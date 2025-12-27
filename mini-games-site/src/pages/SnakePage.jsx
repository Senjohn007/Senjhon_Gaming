// src/pages/SnakePage.jsx
import React, { useEffect, useState, useCallback } from "react";
import { initSnake } from "../games/snake";
import { useSettings } from "../context/SettingsContext.jsx";

export default function SnakePage() {
  const { settings } = useSettings();

  // compute delay based on difficulty
  const tickDelay =
    settings.difficulty === "easy" ? 160 :
    settings.difficulty === "hard" ? 80 : 120;

  const [scores, setScores] = useState([]);

  const loadLeaderboard = useCallback(() => {
    fetch("http://localhost:5000/api/scores/leaderboard?game=snake&limit=10")
      .then((res) => res.json())
      .then((rows) => setScores(rows))
      .catch((err) =>
        console.error("Error loading snake leaderboard (React):", err)
      );
  }, []);

  // initial load of leaderboard
  useEffect(() => {
    loadLeaderboard();
  }, [loadLeaderboard]);

  useEffect(() => {
    if (typeof initSnake === "function") {
      // pass tickDelay and callback to refresh scores after save
      initSnake({ tickDelay, onScoreSaved: loadLeaderboard });
    }
  }, [tickDelay, loadLeaderboard]);
  
  useEffect(() => {
    // Add custom styles for animations
    const styleId = "snake-animations";
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
        
        @keyframes snakeSlither {
          0% { transform: translateX(-100px) translateY(0) rotate(0deg); }
          25% { transform: translateX(-50px) translateY(-10px) rotate(5deg); }
          50% { transform: translateX(0) translateY(0) rotate(0deg); }
          75% { transform: translateX(50px) translateY(10px) rotate(-5deg); }
          100% { transform: translateX(100px) translateY(0) rotate(0deg); }
        }
        
        @keyframes foodPulse {
          0%, 100% { transform: scale(1); opacity: 0.7; }
          50% { transform: scale(1.2); opacity: 1; }
        }
        
        @keyframes grassWave {
          0% { transform: translateX(0) rotate(0deg); }
          50% { transform: translateX(5px) rotate(3deg); }
          100% { transform: translateX(0) rotate(0deg); }
        }
        
        @keyframes leafFloat {
          0% { transform: translateY(0) rotate(0deg); }
          25% { transform: translateY(-20px) rotate(15deg); }
          50% { transform: translateY(-40px) rotate(0deg); }
          75% { transform: translateY(-20px) rotate(-15deg); }
          100% { transform: translateY(0) rotate(0deg); }
        }
        
        @keyframes snakeEgg {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        
        @keyframes gridPulse {
          0%, 100% { opacity: 0.05; }
          50% { opacity: 0.1; }
        }
        
        @keyframes snakeSkin {
          0% { background-position: 0% 0%; }
          100% { background-position: 100% 100%; }
        }
        
        .animated-bg {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: -1;
          overflow: hidden;
          background: linear-gradient(-45deg, #0f172a, #022c22, #0f172a, #064e3b);
          background-size: 400% 400%;
          animation: gradientShift 15s ease infinite;
        }
        
        .snake-segment {
          position: absolute;
          border-radius: 50%;
          animation: snakeSlither 20s linear infinite;
        }
        
        .food-item {
          position: absolute;
          border-radius: 50%;
          animation: foodPulse 3s ease-in-out infinite;
        }
        
        .grass-blade {
          position: absolute;
          bottom: 0;
          width: 3px;
          background: linear-gradient(to top, #14532d, #22c55e);
          border-radius: 100% 0 0 0;
          transform-origin: bottom center;
          animation: grassWave 3s ease-in-out infinite;
        }
        
        .leaf {
          position: absolute;
          width: 15px;
          height: 25px;
          background: linear-gradient(to bottom, #22c55e, #15803d);
          border-radius: 0 100% 0 100%;
          animation: leafFloat 10s ease-in-out infinite;
        }
        
        .snake-egg {
          position: absolute;
          width: 20px;
          height: 25px;
          background: linear-gradient(to bottom, #f3f4f6, #d1d5db);
          border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
          animation: snakeEgg 8s ease-in-out infinite;
        }
        
        .grid-pattern {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-image: linear-gradient(rgba(34, 197, 94, 0.1) 1px, transparent 1px), 
                            linear-gradient(90deg, rgba(34, 197, 94, 0.1) 1px, transparent 1px);
          background-size: 20px 20px;
          animation: gridPulse 5s ease-in-out infinite;
        }
        
        .snake-skin {
          position: absolute;
          border-radius: 50%;
          background-image: repeating-linear-gradient(
            45deg,
            rgba(34, 197, 94, 0.2),
            rgba(34, 197, 94, 0.2) 5px,
            rgba(21, 128, 61, 0.2) 5px,
            rgba(21, 128, 61, 0.2) 10px
          );
          animation: snakeSkin 20s linear infinite;
        }
        
        .nature-zone {
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
        {/* Grid Pattern */}
        <div className="grid-pattern"></div>
        
        {/* Snake Segments */}
        {[...Array(8)].map((_, i) => (
          <div
            key={`snake-${i}`}
            className="snake-segment"
            style={{
              width: `${Math.random() * 20 + 15}px`,
              height: `${Math.random() * 20 + 15}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              backgroundColor: `hsl(${Math.random() * 30 + 120}, 70%, 40%)`,
              animationDelay: `${Math.random() * 10}s`,
              animationDuration: `${Math.random() * 10 + 15}s`,
            }}
          />
        ))}
        
        {/* Snake Skin Patterns */}
        {[...Array(5)].map((_, i) => (
          <div
            key={`skin-${i}`}
            className="snake-skin"
            style={{
              width: `${Math.random() * 40 + 30}px`,
              height: `${Math.random() * 40 + 30}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
        
        {/* Food Items */}
        {[...Array(15)].map((_, i) => {
          const foodTypes = [
            { bg: 'linear-gradient(to bottom, #ef4444, #dc2626)', emoji: '🍎' },
            { bg: 'linear-gradient(to bottom, #f59e0b, #d97706)', emoji: '🍊' },
            { bg: 'linear-gradient(to bottom, #eab308, #ca8a04)', emoji: '🍋' },
            { bg: 'linear-gradient(to bottom, #a855f7, #9333ea)', emoji: '🍇' },
            { bg: 'linear-gradient(to bottom, #ec4899, #db2777)', emoji: '🍓' }
          ];
          const food = foodTypes[Math.floor(Math.random() * foodTypes.length)];
          return (
            <div
              key={`food-${i}`}
              className="food-item"
              style={{
                width: `${Math.random() * 10 + 10}px`,
                height: `${Math.random() * 10 + 10}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                background: food.bg,
                animationDelay: `${Math.random() * 3}s`,
              }}
            />
          );
        })}
        
        {/* Grass Blades */}
        {[...Array(30)].map((_, i) => (
          <div
            key={`grass-${i}`}
            className="grass-blade"
            style={{
              height: `${Math.random() * 20 + 10}px`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${Math.random() * 2 + 3}s`,
            }}
          />
        ))}
        
        {/* Leaves */}
        {[...Array(10)].map((_, i) => (
          <div
            key={`leaf-${i}`}
            className="leaf"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              transform: `rotate(${Math.random() * 360}deg)`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${Math.random() * 5 + 10}s`,
            }}
          />
        ))}
        
        {/* Snake Eggs */}
        {[...Array(6)].map((_, i) => (
          <div
            key={`egg-${i}`}
            className="snake-egg"
            style={{
              bottom: `${Math.random() * 20}px`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${Math.random() * 2 + 8}s`,
            }}
          />
        ))}
        
        {/* Nature Zones */}
        <div 
          className="nature-zone"
          style={{
            width: '300px',
            height: '300px',
            top: '10%',
            left: '10%',
            backgroundColor: 'rgba(34, 197, 94, 0.05)',
            animation: 'float 15s ease-in-out infinite',
          }}
        />
        <div 
          className="nature-zone"
          style={{
            width: '250px',
            height: '250px',
            bottom: '15%',
            right: '15%',
            backgroundColor: 'rgba(16, 185, 129, 0.05)',
            animation: 'floatReverse 12s ease-in-out infinite',
          }}
        />
        <div 
          className="nature-zone"
          style={{
            width: '200px',
            height: '200px',
            top: '50%',
            left: '60%',
            backgroundColor: 'rgba(132, 204, 22, 0.05)',
            animation: 'float 18s ease-in-out infinite',
            animationDelay: '3s',
          }}
        />
      </div>
      
      {/* Main content */}
      <div className="relative max-w-4xl mx-auto px-4 py-10">
        {/* title + description */}
        <div className="mb-6">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-green-300 drop-shadow-[0_0_24px_rgba(134,239,172,0.6)]">
            Snake
          </h2>
          <p className="mt-2 text-sm md:text-base text-slate-300">
            Use arrow keys to move. Eat food, avoid walls and yourself.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] items-start">
          {/* game panel */}
          <div className="rounded-2xl bg-slate-900/70 border border-slate-800/80 shadow-[0_20px_50px_rgba(15,23,42,0.9)] backdrop-blur-sm px-4 py-5 relative overflow-hidden">
            {/* Nature effect at top */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-green-500 to-transparent opacity-50"></div>
            
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">
                Classic
              </span>
              <span className="text-xs text-slate-400">
                Arrow keys · Endless
              </span>
            </div>

            <div id="game-root" className="flex flex-col items-center">
              <canvas
                id="snake-canvas"
                width="320"
                height="320"
                className="rounded-xl bg-slate-950 border border-slate-800 shadow-[0_16px_40px_rgba(15,23,42,1)]"
              ></canvas>

              <div
                className="feedback mt-3 text-sm text-slate-200 text-center"
                id="snake-status"
              >
                Press any arrow key to start.
              </div>
            </div>
          </div>

          {/* leaderboard */}
          <div className="rounded-2xl bg-slate-900/70 border border-slate-800/80 shadow-[0_18px_40px_rgba(15,23,42,0.9)] backdrop-blur-sm px-4 py-5 relative overflow-hidden">
            {/* Nature effect at top */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-green-500 to-transparent opacity-50"></div>
            
            <h3 className="text-lg font-semibold text-slate-50 mb-2">
              Top Snake Scores
            </h3>
            <p className="text-xs text-slate-400 mb-3">
              Scores are ordered by longest snake length in a single run.
            </p>

            <div className="max-h-72 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700/80 scrollbar-track-slate-900/80">
              <table
                id="snake-leaderboard"
                className="w-full text-sm text-slate-200"
              >
                <thead className="text-xs uppercase tracking-wide text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="py-2 text-left">Player</th>
                    <th className="py-2 text-right">Score</th>
                  </tr>
                </thead>
                <tbody>
                  {scores.map((row, index) => (
                    <tr key={row._id || index}>
                      <td>{index + 1}. {row.username}</td>
                      <td className="py-1 text-right">{row.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        
        {/* Game instructions */}
        <div className="mt-8 rounded-xl bg-slate-900/50 border border-slate-800/50 p-4">
          <h4 className="text-sm font-medium text-slate-300 mb-2">How to Play</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-400">
            <div className="flex items-start">
              <span className="text-green-400 mr-2">🐍</span>
              <span>Use arrow keys to control the snake</span>
            </div>
            <div className="flex items-start">
              <span className="text-green-400 mr-2">🍎</span>
              <span>Eat food to grow longer</span>
            </div>
            <div className="flex items-start">
              <span className="text-green-400 mr-2">💥</span>
              <span>Avoid hitting walls or yourself</span>
            </div>
            <div className="flex items-start">
              <span className="text-green-400 mr-2">🏆</span>
              <span>Longer snake means higher score</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}