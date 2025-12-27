// src/pages/FlappyPage.jsx
import React, { useEffect } from "react";
import { initFlappy } from "../games/flappy";

export default function FlappyPage() {
  useEffect(() => {
    // Add custom styles for animations
    const styleId = "flappy-animations";
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
        
        @keyframes birdFlap {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(-20deg); }
        }
        
        @keyframes birdFloat {
          0%, 100% { transform: translateY(0) translateX(0); }
          25% { transform: translateY(-10px) translateX(5px); }
          50% { transform: translateY(0) translateX(0); }
          75% { transform: translateY(-5px) translateX(-5px); }
        }
        
        @keyframes pipeMove {
          0% { transform: translateX(100vw); }
          100% { transform: translateX(-200px); }
        }
        
        @keyframes cloudDrift {
          0% { transform: translateX(-100px); }
          100% { transform: translateX(calc(100vw + 100px)); }
        }
        
        @keyframes sunPulse {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.05); }
        }
        
        @keyframes featherFall {
          0% { transform: translateY(-100px) rotate(0deg); opacity: 0; }
          10% { opacity: 0.7; }
          90% { opacity: 0.7; }
          100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
        }
        
        @keyframes windBlow {
          0% { transform: translateX(0) scaleX(1); }
          50% { transform: translateX(10px) scaleX(1.1); }
          100% { transform: translateX(0) scaleX(1); }
        }
        
        @keyframes scoreFloat {
          0% { transform: translateY(0) scale(0.8); opacity: 0.5; }
          50% { transform: translateY(-20px) scale(1); opacity: 1; }
          100% { transform: translateY(-40px) scale(0.8); opacity: 0.5; }
        }
        
        @keyframes starTwinkle {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.8; }
        }
        
        @keyframes groundWave {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        
        .animated-bg {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: -1;
          overflow: hidden;
          background: linear-gradient(-45deg, #0c4a6e, #075985, #0c4a6e, #0369a1);
          background-size: 400% 400%;
          animation: gradientShift 15s ease infinite;
        }
        
        .bird {
          position: absolute;
          width: 30px;
          height: 25px;
          animation: birdFloat 8s ease-in-out infinite;
        }
        
        .bird::before {
          content: '';
          position: absolute;
          width: 30px;
          height: 25px;
          background: linear-gradient(135deg, #fbbf24, #f59e0b);
          border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
        }
        
        .bird::after {
          content: '';
          position: absolute;
          width: 20px;
          height: 10px;
          background: #f59e0b;
          top: 5px;
          left: 5px;
          border-radius: 50%;
          animation: birdFlap 0.5s ease-in-out infinite;
        }
        
        .bird-eye {
          position: absolute;
          width: 5px;
          height: 5px;
          background: white;
          border-radius: 50%;
          top: 8px;
          right: 8px;
        }
        
        .bird-eye::after {
          content: '';
          position: absolute;
          width: 2px;
          height: 2px;
          background: black;
          border-radius: 50%;
          top: 1px;
          right: 1px;
        }
        
        .bird-beak {
          position: absolute;
          width: 0;
          height: 0;
          border-left: 8px solid #f97316;
          border-top: 4px solid transparent;
          border-bottom: 4px solid transparent;
          right: -5px;
          top: 10px;
        }
        
        .pipe {
          position: absolute;
          width: 60px;
          background: linear-gradient(to right, #16a34a, #15803d);
          border: 2px solid #14532d;
          animation: pipeMove 15s linear infinite;
        }
        
        .pipe::before {
          content: '';
          position: absolute;
          width: 70px;
          height: 30px;
          background: linear-gradient(to right, #16a34a, #15803d);
          border: 2px solid #14532d;
          left: -6px;
        }
        
        .pipe-top::before {
          top: -30px;
          border-radius: 5px 5px 0 0;
        }
        
        .pipe-bottom::before {
          bottom: -30px;
          border-radius: 0 0 5px 5px;
        }
        
        .cloud {
          position: absolute;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 100px;
          animation: cloudDrift 30s linear infinite;
        }
        
        .cloud::before,
        .cloud::after {
          content: '';
          position: absolute;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 100px;
        }
        
        .cloud::before {
          width: 50px;
          height: 50px;
          top: -25px;
          left: 10px;
        }
        
        .cloud::after {
          width: 60px;
          height: 40px;
          top: -15px;
          right: 10px;
        }
        
        .sun {
          position: absolute;
          width: 60px;
          height: 60px;
          background: radial-gradient(circle, rgba(251, 191, 36, 0.4), rgba(251, 191, 36, 0.1));
          border-radius: 50%;
          animation: sunPulse 5s ease-in-out infinite;
        }
        
        .feather {
          position: absolute;
          width: 15px;
          height: 5px;
          background: linear-gradient(to right, #fbbf24, #f59e0b);
          border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
          animation: featherFall 10s linear infinite;
        }
        
        .wind-line {
          position: absolute;
          height: 1px;
          background: linear-gradient(to right, transparent, rgba(255, 255, 255, 0.2), transparent);
          animation: windBlow 3s ease-in-out infinite;
        }
        
        .score-indicator {
          position: absolute;
          font-family: monospace;
          font-size: 14px;
          color: rgba(255, 255, 255, 0.3);
          animation: scoreFloat 5s ease-in-out infinite;
        }
        
        .star {
          position: absolute;
          width: 2px;
          height: 2px;
          background: white;
          border-radius: 50%;
          animation: starTwinkle 3s ease-in-out infinite;
        }
        
        .ground {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 200%;
          height: 80px;
          background: linear-gradient(to top, #14532d, #166534);
          animation: groundWave 20s linear infinite;
        }
        
        .ground::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 10px;
          background: linear-gradient(to right, #15803d, #16a34a, #15803d);
        }
        
        .sky-zone {
          position: absolute;
          border-radius: 50%;
          filter: blur(40px);
        }
      `;
      document.head.appendChild(style);
    }

    initFlappy?.();
  }, []);

  return (
    <main className="min-h-[calc(100vh-80px)] relative overflow-hidden">
      {/* Animated Background */}
      <div className="animated-bg">
        {/* Ground */}
        <div className="ground"></div>
        
        {/* Stars */}
        {[...Array(30)].map((_, i) => (
          <div
            key={`star-${i}`}
            className="star"
            style={{
              top: `${Math.random() * 50}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
            }}
          />
        ))}
        
        {/* Sun */}
        <div
          className="sun"
          style={{
            top: '10%',
            right: '15%',
          }}
        />
        
        {/* Clouds */}
        {[...Array(8)].map((_, i) => (
          <div
            key={`cloud-${i}`}
            className="cloud"
            style={{
              width: `${Math.random() * 100 + 80}px`,
              height: `${Math.random() * 40 + 30}px`,
              top: `${Math.random() * 40}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 30}s`,
              animationDuration: `${Math.random() * 20 + 30}s`,
            }}
          />
        ))}
        
        {/* Birds */}
        {[...Array(10)].map((_, i) => (
          <div
            key={`bird-${i}`}
            className="bird"
            style={{
              top: `${Math.random() * 60 + 10}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 8}s`,
              animationDuration: `${Math.random() * 4 + 8}s`,
            }}
          >
            <div className="bird-eye"></div>
            <div className="bird-beak"></div>
          </div>
        ))}
        
        {/* Pipes */}
        {[...Array(6)].map((_, i) => (
          <div
            key={`pipe-${i}`}
            className={`pipe ${Math.random() > 0.5 ? 'pipe-top' : 'pipe-bottom'}`}
            style={{
              height: `${Math.random() * 200 + 100}px`,
              top: Math.random() > 0.5 ? '0' : 'auto',
              bottom: Math.random() > 0.5 ? 'auto' : '0',
              animationDelay: `${Math.random() * 15}s`,
              animationDuration: `${Math.random() * 5 + 15}s`,
            }}
          />
        ))}
        
        {/* Feathers */}
        {[...Array(15)].map((_, i) => (
          <div
            key={`feather-${i}`}
            className="feather"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              transform: `rotate(${Math.random() * 360}deg)`,
              animationDelay: `${Math.random() * 10}s`,
              animationDuration: `${Math.random() * 5 + 10}s`,
            }}
          />
        ))}
        
        {/* Wind Lines */}
        {[...Array(10)].map((_, i) => (
          <div
            key={`wind-${i}`}
            className="wind-line"
            style={{
              width: `${Math.random() * 100 + 50}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
            }}
          />
        ))}
        
        {/* Score Indicators */}
        {[...Array(5)].map((_, i) => (
          <div
            key={`score-${i}`}
            className="score-indicator"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          >
            +{Math.floor(Math.random() * 10) + 1}
          </div>
        ))}
        
        {/* Sky Zones */}
        <div 
          className="sky-zone"
          style={{
            width: '300px',
            height: '300px',
            top: '10%',
            left: '10%',
            backgroundColor: 'rgba(251, 191, 36, 0.05)',
            animation: 'float 15s ease-in-out infinite',
          }}
        />
        <div 
          className="sky-zone"
          style={{
            width: '250px',
            height: '250px',
            bottom: '15%',
            right: '15%',
            backgroundColor: 'rgba(34, 197, 94, 0.05)',
            animation: 'floatReverse 12s ease-in-out infinite',
          }}
        />
        <div 
          className="sky-zone"
          style={{
            width: '200px',
            height: '200px',
            top: '50%',
            left: '60%',
            backgroundColor: 'rgba(59, 130, 246, 0.05)',
            animation: 'float 18s ease-in-out infinite',
            animationDelay: '3s',
          }}
        />
      </div>
      
      {/* Main content */}
      <div className="relative max-w-4xl mx-auto px-4 py-10">
        <div className="mb-6">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-green-300 drop-shadow-[0_0_24px_rgba(134,239,172,0.6)]">
            Flappy Bird
          </h2>
          <p className="mt-2 text-sm md:text-base text-slate-300">
            Press Space or click to flap. Fly through gaps in the pipes and
            don&apos;t hit anything.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] items-start">
          {/* game panel */}
          <div className="rounded-2xl bg-slate-900/70 border border-slate-800/80 shadow-[0_20px_50px_rgba(15,23,42,0.9)] backdrop-blur-sm px-4 py-5 relative overflow-hidden">
            {/* Sky effect at top */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-green-500 to-transparent opacity-50"></div>
            
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">
                Arcade
              </span>
              <span className="text-xs text-slate-400">
                Space/click · Endless
              </span>
            </div>

            <div id="game-root" className="flex flex-col items-center">
              <canvas
                id="flappy-canvas"
                width="320"
                height="360"
                className="rounded-xl bg-slate-950 border border-slate-800 shadow-[0_16px_40px_rgba(15,23,42,1)]"
              ></canvas>

              <div
                id="flappy-status"
                className="feedback mt-3 text-sm text-slate-200 text-center"
              >
                Press Space or click to start.
              </div>
            </div>
          </div>

          {/* leaderboard */}
          <div className="rounded-2xl bg-slate-900/70 border border-slate-800/80 shadow-[0_18px_40px_rgba(15,23,42,0.9)] backdrop-blur-sm px-4 py-5 relative overflow-hidden">
            {/* Sky effect at top */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-green-500 to-transparent opacity-50"></div>
            
            <h3 className="text-lg font-semibold text-slate-50 mb-2">
              Top Flappy Scores
            </h3>
            <p className="text-xs text-slate-400 mb-3">
              Scores are the number of pipes passed in a single run.
            </p>

            <div className="max-h-72 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700/80 scrollbar-track-slate-900/80">
              <table
                id="flappy-leaderboard"
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
              <span className="text-green-400 mr-2">🐦</span>
              <span>Press Space or click to flap wings</span>
            </div>
            <div className="flex items-start">
              <span className="text-green-400 mr-2">🚧</span>
              <span>Navigate through pipe gaps</span>
            </div>
            <div className="flex items-start">
              <span className="text-green-400 mr-2">💥</span>
              <span>Avoid hitting pipes or ground</span>
            </div>
            <div className="flex items-start">
              <span className="text-green-400 mr-2">🏆</span>
              <span>Score points for each pipe passed</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}