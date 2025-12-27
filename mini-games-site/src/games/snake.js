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
  let particles = [];
  let frameCount = 0;
  let foodPulse = 0;

  // Add custom styles
  const snakeStyles = `
    <style id="snake-styles-style">
      #snake-status {
        background: linear-gradient(to right, #1e293b, #334155);
        color: white;
        padding: 10px 15px;
        border-radius: 8px;
        margin: 15px 0;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        font-weight: 500;
        text-align: center;
      }
      
      #snake-canvas {
        border-radius: 8px;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
                    0 4px 6px -2px rgba(0, 0, 0, 0.05);
      }
    </style>
  `;

  // Add styles to head if not already added
  if (!document.getElementById("snake-styles-style")) {
    const wrapper = document.createElement("div");
    wrapper.innerHTML = snakeStyles;
    const styleTag = wrapper.firstElementChild;
    document.head.appendChild(styleTag);
  }

  function randomFood() {
    food.x = Math.floor(Math.random() * tiles);
    food.y = Math.floor(Math.random() * tiles);
  }

  // Create particle effect when eating food
  function createParticles(x, y) {
    for (let i = 0; i < 10; i++) {
      const angle = (Math.PI * 2 * i) / 10;
      const speed = 1 + Math.random() * 2;
      particles.push({
        x: x * tileSize + tileSize / 2,
        y: y * tileSize + tileSize / 2,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 20,
        color: `hsl(${20 + Math.random() * 40}, 100%, ${
          50 + Math.random() * 30
        }%)`,
      });
    }
  }

  // Update particles
  function updateParticles() {
    particles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.1;
      p.life--;
    });
    particles = particles.filter((p) => p.life > 0);
  }

  // Draw particles
  function drawParticles() {
    particles.forEach((p) => {
      ctx.globalAlpha = p.life / 20;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 2 + p.life / 10, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;
  }

  // submit score only; React handles leaderboard rendering
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
    particles = [];
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
      createParticles(food.x, food.y);
    } else {
      snake.pop();
    }

    frameCount++;
    updateParticles();
    draw();
  }

  function draw() {
    // Clear canvas with gradient background
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, "#0f172a");
    gradient.addColorStop(1, "#1e293b");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid
    ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
    ctx.lineWidth = 1;
    for (let i = 0; i <= tiles; i++) {
      ctx.beginPath();
      ctx.moveTo(i * tileSize, 0);
      ctx.lineTo(i * tileSize, canvas.height);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, i * tileSize);
      ctx.lineTo(canvas.width, i * tileSize);
      ctx.stroke();
    }

    // Draw food with pulsating effect
    foodPulse = (foodPulse + 0.05) % (Math.PI * 2);
    const foodSize = tileSize - 4 + Math.sin(foodPulse) * 2;
    const foodOffset = (tileSize - foodSize) / 2;

    // Food shadow
    ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
    ctx.beginPath();
    ctx.arc(
      food.x * tileSize + tileSize / 2 + 1,
      food.y * tileSize + tileSize / 2 + 1,
      foodSize / 2,
      0,
      Math.PI * 2
    );
    ctx.fill();

    // Food (apple-like)
    const foodGradient = ctx.createRadialGradient(
      food.x * tileSize + tileSize / 2,
      food.y * tileSize + tileSize / 2,
      0,
      food.x * tileSize + tileSize / 2,
      food.y * tileSize + tileSize / 2,
      foodSize / 2
    );
    foodGradient.addColorStop(0, "#ef4444");
    foodGradient.addColorStop(0.7, "#dc2626");
    foodGradient.addColorStop(1, "#b91c1c");

    ctx.fillStyle = foodGradient;
    ctx.beginPath();
    ctx.arc(
      food.x * tileSize + tileSize / 2,
      food.y * tileSize + tileSize / 2,
      foodSize / 2,
      0,
      Math.PI * 2
    );
    ctx.fill();

    // Food highlight
    ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
    ctx.beginPath();
    ctx.arc(
      food.x * tileSize + tileSize / 2 - foodSize / 4,
      food.y * tileSize + tileSize / 2 - foodSize / 4,
      foodSize / 4,
      0,
      Math.PI * 2
    );
    ctx.fill();

    // Draw snake with gradient and rounded segments
    snake.forEach((seg, index) => {
      const size = tileSize - 4;
      const offset = (tileSize - size) / 2;

      // Snake shadow
      ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
      ctx.beginPath();
      ctx.roundRect(
        seg.x * tileSize + offset + 1,
        seg.y * tileSize + offset + 1,
        size,
        size,
        size / 3
      );
      ctx.fill();

      // Snake segment gradient
      const segmentGradient = ctx.createLinearGradient(
        seg.x * tileSize + offset,
        seg.y * tileSize + offset,
        seg.x * tileSize + offset + size,
        seg.y * tileSize + offset + size
      );

      // Head is brighter
      if (index === 0) {
        segmentGradient.addColorStop(0, "#60a5fa");
        segmentGradient.addColorStop(1, "#3b82f6");
      } else {
        // Body segments get darker towards the tail
        const darkness = 1 - (index / snake.length) * 0.5;
        segmentGradient.addColorStop(
          0,
          `rgba(96, 165, 250, ${darkness})`
        );
        segmentGradient.addColorStop(
          1,
          `rgba(59, 130, 246, ${darkness})`
        );
      }

      ctx.fillStyle = segmentGradient;
      ctx.beginPath();
      ctx.roundRect(
        seg.x * tileSize + offset,
        seg.y * tileSize + offset,
        size,
        size,
        size / 3
      );
      ctx.fill();

      // Add eyes to the head
      if (index === 0) {
        const eyeSize = 2;
        const eyeOffset = size / 3;

        // Determine eye position based on direction
        let leftEyeX, leftEyeY, rightEyeX, rightEyeY;

        if (direction.x === 1) {
          // Right
          leftEyeX = seg.x * tileSize + offset + size - eyeOffset;
          leftEyeY = seg.y * tileSize + offset + eyeOffset;
          rightEyeX = seg.x * tileSize + offset + size - eyeOffset;
          rightEyeY = seg.y * tileSize + offset + size - eyeOffset;
        } else if (direction.x === -1) {
          // Left
          leftEyeX = seg.x * tileSize + offset + eyeOffset;
          leftEyeY = seg.y * tileSize + offset + eyeOffset;
          rightEyeX = seg.x * tileSize + offset + eyeOffset;
          rightEyeY = seg.y * tileSize + offset + size - eyeOffset;
        } else if (direction.y === 1) {
          // Down
          leftEyeX = seg.x * tileSize + offset + eyeOffset;
          leftEyeY = seg.y * tileSize + offset + size - eyeOffset;
          rightEyeX = seg.x * tileSize + offset + size - eyeOffset;
          rightEyeY = seg.y * tileSize + offset + size - eyeOffset;
        } else {
          // Up
          leftEyeX = seg.x * tileSize + offset + eyeOffset;
          leftEyeY = seg.y * tileSize + offset + eyeOffset;
          rightEyeX = seg.x * tileSize + offset + size - eyeOffset;
          rightEyeY = seg.y * tileSize + offset + eyeOffset;
        }

        // Draw eyes
        ctx.fillStyle = "white";
        ctx.beginPath();
        ctx.arc(leftEyeX, leftEyeY, eyeSize, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(rightEyeX, rightEyeY, eyeSize, 0, Math.PI * 2);
        ctx.fill();

        // Draw pupils
        ctx.fillStyle = "black";
        ctx.beginPath();
        ctx.arc(leftEyeX, leftEyeY, eyeSize / 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(rightEyeX, rightEyeY, eyeSize / 2, 0, Math.PI * 2);
        ctx.fill();
      }
    });

    // Draw particles
    drawParticles();
  }

  function handleKeyDown(e) {
    if (e.key === "ArrowUp" && direction.y !== 1) direction = { x: 0, y: -1 };
    if (e.key === "ArrowDown" && direction.y !== -1) direction = { x: 0, y: 1 };
    if (e.key === "ArrowLeft" && direction.x !== 1)
      direction = { x: -1, y: 0 };
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
}
