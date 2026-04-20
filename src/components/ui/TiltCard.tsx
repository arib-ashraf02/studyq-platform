"use client";

import { useEffect, useRef } from "react";

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number;
  glare?: boolean;
  style?: React.CSSProperties;
  onClick?: () => void;
}

export function TiltCard({
  children,
  className = "",
  maxTilt = 8,
  glare = true,
  style,
  onClick,
}: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const glareRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const stateRef = useRef({ tiltX: 0, tiltY: 0, glareX: 50, glareY: 50, opacity: 0 });

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    function onMouseMove(e: MouseEvent) {
      const rect = card!.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const tiltX = ((y - cy) / cy) * maxTilt;
      const tiltY = -((x - cx) / cx) * maxTilt;
      const glareX = (x / rect.width) * 100;
      const glareY = (y / rect.height) * 100;

      stateRef.current = { tiltX, tiltY, glareX, glareY, opacity: 0.12 };

      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        card!.style.transform = `perspective(800px) rotateX(${stateRef.current.tiltX}deg) rotateY(${stateRef.current.tiltY}deg) translateZ(4px)`;
        if (glareRef.current) {
          glareRef.current.style.background = `radial-gradient(circle at ${stateRef.current.glareX}% ${stateRef.current.glareY}%, rgba(255,255,255,${stateRef.current.opacity}), transparent 60%)`;
        }
      });
    }

    function onMouseLeave() {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        card!.style.transform = "perspective(800px) rotateX(0deg) rotateY(0deg) translateZ(0px)";
        card!.style.transition = "transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)";
        if (glareRef.current) {
          glareRef.current.style.background = "transparent";
        }
      });
      setTimeout(() => {
        if (card) card.style.transition = "";
      }, 500);
    }

    card.addEventListener("mousemove", onMouseMove, { passive: true });
    card.addEventListener("mouseleave", onMouseLeave, { passive: true });

    return () => {
      card.removeEventListener("mousemove", onMouseMove);
      card.removeEventListener("mouseleave", onMouseLeave);
      cancelAnimationFrame(rafRef.current);
    };
  }, [maxTilt]);

  return (
    <div
      ref={cardRef}
      className={`relative overflow-hidden ${className}`}
      style={{ willChange: "transform", ...style }}
      onClick={onClick}
    >
      {glare && (
        <div
          ref={glareRef}
          className="absolute inset-0 pointer-events-none rounded-[inherit] transition-all duration-200 z-20"
        />
      )}
      {children}
    </div>
  );
}
