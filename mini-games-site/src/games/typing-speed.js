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
      })
      .catch((err) => {
        console.error("Error saving Typing Speed score:", err);
      });
  }

  function pickSentence() {
    targetSentence =
      paragraphs[Math.floor(Math.random() * paragraphs.length)];
    sentenceP.textContent = targetSentence;
  }

  function startTimer() {
    if (timerInterval) clearInterval(timerInterval);
    timerSpan.textContent = "0.0";
    const start = performance.now();

    timerInterval = setInterval(() => {
      const now = performance.now();
      const seconds = (now - start) / 1000;
      timerSpan.textContent = seconds.toFixed(1);
    }, 100);
  }

  function stopTimer() {
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
  }

  function startTest() {
    pickSentence();
    input.value = "";
    input.disabled = false;
    input.focus();
    resultDiv.textContent = "";
    infoSpan.textContent = "Typing...";

    startTime = performance.now();
    testRunning = true;
    startTimer();
  }

  function endTest() {
    if (!testRunning || !startTime) {
      resultDiv.textContent = "Click Start first.";
      return;
    }

    const endTime = performance.now();
    const seconds = (endTime - startTime) / 1000;
    stopTimer();
    testRunning = false;
    input.disabled = true;

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
    resultDiv.textContent = `Time: ${seconds.toFixed(
      1
    )}s · WPM: ${finalWpm} · Accuracy: ${accuracy}%`;
    infoSpan.textContent = "Test finished. Press Start for a new paragraph.";

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
