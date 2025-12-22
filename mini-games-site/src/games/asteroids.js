// src/games/asteroids.js
export function initAsteroids() {
  const canvas = document.getElementById("asteroids-canvas");
  const statusEl = document.getElementById("asteroids-status");
  const leaderboardBody = document.querySelector("#asteroids-leaderboard tbody");

  if (!canvas || !statusEl || !leaderboardBody) return;

  const ctx = canvas.getContext("2d");
  const width = canvas.width;
  const height = canvas.height;

  let ship;
  let asteroids;
  let bullets;
  let keys = {};
  let running = false;
  let loopId;
  let score = 0;

  const SHIP_RADIUS = 10;
  const SHIP_TURN_SPEED = 0.08;
  const SHIP_THRUST = 0.08;
  const FRICTION = 0.99;

  const AST_START = 4;
  const AST_RADIUS = 18;
  const AST_SPEED = 1.2;

  const BULLET_SPEED = 4.0;
  const BULLET_LIFETIME = 60; // frames

  // ---- leaderboard loader ----
  function loadLeaderboard() {
    fetch(
      "http://localhost:5000/api/scores/leaderboard?game=asteroids&limit=10"
    )
      .then((res) => res.json())
      .then((rows) => {
        leaderboardBody.innerHTML = "";
        rows.forEach((row, index) => {
          const tr = document.createElement("tr");
          tr.innerHTML = `
            <td>${index + 1}. ${row.username}</td>
            <td style="text-align:right;">${row.value}</td>
          `;
          leaderboardBody.appendChild(tr);
        });
      })
      .catch((err) =>
        console.error("Error loading asteroids leaderboard:", err)
      );
  }

  // ---- shared submitScore for this game ----
  function submitScore(scoreValue) {
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
        loadLeaderboard();
      })
      .catch((err) => {
        console.error("Error saving asteroids score:", err);
      });
  }

  function resetGame() {
    ship = {
      x: width / 2,
      y: height / 2,
      vx: 0,
      vy: 0,
      angle: -Math.PI / 2,
      dead: false,
    };
    bullets = [];
    asteroids = [];
    score = 0;

    for (let i = 0; i < AST_START; i++) {
      asteroids.push(createAsteroid());
    }

    running = true;
    statusEl.textContent =
      "Arrow keys to turn/thrust, Space to shoot. Avoid collisions.";
    loop();
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
    return {
      x,
      y,
      vx: Math.cos(angle) * AST_SPEED,
      vy: Math.sin(angle) * AST_SPEED,
      r: AST_RADIUS,
    };
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

    // ship controls
    if (keys["ArrowLeft"]) ship.angle -= SHIP_TURN_SPEED;
    if (keys["ArrowRight"]) ship.angle += SHIP_TURN_SPEED;
    if (keys["ArrowUp"]) {
      ship.vx += Math.cos(ship.angle) * SHIP_THRUST;
      ship.vy += Math.sin(ship.angle) * SHIP_THRUST;
    }

    ship.vx *= FRICTION;
    ship.vy *= FRICTION;
    ship.x += ship.vx;
    ship.y += ship.vy;

    // screen wrap
    if (ship.x < 0) ship.x = width;
    if (ship.x > width) ship.x = 0;
    if (ship.y < 0) ship.y = height;
    if (ship.y > height) ship.y = 0;

    // update asteroids
    asteroids.forEach((a) => {
      a.x += a.vx;
      a.y += a.vy;
      if (a.x < -a.r) a.x = width + a.r;
      if (a.x > width + a.r) a.x = -a.r;
      if (a.y < -a.r) a.y = height + a.r;
      if (a.y > height + a.r) a.y = -a.r;
    });

    // update bullets
    bullets.forEach((b) => {
      b.x += b.vx;
      b.y += b.vy;
      b.life--;
    });
    bullets = bullets.filter(
      (b) => b.life > 0 && b.x >= 0 && b.x <= width && b.y >= 0 && b.y <= height
    );

    // bullet-asteroid collisions
    for (let i = asteroids.length - 1; i >= 0; i--) {
      const a = asteroids[i];
      for (let j = bullets.length - 1; j >= 0; j--) {
        const b = bullets[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < a.r) {
          // hit
          asteroids.splice(i, 1);
          bullets.splice(j, 1);
          score += 10;
          // split asteroid if large enough
          if (a.r > 10) {
            asteroids.push({
              x: a.x,
              y: a.y,
              vx: a.vx + (Math.random() - 0.5) * 1.2,
              vy: a.vy + (Math.random() - 0.5) * 1.2,
              r: a.r * 0.6,
            });
            asteroids.push({
              x: a.x,
              y: a.y,
              vx: a.vx + (Math.random() - 0.5) * 1.2,
              vy: a.vy + (Math.random() - 0.5) * 1.2,
              r: a.r * 0.6,
            });
          }
          break;
        }
      }
    }

    // ship-asteroid collisions
    for (const a of asteroids) {
      const dx = a.x - ship.x;
      const dy = a.y - ship.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < a.r + SHIP_RADIUS * 0.7) {
        running = false;
        ship.dead = true;
        statusEl.textContent = `Ship destroyed! Score: ${score}. Press Enter to restart.`;
        submitScore(score);
        return;
      }
    }

    // win condition (cleared all asteroids)
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

    // bullets
    ctx.strokeStyle = "#e5e7eb";
    ctx.lineWidth = 2;
    bullets.forEach((b) => {
      ctx.beginPath();
      ctx.moveTo(b.x, b.y);
      ctx.lineTo(b.x - b.vx * 0.2, b.y - b.vy * 0.2);
      ctx.stroke();
    });

    // asteroids
    ctx.strokeStyle = "#f97316";
    ctx.lineWidth = 2;
    asteroids.forEach((a) => {
      ctx.beginPath();
      ctx.arc(a.x, a.y, a.r, 0, Math.PI * 2);
      ctx.stroke();
    });

    // ship
    ctx.save();
    ctx.translate(ship.x, ship.y);
    ctx.rotate(ship.angle);
    ctx.strokeStyle = "#38bdf8";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(SHIP_RADIUS, 0);
    ctx.lineTo(-SHIP_RADIUS, -SHIP_RADIUS * 0.6);
    ctx.lineTo(-SHIP_RADIUS, SHIP_RADIUS * 0.6);
    ctx.closePath();
    ctx.stroke();
    ctx.restore();

    // score
    ctx.fillStyle = "#e5e7eb";
    ctx.font = "14px system-ui, -apple-system, BlinkMacSystemFont";
    ctx.textAlign = "left";
    ctx.fillText(`Score: ${score}`, 8, 18);
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

  // cleanup old listeners
  document.removeEventListener("keydown", handleKeyDown);
  document.removeEventListener("keyup", handleKeyUp);

  document.addEventListener("keydown", handleKeyDown);
  document.addEventListener("keyup", handleKeyUp);

  // initial idle screen
  running = false;
  score = 0;
  ship = {
    x: width / 2,
    y: height / 2,
    vx: 0,
    vy: 0,
    angle: -Math.PI / 2,
    dead: false,
  };
  bullets = [];
  asteroids = [];
  for (let i = 0; i < AST_START; i++) {
    asteroids.push(createAsteroid());
  }
  statusEl.textContent =
    "Press Enter to start. Arrows to move, Space to shoot.";
  draw();
  loadLeaderboard();
}
