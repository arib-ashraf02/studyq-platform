"use client";

import { motion } from "framer-motion";
import { User, Mail, Award, BookOpen, MessageSquare, CheckCircle, Settings, ExternalLink } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function ProfilePage() {
  const { data: session } = useSession();

  // Use real session data where available, fall back to sensible defaults
  const user = {
    name: session?.user?.name || "Anonymous",
    email: session?.user?.email || "No email",
    image: session?.user?.image || null,
    bio: "Member of the StudyQ learning community.",
    reputation: 1240,
    role: "CONTRIBUTOR",
    questionsAsked: 12,
    answersGiven: 48,
    acceptedAnswers: 12,
    badges: [
      { name: "First Answer", icon: "🎯" },
      { name: "Top Helper", icon: "🏆" },
      { name: "Curious Mind", icon: "🧠" },
    ],
  };

  const stats = [
    { label: "Reputation", value: user.reputation.toLocaleString(), icon: Award, color: "text-primary" },
    { label: "Questions", value: user.questionsAsked, icon: BookOpen, color: "text-accent" },
    { label: "Answers", value: user.answersGiven, icon: MessageSquare, color: "text-blue-400" },
    { label: "Accepted", value: user.acceptedAnswers, icon: CheckCircle, color: "text-green-400" },
  ];

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div
              className="w-1 h-8 rounded-full"
              style={{
                background: "linear-gradient(180deg, var(--primary), var(--primary-light))",
                boxShadow: "0 0 12px var(--primary-glow)",
              }}
            />
            <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
          </div>
          <Link href="/dashboard/settings">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm text-foreground-muted hover:text-foreground transition-colors cursor-none"
              style={{ border: "1px solid var(--border-color)", background: "var(--card)" }}
            >
              <Settings className="w-4 h-4" /> Edit
            </motion.button>
          </Link>
        </div>

        {/* Profile header */}
        <div className="p-6 rounded-2xl glass-card mb-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/[0.05] to-accent/[0.05] pointer-events-none" />
          <div className="relative z-10 flex items-start gap-5 flex-wrap">
            {/* Avatar */}
            {user.image ? (
              <img
                src={user.image}
                alt={user.name}
                className="w-20 h-20 rounded-2xl object-cover shrink-0"
                style={{ boxShadow: "0 0 20px var(--primary-glow)" }}
              />
            ) : (
              <div
                className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-3xl font-bold text-white shrink-0"
                style={{ boxShadow: "0 0 20px var(--primary-glow)" }}
              >
                {user.name.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-1 flex-wrap">
                <h2 className="text-2xl font-bold">{user.name}</h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
                  {user.role}
                </span>
              </div>
              <p className="text-foreground-muted text-sm flex items-center gap-1.5 mb-2">
                <Mail className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{user.email}</span>
              </p>
              <p className="text-sm" style={{ color: "var(--foreground-muted)" }}>{user.bio}</p>
            </div>
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, duration: 0.3 }}
              whileHover={{ y: -2, scale: 1.02 }}
              className="p-4 rounded-2xl glass-card text-center"
            >
              <stat.icon className={`w-5 h-5 mx-auto mb-2 ${stat.color}`} />
              <p className="text-2xl font-bold mb-1">{stat.value}</p>
              <p className="text-xs text-foreground-muted">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Badges */}
        <div className="p-6 rounded-2xl glass-card mb-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Award className="w-5 h-5 text-yellow-400" /> Badges
          </h2>
          {user.badges.length === 0 ? (
            <p className="text-sm text-foreground-muted">No badges earned yet. Start answering questions!</p>
          ) : (
            <div className="flex gap-3 flex-wrap">
              {user.badges.map((badge) => (
                <motion.div
                  key={badge.name}
                  whileHover={{ scale: 1.05, y: -2 }}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl glass-card transition-colors cursor-default"
                  style={{ border: "1px solid rgba(234,179,8,0.2)" }}
                >
                  <span className="text-xl">{badge.icon}</span>
                  <span className="text-sm font-medium">{badge.name}</span>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Reputation progress */}
        <div className="p-6 rounded-2xl glass-card">
          <h2 className="text-lg font-semibold mb-4">Reputation Progress</h2>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-foreground-muted">Level 5 · Contributor</span>
            <span className="gradient-text font-semibold">{user.reputation} / 2,000</span>
          </div>
          <div className="h-3 rounded-full overflow-hidden" style={{ background: "var(--border-color)" }}>
            <motion.div
              className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(user.reputation / 2000) * 100}%` }}
              transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
            />
          </div>
          <p className="text-xs text-foreground-muted mt-2">
            {2000 - user.reputation} points to Level 6 (Expert)
          </p>

          {/* Quick links */}
          <div className="flex gap-3 mt-5 pt-4" style={{ borderTop: "1px solid var(--border-color)" }}>
            <Link href="/dashboard" className="cursor-none">
              <motion.span
                whileHover={{ scale: 1.02 }}
                className="flex items-center gap-1.5 text-xs text-primary hover:text-primary-hover transition-colors cursor-none"
              >
                <ExternalLink className="w-3.5 h-3.5" /> Browse Questions
              </motion.span>
            </Link>
            <Link href="/dashboard/ask" className="cursor-none">
              <motion.span
                whileHover={{ scale: 1.02 }}
                className="flex items-center gap-1.5 text-xs text-primary hover:text-primary-hover transition-colors cursor-none"
              >
                <ExternalLink className="w-3.5 h-3.5" /> Ask a Question
              </motion.span>
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
