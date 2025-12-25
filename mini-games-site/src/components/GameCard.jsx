// src/components/GameCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';

export default function GameCard({ title, description, linkTo, gradientFrom, gradientTo, hoverColor, textClass = "text-slate-50", icon }) {
  return (
    <div className={`group relative overflow-hidden rounded-2xl bg-slate-900/40 border border-slate-700/40 backdrop-blur-sm transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02] hover:shadow-[0_25px_50px_-12px_rgba(168,85,247,0.5)] hover:border-${hoverColor}-400/60`}>
      {/* Animated background gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradientFrom}/10 via-transparent to-${hoverColor}/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
      
      {/* Glow effect on hover */}
      <div className={`absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-500 bg-gradient-to-r ${gradientFrom} ${gradientTo} blur-xl`} />
      
      {/* Scanning line effect */}
      <div className="absolute inset-0 overflow-hidden rounded-2xl">
        <div className="absolute -top-full h-full w-full bg-gradient-to-b from-transparent via-white/10 to-transparent group-hover:animate-slide-down" />
      </div>
      
      <div className="relative p-6 flex flex-col gap-4 h-full">
        {/* Icon */}
        <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${gradientFrom} ${gradientTo} flex items-center justify-center text-2xl group-hover:animate-pulse-glow`}>
          {icon}
        </div>
        
        {/* Content */}
        <div className="flex-1">
          <h3 className="text-xl font-bold tracking-wide text-slate-50 mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-pink-400 transition-all duration-300">
            {title}
          </h3>
          <p className="text-sm text-slate-300 leading-relaxed">
            {description}
          </p>
        </div>
        
        {/* Play button with advanced hover */}
        <Link
          to={linkTo}
          className={`relative overflow-hidden rounded-full bg-gradient-to-r ${gradientFrom} ${gradientTo} px-6 py-3 text-sm font-bold ${textClass} shadow-lg transition-all duration-300 group-hover:shadow-${hoverColor}-500/50 group-hover:scale-105`}
        >
          <span className="relative z-10 flex items-center justify-center gap-2">
            <span>Play Now</span>
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </span>
          
          {/* Shimmer effect */}
          <div className="absolute inset-0 -top-full h-full w-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-shimmer" />
        </Link>
      </div>
    </div>
  );
}