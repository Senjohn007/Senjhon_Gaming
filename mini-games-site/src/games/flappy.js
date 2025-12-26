// src/games/flappy.js
export function initFlappy() {
  const canvas = document.getElementById("flappy-canvas");
  const statusEl = document.getElementById("flappy-status");
  const leaderboardBody = document.querySelector("#flappy-leaderboard tbody");

  if (!canvas || !statusEl || !leaderboardBody) return;

  const ctx = canvas.getContext("2d");
  const width = canvas.width;
  const height = canvas.height;

  let bird;
  let pipes;
  let score;
  let running;
  let loopId;
  let clouds;
  let particles;
  let frameCount;

  const gravity = 0.4;
  const flapVelocity = -6;
  const pipeWidth = 60;
  const pipeGap = 120;
  const pipeInterval = 1500; // ms
  let lastPipeTime = 0;

  // ---- leaderboard loader ----
  function loadLeaderboard() {
    fetch(
      "http://localhost:5000/api/scores/leaderboard?game=flappy&limit=10"
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
        console.error("Error loading flappy leaderboard:", err)
      );
  }

  // ---- updated submitScore using getPlayerInfo + userId ----
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
        gameKey: "flappy",
        value: scoreValue,
        userId: player.isGuest ? null : player.id,
        username: player.name,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Flappy score saved:", data);
        loadLeaderboard();
      })
      .catch((err) => {
        console.error("Error saving flappy score:", err);
      });
  }

  function initClouds() {
    clouds = [];
    for (let i = 0; i < 5; i++) {
      clouds.push({
        x: Math.random() * width,
        y: Math.random() * (height / 2),
        width: 60 + Math.random() * 40,
        height: 30 + Math.random() * 20,
        speed: 0.2 + Math.random() * 0.3,
        opacity: 0.3 + Math.random() * 0.3
      });
    }
  }

  function initParticles() {
    particles = [];
  }

  function createFlapParticles() {
    for (let i = 0; i < 5; i++) {
      particles.push({
        x: bird.x,
        y: bird.y,
        vx: -1 - Math.random() * 2,
        vy: 1 + Math.random() * 2,
        life: 20,
        color: `hsl(${190 + Math.random() * 20}, 100%, ${70 + Math.random() * 20}%)`
      });
    }
  }

  function createExplosion(x, y) {
    for (let i = 0; i < 15; i++) {
      const angle = (Math.PI * 2 * i) / 15;
      const speed = 1 + Math.random() * 3;
      particles.push({
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 30,
        color: `hsl(${10 + Math.random() * 30}, 100%, ${50 + Math.random() * 30}%)`
      });
    }
  }

  function reset() {
    bird = {
      x: width * 0.25,
      y: height / 2,
      vy: 0,
      r: 12,
      angle: 0,
      wingAngle: 0
    };
    pipes = [];
    score = 0;
    running = false;
    lastPipeTime = performance.now();
    frameCount = 0;
    initClouds();
    initParticles();
    statusEl.textContent = "Press Space or click to start.";
    draw();
  }

  function spawnPipe() {
    const minTop = 60;
    const maxTop = height - pipeGap - 60;
    const topHeight =
      minTop + Math.random() * (maxTop - minTop); // top pipe height
    pipes.push({
      x: width + pipeWidth,
      top: topHeight,
      scored: false
    });
  }

  function update(delta) {
    if (!running) return;

    frameCount++;
    
    // Update clouds
    clouds.forEach(cloud => {
      cloud.x -= cloud.speed;
      if (cloud.x + cloud.width < 0) {
        cloud.x = width;
        cloud.y = Math.random() * (height / 2);
      }
    });

    // pipes spawn
    const now = performance.now();
    if (now - lastPipeTime > pipeInterval) {
      spawnPipe();
      lastPipeTime = now;
    }

    // bird physics
    bird.vy += gravity;
    bird.y += bird.vy;
    
    // Update bird angle based on velocity
    bird.angle = Math.min(Math.max(bird.vy * 0.05, -0.5), 0.5);
    
    // Animate wings
    bird.wingAngle = Math.sin(frameCount * 0.3) * 0.3;

    // move pipes
    pipes.forEach((p) => {
      p.x -= 2.5;
    });
    // remove off-screen
    pipes = pipes.filter((p) => p.x + pipeWidth > 0);

    // collision and scoring
    const birdBox = {
      left: bird.x - bird.r,
      right: bird.x + bird.r,
      top: bird.y - bird.r,
      bottom: bird.y + bird.r,
    };

    for (const p of pipes) {
      const pipeLeft = p.x;
      const pipeRight = p.x + pipeWidth;
      const gapTop = p.top;
      const gapBottom = p.top + pipeGap;

      // when pipe passes bird, increment score once
      if (!p.scored && pipeRight < bird.x) {
        p.scored = true;
        score++;
        // Create score particles
        for (let i = 0; i < 10; i++) {
          particles.push({
            x: bird.x,
            y: bird.y,
            vx: Math.random() * 2 - 1,
            vy: Math.random() * 2 - 1,
            life: 20,
            color: `hsl(${50 + Math.random() * 20}, 100%, ${50 + Math.random() * 20}%)`
          });
        }
      }

      const inX = birdBox.right > pipeLeft && birdBox.left < pipeRight;
      const hitTop = birdBox.top < gapTop;
      const hitBottom = birdBox.bottom > gapBottom;
      if (inX && (hitTop || hitBottom)) {
        createExplosion(bird.x, bird.y);
        endGame();
        return;
      }
    }

    // ground/ceiling collision
    if (bird.y - bird.r < 0 || bird.y + bird.r > height) {
      createExplosion(bird.x, bird.y);
      endGame();
      return;
    }

    // Update particles
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.1;
      p.life--;
    });
    particles = particles.filter(p => p.life > 0);

    draw();
  }

  function draw() {
    // Sky gradient background
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, "#87CEEB");
    gradient.addColorStop(0.7, "#98D8E8");
    gradient.addColorStop(1, "#F0E68C");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Draw clouds
    clouds.forEach(cloud => {
      ctx.fillStyle = `rgba(255, 255, 255, ${cloud.opacity})`;
      ctx.beginPath();
      ctx.ellipse(cloud.x, cloud.y, cloud.width / 2, cloud.height / 2, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(cloud.x - cloud.width / 3, cloud.y, cloud.width / 3, cloud.height / 2.5, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(cloud.x + cloud.width / 3, cloud.y, cloud.width / 3, cloud.height / 2.5, 0, 0, Math.PI * 2);
      ctx.fill();
    });

    // Draw ground
    ctx.fillStyle = "#8B7355";
    ctx.fillRect(0, height - 20, width, 20);
    ctx.fillStyle = "#228B22";
    ctx.fillRect(0, height - 25, width, 5);

    // Draw pipes
    pipes.forEach((p) => {
      // Top pipe
      const topGradient = ctx.createLinearGradient(p.x, 0, p.x + pipeWidth, 0);
      topGradient.addColorStop(0, "#2ECC40");
      topGradient.addColorStop(0.5, "#27AE60");
      topGradient.addColorStop(1, "#229954");
      
      ctx.fillStyle = topGradient;
      ctx.fillRect(p.x, 0, pipeWidth, p.top);
      
      // Top pipe cap
      ctx.fillStyle = "#27AE60";
      ctx.fillRect(p.x - 5, p.top - 30, pipeWidth + 10, 30);
      
      // Bottom pipe
      const bottomGradient = ctx.createLinearGradient(p.x, p.top + pipeGap, p.x + pipeWidth, p.top + pipeGap);
      bottomGradient.addColorStop(0, "#2ECC40");
      bottomGradient.addColorStop(0.5, "#27AE60");
      bottomGradient.addColorStop(1, "#229954");
      
      ctx.fillStyle = bottomGradient;
      ctx.fillRect(p.x, p.top + pipeGap, pipeWidth, height - p.top - pipeGap);
      
      // Bottom pipe cap
      ctx.fillStyle = "#27AE60";
      ctx.fillRect(p.x - 5, p.top + pipeGap, pipeWidth + 10, 30);
      
      // Pipe highlights
      ctx.strokeStyle = "#2ECC40";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(p.x + 5, 0);
      ctx.lineTo(p.x + 5, p.top - 30);
      ctx.moveTo(p.x + 5, p.top + pipeGap + 30);
      ctx.lineTo(p.x + 5, height);
      ctx.stroke();
    });

    // Draw particles
    particles.forEach(p => {
      ctx.globalAlpha = p.life / 30;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 2 + p.life / 10, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;

    // Draw bird
    ctx.save();
    ctx.translate(bird.x, bird.y);
    ctx.rotate(bird.angle);
    
    // Body
    ctx.fillStyle = "#FFD700";
    ctx.beginPath();
    ctx.ellipse(0, 0, bird.r, bird.r * 0.8, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Wing
    ctx.fillStyle = "#FFA500";
    ctx.beginPath();
    ctx.ellipse(-5, 0, bird.r * 0.7, bird.r * 0.4, bird.wingAngle, 0, Math.PI * 2);
    ctx.fill();
    
    // Eye
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.arc(5, -3, 4, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.arc(6, -3, 2, 0, Math.PI * 2);
    ctx.fill();
    
    // Beak
    ctx.fillStyle = "#FF6347";
    ctx.beginPath();
    ctx.moveTo(10, 0);
    ctx.lineTo(16, 0);
    ctx.lineTo(10, 4);
    ctx.closePath();
    ctx.fill();
    
    ctx.restore();

    // Score
    ctx.fillStyle = "white";
    ctx.strokeStyle = "black";
    ctx.lineWidth = 3;
    ctx.font = "bold 24px system-ui, -apple-system, BlinkMacSystemFont";
    ctx.textAlign = "center";
    ctx.strokeText(score, width / 2, 50);
    ctx.fillText(score, width / 2, 50);
  }

  function flap() {
    if (!running) {
      running = true;
      statusEl.textContent = "Avoid the pipes!";
      let lastTime = performance.now();
      const loop = (time) => {
        if (!running) return;
        const delta = time - lastTime;
        lastTime = time;
        update(delta);
        loopId = requestAnimationFrame(loop);
      };
      loopId = requestAnimationFrame(loop);
    }
    bird.vy = flapVelocity;
    createFlapParticles();
  }

  function endGame() {
    running = false;
    if (loopId) {
      cancelAnimationFrame(loopId);
      loopId = null;
    }
    statusEl.textContent = `Game over! Score: ${score}. Press Space or click to restart.`;
    submitScore(score);
  }

  function handleKey(e) {
    if (e.code === "Space") {
      e.preventDefault();
      flap();
    }
  }

  function handleClick() {
    flap();
  }

  // clean old listeners
  document.removeEventListener("keydown", handleKey);
  canvas.removeEventListener("click", handleClick);

  document.addEventListener("keydown", handleKey);
  canvas.addEventListener("click", handleClick);

  reset();
  loadLeaderboard();
}