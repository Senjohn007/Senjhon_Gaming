// src/games/snake.js
export function initSnake({ tickDelay = 120, onScoreSaved } = {}) {
  const canvas = document.getElementById("snake-canvas");
  const statusDiv = document.getElementById("snake-status");

  if (!canvas || !statusDiv) return;

  const ctx = canvas.getContext("2d");

  const tileSize = 16;
  const tiles = canvas.width / tileSize;

  let snake = [{ x: 8, y: 8 }];
  let direction = { x: 1, y: 0 };
  let food = { x: 12, y: 8 };
  let gameLoop = null;
  let running = false;
  let score = 0;

  function randomFood() {
    food.x = Math.floor(Math.random() * tiles);
    food.y = Math.floor(Math.random() * tiles);
  }

  // keep this for initial page load (first time)
  function loadLeaderboard() {
    fetch("http://localhost:5000/api/scores/leaderboard?game=snake&limit=10")
      .then((res) => res.json())
      .then((rows) => {
        const tbody = document.querySelector("#snake-leaderboard tbody");
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
      .catch((err) =>
        console.error("Error loading snake leaderboard:", err)
      );
  }

  // uses shared submitScore pattern with auth + gameKey
  function submitScore(scoreValue) {
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
        gameKey: "snake",
        value: scoreValue,
        userId: player.isGuest ? null : player.id,
        username: player.name,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Snake score saved:", data);
        // let React (or outside) decide how to reload
        if (typeof onScoreSaved === "function") {
          onScoreSaved();
        } else {
          // fallback: keep old behavior if callback not passed
          loadLeaderboard();
        }
      })
      .catch((err) => {
        console.error("Error saving snake score:", err);
      });
  }

  function endGame(message) {
    running = false;
    if (gameLoop) {
      clearInterval(gameLoop);
      gameLoop = null;
    }

    score = snake.length * 10 - 10;
    statusDiv.textContent = `${message} Final score: ${score}. Press any arrow key to restart.`;

    submitScore(score);
  }

  function resetGame() {
    snake = [{ x: 8, y: 8 }];
    direction = { x: 1, y: 0 };
    randomFood();
    running = false;
    if (gameLoop) {
      clearInterval(gameLoop);
      gameLoop = null;
    }
    score = 0;
    statusDiv.textContent = "Press any arrow key to start.";
    draw();
  }

  function update() {
    const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

    if (head.x < 0 || head.x >= tiles || head.y < 0 || head.y >= tiles) {
      endGame("Game over! Hit wall.");
      resetGame();
      return;
    }

    if (snake.some((seg) => seg.x === head.x && seg.y === head.y)) {
      endGame("Game over! You hit yourself.");
      resetGame();
      return;
    }

    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
      randomFood();
    } else {
      snake.pop();
    }

    draw();
  }

  function draw() {
    ctx.fillStyle = "#020617";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#22c55e";
    ctx.fillRect(food.x * tileSize, food.y * tileSize, tileSize, tileSize);

    ctx.fillStyle = "#0ea5e9";
    snake.forEach((seg) => {
      const size = tileSize - 2;
      ctx.fillRect(
        seg.x * tileSize + 1,
        seg.y * tileSize + 1,
        size,
        size
      );
    });
  }

  function handleKeyDown(e) {
    if (e.key === "ArrowUp" && direction.y !== 1) direction = { x: 0, y: -1 };
    if (e.key === "ArrowDown" && direction.y !== -1) direction = { x: 0, y: 1 };
    if (e.key === "ArrowLeft" && direction.x !== 1) direction = { x: -1, y: 0 };
    if (e.key === "ArrowRight" && direction.x !== -1)
      direction = { x: 1, y: 0 };

    if (!running) {
      running = true;
      statusDiv.textContent = "Game in progress...";
      if (gameLoop) clearInterval(gameLoop);
      // use configurable delay
      gameLoop = setInterval(update, tickDelay);
    }
  }

  // clean old listener in case of re-mount
  document.removeEventListener("keydown", handleKeyDown);
  document.addEventListener("keydown", handleKeyDown);

  draw();
  loadLeaderboard();
}
