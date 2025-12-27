// src/pages/BreakoutPage.jsx
import React, { useEffect } from "react";
import { initBreakout } from "../games/breakout";

export default function BreakoutPage() {
  useEffect(() => {
    // Add custom styles for animations
    const styleId = "breakout-animations";
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
        
        @keyframes ballBounce {
          0% { transform: translateY(0) scale(1); }
          25% { transform: translateY(-30px) scale(1.1, 0.9); }
          50% { transform: translateY(0) scale(1); }
          75% { transform: translateY(-15px) scale(1.05, 0.95); }
          100% { transform: translateY(0) scale(1); }
        }
        
        @keyframes paddleMove {
          0% { transform: translateX(-50px); }
          50% { transform: translateX(50px); }
          100% { transform: translateX(-50px); }
        }
        
        @keyframes pixelGlow {
          0%, 100% { opacity: 0.3; box-shadow: 0 0 5px rgba(56,189,248,0.3); }
          50% { opacity: 0.8; box-shadow: 0 0 15px rgba(56,189,248,0.8); }
        }
        
        @keyframes scanlineMove {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        
        @keyframes neonFlicker {
          0%, 100% { opacity: 0.8; }
          25% { opacity: 1; }
          50% { opacity: 0.7; }
          75% { opacity: 0.9; }
        }
        
        @keyframes powerUpFloat {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(180deg); }
        }
        
        @keyframes coinSpin {
          0% { transform: rotateY(0deg); }
          100% { transform: rotateY(360deg); }
        }
        
        @keyframes joystickMove {
          0%, 100% { transform: translate(0, 0); }
          25% { transform: translate(5px, 0); }
          50% { transform: translate(0, 5px); }
          75% { transform: translate(-5px, 0); }
        }
        
        .animated-bg {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: -1;
          overflow: hidden;
          background: linear-gradient(-45deg, #0f172a, #0c4a6e, #0f172a, #1e3a8a);
          background-size: 400% 400%;
          animation: gradientShift 15s ease infinite;
        }
        
        .pixel-block {
          position: absolute;
          border-radius: 2px;
          animation: float 15s ease-in-out infinite;
        }
        
        .ball {
          position: absolute;
          border-radius: 50%;
          animation: ballBounce 5s ease-in-out infinite;
        }
        
        .paddle {
          position: absolute;
          border-radius: 4px;
          animation: paddleMove 8s ease-in-out infinite;
        }
        
        .scanline {
          position: absolute;
          width: 100%;
          height: 2px;
          background: linear-gradient(to right, transparent, rgba(56,189,248,0.3), transparent);
          animation: scanlineMove 10s linear infinite;
        }
        
        .neon-sign {
          position: absolute;
          font-family: monospace;
          font-weight: bold;
          color: #38bdf8;
          text-shadow: 0 0 10px #38bdf8, 0 0 20px #38bdf8;
          animation: neonFlicker 3s ease-in-out infinite;
        }
        
        .power-up {
          position: absolute;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          animation: powerUpFloat 7s ease-in-out infinite;
        }
        
        .coin {
          position: absolute;
          width: 25px;
          height: 25px;
          border-radius: 50%;
          background: linear-gradient(135deg, #fbbf24, #f59e0b);
          animation: coinSpin 6s linear infinite;
        }
        
        .coin::before {
          content: '¥';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-weight: bold;
          color: #92400e;
        }
        
        .joystick {
          position: absolute;
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #4b5563, #374151);
          border-radius: 50%;
          animation: joystickMove 4s ease-in-out infinite;
        }
        
        .joystick::before {
          content: '';
          position: absolute;
          width: 20px;
          height: 20px;
          background: linear-gradient(135deg, #6b7280, #4b5563);
          border-radius: 50%;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }
        
        .arcade-button {
          position: absolute;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          animation: float 8s ease-in-out infinite;
        }
        
        .score-display {
          position: absolute;
          font-family: monospace;
          font-size: 14px;
          color: #38bdf8;
          background: rgba(0,0,0,0.3);
          padding: 2px 5px;
          border-radius: 2px;
          animation: float 12s ease-in-out infinite;
        }
        
        .arcade-zone {
          position: absolute;
          border-radius: 50%;
          filter: blur(40px);
        }
      `;
      document.head.appendChild(style);
    }

    if (typeof initBreakout === "function") {
      initBreakout();
    }
  }, []);

  return (
    <main className="min-h-[calc(100vh-80px)] relative overflow-hidden">
      {/* Animated Background */}
      <div className="animated-bg">
        {/* Scanlines */}
        {[...Array(5)].map((_, i) => (
          <div
            key={`scanline-${i}`}
            className="scanline"
            style={{
              top: `${i * 20}%`,
              animationDelay: `${i * 2}s`,
              opacity: 0.3 - i * 0.05,
            }}
          />
        ))}
        
        {/* Pixel Blocks */}
        {[...Array(20)].map((_, i) => {
          const colors = [
            'linear-gradient(to bottom, #ef4444, #dc2626)',
            'linear-gradient(to bottom, #f59e0b, #d97706)',
            'linear-gradient(to bottom, #10b981, #059669)',
            'linear-gradient(to bottom, #3b82f6, #2563eb)',
            'linear-gradient(to bottom, #8b5cf6, #7c3aed)',
            'linear-gradient(to bottom, #ec4899, #db2777)'
          ];
          const color = colors[Math.floor(Math.random() * colors.length)];
          return (
            <div
              key={`block-${i}`}
              className="pixel-block"
              style={{
                width: `${Math.random() * 30 + 20}px`,
                height: `${Math.random() * 15 + 10}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                background: color,
                animationDelay: `${Math.random() * 10}s`,
                animationDuration: `${Math.random() * 10 + 15}s`,
              }}
            />
          );
        })}
        
        {/* Balls */}
        {[...Array(8)].map((_, i) => (
          <div
            key={`ball-${i}`}
            className="ball"
            style={{
              width: `${Math.random() * 10 + 8}px`,
              height: `${Math.random() * 10 + 8}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              background: 'linear-gradient(135deg, #f8fafc, #e2e8f0)',
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${Math.random() * 3 + 5}s`,
            }}
          />
        ))}
        
        {/* Paddles */}
        {[...Array(6)].map((_, i) => (
          <div
            key={`paddle-${i}`}
            className="paddle"
            style={{
              width: `${Math.random() * 40 + 40}px`,
              height: `${Math.random() * 8 + 6}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              background: 'linear-gradient(to right, #4b5563, #6b7280)',
              animationDelay: `${Math.random() * 8}s`,
              animationDuration: `${Math.random() * 4 + 8}s`,
            }}
          />
        ))}
        
        {/* Neon Signs */}
        <div
          className="neon-sign"
          style={{
            top: '10%',
            left: '10%',
            fontSize: '24px',
            animationDelay: '0.5s',
          }}
        >
          BREAKOUT
        </div>
        <div
          className="neon-sign"
          style={{
            top: '20%',
            right: '15%',
            fontSize: '18px',
            animationDelay: '1.5s',
            color: '#ec4899',
            textShadow: '0 0 10px #ec4899, 0 0 20px #ec4899',
          }}
        >
          HIGH SCORE
        </div>
        <div
          className="neon-sign"
          style={{
            bottom: '15%',
            left: '20%',
            fontSize: '20px',
            animationDelay: '2.5s',
            color: '#10b981',
            textShadow: '0 0 10px #10b981, 0 0 20px #10b981',
          }}
        >
          GAME OVER
        </div>
        
        {/* Power-ups */}
        {[...Array(10)].map((_, i) => {
          const powerUpTypes = [
            { bg: 'linear-gradient(135deg, #ef4444, #dc2626)', icon: '⚡' },
            { bg: 'linear-gradient(135deg, #3b82f6, #2563eb)', icon: '🛡️' },
            { bg: 'linear-gradient(135deg, #10b981, #059669)', icon: '🚀' },
            { bg: 'linear-gradient(135deg, #f59e0b, #d97706)', icon: '⭐' }
          ];
          const powerUp = powerUpTypes[Math.floor(Math.random() * powerUpTypes.length)];
          return (
            <div
              key={`powerup-${i}`}
              className="power-up"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                background: powerUp.bg,
                animationDelay: `${Math.random() * 7}s`,
                animationDuration: `${Math.random() * 3 + 7}s`,
              }}
            />
          );
        })}
        
        {/* Coins */}
        {[...Array(8)].map((_, i) => (
          <div
            key={`coin-${i}`}
            className="coin"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 6}s`,
              animationDuration: `${Math.random() * 2 + 6}s`,
            }}
          />
        ))}
        
        {/* Joysticks */}
        {[...Array(4)].map((_, i) => (
          <div
            key={`joystick-${i}`}
            className="joystick"
            style={{
              bottom: `${Math.random() * 20 + 5}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${Math.random() * 2 + 4}s`,
            }}
          />
        ))}
        
        {/* Arcade Buttons */}
        {[...Array(6)].map((_, i) => {
          const buttonColors = ['#ef4444', '#10b981', '#3b82f6', '#f59e0b'];
          const buttonColor = buttonColors[Math.floor(Math.random() * buttonColors.length)];
          return (
            <div
              key={`button-${i}`}
              className="arcade-button"
              style={{
                bottom: `${Math.random() * 20 + 5}%`,
                left: `${Math.random() * 100}%`,
                background: buttonColor,
                animationDelay: `${Math.random() * 8}s}`,
                animationDuration: `${Math.random() * 4 + 8}s}`,
              }}
            />
          );
        })}
        
        {/* Score Displays */}
        {[...Array(5)].map((_, i) => (
          <div
            key={`score-${i}`}
            className="score-display"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 12}s}`,
              animationDuration: `${Math.random() * 6 + 12}s}`,
            }}
          >
            {Math.floor(Math.random() * 10000)}
          </div>
        ))}
        
        {/* Arcade Zones */}
        <div 
          className="arcade-zone"
          style={{
            width: '300px',
            height: '300px',
            top: '10%',
            left: '10%',
            backgroundColor: 'rgba(56, 189, 248, 0.05)',
            animation: 'float 15s ease-in-out infinite',
          }}
        />
        <div 
          className="arcade-zone"
          style={{
            width: '250px',
            height: '250px',
            bottom: '15%',
            right: '15%',
            backgroundColor: 'rgba(236, 72, 153, 0.05)',
            animation: 'floatReverse 12s ease-in-out infinite',
          }}
        />
        <div 
          className="arcade-zone"
          style={{
            width: '200px',
            height: '200px',
            top: '50%',
            left: '60%',
            backgroundColor: 'rgba(16, 185, 129, 0.05)',
            animation: 'float 18s ease-in-out infinite',
            animationDelay: '3s',
          }}
        />
      </div>
      
      {/* Main content */}
      <div className="relative max-w-4xl mx-auto px-4 py-10">
        {/* title + description */}
        <div className="mb-6">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-sky-300 drop-shadow-[0_0_24px_rgba(56,189,248,0.6)]">
            Breakout
          </h2>
          <p className="mt-2 text-sm md:text-base text-slate-300">
            Move the paddle with your left and right arrow keys. Break all the
            bricks and set a new high score.
          </p>
        </div>

        {/* game container */}
        <div className="grid gap-8 md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] items-start">
          {/* canvas + status */}
          <div className="rounded-2xl bg-slate-900/70 border border-slate-800/80 shadow-[0_20px_50px_rgba(15,23,42,0.9)] backdrop-blur-sm px-4 py-5 relative overflow-hidden">
            {/* Retro arcade effect at top */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-70"></div>
            
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">
                Arcade
              </span>
              <span className="text-xs text-slate-400">
                Arrow keys · Lives in HUD
              </span>
            </div>

            <div className="flex justify-center">
              <canvas
                id="breakout-canvas"
                width="360"
                height="320"
                className="rounded-xl bg-slate-950 border border-slate-800 shadow-[0_16px_40px_rgba(15,23,42,1)]"
              />
            </div>

            <div
              id="breakout-status"
              className="mt-3 text-sm text-slate-200 font-medium"
            >
              Press left/right to start.
            </div>
          </div>

          {/* leaderboard */}
          <div className="rounded-2xl bg-slate-900/70 border border-slate-800/80 shadow-[0_18px_40px_rgba(15,23,42,0.9)] backdrop-blur-sm px-4 py-5 relative overflow-hidden">
            {/* Retro arcade effect at top */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-70"></div>
            
            <h3 className="text-lg font-semibold text-slate-50 mb-3">
              Top Breakout Scores
            </h3>
            <div className="text-xs text-slate-400 mb-2">
              Scores are ordered by bricks broken in a single game.
            </div>
            <div className="max-h-72 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700/80 scrollbar-track-slate-900/80">
              <table
                id="breakout-leaderboard"
                className="w-full text-sm text-slate-200"
              >
                <thead className="text-xs uppercase tracking-wide text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="py-2 text-left">Player</th>
                    <th className="py-2 text-right">Score</th>
                  </tr>
                </thead>
                <tbody>{/* rows filled by JS */}</tbody>
              </table>
            </div>
          </div>
        </div>
        
        {/* Game instructions */}
        <div className="mt-8 rounded-xl bg-slate-900/50 border border-slate-800/50 p-4">
          <h4 className="text-sm font-medium text-slate-300 mb-2">How to Play</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-400">
            <div className="flex items-start">
              <span className="text-cyan-400 mr-2">←→</span>
              <span>Move paddle left and right</span>
            </div>
            <div className="flex items-start">
              <span className="text-cyan-400 mr-2">🧱</span>
              <span>Break all bricks to advance</span>
            </div>
            <div className="flex items-start">
              <span className="text-cyan-400 mr-2">⚡</span>
              <span>Don't let the ball fall</span>
            </div>
            <div className="flex items-start">
              <span className="text-cyan-400 mr-2">🏆</span>
              <span>Score points for each brick</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}