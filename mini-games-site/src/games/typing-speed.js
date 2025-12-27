// src/games/typing-speed.js
export function initTypingSpeed() {
  const paragraphs = [
    "JavaScript is a powerful language used to create interactive experiences on the web. From simple games to full web applications, it runs inside your browser. Practicing with small projects is one of the best ways to learn. Over time, these little experiments grow into full portfolio pieces.",
    "Typing speed tests are a fun way to improve both accuracy and confidence on the keyboard. By repeating short challenges often, your fingers begin to remember patterns automatically. This reduces the mental load while you are coding or writing long reports. Small daily practice sessions can lead to big improvements.",
    "Senjhon Gaming offers a collection of simple browser games built with HTML, CSS, and JavaScript. Each game focuses on a different skill, from quick reactions to careful planning. The typing test helps you measure how fast you can copy text on the screen. Competing with friends can make practice much more enjoyable.",
    "Modern web development encourages developers to build modular, reusable components. This approach keeps projects easier to maintain as they grow in size. Simple games like this typing test are excellent examples of small, focused components. Each feature can be improved without breaking the rest of the site.",
    "Many developers start their journey by cloning small projects from tutorials and online courses. Over time, they begin to customize these projects and experiment with new ideas. This process builds a deeper understanding of how the technologies fit together. Eventually, those experiments become unique creations they can be proud of.",
    "Good typing habits can significantly speed up everyday tasks such as writing emails, chatting with teammates, and documenting code. When your fingers know where every key is, you can focus more on your ideas and less on the keyboard. Consistent practice also reduces fatigue during long work sessions. That is why even simple typing games can be surprisingly valuable over time.",
    "Debugging is an unavoidable part of building software, whether it is a game or a large web application. Learning to read error messages carefully can save a lot of time and frustration. Small, focused tests like this typing challenge help you build patience and attention to detail. Those same skills transfer directly into tracking down tricky bugs in real projects.",
  ];

  const sentenceP = document.getElementById("ts-sentence");
  const input = document.getElementById("ts-input");
  const startBtn = document.getElementById("ts-start");
  const doneBtn = document.getElementById("ts-done");
  const resultDiv = document.getElementById("ts-result");
  const timerSpan = document.getElementById("ts-timer");
  const infoSpan = document.getElementById("ts-info");
  const wpmDisplay = document.getElementById("ts-wpm-display") || createWpmDisplay();
  const accuracyDisplay = document.getElementById("ts-accuracy-display") || createAccuracyDisplay();
  const progressDisplay = document.getElementById("ts-progress-display") || createProgressDisplay();

  if (
    !sentenceP ||
    !input ||
    !startBtn ||
    !doneBtn ||
    !resultDiv ||
    !timerSpan ||
    !infoSpan
  ) {
    return;
  }

  let startTime = null;
  let timerInterval = null;
  let targetSentence = "";
  let testRunning = false;
  let currentWpm = 0;
  let currentAccuracy = 100;
  let previousWpm = 0;
  let previousAccuracy = 100;

  // Add custom styles
  const typingStyles = `
    <style id="typing-styles">
      .typing-container {
        position: relative;
        background: linear-gradient(145deg, #1e293b, #334155);
        border-radius: 12px;
        padding: 20px;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
      }
      
      #ts-sentence {
        font-family: 'Courier New', monospace;
        font-size: 1.2rem;
        line-height: 1.6;
        padding: 20px;
        background: #0f172a;
        border-radius: 8px;
        margin-bottom: 20px;
        position: relative;
        overflow-wrap: break-word;
        transition: all 0.3s ease;
        white-space: pre-wrap;
        word-wrap: break-word;
      }
      
      .char {
        position: relative;
        transition: all 0.2s ease;
        display: inline-block;
      }
      
      .space {
        display: inline-block;
        width: 0.3em;
      }
      
      .char.correct {
        color: #10b981;
        background-color: rgba(16, 185, 129, 0.1);
        animation: correctPulse 0.3s ease;
      }
      
      .char.incorrect {
        color: #ef4444;
        background-color: rgba(239, 68, 68, 0.2);
        animation: incorrectShake 0.5s ease;
      }
      
      .char.current {
        background-color: rgba(59, 130, 246, 0.3);
        border-bottom: 2px solid #3b82f6;
        animation: currentBlink 1s infinite;
      }
      
      @keyframes correctPulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.2); }
        100% { transform: scale(1); }
      }
      
      @keyframes incorrectShake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-2px); }
        20%, 40%, 60%, 80% { transform: translateX(2px); }
      }
      
      @keyframes currentBlink {
        0%, 50% { opacity: 1; }
        51%, 100% { opacity: 0.3; }
      }
      
      #ts-input {
        width: 100%;
        padding: 15px;
        font-family: 'Courier New', monospace;
        font-size: 1.1rem;
        border: 2px solid #4b5563;
        border-radius: 8px;
        background: #1e293b;
        color: #e5e7eb;
        transition: all 0.3s ease;
      }
      
      #ts-input:focus {
        outline: none;
        border-color: #3b82f6;
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
      }
      
      #ts-input:disabled {
        background: #374151;
        color: #9ca3af;
        cursor: not-allowed;
      }
      
      .typing-controls {
        display: flex;
        gap: 10px;
        margin: 15px 0;
      }
      
      .typing-button {
        padding: 10px 20px;
        border-radius: 8px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s ease;
        border: none;
        color: white;
        position: relative;
        overflow: hidden;
      }
      
      .typing-button::after {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        width: 5px;
        height: 5px;
        background: rgba(255, 255, 255, 0.5);
        opacity: 0;
        border-radius: 100%;
        transform: scale(1, 1) translate(-50%);
        transform-origin: 50% 50%;
      }
      
      .typing-button:focus:not(:active)::after {
        animation: ripple 1s ease-out;
      }
      
      @keyframes ripple {
        0% {
          transform: scale(0, 0);
          opacity: 0.5;
        }
        20% {
          transform: scale(25, 25);
          opacity: 0.3;
        }
        100% {
          opacity: 0;
          transform: scale(40, 40);
        }
      }
      
      #ts-start {
        background: linear-gradient(145deg, #10b981, #059669);
      }
      
      #ts-start:hover {
        background: linear-gradient(145deg, #059669, #047857);
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
      }
      
      #ts-done {
        background: linear-gradient(145deg, #3b82f6, #2563eb);
      }
      
      #ts-done:hover {
        background: linear-gradient(145deg, #2563eb, #1d4ed8);
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
      }
      
      #ts-timer {
        font-size: 2rem;
        font-weight: bold;
        color: #3b82f6;
        text-align: center;
        margin: 15px 0;
        transition: all 0.3s ease;
      }
      
      #ts-timer.running {
        animation: timerPulse 1s infinite;
      }
      
      @keyframes timerPulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); }
      }
      
      #ts-result {
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
        opacity: 0;
        transform: translateY(10px);
        transition: all 0.5s ease;
      }
      
      #ts-result.show {
        opacity: 1;
        transform: translateY(0);
      }
      
      #ts-info {
        text-align: center;
        color: #9ca3af;
        margin: 10px 0;
        transition: all 0.3s ease;
      }
      
      .stats-display {
        display: flex;
        justify-content: space-around;
        margin: 20px 0;
      }
      
      .stat-box {
        text-align: center;
        padding: 15px;
        background: linear-gradient(145deg, #1e293b, #334155);
        border-radius: 8px;
        min-width: 120px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        transition: all 0.3s ease;
      }
      
      .stat-box:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 12px rgba(0, 0, 0, 0.2);
      }
      
      .stat-label {
        color: #9ca3af;
        font-size: 0.9rem;
        margin-bottom: 5px;
      }
      
      .stat-value {
        color: #e5e7eb;
        font-size: 1.5rem;
        font-weight: bold;
        transition: all 0.3s ease;
      }
      
      .stat-value.increase {
        color: #10b981;
        animation: statIncrease 0.5s ease;
      }
      
      .stat-value.decrease {
        color: #ef4444;
        animation: statDecrease 0.5s ease;
      }
      
      @keyframes statIncrease {
        0% { transform: scale(1); }
        50% { transform: scale(1.2); }
        100% { transform: scale(1); }
      }
      
      @keyframes statDecrease {
        0% { transform: scale(1); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
        100% { transform: scale(1) translateX(0); }
      }
      
      .progress-bar {
        width: 100%;
        height: 8px;
        background: #374151;
        border-radius: 4px;
        overflow: hidden;
        margin: 15px 0;
      }
      
      .progress-fill {
        height: 100%;
        background: linear-gradient(90deg, #3b82f6, #10b981);
        width: 0%;
        transition: width 0.3s ease;
        position: relative;
      }
      
      .progress-fill::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(
          90deg,
          transparent,
          rgba(255, 255, 255, 0.3),
          transparent
        );
        animation: progressShine 2s infinite;
      }
      
      @keyframes progressShine {
        0% { transform: translateX(-100%); }
        100% { transform: translateX(100%); }
      }
      
      .leaderboard-row {
        transition: all 0.3s ease;
      }
      
      .leaderboard-row:hover {
        background-color: rgba(59, 130, 246, 0.1);
        transform: translateX(5px);
      }
      
      .leaderboard-row.new-entry {
        animation: newEntry 1s ease;
      }
      
      @keyframes newEntry {
        0% { 
          background-color: rgba(16, 185, 129, 0.3);
          transform: scale(1.05);
        }
        100% { 
          background-color: transparent;
          transform: scale(1);
        }
      }
    </style>
  `;
  
  // Add styles to head if not already added
  if (!document.getElementById('typing-styles')) {
    const styleElement = document.createElement('div');
    styleElement.id = 'typing-styles';
    styleElement.innerHTML = typingStyles;
    document.head.appendChild(styleElement);
  }

  // Create WPM display if it doesn't exist
  function createWpmDisplay() {
    const container = document.createElement('div');
    container.id = 'ts-wpm-display';
    container.className = 'stat-box';
    
    const label = document.createElement('div');
    label.className = 'stat-label';
    label.textContent = 'WPM';
    
    const value = document.createElement('div');
    value.id = 'ts-wpm-value';
    value.className = 'stat-value';
    value.textContent = '0';
    
    container.appendChild(label);
    container.appendChild(value);
    
    // Insert after timer
    timerSpan.parentNode.insertBefore(container, timerSpan.nextSibling);
    return container;
  }

  // Create accuracy display if it doesn't exist
  function createAccuracyDisplay() {
    const container = document.createElement('div');
    container.id = 'ts-accuracy-display';
    container.className = 'stat-box';
    
    const label = document.createElement('div');
    label.className = 'stat-label';
    label.textContent = 'Accuracy';
    
    const value = document.createElement('div');
    value.id = 'ts-accuracy-value';
    value.className = 'stat-value';
    value.textContent = '100%';
    
    container.appendChild(label);
    container.appendChild(value);
    
    // Insert after WPM display
    const wpmDisplay = document.getElementById('ts-wpm-display');
    wpmDisplay.parentNode.insertBefore(container, wpmDisplay.nextSibling);
    return container;
  }

  // Create progress display if it doesn't exist
  function createProgressDisplay() {
    const container = document.createElement('div');
    container.id = 'ts-progress-display';
    
    const progressBar = document.createElement('div');
    progressBar.className = 'progress-bar';
    
    const progressFill = document.createElement('div');
    progressFill.id = 'ts-progress-fill';
    progressFill.className = 'progress-fill';
    
    progressBar.appendChild(progressFill);
    container.appendChild(progressBar);
    
    // Insert before input
    input.parentNode.insertBefore(container, input);
    return container;
  }

  // Update the sentence display with character highlighting
  function updateSentenceDisplay() {
    if (!targetSentence) return;
    
    const typed = input.value;
    let html = '';
    
    for (let i = 0; i < targetSentence.length; i++) {
      const char = targetSentence[i];
      let className = 'char';
      let displayChar = char;
      
      // Handle spaces specially
      if (char === ' ') {
        className += ' space';
        displayChar = '&nbsp;'; // Non-breaking space to preserve spacing
      }
      
      if (i < typed.length) {
        if (typed[i] === targetSentence[i]) {
          className += ' correct';
        } else {
          className += ' incorrect';
        }
      } else if (i === typed.length) {
        className += ' current';
      }
      
      html += `<span class="${className}">${displayChar}</span>`;
    }
    
    sentenceP.innerHTML = html;
  }

  // Calculate and update real-time WPM
  function updateWpm() {
    if (!startTime || !testRunning) return;
    
    const now = performance.now();
    const minutes = (now - startTime) / 60000;
    
    if (minutes > 0) {
      const wordsTyped = input.value.trim().split(/\s+/).filter(Boolean).length;
      currentWpm = Math.round(wordsTyped / minutes);
      const wpmElement = document.getElementById('ts-wpm-value');
      
      // Add animation class based on change
      if (currentWpm > previousWpm) {
        wpmElement.className = 'stat-value increase';
      } else if (currentWpm < previousWpm) {
        wpmElement.className = 'stat-value decrease';
      }
      
      wpmElement.textContent = currentWpm;
      previousWpm = currentWpm;
      
      // Reset animation class after animation completes
      setTimeout(() => {
        wpmElement.className = 'stat-value';
      }, 500);
    }
  }

  // Calculate and update real-time accuracy
  function updateAccuracy() {
    if (!targetSentence) return;
    
    const typed = input.value;
    let correctChars = 0;
    
    for (let i = 0; i < typed.length; i++) {
      if (typed[i] === targetSentence[i]) {
        correctChars++;
      }
    }
    
    if (typed.length > 0) {
      currentAccuracy = Math.round((correctChars / typed.length) * 100);
      const accuracyElement = document.getElementById('ts-accuracy-value');
      
      // Add animation class based on change
      if (currentAccuracy > previousAccuracy) {
        accuracyElement.className = 'stat-value increase';
      } else if (currentAccuracy < previousAccuracy) {
        accuracyElement.className = 'stat-value decrease';
      }
      
      accuracyElement.textContent = currentAccuracy + '%';
      previousAccuracy = currentAccuracy;
      
      // Reset animation class after animation completes
      setTimeout(() => {
        accuracyElement.className = 'stat-value';
      }, 500);
    }
  }

  // Update progress bar
  function updateProgress() {
    if (!targetSentence) return;
    
    const progress = Math.min(100, (input.value.length / targetSentence.length) * 100);
    document.getElementById('ts-progress-fill').style.width = progress + '%';
  }

  function loadTypingLeaderboard() {
    fetch(
      "http://localhost:5000/api/scores/leaderboard?game=typing-speed&limit=10"
    )
      .then((res) => res.json())
      .then((rows) => {
        const tbody = document.querySelector("#ts-leaderboard tbody");
        if (!tbody) return;
        tbody.innerHTML = "";
        rows.forEach((row, index) => {
          const tr = document.createElement("tr");
          tr.className = "leaderboard-row";
          tr.innerHTML = `
            <td>${index + 1}. ${row.username}</td>
            <td style="text-align:right;">${row.value}</td>
          `;
          tbody.appendChild(tr);
        });
      })
      .catch((err) => {
        console.error("Error loading Typing Speed leaderboard:", err);
      });
  }

  // UPDATED: use shared submitScore pattern with auth + gameKey
  function submitScore(scoreValue, accuracyValue) {
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
        gameKey: "typing-speed",
        value: scoreValue, // WPM
        userId: player.isGuest ? null : player.id,
        username: player.name,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(
          "Typing Speed score saved:",
          data,
          `WPM: ${scoreValue}, Accuracy: ${accuracyValue}%`
        );
        loadTypingLeaderboard();
        
        // Highlight new entry in leaderboard
        setTimeout(() => {
          const rows = document.querySelectorAll("#ts-leaderboard tbody tr");
          if (rows.length > 0) {
            rows[0].classList.add("new-entry");
          }
        }, 100);
      })
      .catch((err) => {
        console.error("Error saving Typing Speed score:", err);
      });
  }

  function pickSentence() {
    targetSentence =
      paragraphs[Math.floor(Math.random() * paragraphs.length)];
    updateSentenceDisplay();
  }

  function startTimer() {
    if (timerInterval) clearInterval(timerInterval);
    timerSpan.textContent = "0.0";
    timerSpan.classList.add("running");
    const start = performance.now();

    timerInterval = setInterval(() => {
      const now = performance.now();
      const seconds = (now - start) / 1000;
      timerSpan.textContent = seconds.toFixed(1);
      
      // Update real-time stats
      updateWpm();
      updateAccuracy();
      updateProgress();
    }, 100);
  }

  function stopTimer() {
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
    timerSpan.classList.remove("running");
  }

  function startTest() {
    pickSentence();
    input.value = "";
    input.disabled = false;
    input.focus();
    resultDiv.textContent = "";
    resultDiv.classList.remove("show");
    infoSpan.textContent = "Typing...";
    infoSpan.style.color = "#10b981";
    
    // Reset stats displays
    document.getElementById('ts-wpm-value').textContent = '0';
    document.getElementById('ts-accuracy-value').textContent = '100%';
    document.getElementById('ts-progress-fill').style.width = '0%';
    
    // Reset previous values
    previousWpm = 0;
    previousAccuracy = 100;

    startTime = performance.now();
    testRunning = true;
    startTimer();
    
    // Add input event listener for real-time feedback
    input.addEventListener('input', updateSentenceDisplay);
  }

  function endTest() {
    if (!testRunning || !startTime) {
      resultDiv.textContent = "Click Start first.";
      resultDiv.classList.add("show");
      return;
    }

    const endTime = performance.now();
    const seconds = (endTime - startTime) / 1000;
    stopTimer();
    testRunning = false;
    input.disabled = true;
    
    // Remove input event listener
    input.removeEventListener('input', updateSentenceDisplay);

    const wordsTyped = input.value
      .trim()
      .split(/\s+/)
      .filter(Boolean).length;
    const rawWpm = (wordsTyped / seconds) * 60;
    const wpm = Math.round(isNaN(rawWpm) ? 0 : rawWpm);

    const typed = input.value;
    let correctChars = 0;
    const len = Math.min(typed.length, targetSentence.length);
    for (let i = 0; i < len; i++) {
      if (typed[i] === targetSentence[i]) correctChars++;
    }
    const accuracy = Math.round(
      (correctChars / targetSentence.length) * 100
    );

    const finalWpm = isNaN(wpm) ? 0 : wpm;
    
    // Create result display with stats
    resultDiv.innerHTML = `
      <div class="stats-display">
        <div class="stat-box">
          <div class="stat-label">Time</div>
          <div class="stat-value">${seconds.toFixed(1)}s</div>
        </div>
        <div class="stat-box">
          <div class="stat-label">WPM</div>
          <div class="stat-value">${finalWpm}</div>
        </div>
        <div class="stat-box">
          <div class="stat-label">Accuracy</div>
          <div class="stat-value">${accuracy}%</div>
        </div>
      </div>
    `;
    
    // Show result with animation
    setTimeout(() => {
      resultDiv.classList.add("show");
    }, 100);
    
    infoSpan.textContent = "Test finished. Press Start for a new paragraph.";
    infoSpan.style.color = "#9ca3af";

    submitScore(finalWpm, accuracy);
    startTime = null;
  }

  // clean old listeners if React re-mounts
  startBtn.replaceWith(startBtn.cloneNode(true));
  const freshStartBtn = document.getElementById("ts-start");

  doneBtn.replaceWith(doneBtn.cloneNode(true));
  const freshDoneBtn = document.getElementById("ts-done");

  freshStartBtn.addEventListener("click", startTest);
  freshDoneBtn.addEventListener("click", endTest);

  input.disabled = true;
  sentenceP.textContent = "";
  infoSpan.textContent = 'Click "Start" to begin.';
  loadTypingLeaderboard();
}