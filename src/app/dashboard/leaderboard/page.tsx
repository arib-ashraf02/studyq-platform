"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Trophy, Medal, Crown, MessageSquare, HelpCircle } from "lucide-react";

interface UserData {
  id: string;
  name: string | null;
  image: string | null;
  reputation: number;
  role: string;
  _count: { questions: number; answers: number };
  badges: { id: string; name: string; icon: string }[];
}

const RANK_STYLES = [
  {
    bg: "rgba(250, 204, 21, 0.08)",
    border: "rgba(250, 204, 21, 0.25)",
    glow: "rgba(250, 204, 21, 0.15)",
    badge: "bg-yellow-400/10 text-yellow-400 border-yellow-400/30",
  },
  {
    bg: "rgba(209, 213, 219, 0.06)",
    border: "rgba(209, 213, 219, 0.15)",
    glow: "rgba(209, 213, 219, 0.08)",
    badge: "bg-gray-400/10 text-gray-300 border-gray-400/30",
  },
  {
    bg: "rgba(180, 83, 9, 0.06)",
    border: "rgba(180, 83, 9, 0.2)",
    glow: "rgba(180, 83, 9, 0.1)",
    badge: "bg-amber-700/10 text-amber-600 border-amber-700/30",
  },
];

export default function LeaderboardPage() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/users", { signal: controller.signal })
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setUsers(data);
        setLoading(false);
      })
      .catch((e) => {
        if (e.name !== "AbortError") {
          setError(true);
          setLoading(false);
        }
      });
    return () => controller.abort();
  }, []);

  function getRankIcon(index: number) {
    if (index === 0)
      return (
        <Crown
          className="w-6 h-6 text-yellow-400"
          style={{ filter: "drop-shadow(0 0 8px rgba(250, 204, 21, 0.7))" }}
        />
      );
    if (index === 1) return <Medal className="w-6 h-6 text-gray-300" />;
    if (index === 2) return <Medal className="w-6 h-6 text-amber-600" />;
    return (
      <span className="w-6 text-center text-foreground-muted font-bold text-sm">
        {index + 1}
      </span>
    );
  }

  return (
    <div>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-2">
          <motion.div
            initial={{ rotate: -20, scale: 0 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
            className="p-2.5 rounded-xl"
            style={{
              background: "rgba(250, 204, 21, 0.1)",
              border: "1px solid rgba(250, 204, 21, 0.25)",
              boxShadow: "0 0 20px rgba(250, 204, 21, 0.15)",
            }}
          >
            <Trophy
              className="w-6 h-6 text-yellow-400"
              style={{ filter: "drop-shadow(0 0 6px rgba(250, 204, 21, 0.5))" }}
            />
          </motion.div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Leaderboard</h1>
            <p className="text-foreground-muted text-sm mt-0.5">
              Top contributors in the StudyQ community.
            </p>
          </div>
        </div>
      </motion.div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="skeleton h-20 rounded-2xl" />
          ))}
        </div>
      ) : error || users.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <div className="text-5xl mb-3">👥</div>
          <p className="text-foreground-muted">No users found yet.</p>
        </motion.div>
      ) : (
        <div className="space-y-3">
          {users.map((user, i) => {
            const rankStyle = RANK_STYLES[i] || null;
            return (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, x: -24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08, duration: 0.35 }}
                whileHover={{ x: 6, scale: 1.008 }}
                className="flex items-center gap-4 p-4 rounded-2xl glass-card transition-all relative overflow-hidden cursor-default"
                style={
                  rankStyle
                    ? {
                        background: rankStyle.bg,
                        borderColor: rankStyle.border,
                        boxShadow: `0 0 30px -8px ${rankStyle.glow}`,
                      }
                    : {}
                }
              >
                {/* Rank glow for top 3 */}
                {rankStyle && (
                  <div
                    className="absolute inset-0 pointer-events-none rounded-2xl"
                    style={{
                      background: `radial-gradient(ellipse at 0% 50%, ${rankStyle.glow} 0%, transparent 60%)`,
                    }}
                  />
                )}

                <div className="w-8 flex justify-center shrink-0 relative z-10">
                  {getRankIcon(i)}
                </div>

                {/* Avatar */}
                {user.image ? (
                  <img
                    src={user.image}
                    alt={user.name || "User"}
                    className="w-11 h-11 rounded-full object-cover shrink-0 relative z-10"
                    style={{
                      boxShadow: i < 3
                        ? `0 0 0 2px ${["rgba(250,204,21,0.5)", "rgba(209,213,219,0.4)", "rgba(180,83,9,0.4)"][i]}`
                        : "0 0 0 2px var(--primary-glow)",
                    }}
                  />
                ) : (
                  <div
                    className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shrink-0 relative z-10"
                    style={{ boxShadow: "0 0 16px var(--primary-glow)" }}
                  >
                    {user.name?.charAt(0) || "?"}
                  </div>
                )}

                {/* Info */}
                <div className="flex-1 min-w-0 relative z-10">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold truncate">{user.name || "Anonymous"}</h3>
                    {user.role === "CONTRIBUTOR" && (
                      <span
                        className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider"
                        style={{
                          background: "var(--primary-glow)",
                          color: "var(--primary-light)",
                          border: "1px solid var(--primary)",
                        }}
                      >
                        Contributor
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-[11px] text-foreground-muted mt-0.5">
                    <span className="flex items-center gap-1">
                      <HelpCircle className="w-3 h-3" /> {user._count.questions} asked
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageSquare className="w-3 h-3" /> {user._count.answers} answered
                    </span>
                  </div>
                </div>

                {/* Reputation */}
                <div className="text-right shrink-0 relative z-10">
                  <p
                    className={`text-xl font-bold ${i < 3 ? "gradient-text-gold" : "gradient-text"}`}
                  >
                    {user.reputation.toLocaleString()}
                  </p>
                  <p className="text-[10px] text-foreground-muted uppercase tracking-wide">rep</p>
                </div>

                {/* Badges */}
                {user.badges.length > 0 && (
                  <div className="flex gap-1 shrink-0 ml-1 relative z-10">
                    {user.badges.slice(0, 3).map((badge) => (
                      <motion.span
                        key={badge.id}
                        whileHover={{ scale: 1.35, rotate: 12 }}
                        className="text-lg cursor-default"
                        title={badge.name}
                      >
                        {badge.icon}
                      </motion.span>
                    ))}
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
