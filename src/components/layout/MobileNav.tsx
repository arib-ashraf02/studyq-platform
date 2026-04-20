"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Home, Flame, Tag, Trophy, Plus, User } from "lucide-react";

const mobileLinks = [
  { href: "/dashboard", label: "Home", icon: Home },
  { href: "/dashboard/needs-attention", label: "Urgent", icon: Flame },
  { href: "/dashboard/ask", label: "Ask", icon: Plus, isPrimary: true },
  { href: "/dashboard/tags", label: "Tags", icon: Tag },
  { href: "/dashboard/profile", label: "Profile", icon: User },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 lg:hidden"
      style={{
        background: "var(--navbar-bg)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderTop: "1px solid var(--border-color)",
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
      }}
      aria-label="Mobile navigation"
    >
      {/* Top accent line */}
      <div
        className="absolute top-0 left-0 right-0 h-[1px]"
        style={{
          background: "linear-gradient(90deg, transparent, var(--primary), var(--primary-light), var(--primary), transparent)",
          opacity: 0.5,
        }}
      />

      <div className="flex items-center justify-around px-2 py-2">
        {mobileLinks.map((link) => {
          const isActive = pathname === link.href;
          const Icon = link.icon;

          if (link.isPrimary) {
            return (
              <Link key={link.href} href={link.href}>
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.88 }}
                  className="flex flex-col items-center gap-1 py-1"
                >
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center"
                    style={{
                      background: "linear-gradient(135deg, var(--primary), var(--primary-active))",
                      boxShadow: "0 0 20px -4px var(--primary-glow)",
                    }}
                  >
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                </motion.div>
              </Link>
            );
          }

          return (
            <Link key={link.href} href={link.href}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.92 }}
                className="flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-colors min-w-[56px]"
                style={{
                  color: isActive ? "var(--primary)" : "var(--foreground-muted)",
                }}
              >
                <div className="relative">
                  <Icon
                    className="w-5 h-5 transition-all duration-200"
                    style={{
                      filter: isActive ? "drop-shadow(0 0 6px var(--primary-glow))" : "none",
                    }}
                  />
                  {/* Active dot */}
                  <AnimatePresence>
                    {isActive && (
                      <motion.div
                        layoutId="mobile-nav-dot"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                        style={{ background: "var(--primary)" }}
                        transition={{ type: "spring", stiffness: 400, damping: 25 }}
                      />
                    )}
                  </AnimatePresence>
                </div>
                <span
                  className="text-[10px] font-medium transition-colors duration-200"
                  style={{ color: isActive ? "var(--primary)" : "var(--foreground-muted)" }}
                >
                  {link.label}
                </span>
              </motion.div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
