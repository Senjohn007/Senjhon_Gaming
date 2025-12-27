// src/pages/AsteroidsPage.jsx
import React, { useEffect, useState, useCallback } from "react";
import { initAsteroids } from "../games/asteroids";
import { initUsernameUI } from "../games/username";

export default function AsteroidsPage() {
  const [scores, setScores] = useState([]);

  const loadLeaderboard = useCallback(() => {
    fetch(
      "http://localhost:5000/api/scores/leaderboard?game=asteroids&limit=10"
    )
      .then((res) => res.json())
      .then((rows) => setScores(rows))
      .catch((err) =>
        console.error("Error loading asteroids leaderboard (React):", err)
      );
  }, []);

  useEffect(() => {
    let isMounted = true;

    // ensure window.getPlayerInfo is available
    initUsernameUI();

    // background / animation CSS
    const styleId = "asteroids-animations";
    if (!document.getElementById(styleId)) {
      const style = document.createElement("style");
      style.id = styleId;
      style.textContent = `
        @keyframes float {0%,100%{transform:translateY(0) rotate(0deg);}50%{transform:translateY(-20px) rotate(5deg);}}
        @keyframes floatReverse {0%,100%{transform:translateY(0) rotate(0deg);}50%{transform:translateY(-15px) rotate(-5deg);}}
        @keyframes gradientShift {0%{background-position:0% 50%;}50%{background-position:100% 50%;}100%{background-position:0% 50%;}}
        @keyframes twinkle {0%,100%{opacity:0.2;}50%{opacity:1;}}
        @keyframes shootingStar {0%{transform:translateX(-100px) translateY(-100px) rotate(45deg);opacity:1;}70%{opacity:1;}100%{transform:translateX(1000px) translateY(1000px) rotate(45deg);opacity:0;}}
        @keyframes asteroidFloat {0%{transform:translateX(-100px) translateY(0) rotate(0deg);}100%{transform:translateX(calc(100vw + 100px)) translateY(50px) rotate(360deg);}}
        @keyframes planetRotate {0%{transform:rotate(0deg);}100%{transform:rotate(360deg);}}
        @keyframes nebulaPulse {0%,100%{opacity:0.1;transform:scale(1);}50%{opacity:0.2;transform:scale(1.05);}}
        @keyframes spaceshipFloat {0%{transform:translateX(0) translateY(0) rotate(0deg);}25%{transform:translateX(30px) translateY(-10px) rotate(5deg);}50%{transform:translateX(0) translateY(-20px) rotate(0deg);}75%{transform:translateX(-30px) translateY(-10px) rotate(-5deg);}100%{transform:translateX(0) translateY(0) rotate(0deg);}}
        .animated-bg{position:fixed;top:0;left:0;width:100%;height:100%;z-index:-1;overflow:hidden;background:linear-gradient(-45deg,#0f172a,#020617,#0f172a,#1e1b4b);background-size:400% 400%;animation:gradientShift 20s ease infinite;}
        .star{position:absolute;background:white;border-radius:50%;animation:twinkle 3s ease-in-out infinite;}
        .shooting-star{position:absolute;width:2px;height:2px;background:white;border-radius:50%;animation:shootingStar 3s linear infinite;}
        .shooting-star::after{content:'';position:absolute;top:0;left:0;width:100px;height:1px;background:linear-gradient(to left,transparent,rgba(255,255,255,0.8));transform:translateX(-2px);}
        .asteroid{position:absolute;background:linear-gradient(135deg,#475569,#334155);border-radius:40% 60% 50% 50%;animation:asteroidFloat 30s linear infinite;}
        .planet{position:absolute;border-radius:50%;animation:planetRotate 60s linear infinite;}
        .planet::before{content:'';position:absolute;top:10%;left:10%;width:80%;height:80%;border-radius:50%;background:radial-gradient(circle at 30% 30%,rgba(255,255,255,0.2),transparent);}
        .planet::after{content:'';position:absolute;top:-10%;left:50%;width:120%;height:20%;border-radius:50%;background:rgba(255,255,255,0.05);transform:rotateX(60deg);}
        .nebula{position:absolute;border-radius:50%;filter:blur(60px);animation:nebulaPulse 10s ease-in-out infinite;}
        .spaceship{position:absolute;opacity:0.15;animation:spaceshipFloat 15s ease-in-out infinite;}
        .spaceship::before{content:'';position:absolute;width:30px;height:15px;background:linear-gradient(to right,#64748b,#94a3b8);border-radius:50% 10% 10% 50%;}
        .spaceship::after{content:'';position:absolute;width:15px;height:5px;background:#3b82f6;top:5px;left:-10px;border-radius:50% 0 0 50%;}
        .space-debris{position:absolute;width:3px;height:3px;background:rgba(148,163,184,0.5);border-radius:50%;animation:float 10s ease-in-out infinite;}
      `;
      document.head.appendChild(style);
    }

    loadLeaderboard();
    initAsteroids?.({
      onScoreSaved: () => {
        if (!isMounted) return;
        loadLeaderboard();
      },
    });

    return () => {
      isMounted = false;
    };
  }, [loadLeaderboard]);

  return (
    <main className="min-h-[calc(100vh-80px)] relative overflow-hidden">
      {/* Animated Background */}
      <div className="animated-bg">
        {[...Array(100)].map((_, i) => (
          <div
            key={`star-${i}`}
            className="star"
            style={{
              width: `${Math.random() * 3}px`,
              height: `${Math.random() * 3}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${Math.random() * 3 + 2}s`,
            }}
          />
        ))}

        {[...Array(5)].map((_, i) => (
          <div
            key={`shooting-star-${i}`}
            className="shooting-star"
            style={{
              top: `${Math.random() * 50}%`,
              left: `${Math.random() * 50}%`,
              animationDelay: `${Math.random() * 10}s`,
              animationDuration: `${Math.random() * 2 + 3}s`,
            }}
          />
        ))}

        {[...Array(6)].map((_, i) => (
          <div
            key={`asteroid-${i}`}
            className="asteroid"
            style={{
              width: `${Math.random() * 30 + 20}px`,
              height: `${Math.random() * 30 + 20}px`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 30}s`,
              animationDuration: `${Math.random() * 20 + 30}s`,
            }}
          />
        ))}

        <div
          className="planet"
          style={{
            width: "80px",
            height: "80px",
            top: "15%",
            right: "10%",
            background: "linear-gradient(135deg,#7c3aed,#4c1d95)",
          }}
        />
        <div
          className="planet"
          style={{
            width: "60px",
            height: "60px",
            bottom: "20%",
            left: "15%",
            background: "linear-gradient(135deg,#dc2626,#7f1d1d)",
            animationDuration: "80s",
          }}
        />

        <div
          className="nebula"
          style={{
            width: "400px",
            height: "400px",
            top: "5%",
            left: "30%",
            background:
              "radial-gradient(circle,rgba(147,51,234,0.1) 0%,transparent 70%)",
          }}
        />
        <div
          className="nebula"
          style={{
            width: "300px",
            height: "300px",
            bottom: "10%",
            right: "20%",
            background:
              "radial-gradient(circle,rgba(59,130,246,0.1) 0%,transparent 70%)",
            animationDelay: "5s",
          }}
        />

        {[...Array(3)].map((_, i) => (
          <div
            key={`spaceship-${i}`}
            className="spaceship"
            style={{
              top: `${20 + i * 25}%`,
              left: `${10 + i * 30}%`,
              animationDelay: `${i * 5}s`,
            }}
          />
        ))}

        {[...Array(20)].map((_, i) => (
          <div
            key={`debris-${i}`}
            className="space-debris"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${Math.random() * 5 + 10}s`,
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <div className="relative max-w-4xl mx-auto px-4 py-10">
        <div className="mb-6">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-sky-300 drop-shadow-[0_0_24px_rgba(56,189,248,0.6)]">
            Asteroids
          </h2>
          <p className="mt-2 text-sm md:text-base text-slate-300">
            Pilot your ship, dodge asteroids, and shoot them down. Arrow keys to
            turn/thrust, Space to shoot.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] items-start">
          {/* game panel */}
          <div className="rounded-2xl bg-slate-900/70 border border-slate-800/80 shadow-[0_20px_50px_rgba(15,23,42,0.9)] backdrop-blur-sm px-4 py-5">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">
                Space
              </span>
              <span className="text-xs text-slate-400">Arrows · Spacebar</span>
            </div>

            <div id="game-root" className="flex flex-col items-center">
              <canvas
                id="asteroids-canvas"
                width="360"
                height="320"
                className="rounded-xl bg-slate-950 border border-slate-800 shadow-[0_16px_40px_rgba(15,23,42,1)]"
              />
              <div
                id="asteroids-status"
                className="feedback mt-3 text-sm text-slate-200 text-center"
              >
                Press Enter to start. Arrows to move, Space to shoot.
              </div>
            </div>
          </div>

          {/* leaderboard – React controls rows */}
          <div className="rounded-2xl bg-slate-900/70 border border-slate-800/80 shadow-[0_18px_40px_rgba(15,23,42,0.9)] backdrop-blur-sm px-4 py-5">
            <h3 className="text-lg font-semibold text-slate-50 mb-2">
              Top Asteroids Scores
            </h3>
            <p className="text-xs text-slate-400 mb-3">
              Scores are based on destroyed asteroids in a single run.
            </p>

            <div className="max-h-72 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700/80 scrollbar-track-slate-900/80">
              <table
                id="asteroids-leaderboard"
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
      </div>
    </main>
  );
}
