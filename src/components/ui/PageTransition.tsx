"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 10, scale: 0.995 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -8, scale: 0.995 }}
        transition={{
          duration: 0.28,
          ease: [0.25, 0.46, 0.45, 0.94],
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

export function TopLoadingBar() {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const prevPath = useRef(pathname);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (prevPath.current !== pathname) {
      prevPath.current = pathname;
      setLoading(true);
      setProgress(0);

      // Quickly advance to 80%
      timerRef.current = setInterval(() => {
        setProgress((p) => {
          if (p >= 80) {
            clearInterval(timerRef.current!);
            return p;
          }
          return p + Math.random() * 12;
        });
      }, 80);

      // Complete and hide
      const done = setTimeout(() => {
        clearInterval(timerRef.current!);
        setProgress(100);
        setTimeout(() => {
          setLoading(false);
          setProgress(0);
        }, 300);
      }, 500);

      return () => {
        clearTimeout(done);
        clearInterval(timerRef.current!);
      };
    }
  }, [pathname]);

  if (!loading && progress === 0) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[99999] h-[2px] pointer-events-none">
      <motion.div
        className="h-full rounded-full"
        style={{
          width: `${progress}%`,
          background: "linear-gradient(90deg, var(--primary), var(--accent), var(--primary))",
          backgroundSize: "200% 100%",
          boxShadow: "0 0 12px var(--primary-glow), 0 0 24px var(--primary-glow)",
          transition: "width 0.1s ease",
          animation: "gradient-shift 1.5s ease infinite",
        }}
      />
    </div>
  );
}
