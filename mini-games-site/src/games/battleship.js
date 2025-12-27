// src/games/battleship.js
export function initBattleship({ onScoreSaved } = {}) {
  const playerGridEl = document.getElementById("bship-player-grid");
  const cpuGridEl = document.getElementById("bship-cpu-grid");
  const statusEl = document.getElementById("bship-status");
  const resetBtn = document.getElementById("bship-reset");

  if (!playerGridEl || !cpuGridEl || !statusEl || !resetBtn) return;

  const size = 6;
  const ships = [3, 2]; // lengths
  let playerBoard, cpuBoard;
  let playerHits, cpuHits;
  let currentTurn; // "player" or "cpu"
  let gameOver;
  let animatingCells = new Set();
  let destroyed = false;

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
        gameKey: "battleship",
        value: scoreValue,
        userId: player.isGuest ? null : player.id,
        username: player.name,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Battleship score saved:", data);
        if (typeof onScoreSaved === "function" && !destroyed) {
          onScoreSaved();
        }
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
    playerGridEl.style.gridTemplateColumns = `repeat(${size}, 40px)`;
    cpuGridEl.style.gridTemplateColumns = `repeat(${size}, 40px)`;
    playerGridEl.style.gap = "4px";
    cpuGridEl.style.gap = "4px";

    // labels omitted for brevity; can be kept as in your original code

    // player grid (shows ships)
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        const cell = document.createElement("div");
        cell.style.width = "40px";
        cell.style.height = "40px";
        cell.style.borderRadius = "8px";
        cell.style.border = "1px solid #334155";
        cell.style.backgroundColor = "#1e293b";
        cell.style.display = "flex";
        cell.style.alignItems = "center";
        cell.style.justifyContent = "center";
        cell.style.position = "relative";
        cell.style.overflow = "hidden";
        cell.style.transition = "all 0.3s ease";

        if (playerBoard[r][c].ship) {
          const ship = document.createElement("div");
          ship.style.width = "30px";
          ship.style.height = "30px";
          ship.style.background =
            "linear-gradient(135deg,#64748b 0%,#334155 100%)";
          ship.style.borderRadius = "4px";
          ship.style.boxShadow = "0 2px 4px rgba(0,0,0,0.3)";
          cell.appendChild(ship);
        }

        playerGridEl.appendChild(cell);
      }
    }

    // CPU grid (clickable)
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        const cell = document.createElement("button");
        cell.style.width = "40px";
        cell.style.height = "40px";
        cell.style.borderRadius = "8px";
        cell.style.border = "1px solid #334155";
        cell.style.backgroundColor = "#1e293b";
        cell.style.display = "flex";
        cell.style.alignItems = "center";
        cell.style.justifyContent = "center";
        cell.style.position = "relative";
        cell.style.overflow = "hidden";
        cell.style.transition = "all 0.3s ease";
        cell.style.cursor = "pointer";

        cell.addEventListener("click", () => handlePlayerShot(r, c, cell));
        cpuGridEl.appendChild(cell);
      }
    }
  }

  function totalShipCells() {
    return ships.reduce((a, b) => a + b, 0);
  }

  function animateExplosion(cellEl, isHit) {
    const explosion = document.createElement("div");
    explosion.style.position = "absolute";
    explosion.style.top = "0";
    explosion.style.left = "0";
    explosion.style.width = "100%";
    explosion.style.height = "100%";
    explosion.style.zIndex = "10";
    explosion.style.pointerEvents = "none";
    explosion.style.backgroundColor = isHit ? "#ef4444" : "#3b82f6";
    explosion.style.opacity = "0.7";
    explosion.style.animation = "explosion 0.5s ease-out forwards";
    cellEl.appendChild(explosion);
    animatingCells.add(cellEl);
    setTimeout(() => {
      if (cellEl.contains(explosion)) cellEl.removeChild(explosion);
      animatingCells.delete(cellEl);
    }, 500);
  }

  function handlePlayerShot(r, c, cellEl) {
    if (gameOver || currentTurn !== "player" || animatingCells.has(cellEl))
      return;
    const cell = cpuBoard[r][c];
    if (cell.hit || cell.miss) return;

    if (cell.ship) {
      cell.hit = true;
      playerHits++;
      cellEl.style.backgroundColor = "#7f1d1d";
      animateExplosion(cellEl, true);
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
      cellEl.style.backgroundColor = "#1e3a8a";
      animateExplosion(cellEl, false);
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
      playerCellEl.style.backgroundColor = "#7f1d1d";
      animateExplosion(playerCellEl, true);
      statusEl.textContent = "CPU hit your ship! Your turn.";
      if (cpuHits === totalShipCells()) {
        statusEl.textContent = "All your ships are sunk. CPU wins.";
        gameOver = true;
        const scoreValue = Math.max(0, 50 - cpuHits * 5);
        submitScore(scoreValue);
        return;
      }
      currentTurn = "player";
    } else {
      cell.miss = true;
      playerCellEl.style.backgroundColor = "#1e3a8a";
      animateExplosion(playerCellEl, false);
      statusEl.textContent = "CPU missed. Your turn.";
      currentTurn = "player";
    }
  }

  function reset() {
    setupBoards();
    buildGrids();
  }

  // explosion / splash CSS
  const style = document.createElement("style");
  style.textContent = `
    @keyframes explosion {
      0% { transform: scale(0); opacity: 0.8; }
      50% { transform: scale(1.2); opacity: 0.6; }
      100% { transform: scale(1); opacity: 0; }
    }
  `;
  document.head.appendChild(style);

  reset();

  resetBtn.onclick = null;
  resetBtn.addEventListener("click", reset);

  // optional destroy function if needed by caller
  return () => {
    destroyed = true;
  };
}
