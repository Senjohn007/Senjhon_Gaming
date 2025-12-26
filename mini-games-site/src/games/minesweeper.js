// src/games/minesweeper.js
export function initMinesweeper({ onScoreSaved } = {}) {
  const gridEl = document.getElementById("mines-grid");
  const statusEl = document.getElementById("mines-status");
  const resetBtn = document.getElementById("mines-reset");
  const leaderboardBody = document.querySelector("#mines-leaderboard tbody");

  if (!gridEl || !statusEl || !resetBtn || !leaderboardBody) return;

  const size = 8; // 8x8
  const mineCount = 10;
  let cells = [];
  let minePositions = new Set();
  let revealedCount = 0;
  let flaggedCount = 0;
  let gameOver = false;
  let startedAt = null;
  let timerInterval = null;
  let elapsedTime = 0;

  // Number colors for traditional Minesweeper look
  const numberColors = [
    "", // 0 (not used)
    "#0000ff", // 1 - blue
    "#008000", // 2 - green
    "#ff0000", // 3 - red
    "#000080", // 4 - dark blue
    "#800000", // 5 - dark red
    "#008080", // 6 - teal
    "#000000", // 7 - black
    "#808080", // 8 - gray
  ];

  function getKey(r, c) {
    return `${r},${c}`;
  }

  // ---- leaderboard loader (fallback, for when callback isn't passed) ----
  function loadLeaderboard() {
    fetch(
      "http://localhost:5000/api/scores/leaderboard?game=minesweeper&limit=10"
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
        console.error("Error loading minesweeper leaderboard:", err)
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
        gameKey: "minesweeper",
        value: scoreValue,
        userId: player.isGuest ? null : player.id,
        username: player.name,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Minesweeper score saved:", data);
        // let React (or caller) decide how to reload
        if (typeof onScoreSaved === "function") {
          onScoreSaved();
        } else {
          // fallback to old behavior if no callback
          loadLeaderboard();
        }
      })
      .catch((err) => {
        console.error("Error saving minesweeper score:", err);
      });
  }

  function startTimer() {
    if (timerInterval) clearInterval(timerInterval);
    elapsedTime = 0;
    timerInterval = setInterval(() => {
      elapsedTime++;
      updateStatus();
    }, 1000);
  }

  function stopTimer() {
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
  }

  function updateStatus() {
    const minutes = Math.floor(elapsedTime / 60);
    const seconds = elapsedTime % 60;
    const timeStr = `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
    statusEl.innerHTML = `
      <div class="flex justify-between items-center">
        <div class="flex items-center">
          <span class="text-red-500 font-bold mr-2">💣</span>
          <span>${mineCount - flaggedCount}</span>
        </div>
        <div class="flex items-center">
          <span class="text-yellow-500 font-bold mr-2">🚩</span>
          <span>${flaggedCount}</span>
        </div>
        <div class="flex items-center">
          <span class="text-blue-500 font-bold mr-2">⏱️</span>
          <span>${timeStr}</span>
        </div>
      </div>
    `;
  }

  function createMines() {
    minePositions.clear();
    while (minePositions.size < mineCount) {
      const r = Math.floor(Math.random() * size);
      const c = Math.floor(Math.random() * size);
      minePositions.add(getKey(r, c));
    }
  }

  function inBounds(r, c) {
    return r >= 0 && r < size && c >= 0 && c < size;
  }

  function getNeighbors(r, c) {
    const neighbors = [];
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        if (dr === 0 && dc === 0) continue;
        const nr = r + dr;
        const nc = c + dc;
        if (inBounds(nr, nc)) neighbors.push({ r: nr, c: nc });
      }
    }
    return neighbors;
  }

  function countAdjacentMines(r, c) {
    return getNeighbors(r, c).filter((n) =>
      minePositions.has(getKey(n.r, n.c))
    ).length;
  }

  function drawMine(el, exploding = false) {
    el.innerHTML = "";
    const mine = document.createElement("div");
    mine.style.width = "18px";
    mine.style.height = "18px";
    mine.style.position = "relative";

    // Mine body
    const mineBody = document.createElement("div");
    mineBody.style.width = "100%";
    mineBody.style.height = "100%";
    mineBody.style.backgroundColor = "#333";
    mineBody.style.borderRadius = "50%";
    mineBody.style.position = "absolute";
    mineBody.style.top = "0";
    mineBody.style.left = "0";

    // Mine spikes
    for (let i = 0; i < 8; i++) {
      const spike = document.createElement("div");
      const angle = (Math.PI * 2 * i) / 8;
      spike.style.width = "3px";
      spike.style.height = "8px";
      spike.style.backgroundColor = "#333";
      spike.style.position = "absolute";
      spike.style.top = "50%";
      spike.style.left = "50%";
      spike.style.transformOrigin = "center bottom";
      spike.style.transform = `translate(-50%, -100%) rotate(${angle}rad)`;
      mine.appendChild(spike);
    }

    mine.appendChild(mineBody);
    el.appendChild(mine);

    if (exploding) {
      // Add explosion effect
      el.style.animation = "explode 0.5s ease-out";

      // Create explosion particles
      for (let i = 0; i < 8; i++) {
        const particle = document.createElement("div");
        particle.style.width = "4px";
        particle.style.height = "4px";
        particle.style.backgroundColor = "#ff5722";
        particle.style.borderRadius = "50%";
        particle.style.position = "absolute";
        particle.style.top = "15px";
        particle.style.left = "15px";

        const angle = (Math.PI * 2 * i) / 8;
        const distance = 20 + Math.random() * 10;
        const tx = Math.cos(angle) * distance;
        const ty = Math.sin(angle) * distance;

        particle.style.animation = `particle 0.5s ease-out forwards`;
        particle.style.setProperty("--tx", `${tx}px`);
        particle.style.setProperty("--ty", `${ty}px`);

        el.appendChild(particle);
      }
    }
  }

  function drawFlag(el) {
    el.innerHTML = "";
    const flag = document.createElement("div");
    flag.style.width = "20px";
    flag.style.height = "20px";
    flag.style.position = "relative";

    // Flag pole
    const pole = document.createElement("div");
    pole.style.width = "2px";
    pole.style.height = "16px";
    pole.style.backgroundColor = "#8b4513";
    pole.style.position = "absolute";
    pole.style.top = "2px";
    pole.style.left = "9px";
    flag.appendChild(pole);

    // Flag
    const flagBody = document.createElement("div");
    flagBody.style.width = "10px";
    flagBody.style.height = "8px";
    flagBody.style.backgroundColor = "#ff0000";
    flagBody.style.position = "absolute";
    flagBody.style.top = "2px";
    flagBody.style.left = "11px";
    flagBody.style.clipPath =
      "polygon(0 0, 100% 0, 80% 50%, 100% 100%, 0 100%)";
    flag.appendChild(flagBody);

    el.appendChild(flag);

    // Add flag placement animation
    flag.style.animation = "placeFlag 0.3s ease-out";
  }

  function revealCell(cellObj) {
    if (gameOver || cellObj.revealed || cellObj.flagged) return;

    if (!startedAt) {
      startedAt = Date.now();
      startTimer();
    }

    const { r, c, el } = cellObj;
    const key = getKey(r, c);

    if (minePositions.has(key)) {
      // hit mine
      el.classList.add("bg-red-900");
      drawMine(el, true);
      endGame(false);
      return;
    }

    cellObj.revealed = true;
    revealedCount++;

    // Add reveal animation
    el.style.animation = "reveal 0.3s ease-out";

    // Update cell appearance
    el.classList.remove("bg-slate-700", "shadow-md", "hover:bg-slate-600");
    el.classList.add("bg-slate-800", "shadow-inner");

    const count = countAdjacentMines(r, c);
    if (count > 0) {
      el.innerHTML = `<span style="color: ${numberColors[count]}; font-weight: bold;">${count}</span>`;
    } else {
      // flood reveal
      getNeighbors(r, c).forEach((n) => {
        const neighbor = cells[n.r][n.c];
        if (!neighbor.revealed && !neighbor.flagged) {
          // Add delay for cascade effect
          setTimeout(() => revealCell(neighbor), 50);
        }
      });
    }

    checkWin();
  }

  function toggleFlag(cellObj, e) {
    e.preventDefault();

    if (gameOver || cellObj.revealed) return;

    cellObj.flagged = !cellObj.flagged;
    if (cellObj.flagged) {
      flaggedCount++;
      drawFlag(cellObj.el);
    } else {
      flaggedCount--;
      cellObj.el.innerHTML = "";
    }
    updateStatus();
  }

  function checkWin() {
    const safeCells = size * size - mineCount;
    if (revealedCount === safeCells) {
      const timeMs = startedAt ? Date.now() - startedAt : 0;
      stopTimer();
      statusEl.innerHTML = `
        <div class="text-center">
          <div class="text-green-400 font-bold text-lg">You Win!</div>
          <div>Time: ${Math.round(timeMs / 100) / 10}s</div>
        </div>
      `;
      gameOver = true;

      // Add win animation to all cells
      cells.flat().forEach((cell) => {
        if (!cell.revealed) {
          cell.el.classList.add("bg-green-800");
          drawFlag(cell.el);
        }
      });

      // higher is better, so invert time (10,000 - seconds * 10)
      const scoreValue = Math.max(0, 10000 - Math.floor(timeMs / 10));
      submitScore(scoreValue);
    }
  }

  function endGame(won) {
    gameOver = true;
    stopTimer();

    // Reveal all mines with animation
    cells.flat().forEach((cell, index) => {
      const key = getKey(cell.r, cell.c);
      if (minePositions.has(key) && !cell.revealed) {
        setTimeout(() => {
          if (!cell.flagged) {
            drawMine(cell.el);
          } else {
            // Mark incorrectly flagged mines
            cell.el.classList.add("bg-red-800");
            cell.el.innerHTML = "❌";
          }
        }, index * 50);
      }
    });

    if (!won) {
      statusEl.innerHTML = `
        <div class="text-center">
          <div class="text-red-400 font-bold text-lg">Game Over!</div>
          <div>Press Reset to try again.</div>
        </div>
      `;
    }
  }

  function buildGrid() {
    gridEl.innerHTML = "";
    gridEl.style.display = "grid";
    gridEl.style.gridTemplateColumns = `repeat(${size}, 32px)`;
    gridEl.style.gap = "2px";

    cells = [];
    for (let r = 0; r < size; r++) {
      const row = [];
      for (let c = 0; c < size; c++) {
        const el = document.createElement("button");
        el.className =
          "w-[32px] h-[32px] bg-slate-700 border border-slate-600 text-sm flex items-center justify-center rounded-md shadow-md hover:bg-slate-600 transition-all duration-200 transform hover:scale-105 active:scale-95";
        el.style.position = "relative";
        el.style.overflow = "hidden";

        const cellObj = { r, c, el, revealed: false, flagged: false };

        el.addEventListener("click", () => {
          revealCell(cellObj);
          // Add press effect
          el.style.transform = "scale(0.95)";
          setTimeout(() => {
            if (!cellObj.revealed) {
              el.style.transform = "";
            }
          }, 100);
        });

        el.addEventListener("contextmenu", (e) =>
          toggleFlag(cellObj, e)
        );

        gridEl.appendChild(el);
        row.push(cellObj);
      }
      cells.push(row);
    }
  }

  function reset() {
    gameOver = false;
    revealedCount = 0;
    flaggedCount = 0;
    startedAt = null;
    stopTimer();
    elapsedTime = 0;
    updateStatus();
    createMines();
    buildGrid();
  }

  // Add CSS animations
  const style = document.createElement("style");
  style.textContent = `
    @keyframes reveal {
      0% { transform: rotateY(90deg); opacity: 0.5; }
      100% { transform: rotateY(0); opacity: 1; }
    }
    
    @keyframes explode {
      0% { transform: scale(1); }
      50% { transform: scale(1.2); }
      100% { transform: scale(1); }
    }
    
    @keyframes particle {
      0% { transform: translate(-50%, -50%); opacity: 1; }
      100% { transform: translate(calc(-50% + var(--tx)), calc(-50% + var(--ty))); opacity: 0; }
    }
    
    @keyframes placeFlag {
      0% { transform: scale(0) rotate(0deg); }
      50% { transform: scale(1.2) rotate(10deg); }
      100% { transform: scale(1) rotate(0deg); }
    }
  `;
  document.head.appendChild(style);

  reset();
  loadLeaderboard();

  resetBtn.addEventListener("click", reset);
}
