// src/games/whack-a-mole.js
export function initWhackAMole({ onScoreSaved } = {}) {
  const grid = document.getElementById("mole-grid");
  const statusDiv = document.getElementById("mole-status");
  const scoreDiv = document.getElementById("mole-score");
  const startBtn = document.getElementById("mole-start");

  if (!grid || !statusDiv || !scoreDiv || !startBtn) {
    return;
  }

  const styleId = "whack-a-mole-styles";
  if (!document.getElementById(styleId)) {
    const style = document.createElement("style");
    style.id = styleId;
    style.textContent = `
      #mole-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 20px;
        justify-content: center;
        margin: 20px auto;
        perspective: 600px;
      }
      .mole-hole {
        position: relative;
        width: 100px;
        height: 100px;
        border-radius: 50%;
        background: radial-gradient(ellipse at center,#1e293b 0%,#0f172a 70%);
        border: 2px solid #334155;
        box-shadow: inset 0 5px 15px rgba(0,0,0,0.7),
                    0 10px 20px rgba(0,0,0,0.5);
        overflow: hidden;
        cursor: pointer;
        transition: transform 0.2s;
      }
      .mole-hole:hover { transform: scale(1.05); }
      .mole {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%,-50%) scale(0);
        font-size: 50px;
        z-index: 10;
        transition: transform 0.3s cubic-bezier(0.175,0.885,0.32,1.275);
        filter: drop-shadow(0 5px 5px rgba(0,0,0,0.5));
      }
      .mole.active {
        transform: translate(-50%,-50%) scale(1);
      }
      .hit-effect {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%,-50%);
        font-size: 30px;
        font-weight: bold;
        color: #fbbf24;
        z-index: 20;
        pointer-events: none;
        animation: hitPop 0.5s ease-out forwards;
      }
      @keyframes hitPop {
        0% { transform: translate(-50%,-50%) scale(0); opacity:1; }
        50% { transform: translate(-50%,-50%) scale(1.5); }
        100% { transform: translate(-50%,-100%) scale(1); opacity:0; }
      }
      #mole-status {
        font-size: 18px;
        margin: 15px 0;
        padding: 10px;
        border-radius: 8px;
        background: linear-gradient(135deg,#1e3a8a 0%,#1e40af 100%);
        color: white;
        text-align: center;
      }
      #mole-score {
        font-size: 24px;
        font-weight: bold;
        margin: 10px 0;
        padding: 10px;
        border-radius: 8px;
        background: linear-gradient(135deg,#059669 0%,#10b981 100%);
        color: white;
        text-align: center;
      }
      #mole-score.pulse { animation: scorePulse 0.3s ease-out; }
      @keyframes scorePulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.2); }
        100% { transform: scale(1); }
      }
      #mole-start {
        display: block;
        margin: 20px auto;
        padding: 12px 24px;
        font-size: 18px;
        font-weight: bold;
        color: white;
        background: linear-gradient(135deg,#dc2626 0%,#ef4444 100%);
        border: none;
        border-radius: 8px;
        cursor: pointer;
      }
      #mole-start:disabled { opacity: 0.6; cursor: not-allowed; }
    `;
    document.head.appendChild(style);
  }

  const holeCount = 9;
  const gameDuration = 20000;
  let score = 0;
  let currentIndex = -1;
  let gameTimer = null;
  let moleTimer = null;
  let running = false;
  let destroyed = false;

  const holes = [];

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
        gameKey: "whack-a-mole",
        value: scoreValue,
        userId: player.isGuest ? null : player.id,
        username: player.name,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Whack-a-Mole score saved:", data);
        if (typeof onScoreSaved === "function" && !destroyed) {
          onScoreSaved();
        }
      })
      .catch((err) =>
        console.error("Error saving Whack-a-Mole score:", err)
      );
  }

  function createGrid() {
    grid.innerHTML = "";
    holes.length = 0;

    for (let i = 0; i < holeCount; i++) {
      const hole = document.createElement("div");
      hole.className = "mole-hole";
      hole.dataset.index = i;

      const mole = document.createElement("div");
      mole.className = "mole";
      mole.textContent = "🐹";
      hole.appendChild(mole);

      hole.addEventListener("click", () => {
        if (!running) return;
        const idx = parseInt(hole.dataset.index, 10);
        if (idx === currentIndex) {
          score += 1;
          scoreDiv.textContent = `Score: ${score}`;

          scoreDiv.classList.remove("pulse");
          void scoreDiv.offsetWidth;
          scoreDiv.classList.add("pulse");

          const hit = document.createElement("div");
          hit.className = "hit-effect";
          hit.textContent = "+1";
          hole.appendChild(hit);
          setTimeout(() => {
            if (hit.parentNode) hit.parentNode.removeChild(hit);
          }, 500);

          hideMole();
        }
      });

      holes.push(hole);
      grid.appendChild(hole);
    }
  }

  function showRandomMole() {
    hideMole();
    const idx = Math.floor(Math.random() * holeCount);
    currentIndex = idx;
    const hole = holes[idx];
    const mole = hole.querySelector(".mole");
    mole.classList.add("active");
  }

  function hideMole() {
    if (currentIndex >= 0) {
      const hole = holes[currentIndex];
      const mole = hole.querySelector(".mole");
      mole.classList.remove("active");
    }
    currentIndex = -1;
  }

  function startGame() {
    if (running || destroyed) return;
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

  // clean old timers and listeners
  if (gameTimer) clearTimeout(gameTimer);
  if (moleTimer) clearInterval(moleTimer);
  startBtn.onclick = null;
  const fresh = startBtn.cloneNode(true);
  startBtn.parentNode.replaceChild(fresh, startBtn);
  fresh.addEventListener("click", startGame);

  createGrid();

  // return a destroy function in case you want to use it on unmount
  return () => {
    destroyed = true;
    if (gameTimer) clearTimeout(gameTimer);
    if (moleTimer) clearInterval(moleTimer);
  };
}
