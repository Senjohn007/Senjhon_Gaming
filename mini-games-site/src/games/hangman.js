// src/games/hangman.js
export function initHangman() {
  const words = ["python", "javascript", "react", "spring", "mongo", "kotlin"];
  let secret = "";
  let guessed = [];
  let wrongGuesses = [];
  const maxWrong = 6;
  let gameOver = false;

  const wordDiv = document.getElementById("hangman-word");
  const infoDiv = document.getElementById("hangman-info");
  const wrongDiv = document.getElementById("hangman-wrong");
  const input = document.getElementById("hangman-input");
  const guessBtn = document.getElementById("hangman-guess");
  const resetBtn = document.getElementById("hangman-reset");

  if (!wordDiv || !infoDiv || !wrongDiv || !input || !guessBtn || !resetBtn) {
    return;
  }

  function loadHangmanLeaderboard() {
    fetch(
      "http://localhost:5000/api/scores/leaderboard?game=hangman&limit=10"
    )
      .then((res) => res.json())
      .then((rows) => {
        const tbody = document.querySelector("#hangman-leaderboard tbody");
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
        console.error("Error loading Hangman leaderboard:", err);
      });
  }

  // UPDATED: use shared submitScore pattern with auth + gameKey
  function submitScore(scoreValue, resultText) {
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
        gameKey: "hangman",
        value: scoreValue,
        userId: player.isGuest ? null : player.id,
        username: player.name,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Hangman score saved:", data, "=>", resultText);
        loadHangmanLeaderboard();
      })
      .catch((err) => {
        console.error("Error saving Hangman score:", err);
      });
  }

  function endGame(result) {
    if (gameOver) return;
    gameOver = true;

    const scoreValue = maxWrong - wrongGuesses.length;
    const resultText =
      result === "win"
        ? `Win, score: ${scoreValue}`
        : `Loss, score: ${scoreValue}`;

    submitScore(scoreValue, resultText);
  }

  function pickWord() {
    secret = words[Math.floor(Math.random() * words.length)];
    guessed = [];
    wrongGuesses = [];
    gameOver = false;
    updateDisplay();
  }

  function updateDisplay() {
    const display = secret
      .split("")
      .map((ch) => (guessed.includes(ch) ? ch : "_"))
      .join(" ");

    wordDiv.textContent = display;

    infoDiv.textContent = `Wrong guesses left: ${
      maxWrong - wrongGuesses.length
    }`;

    wrongDiv.textContent =
      wrongGuesses.length > 0
        ? `Wrong letters: ${wrongGuesses.join(", ")}`
        : "";

    if (!display.includes("_")) {
      infoDiv.textContent = "You guessed the word!";
      endGame("win");
    } else if (wrongGuesses.length >= maxWrong) {
      infoDiv.textContent = `Game over! The word was "${secret}".`;
      endGame("loss");
    }
  }

  function handleGuessClick() {
    if (gameOver) {
      infoDiv.textContent = 'Click "New Word" to start again.';
      return;
    }

    const letter = input.value.toLowerCase();
    input.value = "";

    if (!letter || letter < "a" || letter > "z" || letter.length !== 1) {
      infoDiv.textContent = "Enter a single letter (a-z).";
      return;
    }
    if (guessed.includes(letter) || wrongGuesses.includes(letter)) {
      infoDiv.textContent = "You already tried that letter.";
      return;
    }

    if (secret.includes(letter)) {
      guessed.push(letter);
    } else {
      wrongGuesses.push(letter);
    }

    updateDisplay();
  }

  function handleResetClick() {
    pickWord();
  }

  // clean old listeners if React remounts
  guessBtn.replaceWith(guessBtn.cloneNode(true));
  const freshGuessBtn = document.getElementById("hangman-guess");
  freshGuessBtn.addEventListener("click", handleGuessClick);

  resetBtn.replaceWith(resetBtn.cloneNode(true));
  const freshResetBtn = document.getElementById("hangman-reset");
  freshResetBtn.addEventListener("click", handleResetClick);

  pickWord();
  loadHangmanLeaderboard();
}
