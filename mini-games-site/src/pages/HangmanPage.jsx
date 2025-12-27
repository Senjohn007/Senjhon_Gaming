// src/pages/HangmanPage.jsx
import React, { useEffect } from "react";
import { initHangman } from "../games/hangman";

export default function HangmanPage() {
  useEffect(() => {
    // Add custom styles for animations
    const styleId = "hangman-animations";
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
        
        @keyframes pageTurn {
          0% { transform: rotateY(0deg); }
          50% { transform: rotateY(90deg); }
          100% { transform: rotateY(0deg); }
        }
        
        @keyframes inkDrop {
          0% { transform: translateY(0) scale(1); opacity: 0.7; }
          50% { transform: translateY(20px) scale(1.2); opacity: 0.5; }
          100% { transform: translateY(40px) scale(0.8); opacity: 0; }
        }
        
        @keyframes quillWrite {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-10deg); }
          75% { transform: rotate(10deg); }
        }
        
        @keyframes scrollUnroll {
          0% { transform: scaleY(0.1); opacity: 0.5; }
          50% { transform: scaleY(1); opacity: 0.7; }
          100% { transform: scaleY(0.1); opacity: 0.5; }
        }
        
        @keyframes magnify {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
        
        @keyframes wordFade {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.8; }
        }
        
        .animated-bg {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: -1;
          overflow: hidden;
          background: linear-gradient(-45deg, #1e1b4b, #312e81, #1e1b4b, #4c1d95);
          background-size: 400% 400%;
          animation: gradientShift 15s ease infinite;
        }
        
        .floating-letter {
          position: absolute;
          font-family: serif;
          color: rgba(196, 181, 253, 0.2);
          animation: float 15s ease-in-out infinite;
        }
        
        .book {
          position: absolute;
          background: linear-gradient(to right, #7c2d12, #92400e);
          border-radius: 2px;
          box-shadow: 0 0 5px rgba(0,0,0,0.3);
          animation: float 20s ease-in-out infinite;
        }
        
        .book::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(to right, #fef3c7, #fde68a);
          border-radius: 2px;
          transform-origin: left center;
          animation: pageTurn 8s ease-in-out infinite;
        }
        
        .ink-drop {
          position: absolute;
          width: 10px;
          height: 15px;
          background: linear-gradient(to bottom, rgba(55, 48, 163, 0.7), rgba(55, 48, 163, 0.3));
          border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
          animation: inkDrop 5s ease-in-out infinite;
        }
        
        .quill {
          position: absolute;
          width: 30px;
          height: 3px;
          background: rgba(243, 244, 246, 0.3);
          border-radius: 1px;
          animation: quillWrite 4s ease-in-out infinite;
        }
        
        .quill::before {
          content: '';
          position: absolute;
          width: 0;
          height: 0;
          border-left: 5px solid transparent;
          border-right: 5px solid transparent;
          border-top: 10px solid rgba(243, 244, 246, 0.3);
          right: -5px;
          top: -4px;
        }
        
        .scroll {
          position: absolute;
          width: 60px;
          height: 80px;
          background: linear-gradient(to bottom, rgba(251, 191, 36, 0.1), rgba(251, 191, 36, 0.2));
          border-radius: 5px;
          box-shadow: 0 0 10px rgba(0,0,0,0.1);
          animation: scrollUnroll 10s ease-in-out infinite;
          transform-origin: top center;
        }
        
        .scroll::before, .scroll::after {
          content: '';
          position: absolute;
          width: 70px;
          height: 10px;
          background: rgba(146, 64, 14, 0.3);
          left: -5px;
          border-radius: 5px;
        }
        
        .scroll::before {
          top: -5px;
        }
        
        .scroll::after {
          bottom: -5px;
        }
        
        .magnifying-glass {
          position: absolute;
          width: 40px;
          height: 40px;
          border: 2px solid rgba(196, 181, 253, 0.3);
          border-radius: 50%;
          animation: magnify 6s ease-in-out infinite;
        }
        
        .magnifying-glass::before {
          content: '';
          position: absolute;
          width: 15px;
          height: 3px;
          background: rgba(196, 181, 253, 0.3);
          bottom: -8px;
          right: -8px;
          transform: rotate(45deg);
        }
        
        .word-fragment {
          position: absolute;
          font-family: monospace;
          color: rgba(196, 181, 253, 0.2);
          animation: wordFade 8s ease-in-out infinite;
        }
        
        .dictionary-page {
          position: absolute;
          width: 100px;
          height: 130px;
          background: linear-gradient(to right, rgba(254, 243, 199, 0.1), rgba(254, 243, 199, 0.2));
          border-radius: 2px;
          box-shadow: 0 0 5px rgba(0,0,0,0.1);
          animation: float 25s ease-in-out infinite;
        }
        
        .dictionary-page::before {
          content: '';
          position: absolute;
          top: 10px;
          left: 10px;
          right: 10px;
          height: 2px;
          background: rgba(120, 53, 15, 0.2);
        }
        
        .dictionary-page::after {
          content: '';
          position: absolute;
          top: 20px;
          left: 10px;
          right: 10px;
          height: 1px;
          background: rgba(120, 53, 15, 0.1);
        }
        
        .library-zone {
          position: absolute;
          border-radius: 50%;
          filter: blur(40px);
        }
      `;
      document.head.appendChild(style);
    }

    if (typeof initHangman === "function") {
      initHangman();
    }
  }, []);

  return (
    <main className="min-h-[calc(100vh-80px)] relative overflow-hidden">
      {/* Animated Background */}
      <div className="animated-bg">
        {/* Floating Letters */}
        {[...Array(40)].map((_, i) => (
          <div
            key={`letter-${i}`}
            className="floating-letter"
            style={{
              fontSize: `${Math.random() * 20 + 15}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 10}s`,
              animationDuration: `${Math.random() * 10 + 15}s`,
            }}
          >
            {String.fromCharCode(65 + Math.floor(Math.random() * 26))}
          </div>
        ))}
        
        {/* Books with page turning effect */}
        {[...Array(6)].map((_, i) => (
          <div
            key={`book-${i}`}
            className="book"
            style={{
              width: `${Math.random() * 30 + 40}px`,
              height: `${Math.random() * 40 + 60}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 15}s`,
              animationDuration: `${Math.random() * 10 + 20}s`,
            }}
          />
        ))}
        
        {/* Ink Drops */}
        {[...Array(15)].map((_, i) => (
          <div
            key={`ink-${i}`}
            className="ink-drop"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${Math.random() * 3 + 5}s`,
            }}
          />
        ))}
        
        {/* Quill Pens */}
        {[...Array(8)].map((_, i) => (
          <div
            key={`quill-${i}`}
            className="quill"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              transform: `rotate(${Math.random() * 360}deg)`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
        
        {/* Scrolls */}
        {[...Array(4)].map((_, i) => (
          <div
            key={`scroll-${i}`}
            className="scroll"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 10}s`,
              animationDuration: `${Math.random() * 5 + 10}s`,
            }}
          />
        ))}
        
        {/* Magnifying Glasses */}
        {[...Array(5)].map((_, i) => (
          <div
            key={`magnify-${i}`}
            className="magnifying-glass"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 6}s`,
              animationDuration: `${Math.random() * 3 + 6}s`,
            }}
          />
        ))}
        
        {/* Word Fragments */}
        {[...Array(12)].map((_, i) => (
          <div
            key={`fragment-${i}`}
            className="word-fragment"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              fontSize: `${Math.random() * 10 + 10}px`,
              animationDelay: `${Math.random() * 8}s`,
            }}
          >
            {['ING', 'TION', 'ABLE', 'MENT', 'NESS', 'ITY'][Math.floor(Math.random() * 6)]}
          </div>
        ))}
        
        {/* Dictionary Pages */}
        {[...Array(5)].map((_, i) => (
          <div
            key={`dict-${i}`}
            className="dictionary-page"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              transform: `rotate(${Math.random() * 20 - 10}deg)`,
              animationDelay: `${Math.random() * 15}s`,
              animationDuration: `${Math.random() * 10 + 25}s`,
            }}
          />
        ))}
        
        {/* Library Zones */}
        <div 
          className="library-zone"
          style={{
            width: '300px',
            height: '300px',
            top: '10%',
            left: '10%',
            backgroundColor: 'rgba(139, 92, 246, 0.05)',
            animation: 'float 15s ease-in-out infinite',
          }}
        />
        <div 
          className="library-zone"
          style={{
            width: '250px',
            height: '250px',
            bottom: '15%',
            right: '15%',
            backgroundColor: 'rgba(251, 191, 36, 0.05)',
            animation: 'floatReverse 12s ease-in-out infinite',
          }}
        />
        <div 
          className="library-zone"
          style={{
            width: '200px',
            height: '200px',
            top: '50%',
            left: '60%',
            backgroundColor: 'rgba(196, 181, 253, 0.05)',
            animation: 'float 18s ease-in-out infinite',
            animationDelay: '3s',
          }}
        />
      </div>
      
      {/* Main content */}
      <div className="relative max-w-4xl mx-auto px-4 py-10">
        {/* title + description */}
        <div className="mb-6">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-purple-300 drop-shadow-[0_0_24px_rgba(196,181,253,0.6)]">
            Hangman
          </h2>
          <p className="mt-2 text-sm md:text-base text-slate-300">
            Guess the hidden word one letter at a time. You have limited wrong guesses.
          </p>
        </div>

        {/* card */}
        <div className="grid gap-8 md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] items-start">
          {/* game panel */}
          <div className="rounded-2xl bg-slate-900/70 border border-slate-800/80 shadow-[0_20px_50px_rgba(15,23,42,0.9)] backdrop-blur-sm px-4 py-5 relative overflow-hidden">
            {/* Library effect at top */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-50"></div>
            
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">
                Word Game
              </span>
              <span className="text-xs text-slate-400">
                Type letters · Limited lives
              </span>
            </div>

            <div id="game-root">
              <div
                id="hangman-word"
                className="feedback mt-2 text-center font-mono text-xl tracking-[0.25em]"
              ></div>

              <div
                id="hangman-info"
                className="feedback mt-3 text-sm text-slate-300 text-center"
              ></div>

              <div className="mt-4 flex gap-2 justify-center">
                <input
                  type="text"
                  id="hangman-input"
                  maxLength={1}
                  placeholder="Enter a letter"
                  className="w-32 px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
                <button
                  id="hangman-guess"
                  className="px-4 py-2 rounded-lg bg-purple-500 hover:bg-purple-400 active:bg-purple-600 text-sm font-semibold text-slate-900 shadow-[0_10px_25px_rgba(196,181,253,0.45)] transition-colors"
                >
                  Guess letter
                </button>
              </div>

              <div
                id="hangman-wrong"
                className="feedback mt-3 text-sm text-rose-400 text-center min-h-[1.25rem]"
              ></div>

              <div className="mt-4 flex justify-center">
                <button
                  id="hangman-reset"
                  className="px-4 py-2 rounded-lg border border-slate-600 text-sm font-medium text-slate-200 hover:bg-slate-800/80 transition-colors"
                >
                  New Word
                </button>
              </div>
            </div>
          </div>

          {/* leaderboard */}
          <div className="rounded-2xl bg-slate-900/70 border border-slate-800/80 shadow-[0_18px_40px_rgba(15,23,42,0.9)] backdrop-blur-sm px-4 py-5 relative overflow-hidden">
            {/* Library effect at top */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-50"></div>
            
            <h3 className="text-lg font-semibold text-slate-50 mb-2">
              Top Hangman Scores
            </h3>
            <p className="text-xs text-slate-400 mb-3">
              Scores are ordered by correctly guessed words in a single game.
            </p>

            <div className="max-h-72 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700/80 scrollbar-track-slate-900/80">
              <table
                id="hangman-leaderboard"
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
              <span className="text-purple-400 mr-2">🔤</span>
              <span>Enter one letter at a time</span>
            </div>
            <div className="flex items-start">
              <span className="text-purple-400 mr-2">❓</span>
              <span>Guess the hidden word</span>
            </div>
            <div className="flex items-start">
              <span className="text-purple-400 mr-2">⚠️</span>
              <span>Wrong guesses add to the hangman</span>
            </div>
            <div className="flex items-start">
              <span className="text-purple-400 mr-2">🏆</span>
              <span>Score points for each correct word</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}