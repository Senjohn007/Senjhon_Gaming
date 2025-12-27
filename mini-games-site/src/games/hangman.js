// src/games/hangman.js
let cleanupFns = [];

// allow React to clean up
export function destroyHangman() {
  cleanupFns.forEach((fn) => {
    try {
      fn();
    } catch (e) {
      console.error("Error during Hangman cleanup:", e);
    }
  });
  cleanupFns = [];
}

export function initHangman({ onScoreSaved } = {}) {
  // reset old listeners
  destroyHangman();

  const words = ["python", "javascript", "react", "spring", "mongo", "kotlin"];
  let secret = "";
  let guessed = [];
  let wrongGuesses = [];
  const maxWrong = 6;
  let gameOver = false;
  let destroyed = false;

  const wordDiv = document.getElementById("hangman-word");
  const infoDiv = document.getElementById("hangman-info");
  const wrongDiv = document.getElementById("hangman-wrong");
  const input = document.getElementById("hangman-input");
  const guessBtn = document.getElementById("hangman-guess");
  const resetBtn = document.getElementById("hangman-reset");

  if (!wordDiv || !infoDiv || !wrongDiv || !input || !guessBtn || !resetBtn) {
    console.warn("Hangman: required elements not found");
    return;
  }

  const hangmanSvg =
    document.getElementById("hangman-svg") || createHangmanSvg();
  const keyboardDiv =
    document.getElementById("hangman-keyboard") || createKeyboard();

  // Create SVG for hangman drawing if it doesn't exist
  function createHangmanSvg() {
    const existingContainer = document.getElementById("hangman-svg-container");
    if (existingContainer) return existingContainer.querySelector("svg");

    const svgContainer = document.createElement("div");
    svgContainer.id = "hangman-svg-container";
    svgContainer.className = "flex justify-center my-4";

    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.id = "hangman-svg";
    svg.setAttribute("width", "250");
    svg.setAttribute("height", "250");
    svg.setAttribute("viewBox", "0 0 250 250");

    svg.innerHTML = `
      <!-- Base -->
      <line x1="10" y1="230" x2="150" y2="230" stroke="#6b7280" stroke-width="4" stroke-linecap="round" />
      <!-- Pole -->
      <line x1="50" y1="230" x2="50" y2="20" stroke="#6b7280" stroke-width="4" stroke-linecap="round" />
      <!-- Top -->
      <line x1="50" y1="20" x2="130" y2="20" stroke="#6b7280" stroke-width="4" stroke-linecap="round" />
      <!-- Noose -->
      <line x1="130" y1="20" x2="130" y2="50" stroke="#6b7280" stroke-width="4" stroke-linecap="round" />
      
      <!-- Head -->
      <circle id="hangman-head" cx="130" cy="70" r="20" stroke="#ef4444" stroke-width="3" fill="none" class="hangman-part" />
      
      <!-- Body -->
      <line id="hangman-body" x1="130" y1="90" x2="130" y2="150" stroke="#ef4444" stroke-width="3" stroke-linecap="round" class="hangman-part" />
      
      <!-- Left arm -->
      <line id="hangman-leftarm" x1="130" y1="110" x2="100" y2="130" stroke="#ef4444" stroke-width="3" stroke-linecap="round" class="hangman-part" />
      
      <!-- Right arm -->
      <line id="hangman-rightarm" x1="130" y1="110" x2="160" y2="130" stroke="#ef4444" stroke-width="3" stroke-linecap="round" class="hangman-part" />
      
      <!-- Left leg -->
      <line id="hangman-leftleg" x1="130" y1="150" x2="110" y2="190" stroke="#ef4444" stroke-width="3" stroke-linecap="round" class="hangman-part" />
      
      <!-- Right leg -->
      <line id="hangman-rightleg" x1="130" y1="150" x2="150" y2="190" stroke="#ef4444" stroke-width="3" stroke-linecap="round" class="hangman-part" />
    `;

    svgContainer.appendChild(svg);

    // Insert before the word display
    wordDiv.parentNode.insertBefore(svgContainer, wordDiv);

    // Initially hide all body parts
    svg.querySelectorAll(".hangman-part").forEach((part) => {
      part.style.opacity = "0";
      part.style.transition = "opacity 0.5s ease-in-out";
    });

    return svg;
  }

  // Create virtual keyboard if it doesn't exist
  function createKeyboard() {
    const existingContainer = document.getElementById(
      "hangman-keyboard-container"
    );
    if (existingContainer) return existingContainer.querySelector("#hangman-keyboard");

    const keyboardContainer = document.createElement("div");
    keyboardContainer.id = "hangman-keyboard-container";
    keyboardContainer.className = "flex flex-col items-center my-4";

    const keyboard = document.createElement("div");
    keyboard.id = "hangman-keyboard";
    keyboard.className = "grid grid-cols-7 gap-2 max-w-md";

    for (let i = 0; i < 26; i++) {
      const letter = String.fromCharCode(97 + i);
      const button = document.createElement("button");
      button.textContent = letter.toUpperCase();
      button.className =
        "hangman-key-btn bg-slate-700 hover:bg-slate-600 text-white font-bold py-2 px-3 rounded transition-colors";
      button.setAttribute("data-letter", letter);
      const handler = () => {
        if (!gameOver) {
          input.value = letter;
          handleGuessClick();
        }
      };
      button.addEventListener("click", handler);
      cleanupFns.push(() =>
        button.removeEventListener("click", handler)
      );
      keyboard.appendChild(button);
    }

    keyboardContainer.appendChild(keyboard);

    const inputContainer = input.parentNode;
    inputContainer.parentNode.insertBefore(
      keyboardContainer,
      inputContainer.nextSibling
    );

    return keyboard;
  }

  // Add custom styles
  const hangmanStyles = `
    #hangman-styles {}
    #hangman-word {
      font-family: 'Courier New', monospace;
      font-size: 2rem;
      letter-spacing: 0.5rem;
      margin: 1rem 0;
      min-height: 3rem;
    }
    
    .hangman-letter {
      display: inline-block;
      width: 2.5rem;
      height: 2.5rem;
      margin: 0 0.25rem;
      border-bottom: 3px solid #3b82f6;
      text-align: center;
      line-height: 2.5rem;
      transition: all 0.3s ease;
    }
    
    .hangman-letter.revealed {
      animation: reveal 0.5s ease forwards;
      color: #10b981;
      border-bottom-color: #10b981;
    }
    
    @keyframes reveal {
      0% { transform: rotateY(90deg); }
      100% { transform: rotateY(0); }
    }
    
    #hangman-info {
      font-size: 1.1rem;
      margin: 1rem 0;
      padding: 0.75rem;
      border-radius: 0.5rem;
      background-color: #f3f4f6;
    }
    
    #hangman-info.win {
      background-color: #d1fae5;
      color: #065f46;
    }
    
    #hangman-info.loss {
      background-color: #fee2e2;
      color: #991b1b;
    }
    
    #hangman-wrong {
      margin: 1rem 0;
      min-height: 1.5rem;
    }
    
    .wrong-letter {
      display: inline-block;
      width: 2rem;
      height: 2rem;
      margin: 0 0.25rem;
      background-color: #ef4444;
      color: white;
      text-align: center;
      line-height: 2rem;
      border-radius: 50%;
      animation: wrongGuess 0.5s ease;
    }
    
    @keyframes wrongGuess {
      0% { transform: scale(0); }
      50% { transform: scale(1.2); }
      100% { transform: scale(1); }
    }
    
    #hangman-input {
      padding: 0.5rem;
      border: 2px solid #d1d5db;
      border-radius: 0.375rem;
      margin-right: 0.5rem;
      text-transform: uppercase;
      text-align: center;
      font-size: 1.25rem;
      width: 3rem;
    }
    
    #hangman-guess, #hangman-reset {
      padding: 0.5rem 1rem;
      border-radius: 0.375rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
      border: none;
    }
    
    #hangman-guess {
      background-color: #3b82f6;
      color: white;
    }
    
    #hangman-guess:hover:not(:disabled) {
      background-color: #2563eb;
    }
    
    #hangman-reset {
      background-color: #10b981;
      color: white;
    }
    
    #hangman-reset:hover {
      background-color: #059669;
    }
    
    .hangman-key-btn {
      transition: all 0.2s ease;
    }
    
    .hangman-key-btn:disabled {
      background-color: #4b5563;
      cursor: not-allowed;
      opacity: 0.7;
    }
    
    .hangman-key-btn.correct {
      background-color: #10b981;
    }
    
    .hangman-key-btn.wrong {
      background-color: #ef4444;
    }
  `;

  if (!document.getElementById("hangman-styles")) {
    const styleElement = document.createElement("style");
    styleElement.id = "hangman-styles";
    styleElement.textContent = hangmanStyles;
    document.head.appendChild(styleElement);
  }

  function submitScore(scoreValue, resultText) {
    if (destroyed) return;
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
        gameKey: "hangman",
        value: scoreValue,
        userId: player.isGuest ? null : player.id,
        username: player.name,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Hangman score saved:", data, "=>", resultText);
        if (typeof onScoreSaved === "function" && !destroyed) {
          onScoreSaved();
        }
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

    infoDiv.className = result === "win" ? "win" : "loss";
    if (result === "win") {
      infoDiv.textContent = `You guessed the word! Score: ${scoreValue}`;
    } else {
      infoDiv.textContent = `Game over! The word was "${secret}". Score: ${scoreValue}`;
    }

    document.querySelectorAll(".hangman-key-btn").forEach((btn) => {
      btn.disabled = true;
    });

    submitScore(scoreValue, resultText);
  }

  function pickWord() {
    secret = words[Math.floor(Math.random() * words.length)];
    guessed = [];
    wrongGuesses = [];
    gameOver = false;

    // Reset hangman figure
    document.querySelectorAll(".hangman-part").forEach((part) => {
      part.style.opacity = "0";
    });

    // Reset keyboard buttons
    document.querySelectorAll(".hangman-key-btn").forEach((btn) => {
      btn.disabled = false;
      btn.classList.remove("correct", "wrong");
    });

    infoDiv.className = "";
    updateDisplay();
  }

  function updateDisplay() {
    wordDiv.innerHTML = "";

    secret.split("").forEach((ch) => {
      const letterBox = document.createElement("span");
      letterBox.className = "hangman-letter";

      if (guessed.includes(ch)) {
        letterBox.textContent = ch.toUpperCase();
        letterBox.classList.add("revealed");
      } else {
        letterBox.textContent = "";
      }

      wordDiv.appendChild(letterBox);
    });

    infoDiv.textContent = `Wrong guesses left: ${
      maxWrong - wrongGuesses.length
    }`;

    wrongDiv.innerHTML = "";
    if (wrongGuesses.length > 0) {
      const label = document.createElement("div");
      label.textContent = "Wrong letters:";
      const lettersContainer = document.createElement("div");
      wrongGuesses.forEach((letter) => {
        const letterSpan = document.createElement("span");
        letterSpan.className = "wrong-letter";
        letterSpan.textContent = letter.toUpperCase();
        lettersContainer.appendChild(letterSpan);
      });
      wrongDiv.appendChild(label);
      wrongDiv.appendChild(lettersContainer);
    }

    const parts = [
      "hangman-head",
      "hangman-body",
      "hangman-leftarm",
      "hangman-rightarm",
      "hangman-leftleg",
      "hangman-rightleg",
    ];

    for (let i = 0; i < wrongGuesses.length && i < parts.length; i++) {
      const part = document.getElementById(parts[i]);
      if (part) {
        part.style.opacity = "1";
      }
    }

    if (!secret.split("").some((ch) => !guessed.includes(ch))) {
      endGame("win");
    } else if (wrongGuesses.length >= maxWrong) {
      endGame("loss");
    }
  }

  function handleGuessClick() {
    if (gameOver) {
      infoDiv.textContent = 'Click "New Word" to start again.';
      return;
    }

    const letter = (input.value || "").toLowerCase();
    input.value = "";

    if (!letter || letter < "a" || letter > "z" || letter.length !== 1) {
      infoDiv.textContent = "Enter a single letter (a-z).";
      return;
    }
    if (guessed.includes(letter) || wrongGuesses.includes(letter)) {
      infoDiv.textContent = "You already tried that letter.";
      return;
    }

    const keyBtn = document.querySelector(
      `.hangman-key-btn[data-letter="${letter}"]`
    );
    if (keyBtn) {
      keyBtn.disabled = true;
      if (secret.includes(letter)) {
        keyBtn.classList.add("correct");
      } else {
        keyBtn.classList.add("wrong");
      }
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
  const guessClone = guessBtn.cloneNode(true);
  guessBtn.parentNode.replaceChild(guessClone, guessBtn);
  const freshGuessBtn = document.getElementById("hangman-guess");

  const resetClone = resetBtn.cloneNode(true);
  resetBtn.parentNode.replaceChild(resetClone, resetBtn);
  const freshResetBtn = document.getElementById("hangman-reset");

  const guessHandler = () => handleGuessClick();
  const resetHandler = () => handleResetClick();

  freshGuessBtn.addEventListener("click", guessHandler);
  freshResetBtn.addEventListener("click", resetHandler);

  cleanupFns.push(() =>
    freshGuessBtn.removeEventListener("click", guessHandler)
  );
  cleanupFns.push(() =>
    freshResetBtn.removeEventListener("click", resetHandler)
  );

  pickWord();
}
