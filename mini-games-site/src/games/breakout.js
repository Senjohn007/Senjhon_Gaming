// src/games/breakout.js
export function initBreakout() {
  const canvas = document.getElementById("breakout-canvas");
  const statusDiv = document.getElementById("breakout-status");

  if (!canvas || !statusDiv) return;

  const ctx = canvas.getContext("2d");

  const ballRadius = 6;
  let x = canvas.width / 2;
  let y = canvas.height - 30;
  let dx = 2;
  let dy = -2;

  const paddleHeight = 10;
  const paddleWidth = 70;
  let paddleX = (canvas.width - paddleWidth) / 2;

  let rightPressed = false;
  let leftPressed = false;

  const brickRowCount = 4;
  const brickColumnCount = 7;
  const brickWidth = 40;
  const brickHeight = 12;
  const brickPadding = 6;
  const brickOffsetTop = 30;
  const brickOffsetLeft = 18;

  const bricks = [];
  for (let c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (let r = 0; r < brickRowCount; r++) {
      bricks[c][r] = { x: 0, y: 0, status: 1 };
    }
  }

  const totalBricks = brickRowCount * brickColumnCount;
  let bricksBroken = 0;

  let lives = 3;
  let running = false;
  let loop = null;

  function loadBreakoutLeaderboard() {
    fetch(
      "http://localhost:5000/api/scores/leaderboard?game=breakout&limit=10"
    )
      .then((res) => res.json())
      .then((rows) => {
        const tbody = document.querySelector("#breakout-leaderboard tbody");
        if (!tbody) return;
        tbody.innerHTML = "";
        rows.forEach((row, index) => {
          const tr = document.createElement("tr");
          tr.innerHTML = `
            <td>${index + 1}. ${row.username}</td>
            <td style="text-align:right;">${row.value}</td>
          `;
          tbody.appendChild(tr);
        });
      })
      .catch((err) => {
        console.error("Error loading Breakout leaderboard:", err);
      });
  }

  // UPDATED: use the shared submitScore pattern with auth + gameKey
  function submitScore(scoreValue, resultText) {
    if (typeof window.getPlayerInfo !== "function") {
      console.error("getPlayerInfo is not available");
      return;
    }

    const player = window.getPlayerInfo();

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
        loadBreakoutLeaderboard();
      })
      .catch((err) => {
        console.error("Error saving Breakout score:", err);
      });
  }

  function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = "#22c55e";
    ctx.fill();
    ctx.closePath();
  }

  function drawPaddle() {
    ctx.beginPath();
    ctx.rect(
      paddleX,
      canvas.height - paddleHeight - 4,
      paddleWidth,
      paddleHeight
    );
    ctx.fillStyle = "#0ea5e9";
    ctx.fill();
    ctx.closePath();
  }

  function drawBricks() {
    for (let c = 0; c < brickColumnCount; c++) {
      for (let r = 0; r < brickRowCount; r++) {
        if (bricks[c][r].status === 1) {
          const brickX =
            c * (brickWidth + brickPadding) + brickOffsetLeft;
          const brickY =
            r * (brickHeight + brickPadding) + brickOffsetTop;
          bricks[c][r].x = brickX;
          bricks[c][r].y = brickY;
          ctx.beginPath();
          ctx.rect(brickX, brickY, brickWidth, brickHeight);
          ctx.fillStyle = "#6366f1";
          ctx.fill();
          ctx.closePath();
        }
      }
    }
  }

  function collisionDetection() {
    for (let c = 0; c < brickColumnCount; c++) {
      for (let r = 0; r < brickRowCount; r++) {
        const b = bricks[c][r];
        if (b.status === 1) {
          if (
            x > b.x &&
            x < b.x + brickWidth &&
            y > b.y &&
            y < b.y + brickHeight
          ) {
            dy = -dy;
            b.status = 0;
            bricksBroken++;

            const remaining = bricks
              .flat()
              .filter((br) => br.status === 1).length;
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
    ctx.font = "12px Segoe UI";
    ctx.fillStyle = "#e5e7eb";
    ctx.fillText("Lives: " + lives, 8, 16);
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();
    drawBall();
    drawPaddle();
    drawLives();
    collisionDetection();

    if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
      dx = -dx;
    }
    if (y + dy < ballRadius) {
      dy = -dy;
    } else if (y + dy > canvas.height - ballRadius - paddleHeight - 4) {
      if (x > paddleX && x < paddleX + paddleWidth) {
        dy = -dy;
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
        }
      }
    }

    if (rightPressed && paddleX < canvas.width - paddleWidth) {
      paddleX += 4;
    } else if (leftPressed && paddleX > 0) {
      paddleX -= 4;
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

    for (let c = 0; c < brickColumnCount; c++) {
      for (let r = 0; r < brickRowCount; r++) {
        bricks[c][r].status = 1;
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

  // clean up old listeners if React remounts
  document.removeEventListener("keydown", handleKeyDown);
  document.removeEventListener("keyup", handleKeyUp);
  document.addEventListener("keydown", handleKeyDown);
  document.addEventListener("keyup", handleKeyUp);

  // initial frame + leaderboard
  draw();
  loadBreakoutLeaderboard();
}
