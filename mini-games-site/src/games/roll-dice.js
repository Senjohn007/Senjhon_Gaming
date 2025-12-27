// src/games/roll-dice.js
export function initRollDice() {
  const rollButton = document.getElementById("roll-button");
  const resultDiv = document.getElementById("dice-result");
  const roundsSelect = document.getElementById("roll-rounds-select");
  const startMatchBtn = document.getElementById("roll-start-match-btn");
  const resetMatchBtn = document.getElementById("roll-reset-match-btn");
  const statusBar = document.getElementById("roll-status-bar");
  const roundInfoSpan = document.getElementById("roll-round-info");
  const scoreInfoSpan = document.getElementById("roll-score-info");

  if (
    !rollButton ||
    !resultDiv ||
    !roundsSelect ||
    !startMatchBtn ||
    !resetMatchBtn ||
    !statusBar ||
    !roundInfoSpan ||
    !scoreInfoSpan
  ) {
    return;
  }

  // OUTER wrapper for badge + dice row
  let outerDiceContainer = document.getElementById("dice-container");
  if (!outerDiceContainer) {
    outerDiceContainer = document.createElement("div");
    outerDiceContainer.id = "dice-container";
    outerDiceContainer.className =
      "roll-dice-outer flex flex-col items-center justify-center mt-4 mb-4";
    // insert just above result box
    resultDiv.parentNode.insertBefore(outerDiceContainer, resultDiv);
  } else {
    outerDiceContainer.classList.add(
      "roll-dice-outer",
      "flex",
      "flex-col",
      "items-center",
      "justify-center"
    );
  }

  // TOTAL badge holder (separate row so it never overlaps button)
  let totalRow = document.getElementById("dice-total-row");
  if (!totalRow) {
    totalRow = document.createElement("div");
    totalRow.id = "dice-total-row";
    totalRow.className =
      "dice-total-row flex items-center justify-center mb-2 min-h-[30px]";
    outerDiceContainer.appendChild(totalRow);
  }

  // DICE row
  let diceRow = document.getElementById("dice-row");
  if (!diceRow) {
    diceRow = document.createElement("div");
    diceRow.id = "dice-row";
    diceRow.className =
      "dice-row flex items-center justify-center gap-6 mb-2 min-h-[90px]";
    outerDiceContainer.appendChild(diceRow);
  }

  let totalRounds = 1;
  let currentRound = 0;
  let sessionTotal = 0;
  let sessionActive = false;
  let isRolling = false;

  const diceStyles = `
    <style>
      .roll-dice-outer {
        position: relative;
        overflow: visible;
      }

      .dice-total-row {
        min-height: 30px;
      }

      .dice-row {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 1.5rem;
        margin: 4px 0 8px 0;
        min-height: 90px;
      }

      .dice-slot {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 90px;
        height: 90px;
      }

      .dice {
        width: 80px;
        height: 80px;
        background: linear-gradient(145deg, #ffffff, #e6e6e6);
        border-radius: 12px;
        display: flex;
        justify-content: center;
        align-items: center;
        box-shadow: 5px 5px 15px rgba(0,0,0,0.2),
                    -5px -5px 15px rgba(255,255,255,0.1);
        position: relative;
        transform-style: preserve-3d;
        transition: transform 0.3s ease;
      }

      .dice.rolling {
        animation: roll 0.8s ease-in-out;
      }

      @keyframes roll {
        0%   { transform: rotateX(0deg)    rotateY(0deg); }
        25%  { transform: rotateX(720deg)  rotateY(360deg)  scale(0.8); }
        50%  { transform: rotateX(1440deg) rotateY(720deg)  scale(1.1); }
        75%  { transform: rotateX(2160deg) rotateY(1080deg) scale(0.9); }
        100% { transform: rotateX(2880deg) rotateY(1440deg) scale(1); }
      }

      .dice-dot {
        width: 16px;
        height: 16px;
        background-color: #111827;
        border-radius: 50%;
        position: absolute;
      }

      .dice-face-1 .dice-dot:nth-child(1) {
        top: 50%; left: 50%; transform: translate(-50%, -50%);
      }

      .dice-face-2 .dice-dot:nth-child(1) {
        top: 25%; left: 25%; transform: translate(-50%, -50%);
      }
      .dice-face-2 .dice-dot:nth-child(2) {
        bottom: 25%; right: 25%; transform: translate(50%, 50%);
      }

      .dice-face-3 .dice-dot:nth-child(1) {
        top: 25%; left: 25%; transform: translate(-50%, -50%);
      }
      .dice-face-3 .dice-dot:nth-child(2) {
        top: 50%; left: 50%; transform: translate(-50%, -50%);
      }
      .dice-face-3 .dice-dot:nth-child(3) {
        bottom: 25%; right: 25%; transform: translate(50%, 50%);
      }

      .dice-face-4 .dice-dot:nth-child(1) {
        top: 25%; left: 25%; transform: translate(-50%, -50%);
      }
      .dice-face-4 .dice-dot:nth-child(2) {
        top: 25%; right: 25%; transform: translate(50%, -50%);
      }
      .dice-face-4 .dice-dot:nth-child(3) {
        bottom: 25%; left: 25%; transform: translate(-50%, 50%);
      }
      .dice-face-4 .dice-dot:nth-child(4) {
        bottom: 25%; right: 25%; transform: translate(50%, 50%);
      }

      .dice-face-5 .dice-dot:nth-child(1) {
        top: 25%; left: 25%; transform: translate(-50%, -50%);
      }
      .dice-face-5 .dice-dot:nth-child(2) {
        top: 25%; right: 25%; transform: translate(50%, -50%);
      }
      .dice-face-5 .dice-dot:nth-child(3) {
        top: 50%; left: 50%; transform: translate(-50%, -50%);
      }
      .dice-face-5 .dice-dot:nth-child(4) {
        bottom: 25%; left: 25%; transform: translate(-50%, 50%);
      }
      .dice-face-5 .dice-dot:nth-child(5) {
        bottom: 25%; right: 25%; transform: translate(50%, 50%);
      }

      .dice-face-6 .dice-dot:nth-child(1) {
        top: 25%; left: 25%; transform: translate(-50%, -50%);
      }
      .dice-face-6 .dice-dot:nth-child(2) {
        top: 25%; right: 25%; transform: translate(50%, -50%);
      }
      .dice-face-6 .dice-dot:nth-child(3) {
        top: 50%; left: 25%; transform: translate(-50%, -50%);
      }
      .dice-face-6 .dice-dot:nth-child(4) {
        top: 50%; right: 25%; transform: translate(50%, -50%);
      }
      .dice-face-6 .dice-dot:nth-child(5) {
        bottom: 25%; left: 25%; transform: translate(-50%, 50%);
      }
      .dice-face-6 .dice-dot:nth-child(6) {
        bottom: 25%; right: 25%; transform: translate(50%, 50%);
      }

      .dice-total-pill {
        background-color: #3b82f6;
        color: white;
        font-weight: 600;
        padding: 4px 14px;
        border-radius: 999px;
        font-size: 16px;
        box-shadow: 0 4px 8px rgba(0,0,0,0.25);
        white-space: nowrap;
      }

      #dice-result {
        background: #ffffff;
        padding: 15px;
        border-radius: 8px;
        margin-top: 8px;
        text-align: center;
        font-weight: 500;
        box-shadow: 0 4px 8px rgba(0,0,0,0.25);
        min-height: 60px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #020617;
      }

      #roll-status-bar {
        background: linear-gradient(to right, #1e293b, #334155);
        color: white;
        padding: 10px 15px;
        border-radius: 8px;
        margin: 15px 0;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        display: none;
      }

      .status-info {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 1rem;
      }

      .status-item {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 0.95rem;
      }

      .status-icon {
        font-size: 18px;
      }

      #roll-button {
        background: linear-gradient(145deg, #3b82f6, #2563eb);
        color: white;
        border: none;
        border-radius: 8px;
        padding: 10px 20px;
        font-weight: bold;
        cursor: pointer;
        transition: all 0.2s ease;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      }

      #roll-button:hover:not(:disabled) {
        background: linear-gradient(145deg, #2563eb, #1d4ed8);
        transform: translateY(-2px);
        box-shadow: 0 6px 8px rgba(0,0,0,0.15);
      }

      #roll-button:disabled {
        background: linear-gradient(145deg, #9ca3af, #6b7280);
        cursor: not-allowed;
        opacity: 0.7;
      }

      #roll-rounds-select {
        padding: 8px 12px;
        border-radius: 6px;
        border: 1px solid #d1d5db;
        background-color: white;
        color: #111827;
      }
    </style>
  `;

  if (!document.getElementById("dice-styles")) {
    const styleElement = document.createElement("div");
    styleElement.id = "dice-styles";
    styleElement.innerHTML = diceStyles;
    document.head.appendChild(styleElement);
  }

  function createDice(value, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = "";

    const dice = document.createElement("div");
    dice.className = `dice dice-face-${value}`;

    for (let i = 0; i < value; i++) {
      const dot = document.createElement("div");
      dot.className = "dice-dot";
      dice.appendChild(dot);
    }

    container.appendChild(dice);
  }

  function showDiceTotal(total) {
    if (!totalRow) return;

    totalRow.innerHTML = "";

    const pill = document.createElement("div");
    pill.className = "dice-total-pill";
    pill.textContent = `Total: ${total}`;
    totalRow.appendChild(pill);
  }

  function loadRollLeaderboard() {
    fetch(
      "http://localhost:5000/api/scores/leaderboard?game=roll-dice&limit=10"
    )
      .then((res) => res.json())
      .then((rows) => {
        const tbody = document.querySelector("#roll-leaderboard tbody");
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
        console.error("Error loading Roll Dice leaderboard:", err);
      });
  }

  function submitScore(scoreValue) {
    if (typeof window.getPlayerInfo !== "function") {
      console.error("getPlayerInfo is not available");
      return;
    }

    const player = window.getPlayerInfo();

    fetch("http://localhost:5000/api/scores", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken") || ""}`,
      },
      body: JSON.stringify({
        gameKey: "roll-dice",
        value: scoreValue,
        userId: player.isGuest ? null : player.id,
        username: player.name,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Roll Dice score saved:", data);
        loadRollLeaderboard();
      })
      .catch((err) => {
        console.error("Error saving Roll Dice score:", err);
      });
  }

  function updateStatusBar() {
    const roundNumber = currentRound + 1;
    roundInfoSpan.innerHTML = `<span class="status-icon">🎲</span> Roll ${roundNumber} of ${totalRounds}`;
    scoreInfoSpan.innerHTML = `<span class="status-icon">🏆</span> Session total: ${sessionTotal}`;
  }

  function setRollButtonEnabled(enabled) {
    const btn = document.getElementById("roll-button");
    if (btn) btn.disabled = !enabled;
  }

  function resetSessionState() {
    totalRounds = parseInt(roundsSelect.value, 10) || 1;
    currentRound = 0;
    sessionTotal = 0;
    sessionActive = false;
    isRolling = false;

    statusBar.style.display = "none";
    resultDiv.textContent = 'Choose "Start Session" to play.';

    if (diceRow) diceRow.innerHTML = "";
    if (totalRow) totalRow.innerHTML = "";

    setRollButtonEnabled(false);
  }

  function startSession() {
    totalRounds = parseInt(roundsSelect.value, 10) || 1;
    currentRound = 0;
    sessionTotal = 0;
    sessionActive = true;

    statusBar.style.display = "block";
    updateStatusBar();
    resultDiv.textContent = "Session started! Click Roll 🎲.";
    setRollButtonEnabled(true);

    diceRow.innerHTML = "";
    totalRow.innerHTML = "";

    const dice1Container = document.createElement("div");
    dice1Container.id = "dice1";
    dice1Container.className = "dice-slot";

    const dice2Container = document.createElement("div");
    dice2Container.id = "dice2";
    dice2Container.className = "dice-slot";

    diceRow.appendChild(dice1Container);
    diceRow.appendChild(dice2Container);

    createDice(1, "dice1");
    createDice(1, "dice2");
  }

  function finishSession() {
    sessionActive = false;
    setRollButtonEnabled(false);

    const finalMessage = `Session finished. Total across ${totalRounds} roll(s): ${sessionTotal}.`;
    resultDiv.textContent = finalMessage;
    submitScore(sessionTotal);
  }

  // reset listeners
  rollButton.replaceWith(rollButton.cloneNode(true));
  const freshRollButton = document.getElementById("roll-button");

  startMatchBtn.replaceWith(startMatchBtn.cloneNode(true));
  const freshStartMatchBtn = document.getElementById("roll-start-match-btn");

  resetMatchBtn.replaceWith(resetMatchBtn.cloneNode(true));
  const freshResetMatchBtn = document.getElementById("roll-reset-match-btn");

  freshRollButton.addEventListener("click", () => {
    if (!sessionActive || isRolling) return;

    isRolling = true;
    setRollButtonEnabled(false);

    if (!document.getElementById("dice1") || !document.getElementById("dice2")) {
      diceRow.innerHTML = "";
      const dice1Container = document.createElement("div");
      dice1Container.id = "dice1";
      dice1Container.className = "dice-slot";
      const dice2Container = document.createElement("div");
      dice2Container.id = "dice2";
      dice2Container.className = "dice-slot";
      diceRow.appendChild(dice1Container);
      diceRow.appendChild(dice2Container);
    }

    const dice1Element = document.querySelector("#dice1 .dice");
    const dice2Element = document.querySelector("#dice2 .dice");

    if (dice1Element) dice1Element.classList.add("rolling");
    if (dice2Element) dice2Element.classList.add("rolling");

    const dice1 = Math.floor(Math.random() * 6) + 1;
    const dice2 = Math.floor(Math.random() * 6) + 1;
    const total = dice1 + dice2;

    setTimeout(() => {
      createDice(dice1, "dice1");
      createDice(dice2, "dice2");
      showDiceTotal(total);

      sessionTotal += total;
      resultDiv.textContent = `You rolled: (${dice1}, ${dice2}) — Total this roll: ${total} — Session total: ${sessionTotal}`;

      currentRound += 1;
      updateStatusBar();

      if (currentRound >= totalRounds) {
        finishSession();
      } else {
        isRolling = false;
        setRollButtonEnabled(true);
      }
    }, 800);
  });

  freshStartMatchBtn.addEventListener("click", startSession);
  freshResetMatchBtn.addEventListener("click", resetSessionState);

  resetSessionState();
  loadRollLeaderboard();
}
