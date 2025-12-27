// src/games/asteroids.js
export function initAsteroids({ onScoreSaved } = {}) {
  const canvas = document.getElementById("asteroids-canvas");
  const statusEl = document.getElementById("asteroids-status");

  if (!canvas || !statusEl) return;

  const ctx = canvas.getContext("2d");
  const width = canvas.width;
  const height = canvas.height;

  let ship;
  let asteroids;
  let bullets;
  let particles;
  let stars;
  let keys = {};
  let running = false;
  let loopId;
  let score = 0;
  let destroyed = false;

  const SHIP_RADIUS = 10;
  const SHIP_TURN_SPEED = 0.08;
  const SHIP_THRUST = 0.08;
  const FRICTION = 0.99;

  const AST_START = 4;
  const AST_RADIUS = 18;
  const AST_SPEED = 1.2;

  const BULLET_SPEED = 4.0;
  const BULLET_LIFETIME = 60; // frames

  function submitScore(scoreValue) {
    if (destroyed) return;

    if (typeof window.getPlayerInfo !== "function") {
      console.error("getPlayerInfo is not available");
      return;
    }

    const player = window.getPlayerInfo();
    if (!player || !player.name) {
      console.error("Invalid player info", player);
      return;
    }

    fetch("http://localhost:5000/api/scores", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken") || ""}`,
      },
      body: JSON.stringify({
        gameKey: "asteroids",
        value: scoreValue,
        userId: player.isGuest ? null : player.id,
        username: player.name,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Asteroids score saved:", data);
        if (typeof onScoreSaved === "function" && !destroyed) {
          onScoreSaved();
        }
      })
      .catch((err) => {
        console.error("Error saving asteroids score:", err);
      });
  }

  function initStars() {
    stars = [];
    for (let i = 0; i < 100; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 2,
        brightness: Math.random(),
      });
    }
  }

  function initParticles() {
    particles = [];
  }

  function createExplosion(x, y, size) {
    const particleCount = Math.floor(size);
    for (let i = 0; i < particleCount; i++) {
      const angle = (Math.PI * 2 * i) / particleCount;
      const speed = 1 + Math.random() * 2;
      particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 30 + Math.random() * 20,
        color: `hsl(${20 + Math.random() * 40},100%,${50 + Math.random() * 30}%)`,
      });
    }
  }

  function createThrustParticle() {
    const cos = Math.cos(ship.angle + Math.PI);
    const sin = Math.sin(ship.angle + Math.PI);
    particles.push({
      x: ship.x + cos * SHIP_RADIUS,
      y: ship.y + sin * SHIP_RADIUS,
      vx: ship.vx + cos * (0.5 + Math.random()),
      vy: ship.vy + sin * (0.5 + Math.random()),
      life: 10 + Math.random() * 10,
      color: `hsl(${180 + Math.random() * 40},100%,${50 + Math.random() * 30}%)`,
    });
  }

  function createAsteroid() {
    const edge = Math.floor(Math.random() * 4);
    let x, y;
    if (edge === 0) {
      x = 0;
      y = Math.random() * height;
    } else if (edge === 1) {
      x = width;
      y = Math.random() * height;
    } else if (edge === 2) {
      x = Math.random() * width;
      y = 0;
    } else {
      x = Math.random() * width;
      y = height;
    }
    const angle = Math.random() * Math.PI * 2;

    const vertices = [];
    const vertexCount = 8 + Math.floor(Math.random() * 5);
    for (let i = 0; i < vertexCount; i++) {
      const a = (Math.PI * 2 * i) / vertexCount;
      const variance = 0.8 + Math.random() * 0.4;
      vertices.push({ x: Math.cos(a) * variance, y: Math.sin(a) * variance });
    }

    return {
      x,
      y,
      vx: Math.cos(angle) * AST_SPEED,
      vy: Math.sin(angle) * AST_SPEED,
      r: AST_RADIUS,
      vertices,
      rotation: 0,
      rotationSpeed: (Math.random() - 0.5) * 0.05,
    };
  }

  function resetGame() {
    ship = {
      x: width / 2,
      y: height / 2,
      vx: 0,
      vy: 0,
      angle: -Math.PI / 2,
      dead: false,
      thrusting: false,
    };
    bullets = [];
    asteroids = [];
    particles = [];
    score = 0;

    for (let i = 0; i < AST_START; i++) {
      asteroids.push(createAsteroid());
    }

    running = true;
    statusEl.textContent =
      "Arrow keys to turn/thrust, Space to shoot. Avoid collisions.";
    loop();
  }

  function fireBullet() {
    if (!running || ship.dead) return;
    const cos = Math.cos(ship.angle);
    const sin = Math.sin(ship.angle);
    bullets.push({
      x: ship.x + cos * SHIP_RADIUS,
      y: ship.y + sin * SHIP_RADIUS,
      vx: ship.vx + cos * BULLET_SPEED,
      vy: ship.vy + sin * BULLET_SPEED,
      life: BULLET_LIFETIME,
    });
  }

  function update() {
    if (!running) return;

    if (keys["ArrowLeft"]) ship.angle -= SHIP_TURN_SPEED;
    if (keys["ArrowRight"]) ship.angle += SHIP_TURN_SPEED;

    ship.thrusting = false;
    if (keys["ArrowUp"]) {
      ship.vx += Math.cos(ship.angle) * SHIP_THRUST;
      ship.vy += Math.sin(ship.angle) * SHIP_THRUST;
      ship.thrusting = true;
      if (Math.random() > 0.3) createThrustParticle();
    }

    ship.vx *= FRICTION;
    ship.vy *= FRICTION;
    ship.x += ship.vx;
    ship.y += ship.vy;

    if (ship.x < 0) ship.x = width;
    if (ship.x > width) ship.x = 0;
    if (ship.y < 0) ship.y = height;
    if (ship.y > height) ship.y = 0;

    asteroids.forEach((a) => {
      a.x += a.vx;
      a.y += a.vy;
      a.rotation += a.rotationSpeed;
      if (a.x < -a.r) a.x = width + a.r;
      if (a.x > width + a.r) a.x = -a.r;
      if (a.y < -a.r) a.y = height + a.r;
      if (a.y > height + a.r) a.y = -a.r;
    });

    bullets.forEach((b) => {
      b.x += b.vx;
      b.y += b.vy;
      b.life--;
    });
    bullets = bullets.filter(
      (b) =>
        b.life > 0 &&
        b.x >= 0 &&
        b.x <= width &&
        b.y >= 0 &&
        b.y <= height
    );

    particles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      p.vx *= 0.98;
      p.vy *= 0.98;
      p.life--;
    });
    particles = particles.filter((p) => p.life > 0);

    for (let i = asteroids.length - 1; i >= 0; i--) {
      const a = asteroids[i];
      for (let j = bullets.length - 1; j >= 0; j--) {
        const b = bullets[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < a.r) {
          createExplosion(a.x, a.y, a.r);
          asteroids.splice(i, 1);
          bullets.splice(j, 1);
          score += 10;
          if (a.r > 10) {
            const child1 = {
              x: a.x,
              y: a.y,
              vx: a.vx + (Math.random() - 0.5) * 1.2,
              vy: a.vy + (Math.random() - 0.5) * 1.2,
              r: a.r * 0.6,
              vertices: [...a.vertices],
              rotation: 0,
              rotationSpeed: (Math.random() - 0.5) * 0.05,
            };
            const child2 = { ...child1 };
            asteroids.push(child1, child2);
          }
          break;
        }
      }
    }

    for (const a of asteroids) {
      const dx = a.x - ship.x;
      const dy = a.y - ship.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < a.r + SHIP_RADIUS * 0.7) {
        createExplosion(ship.x, ship.y, SHIP_RADIUS * 2);
        running = false;
        ship.dead = true;
        statusEl.textContent = `Ship destroyed! Score: ${score}. Press Enter to restart.`;
        submitScore(score);
        return;
      }
    }

    if (asteroids.length === 0) {
      running = false;
      statusEl.textContent = `Sector cleared! Score: ${score}. Press Enter to play again.`;
      submitScore(score);
      return;
    }

    draw();
  }

  function draw() {
    ctx.fillStyle = "#020617";
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = "#ffffff";
    stars.forEach((star) => {
      ctx.globalAlpha = 0.3 + star.brightness * 0.7;
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;

    particles.forEach((p) => {
      ctx.globalAlpha = p.life / 40;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 1 + p.life / 20, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;

    ctx.strokeStyle = "#e5e7eb";
    ctx.lineWidth = 3;
    ctx.shadowBlur = 5;
    ctx.shadowColor = "#e5e7eb";
    bullets.forEach((b) => {
      ctx.beginPath();
      ctx.moveTo(b.x, b.y);
      ctx.lineTo(b.x - b.vx * 0.2, b.y - b.vy * 0.2);
      ctx.stroke();
    });
    ctx.shadowBlur = 0;

    ctx.strokeStyle = "#f97316";
    ctx.lineWidth = 2;
    asteroids.forEach((a) => {
      ctx.save();
      ctx.translate(a.x, a.y);
      ctx.rotate(a.rotation);
      ctx.beginPath();
      a.vertices.forEach((v, i) => {
        const vx = v.x * a.r;
        const vy = v.y * a.r;
        if (i === 0) ctx.moveTo(vx, vy);
        else ctx.lineTo(vx, vy);
      });
      ctx.closePath();
      ctx.stroke();
      ctx.restore();
    });

    if (!ship.dead) {
      ctx.save();
      ctx.translate(ship.x, ship.y);
      ctx.rotate(ship.angle);
      ctx.strokeStyle = "#38bdf8";
      ctx.lineWidth = 2;
      ctx.shadowBlur = 10;
      ctx.shadowColor = "#38bdf8";
      ctx.beginPath();
      ctx.moveTo(SHIP_RADIUS, 0);
      ctx.lineTo(-SHIP_RADIUS, -SHIP_RADIUS * 0.6);
      ctx.lineTo(-SHIP_RADIUS * 0.5, 0);
      ctx.lineTo(-SHIP_RADIUS, SHIP_RADIUS * 0.6);
      ctx.closePath();
      ctx.stroke();
      if (ship.thrusting) {
        ctx.strokeStyle = "#fbbf24";
        ctx.shadowColor = "#fbbf24";
        ctx.beginPath();
        ctx.moveTo(-SHIP_RADIUS * 0.5, -SHIP_RADIUS * 0.3);
        ctx.lineTo(-SHIP_RADIUS * 1.5, 0);
        ctx.lineTo(-SHIP_RADIUS * 0.5, SHIP_RADIUS * 0.3);
        ctx.stroke();
      }
      ctx.restore();
      ctx.shadowBlur = 0;
    }

    ctx.fillStyle = "#e5e7eb";
    ctx.font = "bold 16px system-ui, -apple-system, BlinkMacSystemFont";
    ctx.textAlign = "left";
    ctx.fillText(`Score: ${score}`, 8, 24);
  }

  function loop() {
    if (!running) return;
    update();
    loopId = requestAnimationFrame(loop);
  }

  function handleKeyDown(e) {
    keys[e.key] = true;
    if (!running && (e.key === "Enter" || e.key === " ")) {
      resetGame();
    }
    if (e.key === " ") {
      e.preventDefault();
      fireBullet();
    }
  }

  function handleKeyUp(e) {
    keys[e.key] = false;
  }

  document.removeEventListener("keydown", handleKeyDown);
  document.removeEventListener("keyup", handleKeyUp);

  document.addEventListener("keydown", handleKeyDown);
  document.addEventListener("keyup", handleKeyUp);

  initStars();
  initParticles();
  running = false;
  score = 0;
  ship = {
    x: width / 2,
    y: height / 2,
    vx: 0,
    vy: 0,
    angle: -Math.PI / 2,
    dead: false,
    thrusting: false,
  };
  bullets = [];
  asteroids = [];
  for (let i = 0; i < AST_START; i++) {
    asteroids.push(createAsteroid());
  }
  statusEl.textContent =
    "Press Enter to start. Arrows to move, Space to shoot.";
  draw();

  // optional cleanup
  return () => {
    destroyed = true;
    document.removeEventListener("keydown", handleKeyDown);
    document.removeEventListener("keyup", handleKeyUp);
    if (loopId) cancelAnimationFrame(loopId);
  };
}
