// src/games/minesweeper.js
export function initMinesweeper() {
  const gridEl = document.getElementById("mines-grid");
  const statusEl = document.getElementById("mines-status");
  const resetBtn = document.getElementById("mines-reset");
  const leaderboardBody = document.querySelector(
    "#mines-leaderboard tbody"
  );

  if (!gridEl || !statusEl || !resetBtn || !leaderboardBody) return;

  const size = 8; // 8x8
  const mineCount = 10;
  let cells = [];
  let minePositions = new Set();
  let revealedCount = 0;
  let flaggedCount = 0;
  let gameOver = false;
  let startedAt = null;

  function getKey(r, c) {
    return `${r},${c}`;
  }

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
        gameKey: "minesweeper",
        value: scoreValue,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Minesweeper score saved:", data);
        loadLeaderboard();
      })
      .catch((err) => {
        console.error("Error saving minesweeper score:", err);
      });
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

  function revealCell(cellObj) {
    if (gameOver || cellObj.revealed || cellObj.flagged) return;

    if (!startedAt) startedAt = Date.now();

    const { r, c, el } = cellObj;
    const key = getKey(r, c);

    if (minePositions.has(key)) {
      // hit mine
      el.classList.add("bg-rose-900/60", "text-rose-300");
      el.textContent = "💣";
      endGame(false);
      return;
    }

    cellObj.revealed = true;
    revealedCount++;
    el.classList.remove("bg-slate-900");
    el.classList.add("bg-slate-800");

    const count = countAdjacentMines(r, c);
    if (count > 0) {
      el.textContent = count.toString();
      el.classList.add("text-sky-300");
    } else {
      // flood reveal
      getNeighbors(r, c).forEach((n) => {
        const neighbor = cells[n.r][n.c];
        if (!neighbor.revealed && !neighbor.flagged) {
          revealCell(neighbor);
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
      cellObj.el.textContent = "🚩";
      cellObj.el.classList.add("text-amber-300");
    } else {
      flaggedCount--;
      cellObj.el.textContent = "";
      cellObj.el.classList.remove("text-amber-300");
    }
    statusEl.textContent = `Mines: ${mineCount} · Flags: ${flaggedCount}`;
  }

  function checkWin() {
    const safeCells = size * size - mineCount;
    if (revealedCount === safeCells) {
      const timeMs = startedAt ? Date.now() - startedAt : 0;
      statusEl.textContent = `You cleared the board in ${Math.round(
        timeMs / 100
      ) / 10}s!`;
      gameOver = true;
      // higher is better, so invert time (10,000 - seconds)
      const scoreValue = Math.max(0, 10000 - Math.floor(timeMs / 10));
      submitScore(scoreValue);
    }
  }

  function endGame(won) {
    gameOver = true;
    // reveal all mines
    cells.flat().forEach((cell) => {
      const key = getKey(cell.r, cell.c);
      if (minePositions.has(key) && !cell.revealed) {
        cell.el.textContent = "💣";
        cell.el.classList.add("text-rose-300");
      }
    });
    if (!won) {
      statusEl.textContent =
        "Boom! Game over. Press Reset to try again.";
    }
  }

  function buildGrid() {
    gridEl.innerHTML = "";
    gridEl.style.display = "grid";
    gridEl.style.gridTemplateColumns = `repeat(${size}, 30px)`;

    cells = [];
    for (let r = 0; r < size; r++) {
      const row = [];
      for (let c = 0; c < size; c++) {
        const el = document.createElement("button");
        el.className =
          "w-[30px] h-[30px] bg-slate-900 border border-slate-800 text-xs flex items-center justify-center rounded-[6px] hover:bg-slate-800 transition-colors";
        const cellObj = { r, c, el, revealed: false, flagged: false };
        el.addEventListener("click", () => revealCell(cellObj));
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
    statusEl.textContent =
      "Click a cell to start. Right-click to place flags.";
    createMines();
    buildGrid();
  }

  reset();
  loadLeaderboard();

  resetBtn.addEventListener("click", reset);
}
