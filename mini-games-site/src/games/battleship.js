// src/games/battleship.js
export function initBattleship() {
  const playerGridEl = document.getElementById("bship-player-grid");
  const cpuGridEl = document.getElementById("bship-cpu-grid");
  const statusEl = document.getElementById("bship-status");
  const resetBtn = document.getElementById("bship-reset");
  const leaderboardBody = document.querySelector("#bship-leaderboard tbody");

  if (!playerGridEl || !cpuGridEl || !statusEl || !resetBtn || !leaderboardBody) {
    return;
  }

  const size = 6;
  const ships = [3, 2]; // lengths
  let playerBoard, cpuBoard;
  let playerHits, cpuHits;
  let currentTurn; // "player" or "cpu"
  let gameOver;

  // ---- leaderboard loader ----
  function loadLeaderboard() {
    fetch(
      "http://localhost:5000/api/scores/leaderboard?game=battleship&limit=10"
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
        console.error("Error loading battleship leaderboard:", err)
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
        gameKey: "battleship",
        value: scoreValue,
        userId: player.isGuest ? null : player.id,
        username: player.name,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Battleship score saved:", data);
        loadLeaderboard();
      })
      .catch((err) => {
        console.error("Error saving battleship score:", err);
      });
  }

  function createEmptyBoard() {
    const board = [];
    for (let r = 0; r < size; r++) {
      const row = [];
      for (let c = 0; c < size; c++) {
        row.push({ ship: false, hit: false, miss: false });
      }
      board.push(row);
    }
    return board;
  }

  function placeShip(board, length) {
    let placed = false;
    while (!placed) {
      const horizontal = Math.random() < 0.5;
      if (horizontal) {
        const r = Math.floor(Math.random() * size);
        const c = Math.floor(Math.random() * (size - length + 1));
        let ok = true;
        for (let i = 0; i < length; i++) {
          if (board[r][c + i].ship) {
            ok = false;
            break;
          }
        }
        if (!ok) continue;
        for (let i = 0; i < length; i++) board[r][c + i].ship = true;
      } else {
        const r = Math.floor(Math.random() * (size - length + 1));
        const c = Math.floor(Math.random() * size);
        let ok = true;
        for (let i = 0; i < length; i++) {
          if (board[r + i][c].ship) {
            ok = false;
            break;
          }
        }
        if (!ok) continue;
        for (let i = 0; i < length; i++) board[r + i][c].ship = true;
      }
      placed = true;
    }
  }

  function setupBoards() {
    playerBoard = createEmptyBoard();
    cpuBoard = createEmptyBoard();

    ships.forEach((len) => {
      placeShip(playerBoard, len);
      placeShip(cpuBoard, len);
    });

    playerHits = 0;
    cpuHits = 0;
    currentTurn = "player";
    gameOver = false;
    statusEl.textContent = "Your turn: click a cell on the CPU grid.";
  }

  function buildGrids() {
    playerGridEl.innerHTML = "";
    cpuGridEl.innerHTML = "";
    playerGridEl.style.display = "grid";
    cpuGridEl.style.display = "grid";
    playerGridEl.style.gridTemplateColumns = `repeat(${size}, 28px)`;
    cpuGridEl.style.gridTemplateColumns = `repeat(${size}, 28px)`;

    // player grid (shows ships)
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        const cell = document.createElement("div");
        cell.className =
          "w-[28px] h-[28px] rounded-[6px] border border-slate-800 bg-slate-900 flex items-center justify-center text-xs";
        if (playerBoard[r][c].ship) {
          cell.classList.add("bg-slate-800", "text-sky-300");
          cell.textContent = "⛵";
        }
        playerGridEl.appendChild(cell);
      }
    }

    // CPU grid (clickable)
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        const cell = document.createElement("button");
        cell.className =
          "w-[28px] h-[28px] rounded-[6px] border border-slate-800 bg-slate-900 hover:bg-slate-800 transition-colors text-xs flex items-center justify-center";
        cell.addEventListener("click", () => handlePlayerShot(r, c, cell));
        cpuGridEl.appendChild(cell);
      }
    }
  }

  function totalShipCells() {
    return ships.reduce((a, b) => a + b, 0);
  }

  function handlePlayerShot(r, c, cellEl) {
    if (gameOver || currentTurn !== "player") return;
    const cell = cpuBoard[r][c];
    if (cell.hit || cell.miss) return;

    if (cell.ship) {
      cell.hit = true;
      playerHits++;
      cellEl.textContent = "💥";
      cellEl.classList.remove("bg-slate-900", "hover:bg-slate-800");
      cellEl.classList.add("bg-emerald-700/80", "text-emerald-300");
      statusEl.textContent = "Hit! Shoot again.";
      if (playerHits === totalShipCells()) {
        statusEl.textContent = "You sank all enemy ships! You win.";
        gameOver = true;
        const scoreValue = 100 + (totalShipCells() - cpuHits) * 10;
        submitScore(scoreValue);
        return;
      }
    } else {
      cell.miss = true;
      cellEl.textContent = "•";
      cellEl.classList.remove("bg-slate-900", "hover:bg-slate-800");
      cellEl.classList.add("bg-slate-800/80", "text-slate-400");
      statusEl.textContent = "Miss. CPU's turn.";
      currentTurn = "cpu";
      setTimeout(cpuTurn, 600);
    }
  }

  function cpuTurn() {
    if (gameOver) return;
    let r, c, cell;
    do {
      r = Math.floor(Math.random() * size);
      c = Math.floor(Math.random() * size);
      cell = playerBoard[r][c];
    } while (cell.hit || cell.miss);

    const index = r * size + c;
    const playerCellEl = playerGridEl.children[index];

    if (cell.ship) {
      cell.hit = true;
      cpuHits++;
      playerCellEl.textContent = "💥";
      playerCellEl.classList.add("bg-rose-800/80", "text-rose-200");
      statusEl.textContent = "CPU hit your ship!";
      if (cpuHits === totalShipCells()) {
        statusEl.textContent =
          "All your ships are sunk. CPU wins.";
        gameOver = true;
        const scoreValue = Math.max(0, 50 - cpuHits * 5);
        submitScore(scoreValue);
        return;
      }
      currentTurn = "player";
      statusEl.textContent += " Your turn.";
    } else {
      cell.miss = true;
      playerCellEl.textContent = "•";
      playerCellEl.classList.add("text-slate-400");
      statusEl.textContent = "CPU missed. Your turn.";
      currentTurn = "player";
    }
  }

  function reset() {
    setupBoards();
    buildGrids();
  }

  reset();
  loadLeaderboard();

  resetBtn.addEventListener("click", reset);
}
