"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  Settings as SettingsIcon, Bell, Moon, Shield, LogOut, Palette, Check,
  Sun, CloudMoon, Waves, Paintbrush2, Zap, Volume2
} from "lucide-react";
import { useState } from "react";
import { useTheme, THEMES, ThemeId } from "@/context/ThemeContext";
import { TiltCard } from "@/components/ui/TiltCard";

function Toggle({ enabled, onChange }: { enabled: boolean; onChange: (v: boolean) => void }) {
  return (
    <motion.button
      onClick={() => onChange(!enabled)}
      className={`relative w-12 h-6 rounded-full transition-all duration-300 cursor-none focus:outline-none ${
        enabled
          ? "shadow-[0_0_12px_var(--primary-glow)]"
          : ""
      }`}
      style={{ background: enabled ? "var(--primary)" : "var(--input-border)" }}
      whileTap={{ scale: 0.9 }}
    >
      <motion.div
        layout
        className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md"
        animate={{ left: enabled ? 26 : 2 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      />
    </motion.button>
  );
}

const THEME_ICONS: Record<ThemeId, React.ComponentType<any>> = {
  dark: Moon,
  light: Sun,
};

// Mini preview swatches per theme
const THEME_PREVIEW: Record<ThemeId, { bg: string; accent: string; card: string }> = {
  dark: {
    bg: "#0b0f1a",
    accent: "#3b82f6",
    card: "rgba(255,255,255,0.05)",
  },
  light: {
    bg: "#f5f7fb",
    accent: "#2563eb",
    card: "#ffffff",
  },
};

export default function SettingsPage() {
  const { theme: activeTheme, setTheme } = useTheme();
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [pushNotifs, setPushNotifs] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [soundEffects, setSoundEffects] = useState(false);
  const [switchedTheme, setSwitchedTheme] = useState<ThemeId | null>(null);

  function handleThemeChange(id: ThemeId) {
    setTheme(id);
    setSwitchedTheme(id);
    setTimeout(() => setSwitchedTheme(null), 800);
  }

  const containerVariants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.08 } },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] } },
  };

  return (
    <div>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {/* Header */}
        <motion.div variants={cardVariants} className="flex items-center gap-3 mb-8">
          <div
            className="w-1 h-8 rounded-full"
            style={{
              background: "linear-gradient(180deg, var(--primary-light), var(--primary))",
              boxShadow: "0 0 12px var(--primary-glow)",
            }}
          />
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
            <p className="text-sm" style={{ color: "var(--foreground-muted)" }}>
              Customize your StudyQ experience
            </p>
          </div>
        </motion.div>

        <div className="space-y-6 max-w-2xl">

          {/* ── THEME SELECTOR ── */}
          <motion.div variants={cardVariants} className="glass-card p-6">
            {/* Section heading */}
            <div className="flex items-center gap-2 mb-6">
              <div
                className="p-1.5 rounded-lg"
                style={{ background: "var(--primary-glow)", border: "1px solid var(--primary)" }}
              >
                <Palette className="w-4 h-4" style={{ color: "var(--primary-light)" }} />
              </div>
              <h2 className="text-lg font-semibold tracking-tight">Theme</h2>
              <span
                className="ml-auto text-xs px-2 py-0.5 rounded-full font-medium"
                style={{ background: "var(--primary-glow)", color: "var(--primary-light)", border: "1px solid var(--primary)" }}
              >
                {activeTheme.name} {activeTheme.emoji}
              </span>
            </div>

            {/* Theme cards grid */}
            <div className="grid grid-cols-2 gap-3 mb-5">
              {THEMES.map((t) => {
                const Icon = THEME_ICONS[t.id];
                const preview = THEME_PREVIEW[t.id];
                const isActive = activeTheme.id === t.id;
                return (
                  <TiltCard
                    key={t.id}
                    maxTilt={10}
                    glare
                    className="rounded-2xl"
                    onClick={() => handleThemeChange(t.id)}
                  >
                    <motion.div
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.96 }}
                      className="relative rounded-2xl overflow-hidden cursor-none select-none"
                      style={{
                        border: isActive
                          ? `2px solid ${preview.accent}`
                          : `2px solid var(--border-color)`,
                        boxShadow: isActive
                          ? `0 0 20px -6px ${preview.accent}60, inset 0 0 20px -8px ${preview.accent}20`
                          : "none",
                        transition: "border-color 0.3s ease, box-shadow 0.3s ease",
                      }}
                    >
                      {/* Preview miniature */}
                      <div
                        className="h-20 w-full relative"
                        style={{ background: preview.bg }}
                      >
                        {/* Mini navbar */}
                        <div
                          className="absolute top-0 left-0 right-0 h-4"
                          style={{ background: `${preview.bg}CC`, borderBottom: `1px solid ${preview.accent}20` }}
                        />
                        {/* Mini blobs */}
                        <div
                          className="absolute top-2 left-1 w-10 h-10 rounded-full"
                          style={{ background: `radial-gradient(circle, ${preview.accent}30, transparent 70%)`, filter: "blur(8px)" }}
                        />
                        <div
                          className="absolute bottom-0 right-1 w-8 h-8 rounded-full"
                          style={{ background: `radial-gradient(circle, ${preview.accent}25, transparent 70%)`, filter: "blur(6px)" }}
                        />
                        {/* Mini card */}
                        <div
                          className="absolute bottom-3 left-2 right-2 h-5 rounded-md"
                          style={{ background: preview.card, border: `1px solid ${preview.accent}25` }}
                        />
                        {/* Mini accent bar */}
                        <div
                          className="absolute bottom-3 left-2 w-1 h-5 rounded-full"
                          style={{ background: preview.accent, boxShadow: `0 0 6px ${preview.accent}80` }}
                        />
                      </div>

                      {/* Label */}
                      <div className="p-3 flex items-center justify-between bg-black/40">
                        <div className="flex items-center gap-2">
                          <Icon className="w-4 h-4 text-white" />
                          <span className="text-sm font-semibold text-white">{t.name}</span>
                        </div>
                        <AnimatePresence>
                          {isActive && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              exit={{ scale: 0 }}
                              className="w-5 h-5 rounded-full flex items-center justify-center bg-white text-black"
                            >
                              <Check className="w-3 h-3" />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </motion.div>
                  </TiltCard>
                );
              })}
            </div>
          </motion.div>

          {/* ── NOTIFICATIONS ── */}
          <motion.div variants={cardVariants} className="glass-card p-6">
            <div className="flex items-center gap-2 mb-6">
              <div
                className="p-1.5 rounded-lg"
                style={{ background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.2)" }}
              >
                <Bell className="w-4 h-4 text-emerald-400" />
              </div>
              <h2 className="text-lg font-semibold tracking-tight">Notifications</h2>
            </div>

            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Email Notifications</p>
                  <p className="text-xs text-foreground-muted">Weekly digest and activity alerts</p>
                </div>
                <Toggle enabled={emailNotifs} onChange={setEmailNotifs} />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Push Notifications</p>
                  <p className="text-xs text-foreground-muted">Real-time alerts in the browser</p>
                </div>
                <Toggle enabled={pushNotifs} onChange={setPushNotifs} />
              </div>
            </div>
          </motion.div>

          {/* ── ACCESSIBILITY ── */}
          <motion.div variants={cardVariants} className="glass-card p-6">
            <div className="flex items-center gap-2 mb-6">
              <div
                className="p-1.5 rounded-lg"
                style={{ background: "rgba(245,158,11,0.12)", border: "1px solid rgba(245,158,11,0.2)" }}
              >
                <Shield className="w-4 h-4 text-amber-400" />
              </div>
              <h2 className="text-lg font-semibold tracking-tight">Experience</h2>
            </div>

            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Reduced Motion</p>
                  <p className="text-xs text-foreground-muted">Disable heavy UI animations</p>
                </div>
                <Toggle enabled={reducedMotion} onChange={setReducedMotion} />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">UI Sound Effects</p>
                  <p className="text-xs text-foreground-muted">Enable subtle click & feedback sounds</p>
                </div>
                <Toggle enabled={soundEffects} onChange={setSoundEffects} />
              </div>
            </div>
          </motion.div>

          {/* ── ACCOUNT ── */}
          <motion.div variants={cardVariants} className="glass-card p-6">
            <div className="flex items-center gap-2 mb-4">
              <div
                className="p-1.5 rounded-lg"
                style={{ background: "rgba(244,63,94,0.1)", border: "1px solid rgba(244,63,94,0.2)" }}
              >
                <LogOut className="w-4 h-4 text-rose-400" />
              </div>
              <h2 className="text-lg font-semibold tracking-tight">Account</h2>
            </div>
            <motion.button
              whileHover={{ scale: 1.02, x: 4 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 text-rose-400 hover:text-rose-300 transition-colors font-semibold cursor-none"
            >
              <LogOut className="w-4 h-4" />
              Sign Out from all devices
            </motion.button>
          </motion.div>

        </div>
      </motion.div>
    </div>
  );
}
