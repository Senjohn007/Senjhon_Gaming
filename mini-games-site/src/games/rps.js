// src/games/rps.js
export function initRps({ onScoreSaved } = {}) {
  const ROCK = "r";
  const PAPER = "p";
  const SCISSORS = "s";

  const choices = [ROCK, PAPER, SCISSORS];

  const buttons = document.querySelectorAll(".rps-choice-btn");
  const resultDiv = document.getElementById("rps-result");
  const choicesDiv = document.getElementById("rps-choices");
  let battleArea = document.getElementById("rps-battle-area");

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

  // Create battle area if it doesn't exist
  function createBattleArea() {
    const ba = document.createElement("div");
    ba.id = "rps-battle-area";
    ba.className = "flex justify-between items-center my-6 relative";
    choicesDiv.parentNode.insertBefore(ba, choicesDiv.nextSibling);
    return ba;
  }

  if (!battleArea) {
    battleArea = createBattleArea();
  }

  let totalRounds = 3;
  let currentRound = 0;
  let playerWins = 0;
  let computerWins = 0;
  let matchActive = false;
  let isAnimating = false;

  // Add custom styles for the game (tweaked for visibility)
  const rpsStyles = `
    <style id="rps-styles">
      .rps-choice-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 150px;
        position: relative;
      }

      .rps-choice-display {
        width: 120px;
        height: 120px;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        background: linear-gradient(145deg, #f3f4f6, #e5e7eb);
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
                    0 4px 6px -2px rgba(0, 0, 0, 0.05);
        position: relative;
        overflow: hidden;
        transition: all 0.3s ease;
      }

      .rps-choice-display.winner {
        animation: pulse 1s infinite;
        box-shadow: 0 0 20px rgba(34, 197, 94, 0.5);
      }

      .rps-choice-display.loser {
        opacity: 0.7;
        transform: scale(0.9);
      }

      @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
      }

      .rps-choice-icon {
        width: 80px;
        height: 80px;
        position: relative;
      }

      .rps-vs {
        font-size: 2rem;
        font-weight: bold;
        color: #e5e7eb;
        z-index: 2;
      }

      .rps-choice-btn {
        width: 80px;
        height: 80px;
        border-radius: 50%;
        background: linear-gradient(145deg, #ffffff, #f3f4f6);
        border: 2px solid #d1d5db;
        cursor: pointer;
        display: flex;
        justify-content: center;
        align-items: center;
        transition: all 0.2s ease;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
                    0 2px 4px -1px rgba(0, 0, 0, 0.06);
      }

      .rps-choice-btn:hover:not(:disabled) {
        transform: translateY(-5px);
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
                    0 4px 6px -2px rgba(0, 0, 0, 0.05);
      }

      .rps-choice-btn:active:not(:disabled) {
        transform: translateY(-2px);
      }

      .rps-choice-btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      .rps-choice-btn.selected {
        border-color: #3b82f6;
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);
      }

      .rps-result-message {
        font-size: 1.1rem;
        font-weight: 600;
        text-align: center;
        padding: 8px 16px;
        border-radius: 8px;
        margin: 4px 0;
      }

      .rps-result-message.win {
        background-color: rgba(34, 197, 94, 0.12);
        color: #bbf7d0;
      }

      .rps-result-message.lose {
        background-color: rgba(239, 68, 68, 0.12);
        color: #fecaca;
      }

      .rps-result-message.tie {
        background-color: rgba(245, 158, 11, 0.12);
        color: #fed7aa;
      }

      #rps-status {
        background: linear-gradient(to right, #1e293b, #334155);
        color: white;
        padding: 10px 15px;
        border-radius: 8px;
        margin: 15px 0;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
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

      /* RESULT BOX: bright background so text is visible on dark card */
      #rps-result {
        background: #ffffff;
        padding: 15px;
        border-radius: 8px;
        margin: 15px 0 0 0;
        text-align: center;
        font-weight: 500;
        box-shadow: 0 4px 8px rgba(0,0,0,0.25);
        min-height: 60px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #020617;
      }

      .control-buttons {
        display: flex;
        gap: 10px;
        margin: 15px 0;
      }

      .control-button {
        padding: 8px 16px;
        border-radius: 6px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s ease;
        border: none;
      }

      #rps-start-match-btn {
        background: linear-gradient(145deg, #10b981, #059669);
        color: white;
      }

      #rps-start-match-btn:hover {
        background: linear-gradient(145deg, #059669, #047857);
        transform: translateY(-1px);
      }

      #rps-reset-match-btn {
        background: linear-gradient(145deg, #ef4444, #dc2626);
        color: white;
      }

      #rps-reset-match-btn:hover {
        background: linear-gradient(145deg, #dc2626, #b91c1c);
        transform: translateY(-1px);
      }

      .round-selector {
        margin: 15px 0;
        display: flex;
        align-items: center;
        gap: 10px;
      }

      /* ROUNDS SELECTOR: explicit white background + dark text */
      #rps-rounds-select {
        padding: 8px 12px;
        border-radius: 6px;
        border: 1px solid #d1d5db;
        background-color: #ffffff;
        color: #111827;
      }

      .countdown {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 3rem;
        font-weight: bold;
        color: #3b82f6;
        z-index: 10;
        animation: countdown 1s ease-out forwards;
      }

      @keyframes countdown {
        0% { transform: translate(-50%, -50%) scale(0.5); opacity: 0; }
        50% { transform: translate(-50%, -50%) scale(1.2); opacity: 1; }
        100% { transform: translate(-50%, -50%) scale(1); opacity: 0; }
      }

      .shake {
        animation: shake 0.5s;
      }

      @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
        20%, 40%, 60%, 80% { transform: translateX(5px); }
      }
    </style>
  `;

  if (!document.getElementById("rps-styles")) {
    const styleElement = document.createElement("div");
    styleElement.id = "rps-styles";
    styleElement.innerHTML = rpsStyles;
    document.head.appendChild(styleElement);
  }

  // --- icons ---
  function createChoiceIcon(choice) {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 100 100");
    svg.classList.add("rps-choice-icon");

    if (choice === ROCK) {
      svg.innerHTML = `
        <circle cx="50" cy="50" r="45" fill="#9ca3af" />
        <circle cx="50" cy="50" r="40" fill="#d1d5db" />
        <circle cx="50" cy="50" r="35" fill="#9ca3af" />
        <circle cx="50" cy="50" r="30" fill="#d1d5db" />
        <circle cx="50" cy="50" r="25" fill="#9ca3af" />
        <circle cx="50" cy="50" r="20" fill="#d1d5db" />
        <circle cx="50" cy="50" r="15" fill="#9ca3af" />
        <circle cx="50" cy="50" r="10" fill="#d1d5db" />
        <circle cx="50" cy="50" r="5" fill="#9ca3af" />
      `;
    } else if (choice === PAPER) {
      svg.innerHTML = `
        <rect x="20" y="15" width="60" height="70" rx="5" fill="#e5e7eb" stroke="#9ca3af" stroke-width="2" />
        <line x1="30" y1="30" x2="70" y2="30" stroke="#9ca3af" stroke-width="2" />
        <line x1="30" y1="45" x2="70" y2="45" stroke="#9ca3af" stroke-width="2" />
        <line x1="30" y1="60" x2="70" y2="60" stroke="#9ca3af" stroke-width="2" />
        <line x1="30" y1="75" x2="60" y2="75" stroke="#9ca3af" stroke-width="2" />
      `;
    } else if (choice === SCISSORS) {
      svg.innerHTML = `
        <path d="M30,30 L50,70 L55,65 L35,25 Z" fill="#ef4444" />
        <path d="M70,30 L50,70 L45,65 L65,25 Z" fill="#ef4444" />
        <circle cx="32.5" cy="27.5" r="5" fill="#f87171" />
        <circle cx="67.5" cy="27.5" r="5" fill="#f87171" />
        <circle cx="52.5" cy="67.5" r="5" fill="#f87171" />
        <circle cx="47.5" cy="67.5" r="5" fill="#f87171" />
      `;
    }

    return svg;
  }

  function createChoiceDisplay(choice, label) {
    const container = document.createElement("div");
    container.className = "rps-choice-container";

    const labelDiv = document.createElement("div");
    labelDiv.textContent = label;
    labelDiv.className = "font-bold text-center mb-2";

    const display = document.createElement("div");
    display.className = "rps-choice-display";
    display.appendChild(createChoiceIcon(choice));

    container.appendChild(labelDiv);
    container.appendChild(display);

    return container;
  }

  function createVsDisplay() {
    const vs = document.createElement("div");
    vs.className = "rps-vs";
    vs.textContent = "VS";
    return vs;
  }

  function showCountdown(callback) {
    battleArea.innerHTML = "";

    let count = 3;
    const countdownEl = document.createElement("div");
    countdownEl.className = "countdown";
    countdownEl.textContent = count;
    battleArea.appendChild(countdownEl);

    const interval = setInterval(() => {
      count--;
      if (count > 0) {
        countdownEl.textContent = count;
        countdownEl.style.animation = "none";
        setTimeout(() => {
          countdownEl.style.animation = "countdown 1s ease-out forwards";
        }, 10);
      } else {
        clearInterval(interval);
        countdownEl.textContent = "GO!";
        setTimeout(() => {
          callback();
        }, 500);
      }
    }, 1000);
  }

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
        gameKey: "rps",
        value: scoreValue,
        userId: player.isGuest ? null : player.id,
        username: player.name,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("RPS result saved:", data, "=>", resultText);
        if (typeof onScoreSaved === "function") {
          onScoreSaved();
        } else {
          loadRpsLeaderboard();
        }
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
    roundInfoSpan.innerHTML = `<span class="status-icon">🎮</span> Round ${roundNumber} of ${totalRounds}`;
    scoreInfoSpan.innerHTML = `<span class="status-icon">🏆</span> You ${playerWins} - ${computerWins} CPU`;
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
    isAnimating = false;

    statusDiv.style.display = "none";
    resultDiv.textContent = 'Choose "Start Match" to play.';
    resultDiv.className = "";
    choicesDiv.textContent = "";
    battleArea.innerHTML = "";
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
    resultDiv.className = "";
    choicesDiv.textContent = "";
    battleArea.innerHTML = "";
    enableChoiceButtons(true);
  }

  function finishMatch() {
    matchActive = false;
    isAnimating = false;
    enableChoiceButtons(false);

    let finalMessage;
    let finalScoreForBackend = 0;
    let resultClass = "";

    if (playerWins > computerWins) {
      finalMessage = `You won the match! Final score: You ${playerWins} - ${computerWins} CPU.`;
      finalScoreForBackend = 1;
      resultClass = "win";
    } else if (playerWins < computerWins) {
      finalMessage = `You lost the match. Final score: You ${playerWins} - ${computerWins} CPU.`;
      finalScoreForBackend = -1;
      resultClass = "lose";
    } else {
      finalMessage = `The match is a tie. Final score: You ${playerWins} - ${computerWins} CPU.`;
      finalScoreForBackend = 0;
      resultClass = "tie";
    }

    resultDiv.innerHTML = `<div class="rps-result-message ${resultClass}">${finalMessage}</div>`;
    submitScore(finalScoreForBackend, finalMessage);
  }

  function handleChoiceClick(btn) {
    if (!matchActive || isAnimating) return;

    isAnimating = true;
    enableChoiceButtons(false);

    buttons.forEach((b) => b.classList.remove("selected"));
    btn.classList.add("selected");

    const myChoice = btn.getAttribute("data-choice");
    const computerChoice =
      choices[Math.floor(Math.random() * choices.length)];

    showCountdown(() => {
      battleArea.innerHTML = "";

      const playerDisplay = createChoiceDisplay(myChoice, "You");
      const vsDisplay = createVsDisplay();
      const computerDisplay = createChoiceDisplay(computerChoice, "Computer");

      battleArea.appendChild(playerDisplay);
      battleArea.appendChild(vsDisplay);
      battleArea.appendChild(computerDisplay);

      const { message, score } = determineResult(myChoice, computerChoice);
      const resultClass = score === 1 ? "win" : score === -1 ? "lose" : "tie";

      resultDiv.innerHTML = `<div class="rps-result-message ${resultClass}">${message}</div>`;

      if (score === 1) playerWins += 1;
      if (score === -1) computerWins += 1;

      if (score !== 0) {
        const playerChoiceDisplay =
          playerDisplay.querySelector(".rps-choice-display");
        const computerChoiceDisplay =
          computerDisplay.querySelector(".rps-choice-display");

        if (score === 1) {
          playerChoiceDisplay.classList.add("winner");
          computerChoiceDisplay.classList.add("loser");
        } else {
          playerChoiceDisplay.classList.add("loser");
          computerChoiceDisplay.classList.add("winner");
        }
      }

      currentRound += 1;
      updateStatusText();

      const winsNeeded = Math.floor(totalRounds / 2) + 1;
      if (
        playerWins >= winsNeeded ||
        computerWins >= winsNeeded ||
        currentRound >= totalRounds
      ) {
        setTimeout(() => {
          finishMatch();
        }, 2000);
      } else {
        setTimeout(() => {
          isAnimating = false;
          buttons.forEach((b) => b.classList.remove("selected"));
          enableChoiceButtons(true);
          resultDiv.textContent = "Make your next move.";
          resultDiv.className = "";
        }, 2000);
      }
    });
  }

  // clean old listeners in case of re-mount
  startMatchBtn.replaceWith(startMatchBtn.cloneNode(true));
  const freshStartMatchBtn = document.getElementById("rps-start-match-btn");

  resetMatchBtn.replaceWith(resetMatchBtn.cloneNode(true));
  const freshResetMatchBtn = document.getElementById("rps-reset-match-btn");

  const freshButtons = document.querySelectorAll(".rps-choice-btn");

  freshButtons.forEach((btn) => {
    const choice = btn.getAttribute("data-choice");
    if (choice) {
      btn.innerHTML = "";
      btn.appendChild(createChoiceIcon(choice));
    }
  });

  freshStartMatchBtn.addEventListener("click", startMatch);
  freshResetMatchBtn.addEventListener("click", resetMatchState);

  freshButtons.forEach((btn) => {
    btn.addEventListener("click", () => handleChoiceClick(btn));
  });

  resetMatchState();
  loadRpsLeaderboard();
}
