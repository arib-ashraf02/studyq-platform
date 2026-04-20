"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
}

export function ParticleNetwork() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Skip on touch devices for performance
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    const PARTICLE_COUNT = isTouch ? 30 : 55;
    const CONNECT_DIST = 120;
    const PRIMARY = "59, 130, 246";
    const ACCENT = "37, 99, 235";

    let animId: number;
    const particles: Particle[] = [];

    function resize() {
      canvas!.width = window.innerWidth;
      canvas!.height = window.innerHeight;
    }

    function initParticles() {
      particles.length = 0;
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push({
          x: Math.random() * canvas!.width,
          y: Math.random() * canvas!.height,
          vx: (Math.random() - 0.5) * 0.35,
          vy: (Math.random() - 0.5) * 0.35,
          radius: Math.random() * 1.5 + 0.4,
          alpha: Math.random() * 0.45 + 0.15,
        });
      }
    }

    function draw() {
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height);

      particles.forEach((p, i) => {
        // Move
        p.x += p.vx;
        p.y += p.vy;

        // Wrap edges
        if (p.x < 0) p.x = canvas!.width;
        if (p.x > canvas!.width) p.x = 0;
        if (p.y < 0) p.y = canvas!.height;
        if (p.y > canvas!.height) p.y = 0;

        // Draw particle
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        const color = i % 3 === 0 ? ACCENT : PRIMARY;
        ctx!.fillStyle = `rgba(${color}, ${p.alpha})`;
        ctx!.fill();

        // Draw connections (skip some for performance)
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < CONNECT_DIST) {
            const lineAlpha = (1 - dist / CONNECT_DIST) * 0.22;
            ctx!.beginPath();
            ctx!.moveTo(p.x, p.y);
            ctx!.lineTo(p2.x, p2.y);

            const grad = ctx!.createLinearGradient(p.x, p.y, p2.x, p2.y);
            grad.addColorStop(0, `rgba(${PRIMARY}, ${lineAlpha})`);
            grad.addColorStop(1, `rgba(${ACCENT}, ${lineAlpha})`);
            ctx!.strokeStyle = grad;
            ctx!.lineWidth = 0.7;
            ctx!.stroke();
          }
        }
      });

      animId = requestAnimationFrame(draw);
    }

    // ✅ FIX: Named resize handler so it can be properly removed
    function handleResize() {
      cancelAnimationFrame(animId);
      resize();
      initParticles();
      animId = requestAnimationFrame(draw);
    }

    resize();
    initParticles();
    animId = requestAnimationFrame(draw);

    window.addEventListener("resize", handleResize, { passive: true });

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="particle-canvas"
      aria-hidden="true"
    />
  );
}
