// src/games/roll-dice.js
export function initRollDice({ onScoreSaved } = {}) {
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

  let totalRounds = 1;
  let currentRound = 0;
  let sessionTotal = 0;
  let sessionActive = false;

  // remove DOM-based leaderboard updates completely

  // use shared submitScore pattern with auth + gameKey
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
        // tell React to reload leaderboard
        if (typeof onScoreSaved === "function") {
          onScoreSaved();
        }
      })
      .catch((err) => {
        console.error("Error saving Roll Dice score:", err);
      });
  }

  function updateStatusBar() {
    const roundNumber = currentRound + 1;
    roundInfoSpan.textContent = `Roll ${roundNumber} of ${totalRounds}`;
    scoreInfoSpan.textContent = `Session total: ${sessionTotal}`;
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

    statusBar.style.display = "none";
    resultDiv.textContent = "Choose “Start Session” to play.";
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
    if (!sessionActive) return;

    const dice1 = Math.floor(Math.random() * 6) + 1;
    const dice2 = Math.floor(Math.random() * 6) + 1;
    const total = dice1 + dice2;

    sessionTotal += total;

    resultDiv.textContent =
      `You rolled: (${dice1}, ${dice2}) — Total this roll: ${total} — ` +
      `Session total: ${sessionTotal}`;

    currentRound += 1;
    updateStatusBar();

    if (currentRound >= totalRounds) {
      finishSession();
    }
  });

  freshStartMatchBtn.addEventListener("click", startSession);
  freshResetMatchBtn.addEventListener("click", resetSessionState);

  resetSessionState();
}
