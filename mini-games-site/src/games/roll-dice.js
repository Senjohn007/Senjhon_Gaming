// src/games/roll-dice.js
export function initRollDice() {
  const rollButton = document.getElementById("roll-button");
  const resultDiv = document.getElementById("dice-result");
  const diceContainer = document.getElementById("dice-container");

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

  // Create dice container if it doesn't exist
  if (!diceContainer) {
    const newDiceContainer = document.createElement("div");
    newDiceContainer.id = "dice-container";
    newDiceContainer.className = "flex justify-center items-center my-6 gap-8";
    resultDiv.parentNode.insertBefore(newDiceContainer, resultDiv);
  }

  let totalRounds = 1;
  let currentRound = 0;
  let sessionTotal = 0;
  let sessionActive = false;
  let isRolling = false;

  // CSS for dice styling and animations
  const diceStyles = `
    <style>
      .dice {
        width: 80px;
        height: 80px;
        background: linear-gradient(145deg, #ffffff, #e6e6e6);
        border-radius: 12px;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 24px;
        font-weight: bold;
        box-shadow: 5px 5px 15px rgba(0,0,0,0.2), -5px -5px 15px rgba(255,255,255,0.1);
        position: relative;
        transform-style: preserve-3d;
        transition: transform 0.3s ease;
      }
      
      .dice.rolling {
        animation: roll 0.8s ease-in-out;
      }
      
      @keyframes roll {
        0% { transform: rotateX(0deg) rotateY(0deg); }
        25% { transform: rotateX(720deg) rotateY(360deg) scale(0.8); }
        50% { transform: rotateX(1440deg) rotateY(720deg) scale(1.1); }
        75% { transform: rotateX(2160deg) rotateY(1080deg) scale(0.9); }
        100% { transform: rotateX(2880deg) rotateY(1440deg) scale(1); }
      }
      
      .dice-dot {
        width: 16px;
        height: 16px;
        background-color: #333;
        border-radius: 50%;
        position: absolute;
      }
      
      .dice-face-1 .dice-dot:nth-child(1) { top: 50%; left: 50%; transform: translate(-50%, -50%); }
      
      .dice-face-2 .dice-dot:nth-child(1) { top: 25%; left: 25%; transform: translate(-50%, -50%); }
      .dice-face-2 .dice-dot:nth-child(2) { bottom: 25%; right: 25%; transform: translate(50%, 50%); }
      
      .dice-face-3 .dice-dot:nth-child(1) { top: 25%; left: 25%; transform: translate(-50%, -50%); }
      .dice-face-3 .dice-dot:nth-child(2) { top: 50%; left: 50%; transform: translate(-50%, -50%); }
      .dice-face-3 .dice-dot:nth-child(3) { bottom: 25%; right: 25%; transform: translate(50%, 50%); }
      
      .dice-face-4 .dice-dot:nth-child(1) { top: 25%; left: 25%; transform: translate(-50%, -50%); }
      .dice-face-4 .dice-dot:nth-child(2) { top: 25%; right: 25%; transform: translate(50%, -50%); }
      .dice-face-4 .dice-dot:nth-child(3) { bottom: 25%; left: 25%; transform: translate(-50%, 50%); }
      .dice-face-4 .dice-dot:nth-child(4) { bottom: 25%; right: 25%; transform: translate(50%, 50%); }
      
      .dice-face-5 .dice-dot:nth-child(1) { top: 25%; left: 25%; transform: translate(-50%, -50%); }
      .dice-face-5 .dice-dot:nth-child(2) { top: 25%; right: 25%; transform: translate(50%, -50%); }
      .dice-face-5 .dice-dot:nth-child(3) { top: 50%; left: 50%; transform: translate(-50%, -50%); }
      .dice-face-5 .dice-dot:nth-child(4) { bottom: 25%; left: 25%; transform: translate(-50%, 50%); }
      .dice-face-5 .dice-dot:nth-child(5) { bottom: 25%; right: 25%; transform: translate(50%, 50%); }
      
      .dice-face-6 .dice-dot:nth-child(1) { top: 25%; left: 25%; transform: translate(-50%, -50%); }
      .dice-face-6 .dice-dot:nth-child(2) { top: 25%; right: 25%; transform: translate(50%, -50%); }
      .dice-face-6 .dice-dot:nth-child(3) { top: 50%; left: 25%; transform: translate(-50%, -50%); }
      .dice-face-6 .dice-dot:nth-child(4) { top: 50%; right: 25%; transform: translate(50%, -50%); }
      .dice-face-6 .dice-dot:nth-child(5) { bottom: 25%; left: 25%; transform: translate(-50%, 50%); }
      .dice-face-6 .dice-dot:nth-child(6) { bottom: 25%; right: 25%; transform: translate(50%, 50%); }
      
      .dice-total {
        position: absolute;
        top: -40px;
        left: 50%;
        transform: translateX(-50%);
        background-color: #3b82f6;
        color: white;
        font-weight: bold;
        padding: 4px 12px;
        border-radius: 20px;
        font-size: 18px;
        opacity: 0;
        transition: opacity 0.3s ease;
      }
      
      .dice-container {
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 20px 0;
      }
      
      .dice-container.show-total .dice-total {
        opacity: 1;
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
      
      #roll-button:active:not(:disabled) {
        transform: translateY(0);
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      }
      
      #roll-button:disabled {
        background: linear-gradient(145deg, #9ca3af, #6b7280);
        cursor: not-allowed;
        opacity: 0.7;
      }
      
      #roll-status-bar {
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
      
      #dice-result {
        background: linear-gradient(145deg, #f8fafc, #e2e8f0);
        padding: 15px;
        border-radius: 8px;
        margin: 15px 0;
        text-align: center;
        font-weight: 500;
        box-shadow: inset 0 2px 4px rgba(0,0,0,0.06);
        min-height: 60px;
        display: flex;
        align-items: center;
        justify-content: center;
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
      
      #roll-start-match-btn {
        background: linear-gradient(145deg, #10b981, #059669);
        color: white;
      }
      
      #roll-start-match-btn:hover {
        background: linear-gradient(145deg, #059669, #047857);
        transform: translateY(-1px);
      }
      
      #roll-reset-match-btn {
        background: linear-gradient(145deg, #ef4444, #dc2626);
        color: white;
      }
      
      #roll-reset-match-btn:hover {
        background: linear-gradient(145deg, #dc2626, #b91c1c);
        transform: translateY(-1px);
      }
      
      .round-selector {
        margin: 15px 0;
        display: flex;
        align-items: center;
        gap: 10px;
      }
      
      #roll-rounds-select {
        padding: 8px 12px;
        border-radius: 6px;
        border: 1px solid #d1d5db;
        background-color: white;
      }
    </style>
  `;
  
  // Add styles to head if not already added
  if (!document.getElementById('dice-styles')) {
    const styleElement = document.createElement('div');
    styleElement.id = 'dice-styles';
    styleElement.innerHTML = diceStyles;
    document.head.appendChild(styleElement);
  }

  // Function to create a dice element with dots
  function createDice(value, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = '';
    
    const dice = document.createElement('div');
    dice.className = `dice dice-face-${value}`;
    
    // Create dots based on value
    for (let i = 0; i < value; i++) {
      const dot = document.createElement('div');
      dot.className = 'dice-dot';
      dice.appendChild(dot);
    }
    
    container.appendChild(dice);
  }

  // Function to create dice total display
  function showDiceTotal(total) {
    const container = document.getElementById('dice-container');
    if (!container) return;
    
    // Remove existing total if any
    const existingTotal = container.querySelector('.dice-total');
    if (existingTotal) {
      existingTotal.remove();
    }
    
    // Create new total display
    const totalDisplay = document.createElement('div');
    totalDisplay.className = 'dice-total';
    totalDisplay.textContent = `Total: ${total}`;
    container.appendChild(totalDisplay);
    
    // Show the total with animation
    setTimeout(() => {
      container.classList.add('show-total');
    }, 800);
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

  // UPDATED: use shared submitScore pattern with auth + gameKey
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
        Authorization: `Bearer ${
          localStorage.getItem("authToken") || ""
        }`,
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
    resultDiv.textContent = "Choose \"Start Session\" to play.";
    
    // Clear dice
    const diceContainer = document.getElementById('dice-container');
    if (diceContainer) {
      diceContainer.innerHTML = '';
      diceContainer.classList.remove('show-total');
    }
    
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
    
    // Initialize dice with placeholder
    createDice(1, 'dice1');
    createDice(1, 'dice2');
  }

  function finishSession() {
    sessionActive = false;
    setRollButtonEnabled(false);

    const finalMessage = `Session finished. Total across ${totalRounds} roll(s): ${sessionTotal}.`;
    resultDiv.textContent = finalMessage;
    submitScore(sessionTotal);
  }

  // clean old listeners in case of re‑mount
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
    
    // Create dice containers if they don't exist
    if (!document.getElementById('dice1')) {
      const dice1 = document.createElement('div');
      dice1.id = 'dice1';
      dice1.className = 'dice-container';
      
      const dice2 = document.createElement('div');
      dice2.id = 'dice2';
      dice2.className = 'dice-container';
      
      const container = document.getElementById('dice-container');
      container.innerHTML = '';
      container.appendChild(dice1);
      container.appendChild(dice2);
    }
    
    // Add rolling animation
    const dice1Element = document.querySelector('#dice1 .dice');
    const dice2Element = document.querySelector('#dice2 .dice');
    
    if (dice1Element) dice1Element.classList.add('rolling');
    if (dice2Element) dice2Element.classList.add('rolling');
    
    // Generate random values
    const dice1 = Math.floor(Math.random() * 6) + 1;
    const dice2 = Math.floor(Math.random() * 6) + 1;
    const total = dice1 + dice2;
    
    // Show rolling animation for a bit, then reveal the result
    setTimeout(() => {
      createDice(dice1, 'dice1');
      createDice(dice2, 'dice2');
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