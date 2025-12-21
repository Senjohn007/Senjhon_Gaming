// src/games/whack-a-mole.js
export function initWhackAMole() {
  const grid = document.getElementById("mole-grid");
  const statusDiv = document.getElementById("mole-status");
  const scoreDiv = document.getElementById("mole-score");
  const startBtn = document.getElementById("mole-start");

  if (!grid || !statusDiv || !scoreDiv || !startBtn) {
    return;
  }

  const holeCount = 9;
  const gameDuration = 20000; // 20s
  let score = 0;
  let currentIndex = -1;
  let gameTimer = null;
  let moleTimer = null;
  let running = false;

  const holes = [];

  function loadMoleLeaderboard() {
    fetch(
      "http://localhost:5000/api/scores/leaderboard?game=whack-a-mole&limit=10"
    )
      .then((res) => res.json())
      .then((rows) => {
        const tbody = document.querySelector("#mole-leaderboard tbody");
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
        console.error("Error loading Whack-a-Mole leaderboard:", err);
      });
  }

  function submitScore(scoreValue) {
    if (typeof getPlayerInfo !== "function") {
      console.error("getPlayerInfo is not available");
      return;
    }

    const player = getPlayerInfo(); // { id, name }

    if (!player || !player.id || !player.name) {
      console.error("Invalid player info", player);
      return;
    }

    fetch("http://localhost:5000/api/scores", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        playerId: player.id,
        username: player.name,
        gameKey: "whack-a-mole",
        value: scoreValue,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Whack-a-Mole score saved:", data);
        loadMoleLeaderboard();
      })
      .catch((err) =>
        console.error("Error saving Whack-a-Mole score:", err)
      );
  }

  function createGrid() {
    grid.innerHTML = "";
    holes.length = 0;

    for (let i = 0; i < holeCount; i++) {
      const btn = document.createElement("button");
      btn.textContent = "";
      btn.style.width = "80px";
      btn.style.height = "80px";
      btn.style.borderRadius = "50%";
      btn.style.background = "#020617";
      btn.style.border = "1px solid rgba(148,163,184,0.6)";
      btn.style.boxShadow = "0 10px 20px rgba(15,23,42,0.9)";
      btn.dataset.index = i;

      btn.addEventListener("click", () => {
        if (!running) return;
        const idx = parseInt(btn.dataset.index, 10);
        if (idx === currentIndex) {
          score++;
          scoreDiv.textContent = `Score: ${score}`;
          hideMole();
        }
      });

      holes.push(btn);
      grid.appendChild(btn);
    }
  }

  function showRandomMole() {
    hideMole();
    const idx = Math.floor(Math.random() * holeCount);
    currentIndex = idx;
    const btn = holes[idx];
    btn.textContent = "🐹";
    btn.style.background = "#22c55e33";
  }

  function hideMole() {
    if (currentIndex >= 0) {
      const btn = holes[currentIndex];
      btn.textContent = "";
      btn.style.background = "#020617";
    }
    currentIndex = -1;
  }

  function startGame() {
    if (running) return;
    running = true;
    score = 0;
    scoreDiv.textContent = "Score: 0";
    statusDiv.textContent = "Game running... whack the mole!";
    startBtn.disabled = true;

    showRandomMole();
    moleTimer = setInterval(showRandomMole, 700);

    if (gameTimer) clearTimeout(gameTimer);
    gameTimer = setTimeout(() => {
      running = false;
      clearInterval(moleTimer);
      hideMole();

      statusDiv.textContent = `Time up! Final score: ${score}`;
      startBtn.disabled = false;

      submitScore(score);
    }, gameDuration);
  }

  // clean old timers and listeners in case of re-mount
  if (gameTimer) clearTimeout(gameTimer);
  if (moleTimer) clearInterval(moleTimer);
  startBtn.onclick = null;
  startBtn.replaceWith(startBtn.cloneNode(true));
  const freshStartBtn = document.getElementById("mole-start");
  freshStartBtn.addEventListener("click", startGame);

  createGrid();
  loadMoleLeaderboard();
}
