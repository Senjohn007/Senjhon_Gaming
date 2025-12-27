// src/pages/TypingSpeedPage.jsx
import React, { useEffect } from "react";
import { initTypingSpeed } from "../games/typing-speed";

export default function TypingSpeedPage() {
  useEffect(() => {
    // Add custom styles for animations
    const styleId = "typing-speed-animations";
    if (!document.getElementById(styleId)) {
      const style = document.createElement("style");
      style.id = styleId;
      style.textContent = `
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-10px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        @keyframes successPulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
        
        @keyframes errorShake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        
        @keyframes floatReverse {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(-5deg); }
        }
        
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        @keyframes floatUp {
          0% { transform: translateY(100vh) rotate(0deg); opacity: 0; }
          10% { opacity: 0.4; }
          90% { opacity: 0.4; }
          100% { transform: translateY(-100px) rotate(360deg); opacity: 0; }
        }
        
        .typing-cursor {
          display: inline-block;
          width: 2px;
          height: 1.2em;
          background-color: #f0abfc;
          animation: blink 1s infinite;
          margin-left: 2px;
          vertical-align: text-bottom;
        }
        
        .current-word {
          background-color: rgba(217, 70, 239, 0.2);
          border-radius: 3px;
          padding: 0 2px;
          transition: background-color 0.3s;
        }
        
        .typed-char {
          color: #94a3b8;
        }
        
        .current-char {
          position: relative;
        }
        
        .current-char::after {
          content: '';
          position: absolute;
          left: 0;
          bottom: 0;
          width: 100%;
          height: 2px;
          background-color: #f0abfc;
          animation: pulse 1s infinite;
        }
        
        .error-char {
          color: #f87171;
          background-color: rgba(248, 113, 113, 0.1);
          border-radius: 2px;
        }
        
        .success-char {
          color: #34d399;
        }
        
        .timer-pulse {
          animation: pulse 1s infinite;
        }
        
        .result-animation {
          animation: fadeIn 0.5s ease-out;
        }
        
        .leaderboard-row {
          animation: slideIn 0.3s ease-out forwards;
          opacity: 0;
        }
        
        .button-press {
          transform: scale(0.95);
        }
        
        .start-button:active {
          transform: scale(0.95);
        }
        
        .done-button:active {
          transform: scale(0.95);
        }
        
        .paragraph-reveal {
          animation: fadeIn 0.5s ease-out;
        }
        
        .typing-indicator {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          margin-left: 8px;
        }
        
        .typing-indicator span {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background-color: #e870fdff;
          animation: pulse 1.4s infinite;
        }
        
        .typing-indicator span:nth-child(2) {
          animation-delay: 0.2s;
        }
        
        .typing-indicator span:nth-child(3) {
          animation-delay: 0.4s;
        }
        
        .animated-bg {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: -1;
          overflow: hidden;
          background: linear-gradient(-45deg, #0f172a, #1e293b, #0f172a, #1e1b4b);
          background-size: 400% 400%;
          animation: gradientShift 15s ease infinite;
        }
        
        .floating-key {
          position: absolute;
          font-size: 20px;
          color: rgba(217, 70, 239, 0.1);
          animation: floatUp 20s linear infinite;
        }
        
        .floating-key:nth-child(1) { left: 10%; animation-delay: 0s; animation-duration: 25s; }
        .floating-key:nth-child(2) { left: 20%; animation-delay: 2s; animation-duration: 22s; }
        .floating-key:nth-child(3) { left: 30%; animation-delay: 5s; animation-duration: 28s; }
        .floating-key:nth-child(4) { left: 40%; animation-delay: 7s; animation-duration: 24s; }
        .floating-key:nth-child(5) { left: 50%; animation-delay: 1s; animation-duration: 26s; }
        .floating-key:nth-child(6) { left: 60%; animation-delay: 4s; animation-duration: 23s; }
        .floating-key:nth-child(7) { left: 70%; animation-delay: 3s; animation-duration: 27s; }
        .floating-key:nth-child(8) { left: 80%; animation-delay: 6s; animation-duration: 25s; }
        .floating-key:nth-child(9) { left: 90%; animation-delay: 8s; animation-duration: 29s; }
        
        .floating-circle {
          position: absolute;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(217, 70, 239, 0.1) 0%, rgba(217, 70, 239, 0) 70%);
          animation: float 15s ease-in-out infinite;
        }
        
        .floating-circle:nth-child(10) {
          width: 300px;
          height: 300px;
          top: 10%;
          left: 10%;
          animation-delay: 0s;
        }
        
        .floating-circle:nth-child(11) {
          width: 200px;
          height: 200px;
          top: 60%;
          right: 15%;
          animation-delay: 2s;
          animation-name: floatReverse;
        }
        
        .floating-circle:nth-child(12) {
          width: 250px;
          height: 250px;
          bottom: 10%;
          left: 20%;
          animation-delay: 4s;
        }
      `;
      document.head.appendChild(style);
    }

    if (typeof initTypingSpeed === "function") {
      initTypingSpeed();
    }
  }, []);

  return (
    <>
      {/* Animated Background */}
      <div className="animated-bg">
        {/* Floating Keyboard Keys */}
        <div className="floating-key">A</div>
        <div className="floating-key">S</div>
        <div className="floating-key">D</div>
        <div className="floating-key">F</div>
        <div className="floating-key">J</div>
        <div className="floating-key">K</div>
        <div className="floating-key">L</div>
        <div className="floating-key">W</div>
        <div className="floating-key">E</div>
        
        {/* Floating Circles */}
        <div className="floating-circle"></div>
        <div className="floating-circle"></div>
        <div className="floating-circle"></div>
      </div>
      
      <main className="min-h-[calc(100vh-80px)] text-slate-100 relative z-10">
        <div className="max-w-4xl mx-auto px-4 py-10">
          {/* title + description */}
          <div className="mb-6">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-fuchsia-300 drop-shadow-[0_0_24px_rgba(217,70,239,0.6)]">
              Typing Speed Test
            </h2>
            <p className="mt-2 text-sm md:text-base text-slate-300">
              Type the paragraph below as fast and accurately as you can, then
              press <span className="font-semibold">Done</span> to see your WPM
              and accuracy.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] items-start">
            {/* test area */}
            <div className="rounded-2xl bg-slate-900/70 border border-slate-800/80 shadow-[0_18px_40px_rgba(15,23,42,0.9)] backdrop-blur-sm px-4 py-5">
              {/* timer + info */}
              <div className="flex flex-wrap items-center gap-2 text-sm text-slate-200 mb-3">
                <span>
                  Time:{" "}
                  <span
                    id="ts-timer"
                    className="font-semibold text-fuchsia-300"
                  >
                    0.0
                  </span>
                  s
                </span>
                <span className="text-slate-500">·</span>
                <span id="ts-info" className="text-slate-300">
                  Click "Start" to begin.
                </span>
                <div id="typing-indicator" className="typing-indicator hidden">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>

              {/* paragraph */}
              <p
                id="ts-sentence"
                className="min-h-[72px] text-sm md:text-base text-slate-100 bg-slate-900/60 border border-slate-800/80 rounded-xl px-3 py-3 leading-relaxed paragraph-reveal"
              ></p>

              {/* textarea */}
              <textarea
                id="ts-input"
                rows={5}
                className="mt-4 w-full rounded-xl border border-slate-800 bg-slate-950/80 px-3 py-2 text-sm md:text-base text-slate-100 shadow-[0_14px_32px_rgba(15,23,42,0.9)] focus:outline-none focus:ring-2 focus:ring-fuchsia-500/70 focus:border-fuchsia-400 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
                disabled
              />

              {/* controls */}
              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  id="ts-start"
                  type="button"
                  className="start-button inline-flex items-center justify-center rounded-full bg-gradient-to-r from-fuchsia-500 to-pink-500 px-4 py-2 text-sm font-semibold text-slate-50 shadow-[0_12px_30px_rgba(217,70,239,0.7)] hover:from-fuchsia-400 hover:to-pink-400 transition-all duration-200"
                >
                  Start
                </button>
                <button
                  id="ts-done"
                  type="button"
                  className="done-button inline-flex items-center justify-center rounded-full border border-slate-700/80 px-4 py-2 text-sm font-semibold text-slate-100 hover:bg-slate-800/70 transition-all duration-200"
                >
                  Done
                </button>
              </div>

              {/* result */}
              <div
                id="ts-result"
                className="mt-4 text-sm font-medium text-slate-200"
              ></div>
            </div>

            {/* leaderboard */}
            <div className="rounded-2xl bg-slate-900/70 border border-slate-800/80 shadow-[0_18px_40px_rgba(15,23,42,0.9)] backdrop-blur-sm px-4 py-5">
              <h3 className="text-lg font-semibold text-slate-50 mb-3">
                Top Typing Speed Scores
              </h3>
              <div className="text-xs text-slate-400 mb-2">
                Ranked by words per minute (WPM) for a single test.
              </div>
              <div className="max-h-72 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700/80 scrollbar-track-slate-900/80">
                <table
                  id="ts-leaderboard"
                  className="w-full text-sm text-slate-200"
                >
                  <thead className="text-xs uppercase tracking-wide text-slate-400 border-b border-slate-800">
                    <tr>
                      <th className="py-2 text-left">Player</th>
                      <th className="py-2 text-right">WPM</th>
                    </tr>
                  </thead>
                  <tbody>{/* rows filled by JS */}</tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}