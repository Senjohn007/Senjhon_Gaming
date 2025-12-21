// src/games/tictactoe.js
export function initTicTacToe() {
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
    return;
  }

  let totalRounds = 1;
  let currentRound = 0;
  let playerWins = 0;
  let computerWins = 0;
  let matchActive = false;

  function loadTttLeaderboard() {
    fetch(
      "http://localhost:5000/api/scores/leaderboard?game=tictactoe&limit=10"
    )
      .then((res) => res.json())
      .then((rows) => {
        const tbody = document.querySelector("#ttt-leaderboard tbody");
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
        console.error("Error loading Tic Tac Toe leaderboard:", err);
      });
  }

  function submitScore(scoreValue, resultText) {
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
        gameKey: "tictactoe",
        value: scoreValue,
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
      btn.className = "tictactoe-cell";
      btn.textContent = cell;

      btn.disabled = !!cell || !gameRunning || currentPlayer !== "X";

      btn.addEventListener("click", () => {
        if (!gameRunning || currentPlayer !== "X" || board[index]) return;
        board[index] = "X";
        checkGameState();
        renderBoard();

        if (gameRunning) {
          currentPlayer = "O";
          status.textContent = "Computer's turn...";
          setTimeout(computerMove, 400);
        }
      });

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

    statusBar.style.display = "block";
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

  // clean listeners in case of re-mount
  resetBtn.replaceWith(resetBtn.cloneNode(true));
  const freshResetBtn = document.getElementById("ttt-reset");

  startMatchBtn.replaceWith(startMatchBtn.cloneNode(true));
  const freshStartMatchBtn = document.getElementById("ttt-start-match-btn");

  resetMatchBtn.replaceWith(resetMatchBtn.cloneNode(true));
  const freshResetMatchBtn = document.getElementById("ttt-reset-match-btn");

  freshResetBtn.addEventListener("click", () => {
    resetBoardOnly();
  });

  freshStartMatchBtn.addEventListener("click", () => {
    startMatch();
  });

  freshResetMatchBtn.addEventListener("click", () => {
    resetMatch();
  });

  resetMatch();
  loadTttLeaderboard();
}
