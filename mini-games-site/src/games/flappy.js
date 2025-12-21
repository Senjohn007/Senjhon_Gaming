// src/games/flappy.js
export function initFlappy() {
  const canvas = document.getElementById("flappy-canvas");
  const statusEl = document.getElementById("flappy-status");
  const leaderboardBody = document.querySelector(
    "#flappy-leaderboard tbody"
  );

  if (!canvas || !statusEl || !leaderboardBody) return;

  const ctx = canvas.getContext("2d");
  const width = canvas.width;
  const height = canvas.height;

  let bird;
  let pipes;
  let score;
  let running;
  let loopId;

  const gravity = 0.4;
  const flapVelocity = -6;
  const pipeWidth = 40;
  const pipeGap = 120;
  const pipeInterval = 1500; // ms
  let lastPipeTime = 0;

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

  function submitScore(scoreValue) {
    if (typeof getPlayerInfo !== "function") {
      console.error("getPlayerInfo is not available");
      return;
    }
    const player = getPlayerInfo();
    if (!player || !player.id || !player.name) {
      console.error("Invalid player info", player);
      return;
    }
    fetch("http://localhost:5000/api/scores", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        playerId: player.id,
        username: player.name,
        gameKey: "flappy",
        value: scoreValue,
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

  function reset() {
    bird = {
      x: width * 0.25,
      y: height / 2,
      vy: 0,
      r: 10,
    };
    pipes = [];
    score = 0;
    running = false;
    lastPipeTime = performance.now();
    statusEl.textContent = "Press Space or click to start.";
    draw();
  }

  function spawnPipe() {
    const minTop = 40;
    const maxTop = height - pipeGap - 40;
    const topHeight =
      minTop + Math.random() * (maxTop - minTop); // top pipe height
    pipes.push({
      x: width + pipeWidth,
      top: topHeight,
    });
  }

  function update(delta) {
    if (!running) return;

    // pipes spawn
    const now = performance.now();
    if (now - lastPipeTime > pipeInterval) {
      spawnPipe();
      lastPipeTime = now;
    }

    // bird physics
    bird.vy += gravity;
    bird.y += bird.vy;

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
      }

      const inX = birdBox.right > pipeLeft && birdBox.left < pipeRight;
      const hitTop = birdBox.top < gapTop;
      const hitBottom = birdBox.bottom > gapBottom;
      if (inX && (hitTop || hitBottom)) {
        endGame();
        return;
      }
    }

    // ground/ceiling collision
    if (bird.y - bird.r < 0 || bird.y + bird.r > height) {
      endGame();
      return;
    }

    draw();
  }

  function draw() {
    // background
    ctx.fillStyle = "#020617";
    ctx.fillRect(0, 0, width, height);

    // pipes
    ctx.fillStyle = "#22c55e";
    pipes.forEach((p) => {
      // top
      ctx.fillRect(p.x, 0, pipeWidth, p.top);
      // bottom
      ctx.fillRect(p.x, p.top + pipeGap, pipeWidth, height);
    });

    // bird
    ctx.fillStyle = "#0ea5e9";
    ctx.beginPath();
    ctx.arc(bird.x, bird.y, bird.r, 0, Math.PI * 2);
    ctx.fill();

    // score
    ctx.fillStyle = "#e5e7eb";
    ctx.font = "14px system-ui, -apple-system, BlinkMacSystemFont";
    ctx.textAlign = "left";
    ctx.fillText(`Score: ${score}`, 8, 18);
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
