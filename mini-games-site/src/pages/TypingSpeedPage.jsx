// src/pages/TypingSpeedPage.jsx
import React, { useEffect } from "react";
import { initTypingSpeed } from "../games/typing-speed";

export default function TypingSpeedPage() {
  useEffect(() => {
    if (typeof initTypingSpeed === "function") {
      initTypingSpeed();
    }
  }, []);

  return (
    <main className="min-h-[calc(100vh-80px)] bg-gradient-to-b from-slate-950 via-slate-900 to-black text-slate-100">
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
            </div>

            {/* paragraph */}
            <p
              id="ts-sentence"
              className="min-h-[72px] text-sm md:text-base text-slate-100 bg-slate-900/60 border border-slate-800/80 rounded-xl px-3 py-3 leading-relaxed"
            ></p>

            {/* textarea */}
            <textarea
              id="ts-input"
              rows={5}
              className="mt-4 w-full rounded-xl border border-slate-800 bg-slate-950/80 px-3 py-2 text-sm md:text-base text-slate-100 shadow-[0_14px_32px_rgba(15,23,42,0.9)] focus:outline-none focus:ring-2 focus:ring-fuchsia-500/70 focus:border-fuchsia-400 disabled:opacity-60 disabled:cursor-not-allowed"
              disabled
            />

            {/* controls */}
            <div className="mt-4 flex flex-wrap gap-3">
              <button
                id="ts-start"
                type="button"
                className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-fuchsia-500 to-pink-500 px-4 py-2 text-sm font-semibold text-slate-50 shadow-[0_12px_30px_rgba(217,70,239,0.7)] hover:from-fuchsia-400 hover:to-pink-400 transition-colors"
              >
                Start
              </button>
              <button
                id="ts-done"
                type="button"
                className="inline-flex items-center justify-center rounded-full border border-slate-700/80 px-4 py-2 text-sm font-semibold text-slate-100 hover:bg-slate-800/70 transition-colors"
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
  );
}
