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
    grid.innerHTML = "";
    board.forEach((cell, index) => {
      const btn = document.createElement("button");
      // visible 3x3 grid cell
      btn.className =
        "tictactoe-cell h-16 w-16 sm:h-20 sm:w-20 flex items-center justify-center " +
        "text-2xl sm:text-3xl font-bold rounded-xl border border-slate-600 " +
        "bg-slate-900/80 text-slate-100 hover:bg-slate-800/80 transition-colors disabled:opacity-60";
      btn.textContent = cell;

      btn.disabled = !!cell || !gameRunning || currentPlayer !== "X";

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
    return lines.some(
      ([a, c, d]) => b[a] === player && b[c] === player && b[d] === player
    );
  }

  function updateStatusBar() {
    const roundNumber = currentRound + 1;
    roundInfoSpan.textContent = `Round ${roundNumber} of ${totalRounds}`;
    scoreInfoSpan.textContent = `You ${playerWins} - ${computerWins} CPU`;
  }

  function resetBoardOnly() {
    board = ["", "", "", "", "", "", "", "", ""];
    currentPlayer = "X";
    gameRunning = matchActive;
    status.textContent = matchActive
      ? "Your turn."
      : "Choose “Start Match” to play.";
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
    status.textContent = "Choose “Start Match” to play.";
    resetBoardOnly();
  }

  function finishMatch() {
    matchActive = false;
    gameRunning = false;

    let finalMessage;
    let finalScoreForBackend = 0;

    if (playerWins > computerWins) {
      finalMessage = `You won the match! Final score: You ${playerWins} - ${computerWins} CPU.`;
      finalScoreForBackend = 1;
    } else if (playerWins < computerWins) {
      finalMessage = `You lost the match. Final score: You ${playerWins} - ${computerWins} CPU.`;
      finalScoreForBackend = -1;
    } else {
      finalMessage = `The match is a tie. Final score: You ${playerWins} - ${computerWins} CPU.`;
      finalScoreForBackend = 0;
    }

    status.textContent = finalMessage;
    submitScore(finalScoreForBackend, finalMessage);
  }

  function handleRoundEnd(result) {
    gameRunning = false;

    if (result === "win") {
      playerWins += 1;
      status.textContent = "You win this round!";
    } else if (result === "loss") {
      computerWins += 1;
      status.textContent = "Computer wins this round!";
    } else {
      status.textContent = "This round is a tie!";
    }

    const winsNeeded = Math.floor(totalRounds / 2) + 1;
    if (
      playerWins >= winsNeeded ||
      computerWins >= winsNeeded ||
      currentRound + 1 >= totalRounds
    ) {
      finishMatch();
    } else {
      currentRound += 1;
      updateStatusBar();
      setTimeout(() => {
        resetBoardOnly();
      }, 800);
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
