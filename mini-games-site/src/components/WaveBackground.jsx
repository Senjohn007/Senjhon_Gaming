// src/components/WaveBackground.jsx
import React, { useEffect, useRef } from "react";

export default function WaveBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let animationFrameId;
    let time = 0;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const drawWave = (amplitude, frequency, speed, yOffset, color, opacity) => {
      ctx.beginPath();
      ctx.moveTo(0, canvas.height);
      
      for (let x = 0; x <= canvas.width; x++) {
        const y = yOffset + Math.sin((x * frequency) + (time * speed)) * amplitude;
        ctx.lineTo(x, y);
      }
      
      ctx.lineTo(canvas.width, canvas.height);
      ctx.closePath();
      
      const gradient = ctx.createLinearGradient(0, yOffset - amplitude, 0, canvas.height);
      gradient.addColorStop(0, `${color}${Math.floor(opacity * 255).toString(16).padStart(2, '0')}`);
      gradient.addColorStop(1, `${color}00`);
      ctx.fillStyle = gradient;
      ctx.fill();
    };

    const animate = () => {
      ctx.fillStyle = "rgba(15, 23, 42, 0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw multiple waves
      drawWave(50, 0.01, 0.02, canvas.height * 0.6, "#5b21b6", 0.3);
      drawWave(40, 0.015, 0.025, canvas.height * 0.65, "#1e3a8a", 0.25);
      drawWave(30, 0.02, 0.03, canvas.height * 0.7, "#831843", 0.2);
      drawWave(20, 0.025, 0.035, canvas.height * 0.75, "#3730a3", 0.15);
      
      time += 1;
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  return (
    <div className="fixed inset-0 -z-30 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-purple-950/40 to-slate-950" />
      <canvas ref={canvasRef} className="absolute inset-0" />
      <div className="absolute inset-0 bg-radial-gradient from-transparent via-slate-950/30 to-slate-950/70" />
    </div>
  );
}