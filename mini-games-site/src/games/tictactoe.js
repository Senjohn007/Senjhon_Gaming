// src/games/tictactoe.js

let cleanupFns = [];

// optional destroy function to remove listeners when React unmounts
export function destroyTicTacToe() {
  cleanupFns.forEach((fn) => {
    try {
      fn();
    } catch (e) {
      console.error("Error during TicTacToe cleanup:", e);
    }
  });
  cleanupFns = [];
}

export function initTicTacToe() {
  // reset any previous listeners
  destroyTicTacToe();

  let board = ["", "", "", "", "", "", "", "", ""];
  let currentPlayer = "X";
  let gameRunning = false;
  let winningLine = null;

  const grid = document.getElementById("ttt-grid");
  const status = document.getElementById("ttt-status");
  const resetBtn = document.getElementById("ttt-reset");

  const roundsSelect = document.getElementById("ttt-rounds-select");
  const startMatchBtn = document.getElementById("ttt-start-match-btn");
  const resetMatchBtn = document.getElementById("ttt-reset-match-btn");
  const statusBar = document.getElementById("ttt-status-bar");
  const roundInfoSpan = document.getElementById("ttt-round-info");
  const scoreInfoSpan = document.getElementById("ttt-score-info");

  if (
    !grid ||
    !status ||
    !resetBtn ||
    !roundsSelect ||
    !startMatchBtn ||
    !resetMatchBtn ||
    !statusBar ||
    !roundInfoSpan ||
    !scoreInfoSpan
  ) {
    console.warn("TicTacToe: required elements not found");
    return;
  }

  let totalRounds = 1;
  let currentRound = 0;
  let playerWins = 0;
  let computerWins = 0;
  let matchActive = false;

  // Add custom styles for the game
  const tttStyles = `
    <style id="ttt-styles">
      #ttt-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 10px;
        max-width: 320px;
        margin: 0 auto;
        position: relative;
      }
      
      .tictactoe-cell {
        height: 100px;
        width: 100px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: linear-gradient(145deg, #1e293b, #334155);
        border-radius: 12px;
        border: 2px solid #475569;
        cursor: pointer;
        position: relative;
        overflow: hidden;
        transition: all 0.3s ease;
      }
      
      .tictactoe-cell:hover:not(:disabled) {
        background: linear-gradient(145deg, #334155, #475569);
        transform: translateY(-5px);
        box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
      }
      
      .tictactoe-cell:active:not(:disabled) {
        transform: translateY(-2px);
      }
      
      .tictactoe-cell:disabled {
        cursor: default;
      }
      
      .tictactoe-cell.winner {
        background: linear-gradient(145deg, #065f46, #047857);
        border-color: #10b981;
        animation: pulse 1s infinite;
      }
      
      @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
      }
      
      .mark-x, .mark-o {
        position: absolute;
        width: 70%;
        height: 70%;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
      
      .mark-x {
        stroke: #3b82f6;
        stroke-width: 8;
        stroke-linecap: round;
        fill: none;
        opacity: 0;
        animation: fadeIn 0.3s forwards;
      }
      
      .mark-o {
        stroke: #ef4444;
        stroke-width: 8;
        fill: none;
        opacity: 0;
        animation: fadeIn 0.3s forwards;
      }
      
      @keyframes fadeIn {
        to { opacity: 1; }
      }
      
      #ttt-status {
        background: linear-gradient(to right, #1e293b, #334155);
        color: white;
        padding: 15px;
        border-radius: 10px;
        margin: 20px 0;
        text-align: center;
        font-weight: 500;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        min-height: 60px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      
      #ttt-status.win {
        background: linear-gradient(to right, #065f46, #047857);
      }
      
      #ttt-status.loss {
        background: linear-gradient(to right, #7f1d1d, #991b1b);
      }
      
      #ttt-status.tie {
        background: linear-gradient(to right, #78350f, #92400e);
      }
      
      #ttt-status-bar {
        background: linear-gradient(to right, #1e293b, #334155);
        color: white;
        padding: 12px 15px;
        border-radius: 10px;
        margin: 15px 0;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      }
      
      .status-info {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      
      .status-item {
        display: flex;
        align-items: center;
        gap: 8px;
      }
      
      .status-icon {
        font-size: 18px;
      }
      
      .control-button {
        padding: 10px 20px;
        border-radius: 8px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s ease;
        border: none;
        color: white;
      }
      
      #ttt-start-match-btn {
        background: linear-gradient(145deg, #10b981, #059669);
      }
      
      #ttt-start-match-btn:hover {
        background: linear-gradient(145deg, #059669, #047857);
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
      }
      
      #ttt-reset-match-btn {
        background: linear-gradient(145deg, #ef4444, #dc2626);
      }
      
      #ttt-reset-match-btn:hover {
        background: linear-gradient(145deg, #dc2626, #b91c1c);
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
      }
      
      #ttt-reset {
        background: linear-gradient(145deg, #6366f1, #4f46e5);
      }
      
      #ttt-reset:hover {
        background: linear-gradient(145deg, #4f46e5, #4338ca);
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
      }
      
      .winning-line {
        position: absolute;
        background: linear-gradient(90deg, rgba(16, 185, 129, 0.8), rgba(5, 150, 105, 0.8));
        z-index: 10;
        transform-origin: center;
        animation: drawLine 0.5s ease-out forwards;
      }
      
      @keyframes drawLine {
        from { transform: scale(0, 1); }
        to { transform: scale(1, 1); }
      }
      
      .round-selector {
        margin: 15px 0;
        display: flex;
        align-items: center;
        gap: 10px;
      }
      
      #ttt-rounds-select {
        padding: 8px 12px;
        border-radius: 6px;
        border: 1px solid #d1d5db;
        background-color: white;
      }
    </style>
  `;
  
  // Add styles to head if not already added
  if (!document.getElementById('ttt-styles')) {
    const styleElement = document.createElement('div');
    styleElement.id = 'ttt-styles';
    styleElement.innerHTML = tttStyles;
    document.head.appendChild(styleElement);
  }

  // Create SVG for X mark
  function createXMark() {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.classList.add("mark-x");
    svg.setAttribute("viewBox", "0 0 100 100");
    
    const line1 = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line1.setAttribute("x1", "20");
    line1.setAttribute("y1", "20");
    line1.setAttribute("x2", "80");
    line1.setAttribute("y2", "80");
    
    const line2 = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line2.setAttribute("x1", "80");
    line2.setAttribute("y1", "20");
    line2.setAttribute("x2", "20");
    line2.setAttribute("y2", "80");
    
    svg.appendChild(line1);
    svg.appendChild(line2);
    
    return svg;
  }

  // Create SVG for O mark
  function createOMark() {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.classList.add("mark-o");
    svg.setAttribute("viewBox", "0 0 100 100");
    
    const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle.setAttribute("cx", "50");
    circle.setAttribute("cy", "50");
    circle.setAttribute("r", "30");
    
    svg.appendChild(circle);
    
    return svg;
  }

  // Create winning line
  function createWinningLine(startIndex, endIndex) {
    // Remove any existing winning line
    const existingLine = grid.querySelector(".winning-line");
    if (existingLine) {
      grid.removeChild(existingLine);
    }
    
    const startCell = grid.children[startIndex];
    const endCell = grid.children[endIndex];
    
    if (!startCell || !endCell) return;
    
    const startRect = startCell.getBoundingClientRect();
    const endRect = endCell.getBoundingClientRect();
    const gridRect = grid.getBoundingClientRect();
    
    const startX = startRect.left + startRect.width / 2 - gridRect.left;
    const startY = startRect.top + startRect.height / 2 - gridRect.top;
    const endX = endRect.left + endRect.width / 2 - gridRect.left;
    const endY = endRect.top + endRect.height / 2 - gridRect.top;
    
    const length = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));
    const angle = Math.atan2(endY - startY, endX - startX) * 180 / Math.PI;
    
    const line = document.createElement("div");
    line.classList.add("winning-line");
    line.style.width = `${length}px`;
    line.style.height = "8px";
    line.style.left = `${startX}px`;
    line.style.top = `${startY}px`;
    line.style.transform = `rotate(${angle}deg)`;
    line.style.transformOrigin = "0 50%";
    
    grid.appendChild(line);
  }

  // ---- leaderboard loader ----
  function loadTttLeaderboard() {
    fetch(
      "http://localhost:5000/api/scores/leaderboard?game=tictactoe&limit=10"
    )
      .then((res) => res.json())
      .then((rows) => {
        const tbody = document.querySelector("#ttt-leaderboard tbody");
        if (!tbody) return;

        tbody.innerHTML = "";

        if (!rows || rows.length === 0) {
          const tr = document.createElement("tr");
          tr.innerHTML = `
            <td colspan="2" style="text-align:center; color:#94a3b8; padding:8px;">
              No scores yet.
            </td>
          `;
          tbody.appendChild(tr);
          return;
        }

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
        console.error("Error loading Tic Tac Toe leaderboard:", err);
        const tbody = document.querySelector("#ttt-leaderboard tbody");
        if (!tbody) return;
        tbody.innerHTML = `
          <tr>
            <td colspan="2" style="text-align:center; color:#f97373; padding:8px;">
              Failed to load scores.
            </td>
          </tr>
        `;
      });
  }

  // ---- submitScore ----
  function submitScore(scoreValue, resultText) {
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
        gameKey: "tictactoe",
        value: scoreValue, // 1 win, 0 tie, -1 loss
        userId: player.isGuest ? null : player.id,
        username: player.name,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Tic Tac Toe result saved:", data, "=>", resultText);
        loadTttLeaderboard();
      })
      .catch((err) => {
        console.error("Error saving Tic Tac Toe result:", err);
      });
  }

  function renderBoard() {
    // Clear any existing winning line
    const existingLine = grid.querySelector(".winning-line");
    if (existingLine) {
      grid.removeChild(existingLine);
    }
    
    grid.innerHTML = "";
    board.forEach((cell, index) => {
      const btn = document.createElement("button");
      btn.className = "tictactoe-cell";
      btn.disabled = !!cell || !gameRunning || currentPlayer !== "X";

      if (cell === "X") {
        btn.appendChild(createXMark());
      } else if (cell === "O") {
        btn.appendChild(createOMark());
      }

      // Highlight winning cells
      if (winningLine && winningLine.includes(index)) {
        btn.classList.add("winner");
      }

      const handler = () => {
        if (!gameRunning || currentPlayer !== "X" || board[index]) return;
        board[index] = "X";
        checkGameState();
        renderBoard();

        if (gameRunning) {
          currentPlayer = "O";
          status.textContent = "Computer's turn...";
          setTimeout(computerMove, 400);
        }
      };

      btn.addEventListener("click", handler);
      cleanupFns.push(() => btn.removeEventListener("click", handler));

      grid.appendChild(btn);
    });
  }

  function checkWinner(b, player) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    
    for (const [a, c, d] of lines) {
      if (b[a] === player && b[c] === player && b[d] === player) {
        winningLine = [a, c, d];
        return true;
      }
    }
    
    return false;
  }

  function updateStatusBar() {
    const roundNumber = currentRound + 1;
    roundInfoSpan.innerHTML = `<span class="status-icon">🎮</span> Round ${roundNumber} of ${totalRounds}`;
    scoreInfoSpan.innerHTML = `<span class="status-icon">🏆</span> You ${playerWins} - ${computerWins} CPU`;
  }

  function resetBoardOnly() {
    board = ["", "", "", "", "", "", "", "", ""];
    currentPlayer = "X";
    gameRunning = matchActive;
    winningLine = null;
    
    // Reset status styling
    status.className = "";
    
    status.textContent = matchActive
      ? "Your turn."
      : "Choose \"Start Match\" to play.";
    renderBoard();
  }

  function startMatch() {
    totalRounds = parseInt(roundsSelect.value, 10) || 1;
    currentRound = 0;
    playerWins = 0;
    computerWins = 0;
    matchActive = true;

    statusBar.style.display = "flex";
    updateStatusBar();
    status.textContent = "Match started! Your turn.";
    resetBoardOnly();
  }

  function resetMatch() {
    matchActive = false;
    totalRounds = parseInt(roundsSelect.value, 10) || 1;
    currentRound = 0;
    playerWins = 0;
    computerWins = 0;
    statusBar.style.display = "none";
    status.textContent = "Choose \"Start Match\" to play.";
    resetBoardOnly();
  }

  function finishMatch() {
    matchActive = false;
    gameRunning = false;

    let finalMessage;
    let finalScoreForBackend = 0;
    let statusClass = "";

    if (playerWins > computerWins) {
      finalMessage = `You won the match! Final score: You ${playerWins} - ${computerWins} CPU.`;
      finalScoreForBackend = 1;
      statusClass = "win";
    } else if (playerWins < computerWins) {
      finalMessage = `You lost the match. Final score: You ${playerWins} - ${computerWins} CPU.`;
      finalScoreForBackend = -1;
      statusClass = "loss";
    } else {
      finalMessage = `The match is a tie. Final score: You ${playerWins} - ${computerWins} CPU.`;
      finalScoreForBackend = 0;
      statusClass = "tie";
    }

    status.textContent = finalMessage;
    status.className = statusClass;
    submitScore(finalScoreForBackend, finalMessage);
  }

  function handleRoundEnd(result) {
    gameRunning = false;

    // Update status with appropriate styling
    status.className = result;
    
    if (result === "win") {
      playerWins += 1;
      status.textContent = "You win this round!";
      if (winningLine) {
        createWinningLine(winningLine[0], winningLine[2]);
      }
    } else if (result === "loss") {
      computerWins += 1;
      status.textContent = "Computer wins this round!";
      if (winningLine) {
        createWinningLine(winningLine[0], winningLine[2]);
      }
    } else {
      status.textContent = "This round is a tie!";
    }

    const winsNeeded = Math.floor(totalRounds / 2) + 1;
    if (
      playerWins >= winsNeeded ||
      computerWins >= winsNeeded ||
      currentRound + 1 >= totalRounds
    ) {
      setTimeout(() => {
        finishMatch();
      }, 1500);
    } else {
      currentRound += 1;
      updateStatusBar();
      setTimeout(() => {
        resetBoardOnly();
      }, 1500);
    }
  }

  function endGame(result) {
    handleRoundEnd(result);
  }

  function checkGameState() {
    if (checkWinner(board, "X")) {
      endGame("win");
      return;
    }
    if (checkWinner(board, "O")) {
      endGame("loss");
      return;
    }
    if (!board.includes("")) {
      endGame("tie");
    }
  }

  function computerMove() {
    if (!gameRunning) return;

    const emptyIndices = board
      .map((val, idx) => (val === "" ? idx : null))
      .filter((v) => v !== null);

    if (emptyIndices.length === 0) return;

    const randomIndex =
      emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
    board[randomIndex] = "O";
    checkGameState();

    if (gameRunning) {
      currentPlayer = "X";
      status.textContent = "Your turn.";
    }

    renderBoard();
  }

  // ----------------- DOM listeners -----------------
  const resetHandler = () => resetBoardOnly();
  resetBtn.addEventListener("click", resetHandler);
  cleanupFns.push(() => resetBtn.removeEventListener("click", resetHandler));

  const startHandler = () => startMatch();
  startMatchBtn.addEventListener("click", startHandler);
  cleanupFns.push(() =>
    startMatchBtn.removeEventListener("click", startHandler)
  );

  const resetMatchHandler = () => resetMatch();
  resetMatchBtn.addEventListener("click", resetMatchHandler);
  cleanupFns.push(() =>
    resetMatchBtn.removeEventListener("click", resetMatchHandler)
  );

  // initial state
  resetMatch();
  loadTttLeaderboard();
}