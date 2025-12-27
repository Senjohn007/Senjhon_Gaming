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
        
        @keyframes keyPress {
          0% { transform: scale(1); }
          50% { transform: scale(0.95); }
          100% { transform: scale(1); }
        }
        
        @keyframes cursorTrail {
          0% { opacity: 0.8; }
          100% { opacity: 0; }
        }
        
        @keyframes textWave {
          0% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
          100% { transform: translateY(0); }
        }
        
        @keyframes typeWriter {
          0% { width: 0; }
          100% { width: 100%; }
        }
        
        @keyframes wpmGlow {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.8; }
        }
        
        @keyframes accuracyBar {
          0% { width: 0%; }
          100% { width: var(--accuracy); }
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
        
        .keyboard-key {
          position: absolute;
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #374151, #1f2937);
          border-radius: 5px;
          box-shadow: 0 2px 5px rgba(0,0,0,0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: monospace;
          font-size: 14px;
          color: #e5e7eb;
          animation: floatUp 20s linear infinite;
        }
        
        .keyboard-key::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.1), transparent);
          border-radius: 5px;
        }
        
        .text-fragment {
          position: absolute;
          font-family: monospace;
          color: rgba(217, 70, 239, 0.2);
          animation: float 15s ease-in-out infinite;
        }
        
        .typing-cursor-bg {
          position: absolute;
          width: 2px;
          height: 20px;
          background: linear-gradient(to bottom, transparent, rgba(217, 70, 239, 0.7), transparent);
          animation: float 8s ease-in-out infinite;
        }
        
        .cursor-trail {
          position: absolute;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: rgba(217, 70, 239, 0.5);
          animation: cursorTrail 2s ease-out infinite;
        }
        
        .keyboard-layout {
          position: absolute;
          opacity: 0.1;
          animation: float 20s ease-in-out infinite;
        }
        
        .keyboard-row {
          display: flex;
            gap: 5px;
            margin-bottom: 5px;
        }
        
        .keyboard-layout-key {
            width: 30px;
            height: 30px;
            background: rgba(217, 70, 239, 0.1);
            border-radius: 3px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: monospace;
            font-size: 12px;
            color: rgba(217, 70, 239, 0.5);
        }
        
        .wpm-indicator {
          position: absolute;
            width: 60px;
            height: 60px;
            border-radius: 50%;
            border: 2px solid rgba(217, 70, 239, 0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: monospace;
            font-size: 12px;
            color: rgba(217, 70, 239, 0.5);
            animation: wpmGlow 5s ease-in-out infinite;
        }
        
        .word-bubble {
            position: absolute;
            padding: 5px 10px;
            background: rgba(217, 70, 239, 0.1);
            border-radius: 15px;
            font-family: monospace;
            font-size: 12px;
            color: rgba(217, 70, 239, 0.3);
            animation: float 10s ease-in-out infinite;
        }
        
        .word-bubble::before {
            content: '';
            position: absolute;
            bottom: -5px;
            left: 10px;
            width: 10px;
            height: 10px;
            background: rgba(217, 70, 239, 0.1);
            transform: rotate(45deg);
        }
        
        .typing-zone {
            position: absolute;
            border-radius: 50%;
            filter: blur(40px);
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
        {/* Keyboard Keys */}
        {[...Array(20)].map((_, i) => {
          const keys = ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Z'];
          const key = keys[Math.floor(Math.random() * keys.length)];
          return (
            <div
              key={`key-${i}`}
              className="keyboard-key"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 20}s`,
                animationDuration: `${Math.random() * 10 + 20}s`,
              }}
            >
              {key}
            </div>
          );
        })}
        
        {/* Text Fragments */}
        {[...Array(15)].map((_, i) => {
          const words = ['the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can', 'had', 'her', 'was', 'one', 'our', 'out', 'day'];
          const word = words[Math.floor(Math.random() * words.length)];
          return (
            <div
              key={`text-${i}`}
              className="text-fragment"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                fontSize: `${Math.random() * 10 + 10}px`,
                animationDelay: `${Math.random() * 10}s`,
                animationDuration: `${Math.random() * 5 + 15}s`,
              }}
            >
              {word}
            </div>
          );
        })}
        
        {/* Typing Cursors */}
        {[...Array(10)].map((_, i) => (
          <div
            key={`cursor-${i}`}
            className="typing-cursor-bg"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 8}s`,
              animationDuration: `${Math.random() * 4 + 8}s`,
            }}
          />
        ))}
        
        {/* Cursor Trails */}
        {[...Array(15)].map((_, i) => (
          <div
            key={`trail-${i}`}
            className="cursor-trail"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          />
        ))}
        
        {/* Keyboard Layouts */}
        {[...Array(3)].map((_, i) => (
          <div
            key={`layout-${i}`}
            className="keyboard-layout"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              transform: `rotate(${Math.random() * 20 - 10}deg)`,
              animationDelay: `${Math.random() * 20}s`,
              animationDuration: `${Math.random() * 10 + 20}s`,
            }}
          >
            <div className="keyboard-row">
              <div className="keyboard-layout-key">Q</div>
              <div className="keyboard-layout-key">W</div>
              <div className="keyboard-layout-key">E</div>
              <div className="keyboard-layout-key">R</div>
              <div className="keyboard-layout-key">T</div>
            </div>
            <div className="keyboard-row">
              <div className="keyboard-layout-key">A</div>
              <div className="keyboard-layout-key">S</div>
              <div className="keyboard-layout-key">D</div>
              <div className="keyboard-layout-key">F</div>
              <div className="keyboard-layout-key">G</div>
            </div>
            <div className="keyboard-row">
              <div className="keyboard-layout-key">Z</div>
              <div className="keyboard-layout-key">X</div>
              <div className="keyboard-layout-key">C</div>
              <div className="keyboard-layout-key">V</div>
              <div className="keyboard-layout-key">B</div>
            </div>
          </div>
        ))}
        
        {/* WPM Indicators */}
        {[...Array(5)].map((_, i) => (
          <div
            key={`wpm-${i}`}
            className="wpm-indicator"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          >
            {Math.floor(Math.random() * 100 + 20)} WPM
          </div>
        ))}
        
        {/* Word Bubbles */}
        {[...Array(8)].map((_, i) => {
          const words = ['fast', 'quick', 'speed', 'type', 'keyboard', 'fingers', 'accuracy', 'words'];
          const word = words[Math.floor(Math.random() * words.length)];
          return (
            <div
              key={`bubble-${i}`}
              className="word-bubble"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 10}s`,
                animationDuration: `${Math.random() * 5 + 10}s`,
              }}
            >
              {word}
            </div>
          );
        })}
        
        {/* Typing Zones */}
        <div 
          className="typing-zone"
          style={{
            width: '300px',
            height: '300px',
            top: '10%',
            left: '10%',
            backgroundColor: 'rgba(217, 70, 239, 0.05)',
            animation: 'float 15s ease-in-out infinite',
          }}
        />
        <div 
          className="typing-zone"
          style={{
            width: '250px',
            height: '250px',
            bottom: '15%',
            right: '15%',
            backgroundColor: 'rgba(168, 85, 247, 0.05)',
            animation: 'floatReverse 12s ease-in-out infinite',
          }}
        />
        <div 
          className="typing-zone"
          style={{
            width: '200px',
            height: '200px',
            top: '50%',
            left: '60%',
            backgroundColor: 'rgba(236, 72, 153, 0.05)',
            animation: 'float 18s ease-in-out infinite',
            animationDelay: '3s',
          }}
        />
      </div>
      
      <main className="min-h-[calc(100vh-80px)] text-slate-100 relative z-10">
        <div className="max-w-4xl mx-auto px-4 py-10">
          {/* title + description */}
          <div className="mb-6">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-fuchsia-300 drop-shadow-[0_0_24px_rgba(217,70,239,0.6)]">
              Typing Speed Test
            </h2>
            <p className="mt-2 text-sm md:text-base text-slate-300">
              Type paragraph below as fast and accurately as you can, then
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