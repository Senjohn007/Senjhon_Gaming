// src/components/AnimatedBackground.jsx
import React from "react";

export default function AnimatedBackground() {
  return (
    <>
      {/* animated gradient base */}
      <div
        className="pointer-events-none fixed inset-0 -z-30
                   bg-gradient-to-br from-slate-900 via-slate-950 to-black
                   bg-[length:200%_200%] animate-gradient-bg"
      />

      {/* animated blurry blobs */}
      <div
        className="pointer-events-none fixed -top-32 -left-32 w-80 h-80
                   rounded-full bg-purple-500/40 blur-3xl mix-blend-screen
                   -z-20 animate-blob-slow"
      />
      <div
        className="pointer-events-none fixed -bottom-40 -right-20 w-96 h-96
                   rounded-full bg-cyan-400/35 blur-3xl mix-blend-screen
                   -z-20 animate-blob-slower"
      />

      {/* subtle grid overlay */}
      <div
        className="pointer-events-none fixed inset-0 -z-10 opacity-20
                   bg-[linear-gradient(to_right,rgba(148,163,184,0.18)_1px,transparent_1px),
                      linear-gradient(to_bottom,rgba(148,163,184,0.18)_1px,transparent_1px)]
                   [background-size:72px_72px]"
      />
    </>
  );
}