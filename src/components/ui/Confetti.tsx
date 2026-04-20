"use client";

import { motion, AnimatePresence } from "framer-motion";

interface ConfettiProps {
  active: boolean;
}

const colors = ["#3b82f6", "#60a5fa", "#22c55e", "#f59e0b", "#06b6d4", "#1d4ed8"];

export function Confetti({ active }: ConfettiProps) {
  return (
    <AnimatePresence>
      {active && (
        <div className="fixed inset-0 z-[200] pointer-events-none overflow-hidden">
          {Array.from({ length: 40 }).map((_, i) => (
            <motion.div
              key={i}
              initial={{
                x: Math.random() * (typeof window !== "undefined" ? window.innerWidth : 800),
                y: -20,
                rotate: 0,
                scale: Math.random() * 0.5 + 0.5,
              }}
              animate={{
                y: typeof window !== "undefined" ? window.innerHeight + 20 : 800,
                rotate: Math.random() * 720 - 360,
                x: `+=${Math.random() * 200 - 100}`,
              }}
              exit={{ opacity: 0 }}
              transition={{
                duration: Math.random() * 2 + 2,
                delay: Math.random() * 0.5,
                ease: "easeIn",
              }}
              className="absolute w-3 h-3 rounded-sm"
              style={{
                backgroundColor: colors[Math.floor(Math.random() * colors.length)],
              }}
            />
          ))}
        </div>
      )}
    </AnimatePresence>
  );
}
