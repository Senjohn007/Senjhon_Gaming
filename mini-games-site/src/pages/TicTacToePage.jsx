// src/pages/TicTacToePage.jsx
import React, { useEffect, useState, useCallback } from "react";
import { initTicTacToe, destroyTicTacToe } from "../games/tictactoe";
import { initUsernameUI } from "../games/username";

export default function TicTacToePage() {
  const [scores, setScores] = useState([]);

  const loadLeaderboard = useCallback(() => {
    fetch(
      "http://localhost:5000/api/scores/leaderboard?game=tictactoe&limit=10"
    )
      .then((res) => res.json())
      .then((rows) => setScores(rows))
      .catch((err) =>
        console.error("Error loading TicTacToe leaderboard (React):", err)
      );
  }, []);

  useEffect(() => {
    let isMounted = true;

    // ensure window.getPlayerInfo exists
    initUsernameUI();

    const styleId = "tictactoe-animations";
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
        @keyframes xDraw {
          0% { transform: rotate(0deg) scale(0.8); opacity: 0.5; }
          50% { transform: rotate(90deg) scale(1); opacity: 1; }
          100% { transform: rotate(180deg) scale(0.8); opacity: 0.5; }
        }
        @keyframes oDraw {
          0% { transform: scale(0.8); opacity: 0.5; }
          50% { transform: scale(1.1); opacity: 1; }
          100% { transform: scale(0.8); opacity: 0.5; }
        }
        @keyframes gridPulse {
          0%, 100% { opacity: 0.1; }
          50% { opacity: 0.3; }
        }
        @keyframes mathSymbolFloat {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          25% { transform: translateY(-15px) rotate(5deg); }
          50% { transform: translateY(0) rotate(0deg); }
          75% { transform: translateY(-10px) rotate(-5deg); }
        }
        @keyframes winLine {
          0% { transform: scaleX(0); opacity: 0; }
          50% { transform: scaleX(1); opacity: 0.7; }
          100% { transform: scaleX(0); opacity: 0; }
        }
        @keyframes strategyBoard {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes ticTacToe {
          0% { transform: scale(1); opacity: 0.7; }
          50% { transform: scale(1.05); opacity: 1; }
          100% { transform: scale(1); opacity: 0.7; }
        }
        .animated-bg {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: -1;
          overflow: hidden;
          background: linear-gradient(-45deg, #0f172a, #451a03, #0f172a, #78350f);
          background-size: 400% 400%;
          animation: gradientShift 15s ease infinite;
        }
        .x-symbol {
          position: absolute;
          width: 40px;
          height: 40px;
          animation: xDraw 8s ease-in-out infinite;
        }
        .x-symbol::before,
        .x-symbol::after {
          content: '';
          position: absolute;
          width: 100%;
          height: 4px;
          background: linear-gradient(to right, rgba(251, 191, 36, 0.7), rgba(251, 191, 36, 0.3));
          top: 50%;
          left: 0;
          transform-origin: center;
        }
        .x-symbol::before { transform: rotate(45deg); }
        .x-symbol::after { transform: rotate(-45deg); }
        .o-symbol {
          position: absolute;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          border: 4px solid rgba(251, 191, 36, 0.7);
          animation: oDraw 7s ease-in-out infinite;
        }
        .grid-pattern {
          position: absolute;
          opacity: 0.1;
        }
        .grid-pattern::before,
        .grid-pattern::after {
          content: '';
          position: absolute;
          background: rgba(251, 191, 36, 0.2);
        }
        .grid-pattern::before {
          width: 100%;
          height: 2px;
          top: 50%;
          left: 0;
        }
        .grid-pattern::after {
          width: 2px;
          height: 100%;
          top: 0;
          left: 50%;
        }
        .math-symbol {
          position: absolute;
          font-family: monospace;
          font-weight: bold;
          color: rgba(251, 191, 36, 0.3);
          animation: mathSymbolFloat 10s ease-in-out infinite;
        }
        .win-line {
          position: absolute;
          height: 4px;
          background: linear-gradient(to right, rgba(251, 191, 36, 0.7), rgba(251, 191, 36, 0.3));
          animation: winLine 6s ease-in-out infinite;
        }
        .strategy-board {
          position: absolute;
          width: 60px;
          height: 60px;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          grid-template-rows: repeat(3, 1fr);
          gap: 2px;
          animation: strategyBoard 20s linear infinite;
        }
        .strategy-board::before {
          content: '';
          position: absolute;
          inset: 0;
          background: rgba(251, 191, 36, 0.1);
          border-radius: 5px;
        }
        .tic-tac-toe-cell {
          position: relative;
        }
        .tic-tac-toe-cell::before {
          content: '';
          position: absolute;
          inset: 0;
          background: rgba(251, 191, 36, 0.05);
          border-radius: 2px;
        }
        .geometric-shape {
          position: absolute;
          opacity: 0.1;
          animation: float 15s ease-in-out infinite;
        }
        .game-zone {
          position: absolute;
          border-radius: 50%;
          filter: blur(40px);
        }
      `;
      document.head.appendChild(style);
    }

    loadLeaderboard();

    initTicTacToe({
      onScoreSaved: () => {
        if (!isMounted) return;
        loadLeaderboard();
      },
    });

    return () => {
      destroyTicTacToe?.();
      isMounted = false;
    };
  }, [loadLeaderboard]);

  return (
    <main className="min-h-[calc(100vh-80px)] relative overflow-hidden">
      {/* Animated Background */}
      <div className="animated-bg">
        {[...Array(10)].map((_, i) => (
          <div
            key={`x-${i}`}
            className="x-symbol"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 8}s`,
              animationDuration: `${Math.random() * 4 + 8}s`,
            }}
          />
        ))}

        {[...Array(10)].map((_, i) => (
          <div
            key={`o-${i}`}
            className="o-symbol"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 7}s`,
              animationDuration: `${Math.random() * 3 + 7}s`,
            }}
          />
        ))}

        {[...Array(8)].map((_, i) => (
          <div
            key={`grid-${i}`}
            className="grid-pattern"
            style={{
              width: `${Math.random() * 40 + 40}px`,
              height: `${Math.random() * 40 + 40}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 10}s`,
              animationDuration: `${Math.random() * 5 + 10}s`,
            }}
          />
        ))}

        {[...Array(15)].map((_, i) => {
          const symbols = [
            "+",
            "-",
            "×",
            "÷",
            "=",
            "≠",
            "≤",
            "≥",
            "∑",
            "∏",
            "∫",
            "√",
            "∞",
          ];
          const symbol = symbols[Math.floor(Math.random() * symbols.length)];
          return (
            <div
              key={`math-${i}`}
              className="math-symbol"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                fontSize: `${Math.random() * 20 + 15}px`,
                animationDelay: `${Math.random() * 10}s`,
              }}
            >
              {symbol}
            </div>
          );
        })}

        {[...Array(5)].map((_, i) => (
          <div
            key={`win-${i}`}
            className="win-line"
            style={{
              width: `${Math.random() * 100 + 50}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              transform: `rotate(${Math.random() * 360}deg)`,
              animationDelay: `${Math.random() * 6}s`,
              animationDuration: `${Math.random() * 3 + 6}s`,
            }}
          />
        ))}

        {[...Array(4)].map((_, i) => (
          <div
            key={`strategy-${i}`}
            className="strategy-board"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 20}s`,
              animationDuration: `${Math.random() * 10 + 20}s`,
            }}
          >
            {[...Array(9)].map((_, j) => (
              <div key={j} className="tic-tac-toe-cell" />
            ))}
          </div>
        ))}

        {[...Array(12)].map((_, i) => {
          const shapes = ["square", "circle", "triangle"];
          const shape = shapes[Math.floor(Math.random() * shapes.length)];

          let shapeStyle = {};
          if (shape === "square") {
            shapeStyle = {
              width: `${Math.random() * 30 + 20}px`,
              height: `${Math.random() * 30 + 20}px`,
              backgroundColor: "rgba(251, 191, 36, 0.1)",
              borderRadius: "2px",
            };
          } else if (shape === "circle") {
            shapeStyle = {
              width: `${Math.random() * 30 + 20}px`,
              height: `${Math.random() * 30 + 20}px`,
              backgroundColor: "rgba(251, 191, 36, 0.1)",
              borderRadius: "50%",
            };
          } else {
            shapeStyle = {
              width: 0,
              height: 0,
              borderLeft: `${Math.random() * 15 + 10}px solid transparent`,
              borderRight: `${Math.random() * 15 + 10}px solid transparent`,
              borderBottom: `${Math.random() * 20 + 15}px solid rgba(251, 191, 36, 0.1)`,
            };
          }

          return (
            <div
              key={`shape-${i}`}
              className="geometric-shape"
              style={{
                ...shapeStyle,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 15}s`,
                animationDuration: `${Math.random() * 10 + 15}s`,
              }}
            />
          );
        })}

        <div
          className="game-zone"
          style={{
            width: "300px",
            height: "300px",
            top: "10%",
            left: "10%",
            backgroundColor: "rgba(251, 191, 36, 0.05)",
            animation: "float 15s ease-in-out infinite",
          }}
        />
        <div
          className="game-zone"
          style={{
            width: "250px",
            height: "250px",
            bottom: "15%",
            right: "15%",
            backgroundColor: "rgba(217, 119, 6, 0.05)",
            animation: "floatReverse 12s ease-in-out infinite",
          }}
        />
        <div
          className="game-zone"
          style={{
            width: "200px",
            height: "200px",
            top: "50%",
            left: "60%",
            backgroundColor: "rgba(180, 83, 9, 0.05)",
            animation: "float 18s ease-in-out infinite",
            animationDelay: "3s",
          }}
        />
      </div>

      {/* Main content */}
      <div className="relative max-w-4xl mx-auto px-4 py-10">
        <div className="mb-6">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-amber-300 drop-shadow-[0_0_24px_rgba(251,191,36,0.6)]">
            Tic Tac Toe
          </h2>
          <p className="mt-2 text-sm md:text-base text-slate-300">
            You are X. Click a cell to make a move. The computer plays as O.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] items-start">
          {/* game panel */}
          <div className="rounded-2xl bg-slate-900/70 border border-slate-800/80 shadow-[0_20px_50px_rgba(15,23,42,0.9)] backdrop-blur-sm px-4 py-5 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent opacity-50" />

            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">
                Grid Game
              </span>
              <span className="text-xs text-slate-400">
                Best-of rounds · CPU
              </span>
            </div>

            <div id="game-root">
              <div
                id="ttt-setup"
                className="mb-3 flex flex-wrap items-center gap-2"
              >
                <label
                  htmlFor="ttt-rounds-select"
                  className="text-sm text-slate-200"
                >
                  Play:
                </label>
                <select
                  id="ttt-rounds-select"
                  defaultValue="3"
                  className="h-9 rounded-lg bg-slate-950 border border-slate-700 px-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                >
                  <option value="1">Best of 1</option>
                  <option value="3">Best of 3</option>
                  <option value="5">Best of 5</option>
                </select>
                <button
                  id="ttt-start-match-btn"
                  type="button"
                  className="h-9 px-3 rounded-lg bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-xs sm:text-sm font-semibold text-slate-900 shadow-[0_10px_25px_rgba(251,191,36,0.45)] transition-colors"
                >
                  Start Match
                </button>
              </div>

              <div
                id="ttt-status-bar"
                className="hidden mb-2 items-center text-xs sm:text-sm text-slate-200"
              >
                <span id="ttt-round-info">Round 1</span>
                <span className="mx-1">·</span>
                <span id="ttt-score-info">You 0 - 0 CPU</span>
                <button
                  id="ttt-reset-match-btn"
                  type="button"
                  className="ml-2 px-2 py-1 rounded-md border border-slate-600 text-[11px] sm:text-xs text-slate-200 hover:bg-slate-800/80 transition-colors"
                >
                  Reset Match
                </button>
              </div>

              <div
                id="ttt-grid"
                className="tictactoe-grid grid grid-cols-3 gap-2 mt-3 max-w-xs mx-auto"
              />

              <div
                className="status mt-3 text-center text-sm text-slate-200 min-h-[1.25rem]"
                id="ttt-status"
              >
                Choose "Start Match" to play.
              </div>

              <div className="mt-3 flex justify-center">
                <button
                  id="ttt-reset"
                  className="px-4 py-2 rounded-lg border border-slate-600 text-sm font-medium text-slate-200 hover:bg-slate-800/80 transition-colors"
                >
                  Reset Board
                </button>
              </div>
            </div>
          </div>

          {/* leaderboard – React renders rows */}
          <div className="rounded-2xl bg-slate-900/70 border border-slate-800/80 shadow-[0_18px_40px_rgba(15,23,42,0.9)] backdrop-blur-sm px-4 py-5 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent opacity-50" />

            <h3 className="text-lg font-semibold text-slate-50 mb-2">
              Top Tic Tac Toe Scores
            </h3>
            <p className="text-xs text-slate-400 mb-3">
              Scores are ordered by matches won in a single session.
            </p>

            <div className="max-h-72 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700/80 scrollbar-track-slate-900/80">
              <table
                id="ttt-leaderboard"
                className="w-full text-sm text-slate-200"
              >
                <thead className="text-xs uppercase tracking-wide text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="py-2 text-left">Player</th>
                    <th className="py-2 text-right">Score</th>
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
                        <td>{index + 1}. {row.username}</td>
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
              <span className="text-amber-400 mr-2">❌</span>
              <span>You play as X</span>
            </div>
            <div className="flex items-start">
              <span className="text-amber-400 mr-2">⭕</span>
              <span>Computer plays as O</span>
            </div>
            <div className="flex items-start">
              <span className="text-amber-400 mr-2">🎯</span>
              <span>Get three in a row to win</span>
            </div>
            <div className="flex items-start">
              <span className="text-amber-400 mr-2">🏆</span>
              <span>Win more rounds to win match</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
