// src/components/GeometricBackground.jsx
import React, { useEffect, useRef, useState } from "react";

export default function GeometricBackground() {
  const canvasRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let animationFrameId;
    let shapes = [];

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    class Shape {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 60 + 20;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.01;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.speedY = (Math.random() - 0.5) * 0.5;
        this.sides = Math.floor(Math.random() * 4) + 3;
        this.opacity = Math.random() * 0.3 + 0.1;
        this.color = this.getRandomColor();
        this.trail = [];
        this.maxTrailLength = 10;
      }

      getRandomColor() {
        const colors = [
          "91, 33, 182",   // Dark purple
          "30, 58, 138",   // Dark blue
          "131, 24, 67",   // Dark pink
          "55, 48, 163"    // Dark indigo
        ];
        return colors[Math.floor(Math.random() * colors.length)];
      }

      update() {
        // Store previous position for trail effect
        this.trail.push({ x: this.x, y: this.y, rotation: this.rotation });
        if (this.trail.length > this.maxTrailLength) {
          this.trail.shift();
        }

        this.x += this.speedX;
        this.y += this.speedY;
        this.rotation += this.rotationSpeed;

        // Wrap around edges
        if (this.x > canvas.width + this.size) this.x = -this.size;
        if (this.x < -this.size) this.x = canvas.width + this.size;
        if (this.y > canvas.height + this.size) this.y = -this.size;
        if (this.y < -this.size) this.y = canvas.height + this.size;

        // Mouse interaction
        const dx = mousePosition.x - this.x;
        const dy = mousePosition.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 150) {
          const force = (150 - distance) / 150;
          this.rotationSpeed += force * 0.001;
        }
      }

      draw() {
        // Draw trail
        this.trail.forEach((point, index) => {
          const trailOpacity = (index / this.trail.length) * this.opacity * 0.5;
          ctx.save();
          ctx.translate(point.x, point.y);
          ctx.rotate(point.rotation);
          ctx.strokeStyle = `rgba(${this.color}, ${trailOpacity})`;
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          
          for (let i = 0; i < this.sides; i++) {
            const angle = (i / this.sides) * Math.PI * 2;
            const x = Math.cos(angle) * this.size;
            const y = Math.sin(angle) * this.size;
            if (i === 0) {
              ctx.moveTo(x, y);
            } else {
              ctx.lineTo(x, y);
            }
          }
          
          ctx.closePath();
          ctx.stroke();
          ctx.restore();
        });

        // Draw main shape
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.strokeStyle = `rgba(${this.color}, ${this.opacity})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        
        for (let i = 0; i < this.sides; i++) {
          const angle = (i / this.sides) * Math.PI * 2;
          const x = Math.cos(angle) * this.size;
          const y = Math.sin(angle) * this.size;
          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        
        ctx.closePath();
        ctx.stroke();
        ctx.restore();
      }
    }

    // Create shapes
    for (let i = 0; i < 15; i++) {
      shapes.push(new Shape());
    }

    const animate = () => {
      // Clear canvas completely with a dark semi-transparent layer
      ctx.fillStyle = "rgba(15, 23, 42, 0.8)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      shapes.forEach(shape => {
        shape.update();
        shape.draw();
      });
      
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [mousePosition]);

  return (
    <div className="fixed inset-0 -z-30 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-purple-950/30 to-slate-950" />
      <canvas ref={canvasRef} className="absolute inset-0" />
      <div className="absolute inset-0 bg-radial-gradient from-transparent via-slate-950/20 to-slate-950/60" />
    </div>
  );
}