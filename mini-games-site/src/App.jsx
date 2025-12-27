// src/App.jsx
import React, { useEffect, useState } from "react";
import { Routes, Route, Link, useLocation } from "react-router-dom";

// game pages
import HomePage from "./pages/HomePage.jsx";
import RollDicePage from "./pages/RollDicePage.jsx";
import HangmanPage from "./pages/HangmanPage.jsx";
import SnakePage from "./pages/SnakePage.jsx";
import TypingSpeedPage from "./pages/TypingSpeedPage.jsx";
import RpsPage from "./pages/RpsPage.jsx";
import TicTacToePage from "./pages/TicTacToePage.jsx";
import WackAMolePage from "./pages/WackAMolePage.jsx";
import BreakoutPage from "./pages/BreakoutPage.jsx";
import MinesweeperPage from "./pages/MinesweeperPage.jsx";
import BattleshipPage from "./pages/BattleshipPage.jsx";
import FlappyPage from "./pages/FlappyPage.jsx";
import AsteroidsPage from "./pages/AsteroidsPage.jsx";

// user authentication / profile pages
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";

// auth helpers
import { getCurrentUser, logout } from "./auth";

// global background audio (uses SettingsContext)
import GlobalAudio from "./components/GlobalAudio.jsx";
import SettingsDrawer from "./components/SettingsDrawer.jsx";

// animated background layer
import AnimatedBackground from "./components/GeometricBackground.jsx";

// settings context
import { SettingsProvider } from "./context/SettingsContext.jsx";

function AppShell() {
  const [user, setUser] = useState(null);
  const location = useLocation();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // routes that should show the animated background
  const animatedPaths = ["/", "/login", "/register", "/profile"];
  const shouldShowAnimation = animatedPaths.includes(location.pathname);

  useEffect(() => {
    const timer = setTimeout(() => {
      setUser(getCurrentUser());
      setIsLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  function handleLogout() {
    logout();
    setUser(null);
    window.location.href = "/";
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
          <p className="mt-4 text-slate-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-transparent text-slate-100 relative">
      {/* animated background, behind home, login , register, profile */}
      {shouldShowAnimation && <AnimatedBackground />}

      {/* global music for whole app */}
      <GlobalAudio />

      {/* header */}
      <header className="relative z-20 border-b border-purple-500/30 bg-gradient-to-r from-slate-950 via-purple-950/90 to-slate-950 backdrop-blur-md shadow-2xl shadow-purple-900/20">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-purple-950/10"></div>

        {/* Gaming decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-0 w-32 h-32 bg-purple-600/10 rounded-full filter blur-3xl"></div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-pink-600/10 rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-64 h-1 bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 py-4 md:py-5">
          {/* top row: brand + auth */}
          <div className="flex items-center justify-between gap-4">
            {/* brand with gaming logo */}
            <div className="flex items-center gap-3 shrink-0">
              <div className="relative">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center transform rotate-12 shadow-lg shadow-purple-600/40 animate-pulse">
                  <span className="text-white font-bold text-xl md:text-2xl transform -rotate-12">S</span>
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-pink-500 rounded-full animate-pulse"></div>
                <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-purple-500 rounded-full animate-pulse"></div>
              </div>
              <div className="flex flex-col">
                <h1 className="text-2xl md:text-3xl font-black tracking-tight bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent uppercase">
                  Senjhon Gaming
                </h1>
                <span className="text-xs md:text-sm font-medium text-purple-300/80">
                  mini games hub
                </span>
              </div>
            </div>

            {/* auth + profile + settings */}
            <div className="flex items-center gap-2 md:gap-3 text-sm md:text-base shrink-0">
              {user ? (
                <>
                  <div className="hidden md:block text-right">
                    <span className="block text-xs text-purple-300/60 mb-1">Player</span>
                    <span className="text-base md:text-lg font-bold text-purple-300">{user.name}</span>
                  </div>

                  {/* Profile button with icon */}
                  <Link
                    to="/profile"
                    className="p-2 rounded-full bg-gradient-to-r from-purple-900/80 to-pink-900/80 border border-purple-700/50 text-purple-200 shadow-lg shadow-purple-900/30 hover:shadow-purple-700/50 transition-all duration-300 hover:scale-105"
                    title="Profile"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="px-3 py-1.5 md:px-4 rounded-full bg-gradient-to-r from-red-900/80 to-pink-900/80 border border-red-700/50 text-red-200 font-medium shadow-lg shadow-red-900/30 hover:shadow-red-700/50 transition-all duration-300 hover:scale-105"
                  >
                    Logout
                  </button>

                  <button
                    onClick={() => setSettingsOpen(true)}
                    className="p-2 rounded-full bg-gradient-to-r from-indigo-900/80 to-purple-900/80 border border-indigo-700/50 text-indigo-200 shadow-lg shadow-indigo-900/30 hover:shadow-indigo-700/50 transition-all duration-300 hover:scale-105"
                    title="Settings"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                    </svg>
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="px-4 py-2 rounded-full bg-gradient-to-r from-slate-800 to-slate-900 border border-slate-700 text-slate-200 font-medium hover:from-slate-700 hover:to-slate-800 transition-all duration-300 hover:scale-105"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="px-4 py-2 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium shadow-lg shadow-purple-600/30 hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105"
                  >
                    Join Now
                  </Link>
                </>
              )}

              {/* Mobile menu toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg bg-slate-800/80 text-slate-200 hover:bg-slate-700/80 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {mobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>

          {/* Navigation menu */}
          <nav
            className={`mt-4 transition-all duration-300 overflow-hidden ${
              mobileMenuOpen ? "max-h-96" : "max-h-0 md:max-h-96"
            }`}
          >
            <div className="flex flex-wrap gap-2 md:gap-3 text-xs md:text-sm">
              <Link
                to="/"
                className="px-3 py-1.5 rounded-full bg-slate-800/60 hover:bg-gradient-to-r hover:from-purple-800/60 hover:to-pink-800/60 text-slate-300 hover:text-white transition-all duration-300 hover:scale-105"
              >
                Home
              </Link>
              <Link
                to="/roll-dice"
                className="px-3 py-1.5 rounded-full bg-slate-800/60 hover:bg-gradient-to-r hover:from-violet-800/60 hover:to-purple-800/60 text-slate-300 hover:text-white transition-all duration-300 hover:scale-105"
              >
                Roll Dice
              </Link>
              <Link
                to="/rps"
                className="px-3 py-1.5 rounded-full bg-slate-800/60 hover:bg-gradient-to-r hover:from-emerald-800/60 hover:to-green-800/60 text-slate-300 hover:text-white transition-all duration-300 hover:scale-105"
              >
                RPS
              </Link>
              <Link
                to="/hangman"
                className="px-3 py-1.5 rounded-full bg-slate-800/60 hover:bg-gradient-to-r hover:from-rose-800/60 hover:to-red-800/60 text-slate-300 hover:text-white transition-all duration-300 hover:scale-105"
              >
                Hangman
              </Link>
              <Link
                to="/snake"
                className="px-3 py-1.5 rounded-full bg-slate-800/60 hover:bg-gradient-to-r hover:from-lime-800/60 hover:to-green-800/60 text-slate-300 hover:text-white transition-all duration-300 hover:scale-105"
              >
                Snake
              </Link>
              <Link
                to="/breakout"
                className="px-3 py-1.5 rounded-full bg-slate-800/60 hover:bg-gradient-to-r hover:from-sky-800/60 hover:to-blue-800/60 text-slate-300 hover:text-white transition-all duration-300 hover:scale-105"
              >
                Breakout
              </Link>
              <Link
                to="/typing-speed"
                className="px-3 py-1.5 rounded-full bg-slate-800/60 hover:bg-gradient-to-r hover:from-fuchsia-800/60 hover:to-purple-800/60 text-slate-300 hover:text-white transition-all duration-300 hover:scale-105"
              >
                Typing
              </Link>
              <Link
                to="/tic-tac-toe"
                className="px-3 py-1.5 rounded-full bg-slate-800/60 hover:bg-gradient-to-r hover:from-amber-800/60 hover:to-yellow-800/60 text-slate-300 hover:text-white transition-all duration-300 hover:scale-105"
              >
                Tic Tac Toe
              </Link>
              <Link
                to="/wack-a-mole"
                className="px-3 py-1.5 rounded-full bg-slate-800/60 hover:bg-gradient-to-r hover:from-red-800/60 hover:to-orange-800/60 text-slate-300 hover:text-white transition-all duration-300 hover:scale-105"
              >
                Whack-a-Mole
              </Link>
              <Link
                to="/minesweeper"
                className="px-3 py-1.5 rounded-full bg-slate-800/60 hover:bg-gradient-to-r hover:from-indigo-800/60 hover:to-blue-800/60 text-slate-300 hover:text-white transition-all duration-300 hover:scale-105"
              >
                Minesweeper
              </Link>
              <Link
                to="/battleship"
                className="px-3 py-1.5 rounded-full bg-slate-800/60 hover:bg-gradient-to-r hover:from-cyan-800/60 hover:to-teal-800/60 text-slate-300 hover:text-white transition-all duration-300 hover:scale-105"
              >
                Battleship
              </Link>
              <Link
                to="/flappy"
                className="px-3 py-1.5 rounded-full bg-slate-800/60 hover:bg-gradient-to-r hover:from-green-800/60 hover:to-emerald-800/60 text-slate-300 hover:text-white transition-all duration-300 hover:scale-105"
              >
                Flappy
              </Link>
              <Link
                to="/asteroids"
                className="px-3 py-1.5 rounded-full bg-slate-800/60 hover:bg-gradient-to-r hover:from-orange-800/60 hover:to-red-800/60 text-slate-300 hover:text-white transition-all duration-300 hover:scale-105"
              >
                Asteroids
              </Link>
            </div>
          </nav>
        </div>
      </header>

      {/* main content */}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/roll-dice" element={<RollDicePage />} />
          <Route path="/rps" element={<RpsPage />} />
          <Route path="/hangman" element={<HangmanPage />} />
          <Route path="/snake" element={<SnakePage />} />
          <Route path="/breakout" element={<BreakoutPage />} />
          <Route path="/typing-speed" element={<TypingSpeedPage />} />
          <Route path="/tic-tac-toe" element={<TicTacToePage />} />
          <Route path="/wack-a-mole" element={<WackAMolePage />} />
          <Route path="/minesweeper" element={<MinesweeperPage />} />
          <Route path="/battleship" element={<BattleshipPage />} />
          <Route path="/flappy" element={<FlappyPage />} />
          <Route path="/asteroids" element={<AsteroidsPage />} />

          {/* auth + profile routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </main>

      {/* footer */}
      <footer className="relative border-t border-purple-500/30 bg-gradient-to-r from-slate-950 via-purple-950/50 to-slate-950">
        <div className="absolute inset-0 bg-gradient-to-t from-purple-950/20 to-transparent"></div>

        {/* Gaming decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-purple-600/10 rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-40 h-40 bg-pink-600/10 rounded-full filter blur-3xl"></div>
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-64 h-1 bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* About section */}
            <div className="flex flex-col gap-3">
              <h3 className="text-lg font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent uppercase tracking-wider">About</h3>
              <p className="text-sm text-slate-400">
                Senjhon Gaming is your ultimate destination for mini-games. Challenge yourself with a variety of games and compete with players worldwide.
              </p>
              <div className="flex gap-2 mt-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center animate-pulse">
                  <span className="text-white font-bold">S</span>
                </div>
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center animate-pulse">
                  <span className="text-white font-bold">G</span>
                </div>
              </div>
            </div>

            {/* Quick links */}
            <div className="flex flex-col gap-3">
              <h3 className="text-lg font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent uppercase tracking-wider">Quick Links</h3>
              <div className="flex flex-wrap gap-2 text-sm">
                <Link to="/" className="text-slate-400 hover:text-purple-400 transition-colors">Home</Link>
                <span className="text-slate-600">•</span>
                <Link to="/profile" className="text-slate-400 hover:text-purple-400 transition-colors">Profile</Link>
                <span className="text-slate-600">•</span>
                <Link to="/login" className="text-slate-400 hover:text-purple-400 transition-colors">Login</Link>
                <span className="text-slate-600">•</span>
                <Link to="/register" className="text-slate-400 hover:text-purple-400 transition-colors">Register</Link>
              </div>
            </div>

            {/* Tech stack */}
            <div className="flex flex-col gap-3">
              <h3 className="text-lg font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent uppercase tracking-wider">Powered By</h3>
              <div className="flex flex-wrap gap-2">
                <span className="px-2 py-1 text-xs rounded-full bg-slate-800/60 text-slate-300">React</span>
                <span className="px-2 py-1 text-xs rounded-full bg-slate-800/60 text-slate-300">Vite</span>
                <span className="px-2 py-1 text-xs rounded-full bg-slate-800/60 text-slate-300">Tailwind</span>
                <span className="px-2 py-1 text-xs rounded-full bg-slate-800/60 text-slate-300">MongoDB</span>
              </div>
            </div>
          </div>

          {/* Bottom copyright */}
          <div className="border-t border-slate-800/50 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-slate-400">
              © {new Date().getFullYear()} Senjhon Gaming. All rights reserved.
            </p>

            {/* Social links */}
            <div className="flex gap-3">
              <a href="#" className="w-8 h-8 rounded-full bg-slate-800/60 flex items-center justify-center text-slate-400 hover:bg-purple-800/60 hover:text-purple-300 transition-all hover:scale-110">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-slate-800/60 flex items-center justify-center text-slate-400 hover:bg-purple-800/60 hover:text-purple-300 transition-all hover:scale-110">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-slate-800/60 flex items-center justify-center text-slate-400 hover:bg-purple-800/60 hover:text-purple-300 transition-all hover:scale-110">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>

      <SettingsDrawer
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <SettingsProvider>
      <AppShell />
    </SettingsProvider>
  );
}
