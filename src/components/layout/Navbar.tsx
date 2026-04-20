"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { signOut, useSession } from "next-auth/react";
import {
  Search, Bell, User, Plus, Home, Flame, Tag, Trophy, LogOut, ChevronDown, Sun, Moon
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useTheme } from "@/context/ThemeContext";

const navLinks = [
  { href: "/dashboard", label: "Home", icon: Home },
  { href: "/dashboard/needs-attention", label: "Needs Attention", icon: Flame },
  { href: "/dashboard/tags", label: "Tags", icon: Tag },
  { href: "/dashboard/leaderboard", label: "Leaderboard", icon: Trophy },
];

export function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { theme, setTheme } = useTheme();
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [profileOpen, setProfileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  function handleSearch(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && searchValue.trim()) {
      router.push(`/dashboard?search=${encodeURIComponent(searchValue.trim())}`);
      (e.target as HTMLInputElement).blur();
    }
    if (e.key === "Escape") {
      setSearchValue("");
      (e.target as HTMLInputElement).blur();
    }
  }

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const userName = session?.user?.name || "User";
  const userEmail = session?.user?.email || "";
  const userImage = session?.user?.image;

  return (
    <nav className="sticky top-0 z-50 w-full navbar-glass">
      {/* Top accent line */}
      <div
        className="absolute top-0 left-0 right-0 h-[1px]"
        style={{
          background: "linear-gradient(90deg, transparent, var(--primary), var(--primary-light), var(--primary), transparent)",
        }}
      />

      <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0 group cursor-none">
          <motion.div
            whileHover={{ rotate: 10, scale: 1.12 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
            className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-sm font-black text-white"
            style={{ boxShadow: "0 0 20px var(--primary-glow), 0 2px 8px rgba(0,0,0,0.3)" }}
          >
            Q
          </motion.div>
          <span className="text-xl font-bold tracking-tight hidden sm:block">
            Study<span className="gradient-text">Q</span>
          </span>
        </Link>

        {/* Nav Links */}
        <div className="hidden md:flex items-center gap-0.5 ml-6">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link key={link.href} href={link.href} className="cursor-none">
                <motion.div
                  className={`relative flex items-center gap-1.5 px-3 py-2 rounded-lg text-[13px] font-medium transition-colors duration-200 cursor-none ${
                    isActive
                      ? "text-white"
                      : "text-foreground-muted hover:text-foreground"
                  }`}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                >
                  <link.icon className={`w-3.5 h-3.5 transition-colors ${isActive ? "text-blue-400" : ""}`} />
                  {link.label}
                  {isActive && (
                    <motion.div
                      layoutId="nav-pill"
                      className="absolute inset-0 nav-active-pill rounded-lg"
                      style={{ zIndex: -1 }}
                      transition={{ type: "spring", stiffness: 380, damping: 28 }}
                    />
                  )}
                </motion.div>
              </Link>
            );
          })}
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-sm mx-4">
          <motion.div
            className="relative"
            animate={{ scale: searchFocused ? 1.02 : 1 }}
            transition={{ duration: 0.25 }}
          >
            <Search
              className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors duration-200 ${
                searchFocused ? "text-blue-400" : "text-foreground-muted"
              }`}
            />
            <input
              type="text"
              placeholder="Search questions... (Enter to search)"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyDown={handleSearch}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              className={`input-glow w-full h-9 pl-9 pr-4 rounded-xl text-sm cursor-none ${
                searchFocused ? "ring-1 ring-blue-500/30" : ""
              }`}
              style={{ cursor: "none" }}
              aria-label="Search questions"
            />
          </motion.div>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          {/* Theme Toggle */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setTheme(theme.id === "dark" ? "light" : "dark")}
            className="nav-icon-btn cursor-none"
            title={theme.id === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {theme.id === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </motion.button>

          <Link href="/dashboard/ask" className="cursor-none">
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              className="btn-primary flex items-center gap-1.5 px-4 py-2 rounded-xl text-white text-sm font-semibold cursor-none"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:block">Ask</span>
            </motion.button>
          </Link>

          {/* Bell */}
          <motion.button
            whileHover={{ scale: 1.14 }}
            whileTap={{ scale: 0.88 }}
            className="nav-icon-btn relative cursor-none"
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
            <span
              className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full animate-notification-pulse"
              style={{ background: "var(--danger)", boxShadow: "0 0 6px var(--danger-glow)" }}
            />
          </motion.button>

          {/* Profile dropdown */}
          <div className="relative" ref={dropdownRef}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2 p-1 rounded-xl hover:bg-[var(--interactive-hover)] transition-colors cursor-none"
            >
              {userImage ? (
                <img
                  src={userImage}
                  alt={userName}
                  className="w-8 h-8 rounded-full object-cover"
                  style={{ boxShadow: "0 0 0 2px var(--primary-glow)" }}
                />
              ) : (
                <div
                  className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold"
                  style={{ boxShadow: "0 0 12px var(--primary-glow)" }}
                >
                  {userName.charAt(0).toUpperCase()}
                </div>
              )}
              <ChevronDown
                className={`w-3.5 h-3.5 text-foreground-muted transition-transform duration-200 hidden sm:block ${
                  profileOpen ? "rotate-180" : ""
                }`}
              />
            </motion.button>

            <AnimatePresence>
              {profileOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.92, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.92, y: -10 }}
                  transition={{ duration: 0.18, ease: [0.25, 0.46, 0.45, 0.94] }}
                  className="absolute right-0 mt-2 w-64 p-2 rounded-2xl z-50"
                  style={{
                    background: "var(--card)",
                    border: "1px solid var(--card-border)",
                    backdropFilter: "blur(32px)",
                    WebkitBackdropFilter: "blur(32px)",
                    boxShadow: "0 16px 48px rgba(0,0,0,0.25), 0 0 0 1px rgba(255,255,255,0.04)",
                  }}
                >
                  <div className="px-3 py-2.5 mb-1">
                    <p className="text-sm font-semibold truncate">{userName}</p>
                    <p className="text-xs text-foreground-muted truncate">{userEmail}</p>
                  </div>

                  <div className="h-px mx-1 my-1" style={{ background: "linear-gradient(90deg, transparent, var(--border-color), transparent)" }} />

                  <Link href="/dashboard/profile" onClick={() => setProfileOpen(false)} className="cursor-none">
                    <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-foreground-muted hover:text-primary hover:bg-primary/[0.08] transition-all cursor-pointer border border-transparent hover:border-primary/20">
                      <User className="w-4 h-4" /> Profile
                    </div>
                  </Link>

                  <div className="h-px mx-1 my-1" style={{ background: "linear-gradient(90deg, transparent, var(--border-color), transparent)" }} />

                  <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-rose-400 hover:bg-rose-500/10 transition-all border border-transparent hover:border-rose-500/20 cursor-none"
                  >
                    <LogOut className="w-4 h-4" /> Sign Out
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </nav>
  );
}
