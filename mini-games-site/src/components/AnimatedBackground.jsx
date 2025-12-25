// src/components/AdvancedAnimatedBackground.jsx
import React, { useEffect, useRef, useState } from "react";

export default function AdvancedAnimatedBackground() {
  const canvasRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isLoaded, setIsLoaded] = useState(false);

  // Track mouse position for interactive effects
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Canvas particle system
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let animationFrameId;
    let particles = [];

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Particle class
    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2.5 + 0.5; // Slightly smaller particles
        this.speedX = Math.random() * 0.8 - 0.4; // Slower movement
        this.speedY = Math.random() * 0.8 - 0.4;
        this.opacity = Math.random() * 0.3 + 0.1; // Lower opacity
        this.pulse = Math.random() * 0.015 + 0.003; // Slower pulse
        this.pulseDirection = 1;
        this.color = this.getRandomColor(); // Add color variation
      }

      getRandomColor() {
        const colors = [
          { r: 91, g: 33, b: 182 }, // Darker purple
          { r: 30, g: 58, b: 138 },  // Darker blue
          { r: 131, g: 24, b: 67 },  // Darker pink
          { r: 55, g: 48, b: 163 }   // Darker indigo
        ];
        return colors[Math.floor(Math.random() * colors.length)];
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Wrap around edges
        if (this.x > canvas.width) this.x = 0;
        if (this.x < 0) this.x = canvas.width;
        if (this.y > canvas.height) this.y = 0;
        if (this.y < 0) this.y = canvas.height;

        // Pulsing effect
        this.opacity += this.pulse * this.pulseDirection;
        if (this.opacity > 0.4 || this.opacity < 0.1) { // Lower max opacity
          this.pulseDirection *= -1;
        }

        // Mouse interaction with reduced range
        const dx = mousePosition.x - this.x;
        const dy = mousePosition.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 80) { // Reduced interaction distance
          const forceDirectionX = dx / distance;
          const forceDirectionY = dy / distance;
          const maxDistance = 80;
          const force = (maxDistance - distance) / maxDistance;
          const directionX = forceDirectionX * force * 1.5; // Reduced force
          const directionY = forceDirectionY * force * 1.5;
          
          this.x -= directionX;
          this.y -= directionY;
        }
      }

      draw() {
        ctx.fillStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Create particles
    const createParticles = () => {
      particles = [];
      const numberOfParticles = Math.floor((canvas.width * canvas.height) / 18000); // Fewer particles
      for (let i = 0; i < numberOfParticles; i++) {
        particles.push(new Particle());
      }
    };
    createParticles();

    // Connect particles with lines
    const connectParticles = () => {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 100) { // Slightly reduced connection distance
            const opacity = (1 - distance / 100) * 0.3; // Lower line opacity
            const avgColor = {
              r: (particles[i].color.r + particles[j].color.r) / 2,
              g: (particles[i].color.g + particles[j].color.g) / 2,
              b: (particles[i].color.b + particles[j].color.b) / 2
            };
            
            ctx.strokeStyle = `rgba(${avgColor.r}, ${avgColor.g}, ${avgColor.b}, ${opacity})`;
            ctx.lineWidth = 0.4; // Thinner lines
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
    };

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(particle => {
        particle.update();
        particle.draw();
      });
      
      connectParticles();
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();
    setIsLoaded(true);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [mousePosition]);

  // SVG grid data URL - properly encoded
  const gridSvg = encodeURIComponent(
    `<svg width="60" height="60" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
          <path d="M 60 0 L 0 0 0 60" fill="none" stroke="white" stroke-width="1"/>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(%23grid)" />
    </svg>`
  );

  return (
    <div className="fixed inset-0 -z-30 overflow-hidden">
      {/* Base gradient layer - darker */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-purple-950/40 to-slate-950" />
      
      {/* Animated gradient orbs - darker and less prominent */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-900/15 rounded-full filter blur-3xl animate-pulse" />
        <div className="absolute top-1/4 right-0 w-80 h-80 bg-blue-900/15 rounded-full filter blur-3xl animate-pulse animation-delay-2000" />
        <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-pink-900/15 rounded-full filter blur-3xl animate-pulse animation-delay-4000" />
      </div>
      
      {/* Grid overlay - more subtle */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `url("data:image/svg+xml,${gridSvg}")`,
          transform: `translate(${mousePosition.x * 0.008}px, ${mousePosition.y * 0.008}px)`
        }}
      />
      
      {/* Particle canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0"
        style={{ opacity: isLoaded ? 0.8 : 0, transition: 'opacity 1s ease-in' }}
      />
      
      {/* Darker radial gradient overlay for depth */}
      <div className="absolute inset-0 bg-radial-gradient from-transparent via-slate-950/20 to-slate-950/70" />
      
      {/* Scanline effect - more subtle */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="h-full w-full bg-[repeating-linear-gradient(0deg,rgba(255,255,255,0.02)0px,transparent 1px,transparent 2px,rgba(255,255,255,0.02)3px)] animate-scanline" />
      </div>
      
      {/* Noise texture overlay - more subtle */}
      <div 
        className="absolute inset-0 opacity-[0.015] mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
        }}
      />
    </div>
  );
}