"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Home, Flame, Tag, Trophy, User, Settings, Star, Zap } from "lucide-react";

const sidebarLinks = [
  { href: "/dashboard", label: "Home", icon: Home },
  { href: "/dashboard/needs-attention", label: "Needs Attention", icon: Flame, badge: 3 },
  { href: "/dashboard/tags", label: "Browse Tags", icon: Tag },
  { href: "/dashboard/leaderboard", label: "Leaderboard", icon: Trophy },
  { href: "/dashboard/profile", label: "Profile", icon: User },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="hidden lg:flex flex-col w-56 shrink-0 h-[calc(100vh-64px)] sticky top-16 p-4 gap-4 sidebar-glass"
    >
      {/* Top glow line */}
      <div
        className="absolute top-0 left-0 bottom-0 w-[1px]"
        style={{
          background: "linear-gradient(180deg, transparent, var(--primary), var(--primary-light), transparent)",
        }}
      />

      <nav className="flex flex-col gap-0.5">
        {sidebarLinks.map((link, i) => {
          const isActive = pathname === link.href;
          return (
            <Link key={link.href} href={link.href} className="cursor-none">
              <motion.div
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05, duration: 0.25 }}
                whileHover={{ x: 4 }}
                className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 cursor-none ${
                  isActive
                    ? "text-white"
                    : "text-foreground-muted hover:text-foreground"
                }`}
                style={
                  isActive
                    ? {
                        background: "var(--primary-glow)",
                        border: "1px solid var(--primary)",
                        boxShadow: "0 0 20px -8px var(--primary-glow)",
                      }
                    : {
                        background: "transparent",
                        border: "1px solid transparent",
                      }
                }
              >
                {/* Active indicator bar */}
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="sidebar-active-indicator absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-full bg-blue-500"
                    transition={{ type: "spring", stiffness: 400, damping: 28 }}
                  />
                )}

                <link.icon
                  className={`w-4 h-4 transition-all duration-200 ${
                    isActive ? "text-blue-400" : ""
                  }`}
                  style={isActive ? { filter: "drop-shadow(0 0 6px var(--primary-glow))" } : undefined}
                />
                {link.label}

                {link.badge && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="ml-auto px-1.5 py-0.5 rounded-full text-[10px] font-bold min-w-[1.25rem] text-center"
                    style={{
                      background: "rgba(244, 63, 94, 0.2)",
                      color: "#f43f5e",
                      border: "1px solid rgba(244, 63, 94, 0.3)",
                      animation: "notification-pulse 2.5s ease-in-out infinite",
                    }}
                  >
                    {link.badge}
                  </motion.span>
                )}
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* ─── Reputation Widget ─── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="mt-auto p-4 rounded-2xl relative overflow-hidden glass-card group"
      >
        {/* Animated gradient bg on hover */}
        <motion.div
          className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{
            background: "radial-gradient(circle at 30% 70%, var(--primary-glow), transparent 60%)",
          }}
        />

        {/* Header row */}
        <div className="flex items-center gap-2 mb-3 relative z-10">
          <motion.div
            animate={{ rotate: [0, 20, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
          >
            <Star className="w-4 h-4 text-yellow-400" style={{ filter: "drop-shadow(0 0 6px rgba(250, 204, 21, 0.5))" }} />
          </motion.div>
          <p className="text-[11px] text-foreground-muted font-semibold uppercase tracking-widest">
            Your Reputation
          </p>
        </div>

        {/* Reputation number */}
        <motion.p
          className="text-3xl font-extrabold gradient-text mb-3 relative z-10"
          initial={{ opacity: 0, scale: 0.75 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.55, duration: 0.5, type: "spring", stiffness: 200 }}
        >
          1,240
        </motion.p>

        {/* Progress bar */}
        <div className="rep-progress-bar mb-2 relative z-10 h-1 rounded-full overflow-hidden" style={{ background: "var(--border-color)" }}>
          <motion.div
            className="h-full bg-blue-500"
            initial={{ width: 0 }}
            animate={{ width: "62%" }}
            transition={{ duration: 1.5, delay: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
          />
        </div>

        <div className="flex items-center justify-between relative z-10">
          <p className="text-[11px] text-foreground-muted">
            <span className="text-blue-400 font-semibold">760</span> to next level
          </p>
          <div className="flex items-center gap-1">
            <Zap className="w-3 h-3 text-amber-400" />
            <span className="text-[10px] text-amber-400 font-bold">Lvl 3</span>
          </div>
        </div>
      </motion.div>
    </aside>
  );
}
