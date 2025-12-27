// src/pages/RollDicePage.jsx
import React, { useEffect, useState, useCallback } from "react";
import { initRollDice, destroyRollDice } from "../games/roll-dice";
import { initUsernameUI } from "../games/username";

export default function RollDicePage() {
  const [scores, setScores] = useState([]);

  const loadLeaderboard = useCallback(() => {
    fetch(
      "http://localhost:5000/api/scores/leaderboard?game=roll-dice&limit=10"
    )
      .then((res) => res.json())
      .then((rows) => setScores(rows))
      .catch((err) =>
        console.error("Error loading Roll Dice leaderboard (React):", err)
      );
  }, []);

  useEffect(() => {
    // make sure username / getPlayerInfo is available
    initUsernameUI();
    loadLeaderboard();

    initRollDice({ onScoreSaved: loadLeaderboard });

    return () => {
      if (typeof destroyRollDice === "function") {
        destroyRollDice();
      }
    };
  }, [loadLeaderboard]);

  useEffect(() => {
    // Add custom styles for animations
    const styleId = "roll-dice-animations";
    if (!document.getElementById(styleId)) {
      const style = document.createElement("style");
      style.id = styleId;
      style.textContent = `
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
        
        @keyframes diceRoll {
          0% { transform: rotate(0deg) scale(1); }
          25% { transform: rotate(90deg) scale(1.1); }
          50% { transform: rotate(180deg) scale(1); }
          75% { transform: rotate(270deg) scale(1.1); }
          100% { transform: rotate(360deg) scale(1); }
        }
        
        @keyframes chipFlip {
          0% { transform: rotateY(0deg); }
          50% { transform: rotateY(180deg); }
          100% { transform: rotateY(360deg); }
        }
        
        @keyframes cardFlip {
          0% { transform: rotateY(0deg); }
          50% { transform: rotateY(90deg); }
          100% { transform: rotateY(0deg); }
        }
        
        @keyframes coinSpin {
          0% { transform: rotateY(0deg) rotateX(0deg); }
          50% { transform: rotateY(180deg) rotateX(180deg); }
          100% { transform: rotateY(360deg) rotateX(360deg); }
        }
        
        @keyframes neonFlicker {
          0%, 100% { opacity: 0.8; }
          25% { opacity: 1; }
          50% { opacity: 0.7; }
          75% { opacity: 0.9; }
        }
        
        @keyframes slotSpin {
          0% { transform: translateY(0); }
          100% { transform: translateY(-100%); }
        }
        
        @keyframes rouletteSpin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .animated-bg {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: -1;
          overflow: hidden;
          background: linear-gradient(-45deg, #1e1b4b, #581c87, #1e1b4b, #4c1d95);
          background-size: 400% 400%;
          animation: gradientShift 15s ease infinite;
        }
        
        .dice {
          position: absolute;
          background: linear-gradient(135deg, #f8fafc, #e2e8f0);
          border-radius: 10%;
          box-shadow: 0 0 10px rgba(0,0,0,0.2);
          animation: float 15s ease-in-out infinite;
        }
        
        .dice-dot {
          position: absolute;
          width: 15%;
          height: 15%;
          background: #1e293b;
          border-radius: 50%;
        }
        
        .dice-1 .dice-dot {
          top: 42.5%;
          left: 42.5%;
        }
        
        .dice-2 .dice-dot:nth-child(1) {
          top: 25%;
          left: 25%;
        }
        
        .dice-2 .dice-dot:nth-child(2) {
          bottom: 25%;
          right: 25%;
        }
        
        .dice-3 .dice-dot:nth-child(1) {
          top: 25%;
          left: 25%;
        }
        
        .dice-3 .dice-dot:nth-child(2) {
          top: 42.5%;
          left: 42.5%;
        }
        
        .dice-3 .dice-dot:nth-child(3) {
          bottom: 25%;
          right: 25%;
        }
        
        .dice-4 .dice-dot:nth-child(1) {
          top: 25%;
          left: 25%;
        }
        
        .dice-4 .dice-dot:nth-child(2) {
          top: 25%;
          right: 25%;
        }
        
        .dice-4 .dice-dot:nth-child(3) {
          bottom: 25%;
          left: 25%;
        }
        
        .dice-4 .dice-dot:nth-child(4) {
          bottom: 25%;
          right: 25%;
        }
        
        .dice-5 .dice-dot:nth-child(1) {
          top: 25%;
          left: 25%;
        }
        
        .dice-5 .dice-dot:nth-child(2) {
          top: 25%;
          right: 25%;
        }
        
        .dice-5 .dice-dot:nth-child(3) {
          top: 42.5%;
          left: 42.5%;
        }
        
        .dice-5 .dice-dot:nth-child(4) {
          bottom: 25%;
          left: 25%;
        }
        
        .dice-5 .dice-dot:nth-child(5) {
          bottom: 25%;
          right: 25%;
        }
        
        .dice-6 .dice-dot:nth-child(1) {
          top: 25%;
          left: 25%;
        }
        
        .dice-6 .dice-dot:nth-child(2) {
          top: 25%;
          right: 25%;
        }
        
        .dice-6 .dice-dot:nth-child(3) {
          top: 42.5%;
          left: 25%;
        }
        
        .dice-6 .dice-dot:nth-child(4) {
          top: 42.5%;
          right: 25%;
        }
        
        .dice-6 .dice-dot:nth-child(5) {
          bottom: 25%;
          left: 25%;
        }
        
        .dice-6 .dice-dot:nth-child(6) {
          bottom: 25%;
          right: 25%;
        }
        
        .chip {
          position: absolute;
          border-radius: 50%;
          border: 2px dashed rgba(255,255,255,0.3);
          animation: chipFlip 10s ease-in-out infinite;
        }
        
        .chip::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 70%;
          height: 70%;
          border-radius: 50%;
          transform: translate(-50%, -50%);
        }
        
        .playing-card {
          position: absolute;
          background: linear-gradient(to bottom, #f8fafc, #f1f5f9);
          border-radius: 5px;
          box-shadow: 0 0 10px rgba(0,0,0,0.2);
          animation: cardFlip 12s ease-in-out infinite;
        }
        
        .playing-card::before {
          content: attr(data-suit);
          position: absolute;
          top: 5px;
          left: 5px;
          font-size: 14px;
        }
        
        .coin {
          position: absolute;
          border-radius: 50%;
          background: linear-gradient(135deg, #fbbf24, #f59e0b);
          box-shadow: 0 0 10px rgba(0,0,0,0.2);
          animation: coinSpin 8s ease-in-out infinite;
        }
        
        .coin::before {
          content: '$';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-weight: bold;
          color: #92400e;
        }
        
        .neon-sign {
          position: absolute;
          font-family: monospace;
          font-weight: bold;
          color: #fbbf24;
          text-shadow: 0 0 10px #fbbf24, 0 0 20px #fbbf24;
          animation: neonFlicker 3s ease-in-out infinite;
        }
        
        .slot-symbol {
          position: absolute;
          width: 40px;
          height: 40px;
          background: rgba(255,255,255,0.1);
          border-radius: 5px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          animation: slotSpin 5s linear infinite;
        }
        
        .roulette-wheel {
          position: absolute;
          border-radius: 50%;
          border: 2px solid rgba(255,255,255,0.2);
          animation: rouletteSpin 20s linear infinite;
        }
        
        .casino-zone {
          position: absolute;
          border-radius: 50%;
          filter: blur(40px);
        }
      `;
      document.head.appendChild(style);
    }
  }, []);

  return (
    <main className="min-h-[calc(100vh-80px)] relative overflow-hidden">
      {/* Animated Background */}
      <div className="animated-bg">
        {/* Animated Dice with proper dots */}
        {[...Array(10)].map((_, i) => {
          const diceValue = Math.floor(Math.random() * 6) + 1;
          return (
            <div
              key={`dice-${i}`}
              className={`dice dice-${diceValue}`}
              style={{
                width: `${Math.random() * 30 + 40}px`,
                height: `${Math.random() * 30 + 40}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 10}s`,
                animationDuration: `${Math.random() * 10 + 15}s`,
              }}
            >
              {[...Array(diceValue)].map((_, j) => (
                <div key={j} className="dice-dot" />
              ))}
            </div>
          );
        })}

        {/* Casino Chips */}
        {[...Array(8)].map((_, i) => {
          const chipColors = ["#dc2626", "#16a34a", "#2563eb", "#ca8a04"];
          const chipColor =
            chipColors[Math.floor(Math.random() * chipColors.length)];
          return (
            <div
              key={`chip-${i}`}
              className="chip"
              style={{
                width: `${Math.random() * 20 + 30}px`,
                height: `${Math.random() * 20 + 30}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${Math.random() * 5 + 10}s`,
              }}
            >
              <div style={{ backgroundColor: chipColor }} />
            </div>
          );
        })}

        {/* Playing Cards */}
        {[...Array(6)].map((_, i) => {
          const suits = ["♠", "♥", "♦", "♣"];
          const suitColors = ["black", "red", "red", "black"];
          const suitIndex = Math.floor(Math.random() * suits.length);
          return (
            <div
              key={`card-${i}`}
              className="playing-card"
              data-suit={suits[suitIndex]}
              style={{
                width: `${Math.random() * 20 + 40}px`,
                height: `${Math.random() * 20 + 60}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                color: suitColors[suitIndex],
                animationDelay: `${Math.random() * 10}s`,
                animationDuration: `${Math.random() * 5 + 12}s`,
              }}
            />
          );
        })}

        {/* Gold Coins */}
        {[...Array(10)].map((_, i) => (
          <div
            key={`coin-${i}`}
            className="coin"
            style={{
              width: `${Math.random() * 15 + 20}px`,
              height: `${Math.random() * 15 + 20}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${Math.random() * 3 + 8}s`,
            }}
          />
        ))}

        {/* Neon Signs */}
        <div
          className="neon-sign"
          style={{
            top: "10%",
            left: "10%",
            fontSize: "24px",
            animationDelay: "0.5s",
          }}
        >
          LUCKY
        </div>
        <div
          className="neon-sign"
          style={{
            top: "20%",
            right: "15%",
            fontSize: "20px",
            animationDelay: "1.5s",
            color: "#ec4899",
            textShadow: "0 0 10px #ec4899, 0 0 20px #ec4899",
          }}
        >
          WINNER
        </div>
        <div
          className="neon-sign"
          style={{
            bottom: "15%",
            left: "20%",
            fontSize: "22px",
            animationDelay: "2.5s",
            color: "#10b981",
            textShadow: "0 0 10px #10b981, 0 0 20px #10b981",
          }}
        >
          JACKPOT
        </div>

        {/* Slot Machine Symbols */}
        {[...Array(5)].map((_, i) => {
          const symbols = ["🍒", "🍋", "🔔", "💎", "7️⃣"];
          const symbol = symbols[Math.floor(Math.random() * symbols.length)];
          return (
            <div
              key={`slot-${i}`}
              className="slot-symbol"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${Math.random() * 3 + 5}s`,
              }}
            >
              {symbol}
            </div>
          );
        })}

        {/* Roulette Wheels */}
        <div
          className="roulette-wheel"
          style={{
            width: "80px",
            height: "80px",
            top: "15%",
            right: "10%",
            background:
              "conic-gradient(#dc2626 0deg 18deg, #1e293b 18deg 36deg, #dc2626 36deg 54deg, #1e293b 54deg 72deg, #dc2626 72deg 90deg, #1e293b 90deg 108deg, #dc2626 108deg 126deg, #1e293b 126deg 144deg, #dc2626 144deg 162deg, #1e293b 162deg 180deg, #dc2626 180deg 198deg, #1e293b 198deg 216deg, #dc2626 216deg 234deg, #1e293b 234deg 252deg, #dc2626 252deg 270deg, #1e293b 270deg 288deg, #dc2626 288deg 306deg, #1e293b 306deg 324deg, #dc2626 324deg 342deg, #1e293b 342deg 360deg)",
          }}
        />
        <div
          className="roulette-wheel"
          style={{
            width: "60px",
            height: "60px",
            bottom: "20%",
            left: "15%",
            animationDuration: "25s",
            background:
              "conic-gradient(#16a34a 0deg 36deg, #1e293b 36deg 72deg, #16a34a 72deg 108deg, #1e293b 108deg 144deg, #16a34a 144deg 180deg, #1e293b 180deg 216deg, #16a34a 216deg 252deg, #1e293b 252deg 288deg, #16a34a 288deg 324deg, #1e293b 324deg 360deg)",
          }}
        />

        {/* Casino Zones */}
        <div
          className="casino-zone"
          style={{
            width: "300px",
            height: "300px",
            top: "10%",
            left: "10%",
            backgroundColor: "rgba(220, 38, 38, 0.05)",
            animation: "float 15s ease-in-out infinite",
          }}
        />
        <div
          className="casino-zone"
          style={{
            width: "250px",
            height: "250px",
            bottom: "15%",
            right: "15%",
            backgroundColor: "rgba(251, 191, 36, 0.05)",
            animation: "floatReverse 12s ease-in-out infinite",
          }}
        />
        <div
          className="casino-zone"
          style={{
            width: "200px",
            height: "200px",
            top: "50%",
            left: "60%",
            backgroundColor: "rgba(34, 197, 94, 0.05)",
            animation: "float 18s ease-in-out infinite",
            animationDelay: "3s",
          }}
        />
      </div>

      {/* Main content */}
      <div className="relative max-w-4xl mx-auto px-4 py-10">
        {/* title + description */}
        <div className="mb-6">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-purple-300 drop-shadow-[0_0_24px_rgba(196,181,253,0.6)]">
            Roll Dice
          </h2>
          <p className="mt-2 text-sm md:text-base text-slate-300">
            Click the button to roll two dice multiple times and try to get the
            highest total.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] items-start">
          {/* game panel */}
          <div className="rounded-2xl bg-slate-900/70 border border-slate-800/80 shadow-[0_20px_50px_rgba(15,23,42,0.9)] backdrop-blur-sm px-4 py-5 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-50"></div>

            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">
                Dice Game
              </span>
              <span className="text-xs text-slate-400">
                Sessions · Best total
              </span>
            </div>

            <div id="game-root">
              {/* Match setup */}
              <div
                id="roll-setup"
                className="mb-3 flex flex-wrap items-center gap-2"
              >
                <label
                  htmlFor="roll-rounds-select"
                  className="text-sm text-slate-200"
                >
                  Play:
                </label>
                <select
                  id="roll-rounds-select"
                  defaultValue="1"
                  className="h-9 rounded-lg bg-slate-950 border border-slate-700 px-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="1">1 roll</option>
                  <option value="3">Best of 3 rolls</option>
                  <option value="5">Best of 5 rolls</option>
                  <option value="10">Best of 10 rolls</option>
                </select>
                <button
                  id="roll-start-match-btn"
                  type="button"
                  className="h-9 px-3 rounded-lg bg-purple-500 hover:bg-purple-400 active:bg-purple-600 text-xs sm:text-sm font-semibold text-slate-900 shadow-[0_10px_25px_rgba(196,181,253,0.45)] transition-colors"
                >
                  Start Session
                </button>
              </div>

              {/* Match status */}
              <div
                id="roll-status-bar"
                className="hidden mb-2 items-center text-xs sm:text-sm text-slate-200"
              >
                <span id="roll-round-info">Roll 1</span>
                <span className="mx-1">·</span>
                <span id="roll-score-info">Session total: 0</span>
                <button
                  id="roll-reset-match-btn"
                  type="button"
                  className="ml-2 px-2 py-1 rounded-md border border-slate-600 text-[11px] sm:text-xs text-slate-200 hover:bg-slate-800/80 transition-colors"
                >
                  Reset Session
                </button>
              </div>

              <div className="mt-2 flex justify-center">
                <button
                  id="roll-button"
                  disabled
                  className="px-5 py-2.5 rounded-lg bg-slate-800 text-sm font-semibold text-slate-200 border border-slate-700 shadow-[0_12px_30px_rgba(15,23,42,0.9)] disabled:opacity-60 disabled:cursor-not-allowed hover:bg-slate-700 transition-colors"
                >
                  Roll 🎲
                </button>
              </div>

              <div
                className="feedback mt-3 text-center text-sm text-slate-200 min-h-[1.25rem]"
                id="dice-result"
              >
                Choose "Start Session" to play.
              </div>
            </div>
          </div>

          {/* leaderboard – React only */}
          <div className="rounded-2xl bg-slate-900/70 border border-slate-800/80 shadow-[0_18px_40px_rgba(15,23,42,0.9)] backdrop-blur-sm px-4 py-5 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-50"></div>

            <h3 className="text-lg font-semibold text-slate-50 mb-2">
              Top Roll Dice Scores
            </h3>
            <p className="text-xs text-slate-400 mb-3">
              Scores are ordered by highest total in a single session.
            </p>

            <div className="max-h-72 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700/80 scrollbar-track-slate-900/80">
              <table
                id="roll-leaderboard"
                className="w-full text-sm text-slate-200"
              >
                <thead className="text-xs uppercase tracking-wide text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="py-2 text-left">Player</th>
                    <th className="py-2 text-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {scores.length === 0 ? (
                    <tr>
                      <td
                        colSpan={2}
                        className="py-2 text-center text-slate-500"
                      >
                        No scores yet.
                      </td>
                    </tr>
                  ) : (
                    scores.map((row, index) => (
                      <tr key={row._id || index}>
                        <td>
                          {index + 1}. {row.username}
                        </td>
                        <td className="py-1 text-right">{row.value}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Game instructions */}
        <div className="mt-8 rounded-xl bg-slate-900/50 border border-slate-800/50 p-4">
          <h4 className="text-sm font-medium text-slate-300 mb-2">
            How to Play
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-400">
            <div className="flex items-start">
              <span className="text-purple-400 mr-2">🎲</span>
              <span>Choose number of rolls and start session</span>
            </div>
            <div className="flex items-start">
              <span className="text-purple-400 mr-2">🎯</span>
              <span>Click Roll to roll two dice</span>
            </div>
            <div className="flex items-start">
              <span className="text-purple-400 mr-2">🏆</span>
              <span>Try to get the highest total</span>
            </div>
            <div className="flex items-start">
              <span className="text-purple-400 mr-2">📊</span>
              <span>Best roll of the session counts</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
