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
  let animatingCells = new Set();

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
    playerGridEl.style.gridTemplateColumns = `repeat(${size}, 40px)`;
    cpuGridEl.style.gridTemplateColumns = `repeat(${size}, 40px)`;
    playerGridEl.style.gap = "4px";
    cpuGridEl.style.gap = "4px";

    // Add grid labels
    playerGridEl.style.position = "relative";
    cpuGridEl.style.position = "relative";

    // Create row and column labels for player grid
    const playerRowLabels = document.createElement("div");
    playerRowLabels.style.position = "absolute";
    playerRowLabels.style.left = "-20px";
    playerRowLabels.style.top = "0";
    playerRowLabels.style.height = "100%";
    playerRowLabels.style.display = "flex";
    playerRowLabels.style.flexDirection = "column";
    
    const playerColLabels = document.createElement("div");
    playerColLabels.style.position = "absolute";
    playerColLabels.style.top = "-20px";
    playerColLabels.style.left = "0";
    playerColLabels.style.width = "100%";
    playerColLabels.style.display = "flex";
    
    // Create row and column labels for CPU grid
    const cpuRowLabels = document.createElement("div");
    cpuRowLabels.style.position = "absolute";
    cpuRowLabels.style.left = "-20px";
    cpuRowLabels.style.top = "0";
    cpuRowLabels.style.height = "100%";
    cpuRowLabels.style.display = "flex";
    cpuRowLabels.style.flexDirection = "column";
    
    const cpuColLabels = document.createElement("div");
    cpuColLabels.style.position = "absolute";
    cpuColLabels.style.top = "-20px";
    cpuColLabels.style.left = "0";
    cpuColLabels.style.width = "100%";
    cpuColLabels.style.display = "flex";

    // Create labels
    for (let i = 0; i < size; i++) {
      // Row labels (A, B, C, etc.)
      const playerRowLabel = document.createElement("div");
      playerRowLabel.style.height = "40px";
      playerRowLabel.style.display = "flex";
      playerRowLabel.style.alignItems = "center";
      playerRowLabel.style.justifyContent = "center";
      playerRowLabel.style.color = "#94a3b8";
      playerRowLabel.style.fontSize = "12px";
      playerRowLabel.textContent = String.fromCharCode(65 + i);
      playerRowLabels.appendChild(playerRowLabel);
      
      const cpuRowLabel = playerRowLabel.cloneNode(true);
      cpuRowLabels.appendChild(cpuRowLabel);
      
      // Column labels (1, 2, 3, etc.)
      const playerColLabel = document.createElement("div");
      playerColLabel.style.width = "40px";
      playerColLabel.style.display = "flex";
      playerColLabel.style.alignItems = "center";
      playerColLabel.style.justifyContent = "center";
      playerColLabel.style.color = "#94a3b8";
      playerColLabel.style.fontSize = "12px";
      playerColLabel.textContent = (i + 1).toString();
      playerColLabels.appendChild(playerColLabel);
      
      const cpuColLabel = playerColLabel.cloneNode(true);
      cpuColLabels.appendChild(cpuColLabel);
    }
    
    playerGridEl.style.paddingTop = "20px";
    playerGridEl.style.paddingLeft = "20px";
    playerGridEl.appendChild(playerRowLabels);
    playerGridEl.appendChild(playerColLabels);
    
    cpuGridEl.style.paddingTop = "20px";
    cpuGridEl.style.paddingLeft = "20px";
    cpuGridEl.appendChild(cpuRowLabels);
    cpuGridEl.appendChild(cpuColLabels);

    // player grid (shows ships)
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        const cell = document.createElement("div");
        cell.className = "cell";
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
        
        // Add water effect
        const waterEffect = document.createElement("div");
        waterEffect.style.position = "absolute";
        waterEffect.style.top = "0";
        waterEffect.style.left = "0";
        waterEffect.style.width = "100%";
        waterEffect.style.height = "100%";
        waterEffect.style.background = "linear-gradient(135deg, #0ea5e9 0%, #0369a1 100%)";
        waterEffect.style.opacity = "0.2";
        waterEffect.style.zIndex = "1";
        cell.appendChild(waterEffect);
        
        if (playerBoard[r][c].ship) {
          // Create ship visual
          const ship = document.createElement("div");
          ship.style.position = "relative";
          ship.style.zIndex = "2";
          ship.style.width = "30px";
          ship.style.height = "30px";
          ship.style.background = "linear-gradient(135deg, #64748b 0%, #334155 100%)";
          ship.style.borderRadius = "4px";
          ship.style.boxShadow = "0 2px 4px rgba(0,0,0,0.3)";
          
          // Add ship details
          const shipDetail = document.createElement("div");
          shipDetail.style.position = "absolute";
          shipDetail.style.top = "50%";
          shipDetail.style.left = "50%";
          shipDetail.style.transform = "translate(-50%, -50%)";
          shipDetail.style.width = "10px";
          shipDetail.style.height = "10px";
          shipDetail.style.borderRadius = "50%";
          shipDetail.style.backgroundColor = "#ef4444";
          ship.appendChild(shipDetail);
          
          cell.appendChild(ship);
        }
        
        playerGridEl.appendChild(cell);
      }
    }

    // CPU grid (clickable)
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        const cell = document.createElement("button");
        cell.className = "cell";
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
        cell.style.boxShadow = "0 1px 3px rgba(0,0,0,0.2)";
        
        // Add water effect
        const waterEffect = document.createElement("div");
        waterEffect.style.position = "absolute";
        waterEffect.style.top = "0";
        waterEffect.style.left = "0";
        waterEffect.style.width = "100%";
        waterEffect.style.height = "100%";
        waterEffect.style.background = "linear-gradient(135deg, #0ea5e9 0%, #0369a1 100%)";
        waterEffect.style.opacity = "0.2";
        waterEffect.style.zIndex = "1";
        cell.appendChild(waterEffect);
        
        // Add hover effect
        cell.addEventListener("mouseenter", () => {
          if (!gameOver && currentTurn === "player" && !cpuBoard[r][c].hit && !cpuBoard[r][c].miss) {
            cell.style.backgroundColor = "#334155";
            cell.style.transform = "scale(1.05)";
            cell.style.boxShadow = "0 4px 8px rgba(0,0,0,0.3)";
          }
        });
        
        cell.addEventListener("mouseleave", () => {
          if (!cpuBoard[r][c].hit && !cpuBoard[r][c].miss) {
            cell.style.backgroundColor = "#1e293b";
            cell.style.transform = "scale(1)";
            cell.style.boxShadow = "0 1px 3px rgba(0,0,0,0.2)";
          }
        });
        
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
    
    if (isHit) {
      // Create explosion effect for hit
      explosion.style.backgroundColor = "#ef4444";
      explosion.style.opacity = "0.8";
      explosion.style.animation = "explosion 0.5s ease-out forwards";
      
      // Add explosion particles
      for (let i = 0; i < 8; i++) {
        const particle = document.createElement("div");
        particle.style.position = "absolute";
        particle.style.width = "4px";
        particle.style.height = "4px";
        particle.style.backgroundColor = "#fbbf24";
        particle.style.borderRadius = "50%";
        particle.style.top = "50%";
        particle.style.left = "50%";
        particle.style.transform = "translate(-50%, -50%)";
        
        const angle = (Math.PI * 2 * i) / 8;
        const distance = 15 + Math.random() * 10;
        const tx = Math.cos(angle) * distance;
        const ty = Math.sin(angle) * distance;
        
        particle.style.animation = `particle 0.5s ease-out forwards`;
        particle.style.setProperty('--tx', `${tx}px`);
        particle.style.setProperty('--ty', `${ty}px`);
        
        explosion.appendChild(particle);
      }
    } else {
      // Create splash effect for miss
      explosion.style.backgroundColor = "#3b82f6";
      explosion.style.opacity = "0.6";
      explosion.style.animation = "splash 0.4s ease-out forwards";
    }
    
    cellEl.appendChild(explosion);
    animatingCells.add(cellEl);
    
    setTimeout(() => {
      if (cellEl.contains(explosion)) {
        cellEl.removeChild(explosion);
      }
      animatingCells.delete(cellEl);
    }, 500);
  }

  function handlePlayerShot(r, c, cellEl) {
    if (gameOver || currentTurn !== "player" || animatingCells.has(cellEl)) return;
    const cell = cpuBoard[r][c];
    if (cell.hit || cell.miss) return;

    if (cell.ship) {
      cell.hit = true;
      playerHits++;
      
      // Update cell appearance
      cellEl.style.backgroundColor = "#7f1d1d";
      cellEl.style.border = "1px solid #dc2626";
      cellEl.style.cursor = "not-allowed";
      
      // Create hit marker
      const hitMarker = document.createElement("div");
      hitMarker.style.position = "relative";
      hitMarker.style.zIndex = "2";
      hitMarker.style.width = "20px";
      hitMarker.style.height = "20px";
      hitMarker.style.background = "radial-gradient(circle, #fbbf24 0%, #f59e0b 70%, #d97706 100%)";
      hitMarker.style.borderRadius = "50%";
      hitMarker.style.boxShadow = "0 0 10px rgba(251, 191, 36, 0.7)";
      cellEl.appendChild(hitMarker);
      
      // Animate explosion
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
      
      // Update cell appearance
      cellEl.style.backgroundColor = "#1e3a8a";
      cellEl.style.border = "1px solid #3b82f6";
      cellEl.style.cursor = "not-allowed";
      
      // Create miss marker
      const missMarker = document.createElement("div");
      missMarker.style.position = "relative";
      missMarker.style.zIndex = "2";
      missMarker.style.width = "10px";
      missMarker.style.height = "10px";
      missMarker.style.backgroundColor = "#93c5fd";
      missMarker.style.borderRadius = "50%";
      cellEl.appendChild(missMarker);
      
      // Animate splash
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
    const playerCellEl = playerGridEl.children[index + 2 + size]; // +2 for labels, +size for first row of labels

    if (cell.ship) {
      cell.hit = true;
      cpuHits++;
      
      // Update cell appearance
      playerCellEl.style.backgroundColor = "#7f1d1d";
      playerCellEl.style.border = "1px solid #dc2626";
      
      // Create hit marker
      const hitMarker = document.createElement("div");
      hitMarker.style.position = "relative";
      hitMarker.style.zIndex = "2";
      hitMarker.style.width = "20px";
      hitMarker.style.height = "20px";
      hitMarker.style.background = "radial-gradient(circle, #fbbf24 0%, #f59e0b 70%, #d97706 100%)";
      hitMarker.style.borderRadius = "50%";
      hitMarker.style.boxShadow = "0 0 10px rgba(251, 191, 36, 0.7)";
      playerCellEl.appendChild(hitMarker);
      
      // Animate explosion
      animateExplosion(playerCellEl, true);
      
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
      
      // Update cell appearance
      playerCellEl.style.backgroundColor = "#1e3a8a";
      playerCellEl.style.border = "1px solid #3b82f6";
      
      // Create miss marker
      const missMarker = document.createElement("div");
      missMarker.style.position = "relative";
      missMarker.style.zIndex = "2";
      missMarker.style.width = "10px";
      missMarker.style.height = "10px";
      missMarker.style.backgroundColor = "#93c5fd";
      missMarker.style.borderRadius = "50%";
      playerCellEl.appendChild(missMarker);
      
      // Animate splash
      animateExplosion(playerCellEl, false);
      
      statusEl.textContent = "CPU missed. Your turn.";
      currentTurn = "player";
    }
  }

  function reset() {
    setupBoards();
    buildGrids();
  }

  // Add CSS animations
  const style = document.createElement('style');
  style.textContent = `
    @keyframes explosion {
      0% { transform: scale(0); opacity: 0.8; }
      50% { transform: scale(1.2); opacity: 0.6; }
      100% { transform: scale(1); opacity: 0; }
    }
    
    @keyframes splash {
      0% { transform: scale(0.5); opacity: 0.6; }
      100% { transform: scale(1); opacity: 0; }
    }
    
    @keyframes particle {
      0% { transform: translate(-50%, -50%); opacity: 1; }
      100% { transform: translate(calc(-50% + var(--tx)), calc(-50% + var(--ty))); opacity: 0; }
    }
  `;
  document.head.appendChild(style);

  reset();
  loadLeaderboard();

  resetBtn.addEventListener("click", reset);
}