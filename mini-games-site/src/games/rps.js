// src/games/rps.js
export function initRps() {
  const ROCK = "r";
  const PAPER = "p";
  const SCISSORS = "s";

  const emojis = {
    [ROCK]: "🗻",
    [PAPER]: "📃",
    [SCISSORS]: "⚔️",
  };

  const choices = [ROCK, PAPER, SCISSORS];

  const buttons = document.querySelectorAll(".rps-choice-btn");
  const resultDiv = document.getElementById("rps-result");
  const choicesDiv = document.getElementById("rps-choices");

  const roundsSelect = document.getElementById("rps-rounds-select");
  const startMatchBtn = document.getElementById("rps-start-match-btn");
  const resetMatchBtn = document.getElementById("rps-reset-match-btn");
  const statusDiv = document.getElementById("rps-status");
  const roundInfoSpan = document.getElementById("rps-round-info");
  const scoreInfoSpan = document.getElementById("rps-score-info");

  if (
    !resultDiv ||
    !choicesDiv ||
    !roundsSelect ||
    !startMatchBtn ||
    !resetMatchBtn ||
    !statusDiv ||
    !roundInfoSpan ||
    !scoreInfoSpan ||
    buttons.length === 0
  ) {
    return;
  }

  let totalRounds = 3;
  let currentRound = 0;
  let playerWins = 0;
  let computerWins = 0;
  let matchActive = false;

  function loadRpsLeaderboard() {
    fetch("http://localhost:5000/api/scores/leaderboard?game=rps&limit=10")
      .then((res) => res.json())
      .then((rows) => {
        const tbody = document.querySelector("#rps-leaderboard tbody");
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
        console.error("Error loading RPS leaderboard:", err);
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
        gameKey: "rps",
        value: scoreValue, // 1 win, 0 tie, -1 loss
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("RPS result saved:", data, "=>", resultText);
        loadRpsLeaderboard();
      })
      .catch((err) => {
        console.error("Error saving RPS result:", err);
      });
  }

  function determineResult(myChoice, computerChoice) {
    if (myChoice === computerChoice) {
      return { message: "It's a tie, same choice.", score: 0 };
    }

    const isWin =
      (myChoice === ROCK && computerChoice === SCISSORS) ||
      (myChoice === SCISSORS && computerChoice === PAPER) ||
      (myChoice === PAPER && computerChoice === ROCK);

    if (isWin) {
      return {
        message: "You win this round!",
        score: 1,
      };
    }

    return {
      message: "You lose this round.",
      score: -1,
    };
  }

  function updateStatusText() {
    const roundNumber = currentRound + 1;
    roundInfoSpan.textContent = `Round ${roundNumber} of ${totalRounds}`;
    scoreInfoSpan.textContent = `You ${playerWins} - ${computerWins} CPU`;
  }

  function enableChoiceButtons(enabled) {
    buttons.forEach((btn) => {
      btn.disabled = !enabled;
    });
  }

  function resetMatchState() {
    totalRounds = parseInt(roundsSelect.value, 10) || 3;
    currentRound = 0;
    playerWins = 0;
    computerWins = 0;
    matchActive = false;

    statusDiv.style.display = "none";
    resultDiv.textContent = "Choose “Start Match” to play.";
    choicesDiv.textContent = "";
    enableChoiceButtons(false);
  }

  function startMatch() {
    totalRounds = parseInt(roundsSelect.value, 10) || 3;
    currentRound = 0;
    playerWins = 0;
    computerWins = 0;
    matchActive = true;

    statusDiv.style.display = "block";
    updateStatusText();
    resultDiv.textContent = "Match started! Make your move.";
    choicesDiv.textContent = "";
    enableChoiceButtons(true);
  }

  function finishMatch() {
    matchActive = false;
    enableChoiceButtons(false);

    let finalMessage;
    let finalScoreForBackend = 0; // 1 = match win, 0 = tie, -1 = loss

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

    resultDiv.textContent = finalMessage;
    submitScore(finalScoreForBackend, finalMessage);
  }

  function handleChoiceClick(btn) {
    if (!matchActive) return;

    const myChoice = btn.getAttribute("data-choice");
    const computerChoice =
      choices[Math.floor(Math.random() * choices.length)];

    choicesDiv.textContent = `You chose ${emojis[myChoice]} | Computer chose ${emojis[computerChoice]}`;

    const { message, score } = determineResult(myChoice, computerChoice);
    resultDiv.textContent = message;

    if (score === 1) playerWins += 1;
    if (score === -1) computerWins += 1;

    currentRound += 1;
    updateStatusText();

    const winsNeeded = Math.floor(totalRounds / 2) + 1;
    if (
      playerWins >= winsNeeded ||
      computerWins >= winsNeeded ||
      currentRound >= totalRounds
    ) {
      finishMatch();
    }
  }

  // clean old listeners in case of re-mount
  startMatchBtn.replaceWith(startMatchBtn.cloneNode(true));
  const freshStartMatchBtn = document.getElementById("rps-start-match-btn");

  resetMatchBtn.replaceWith(resetMatchBtn.cloneNode(true));
  const freshResetMatchBtn = document.getElementById("rps-reset-match-btn");

  const freshButtons = document.querySelectorAll(".rps-choice-btn");

  freshStartMatchBtn.addEventListener("click", startMatch);
  freshResetMatchBtn.addEventListener("click", resetMatchState);

  freshButtons.forEach((btn) => {
    btn.addEventListener("click", () => handleChoiceClick(btn));
  });

  resetMatchState();
  loadRpsLeaderboard();
}
