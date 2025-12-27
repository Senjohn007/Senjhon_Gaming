// src/games/breakout.js
export function initBreakout({ onScoreSaved } = {}) {
  const canvas = document.getElementById("breakout-canvas");
  const statusDiv = document.getElementById("breakout-status");

  if (!canvas || !statusDiv) return;

  const ctx = canvas.getContext("2d");

  const ballRadius = 8;
  let x = canvas.width / 2;
  let y = canvas.height - 30;
  let dx = 2;
  let dy = -2;
  let ballTrail = [];
  let ballGlow = 0;

  const paddleHeight = 12;
  const paddleWidth = 80;
  let paddleX = (canvas.width - paddleWidth) / 2;
  let paddleGlow = 0;

  let rightPressed = false;
  let leftPressed = false;

  const brickRowCount = 5;
  const brickColumnCount = 8;
  const brickWidth = 45;
  const brickHeight = 15;
  const brickPadding = 6;
  const brickOffsetTop = 40;
  const brickOffsetLeft = 15;

  const bricks = [];
  const brickColors = [
    "#ef4444",
    "#f97316",
    "#eab308",
    "#22c55e",
    "#3b82f6",
  ];

  for (let c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (let r = 0; r < brickRowCount; r++) {
      bricks[c][r] = {
        x: 0,
        y: 0,
        status: 1,
        color: brickColors[r],
        breaking: false,
        breakProgress: 0,
      };
    }
  }

  const totalBricks = brickRowCount * brickColumnCount;
  let bricksBroken = 0;
  let particles = [];
  let stars = [];

  let lives = 3;
  let running = false;
  let loop = null;
  let frameCount = 0;
  let destroyed = false;

  function initStars() {
    stars = [];
    for (let i = 0; i < 50; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2,
        brightness: Math.random(),
      });
    }
  }

  function createParticles(px, py, color) {
    for (let i = 0; i < 10; i++) {
      const angle = (Math.PI * 2 * i) / 10;
      const speed = 1 + Math.random() * 2;
      particles.push({
        x: px,
        y: py,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 30,
        color,
        size: 2 + Math.random() * 3,
      });
    }
  }

  function updateParticles() {
    particles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.1;
      p.life--;
    });
    particles = particles.filter((p) => p.life > 0);
  }

  function drawParticles() {
    particles.forEach((p) => {
      ctx.globalAlpha = p.life / 30;
      ctx.fillStyle = p.color;
      ctx.fillRect(p.x, p.y, p.size, p.size);
    });
    ctx.globalAlpha = 1;
  }

  function submitScore(scoreValue, resultText) {
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
        Authorization: `Bearer ${
          localStorage.getItem("authToken") || ""
        }`,
      },
      body: JSON.stringify({
        gameKey: "breakout",
        value: scoreValue,
        userId: player.isGuest ? null : player.id,
        username: player.name,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Breakout score saved:", data, "=>", resultText);
        if (typeof onScoreSaved === "function" && !destroyed) {
          onScoreSaved();
        }
      })
      .catch((err) => {
        console.error("Error saving Breakout score:", err);
      });
  }

  function drawBall() {
    ballTrail.push({ x, y });
    if (ballTrail.length > 10) ballTrail.shift();

    ballTrail.forEach((point, index) => {
      ctx.globalAlpha = (index / ballTrail.length) * 0.5;
      ctx.beginPath();
      ctx.arc(
        point.x,
        point.y,
        ballRadius * (index / ballTrail.length),
        0,
        Math.PI * 2
      );
      ctx.fillStyle = "#22c55e";
      ctx.fill();
      ctx.closePath();
    });
    ctx.globalAlpha = 1;

    ballGlow = (ballGlow + 0.1) % (Math.PI * 2);

    const gradient = ctx.createRadialGradient(
      x,
      y,
      0,
      x,
      y,
      ballRadius * 2
    );
    gradient.addColorStop(0, "rgba(34, 197, 94, 0.8)");
    gradient.addColorStop(0.5, "rgba(34, 197, 94, 0.4)");
    gradient.addColorStop(1, "rgba(34, 197, 94, 0)");

    ctx.beginPath();
    ctx.arc(
      x,
      y,
      ballRadius * (1.5 + Math.sin(ballGlow) * 0.2),
      0,
      Math.PI * 2
    );
    ctx.fillStyle = gradient;
    ctx.fill();
    ctx.closePath();

    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = "#22c55e";
    ctx.fill();
    ctx.closePath();

    ctx.beginPath();
    ctx.arc(
      x - ballRadius / 3,
      y - ballRadius / 3,
      ballRadius / 3,
      0,
      Math.PI * 2
    );
    ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
    ctx.fill();
    ctx.closePath();
  }

  function drawPaddle() {
    paddleGlow = (paddleGlow + 0.05) % (Math.PI * 2);

    ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
    ctx.fillRect(
      paddleX + 2,
      canvas.height - paddleHeight - 2,
      paddleWidth,
      paddleHeight
    );

    const gradient = ctx.createLinearGradient(
      paddleX,
      canvas.height - paddleHeight - 4,
      paddleX,
      canvas.height - 4
    );
    gradient.addColorStop(0, "rgba(14, 165, 233, 0.8)");
    gradient.addColorStop(0.5, "rgba(14, 165, 233, 0.4)");
    gradient.addColorStop(1, "rgba(14, 165, 233, 0.1)");

    ctx.fillStyle = gradient;
    ctx.fillRect(
      paddleX - 2,
      canvas.height - paddleHeight - 6,
      paddleWidth + 4,
      paddleHeight + 4
    );

    ctx.beginPath();
    ctx.roundRect(
      paddleX,
      canvas.height - paddleHeight - 4,
      paddleWidth,
      paddleHeight,
      paddleHeight / 2
    );
    ctx.fillStyle = "#0ea5e9";
    ctx.fill();
    ctx.closePath();

    ctx.beginPath();
    ctx.roundRect(
      paddleX,
      canvas.height - paddleHeight - 4,
      paddleWidth,
      paddleHeight / 2,
      paddleHeight / 4
    );
    ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
    ctx.fill();
    ctx.closePath();
  }

  function shadeColor(color, percent) {
    const num = parseInt(color.replace("#", ""), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = ((num >> 8) & 0x00ff) + amt;
    const B = (num & 0x0000ff) + amt;
    return (
      "#" +
      (
        0x1000000 +
        (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
        (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
        (B < 255 ? (B < 1 ? 0 : B) : 255)
      )
        .toString(16)
        .slice(1)
    );
  }

  function drawBricks() {
    for (let c = 0; c < brickColumnCount; c++) {
      for (let r = 0; r < brickRowCount; r++) {
        const b = bricks[c][r];
        if (b.status === 1) {
          const brickX =
            c * (brickWidth + brickPadding) + brickOffsetLeft;
          const brickY =
            r * (brickHeight + brickPadding) + brickOffsetTop;
          b.x = brickX;
          b.y = brickY;

          if (b.breaking) {
            b.breakProgress += 0.1;
            if (b.breakProgress >= 1) {
              b.status = 0;
              createParticles(
                brickX + brickWidth / 2,
                brickY + brickHeight / 2,
                b.color
              );
              continue;
            }
          }

          ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
          ctx.fillRect(brickX + 2, brickY + 2, brickWidth, brickHeight);

          ctx.beginPath();
          ctx.roundRect(
            brickX,
            brickY,
            brickWidth,
            brickHeight,
            3
          );

          const gradient = ctx.createLinearGradient(
            brickX,
            brickY,
            brickX,
            brickY + brickHeight
          );
          gradient.addColorStop(0, b.color);
          gradient.addColorStop(1, shadeColor(b.color, -20));

          ctx.fillStyle = gradient;
          ctx.fill();
          ctx.closePath();

          ctx.beginPath();
          ctx.roundRect(
            brickX,
            brickY,
            brickWidth,
            brickHeight / 2,
            3
          );
          ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
          ctx.fill();
          ctx.closePath();

          if (b.breaking) {
            ctx.globalAlpha = 1 - b.breakProgress;
            ctx.save();
            ctx.translate(
              brickX + brickWidth / 2,
              brickY + brickHeight / 2
            );
            ctx.scale(
              1 + b.breakProgress * 0.2,
              1 + b.breakProgress * 0.2
            );
            ctx.translate(
              -(brickX + brickWidth / 2),
              -(brickY + brickHeight / 2)
            );

            ctx.beginPath();
            ctx.roundRect(
              brickX,
              brickY,
              brickWidth,
              brickHeight,
              3
            );
            ctx.fillStyle = b.color;
            ctx.fill();
            ctx.closePath();

            ctx.restore();
            ctx.globalAlpha = 1;
          }
        }
      }
    }
  }

  function collisionDetection() {
    for (let c = 0; c < brickColumnCount; c++) {
      for (let r = 0; r < brickRowCount; r++) {
        const b = bricks[c][r];
        if (b.status === 1 && !b.breaking) {
          if (
            x > b.x &&
            x < b.x + brickWidth &&
            y > b.y &&
            y < b.y + brickHeight
          ) {
            dy = -dy;
            b.breaking = true;
            bricksBroken++;

            const remaining = bricks
              .flat()
              .filter((br) => br.status === 1 && !br.breaking).length;
            if (remaining === 0) {
              statusDiv.textContent = "You win! All bricks broken.";
              stopGame("win");
            }
          }
        }
      }
    }
  }

  function drawLives() {
    for (let i = 0; i < lives; i++) {
      ctx.beginPath();
      ctx.roundRect(8 + i * 25, 8, 20, 6, 3);
      ctx.fillStyle = "#0ea5e9";
      ctx.fill();
      ctx.closePath();
    }

    ctx.font = "12px Segoe UI";
    ctx.fillStyle = "#e5e7eb";
    ctx.fillText("Lives: ", 8, 30);
  }

  function drawBackground() {
    const gradient = ctx.createLinearGradient(
      0,
      0,
      0,
      canvas.height
    );
    gradient.addColorStop(0, "#0f172a");
    gradient.addColorStop(1, "#1e293b");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#ffffff";
    stars.forEach((star) => {
      ctx.globalAlpha =
        0.3 +
        star.brightness *
          0.7 *
          (0.5 + 0.5 * Math.sin(frameCount * 0.02 + star.x));
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;
  }

  function draw() {
    frameCount++;

    drawBackground();
    drawBricks();
    drawBall();
    drawPaddle();
    drawLives();
    drawParticles();
    updateParticles();
    collisionDetection();

    if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
      dx = -dx;
      createParticles(x, y, "#22c55e");
    }
    if (y + dy < ballRadius) {
      dy = -dy;
      createParticles(x, y, "#22c55e");
    } else if (y + dy > canvas.height - ballRadius - paddleHeight - 4) {
      if (x > paddleX && x < paddleX + paddleWidth) {
        dy = -dy;
        const hitPos = (x - paddleX) / paddleWidth;
        dx = 4 * (hitPos - 0.5);
        createParticles(x, y, "#0ea5e9");
      } else if (y + dy > canvas.height - ballRadius) {
        lives--;
        if (!lives) {
          statusDiv.textContent =
            "Game over! Press left/right to restart.";
          stopGame("loss");
          return;
        } else {
          x = canvas.width / 2;
          y = canvas.height - 30;
          dx = 2;
          dy = -2;
          paddleX = (canvas.width - paddleWidth) / 2;
          ballTrail = [];
        }
      }
    }

    if (rightPressed && paddleX < canvas.width - paddleWidth) {
      paddleX += 5;
    } else if (leftPressed && paddleX > 0) {
      paddleX -= 5;
    }

    x += dx;
    y += dy;
  }

  function startGame() {
    if (running) return;
    running = true;
    statusDiv.textContent = "Break the bricks!";
    lives = 3;
    bricksBroken = 0;
    particles = [];
    ballTrail = [];

    for (let c = 0; c < brickColumnCount; c++) {
      for (let r = 0; r < brickRowCount; r++) {
        bricks[c][r].status = 1;
        bricks[c][r].breaking = false;
        bricks[c][r].breakProgress = 0;
      }
    }

    x = canvas.width / 2;
    y = canvas.height - 30;
    dx = 2;
    dy = -2;
    paddleX = (canvas.width - paddleWidth) / 2;

    if (loop) clearInterval(loop);
    loop = setInterval(draw, 16);
  }

  function stopGame(result) {
    if (!running) return;
    running = false;
    if (loop) {
      clearInterval(loop);
      loop = null;
    }

    const scoreValue = bricksBroken;
    const resultText =
      result === "win"
        ? "Win, bricks broken: " + scoreValue
        : "Loss, bricks broken: " + scoreValue;

    submitScore(scoreValue, resultText);
  }

  function handleKeyDown(e) {
    if (e.key === "Right" || e.key === "ArrowRight") {
      rightPressed = true;
      if (!running) startGame();
    } else if (e.key === "Left" || e.key === "ArrowLeft") {
      leftPressed = true;
      if (!running) startGame();
    }
  }

  function handleKeyUp(e) {
    if (e.key === "Right" || e.key === "ArrowRight") {
      rightPressed = false;
    } else if (e.key === "Left" || e.key === "ArrowLeft") {
      leftPressed = false;
    }
  }

  document.removeEventListener("keydown", handleKeyDown);
  document.removeEventListener("keyup", handleKeyUp);
  document.addEventListener("keydown", handleKeyDown);
  document.addEventListener("keyup", handleKeyUp);

  initStars();
  draw();

  // optional cleanup for React unmounts
  return () => {
    destroyed = true;
    document.removeEventListener("keydown", handleKeyDown);
    document.removeEventListener("keyup", handleKeyUp);
    if (loop) clearInterval(loop);
  };
}
