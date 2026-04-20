"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, ArrowUp, ArrowDown, CheckCircle, Eye, Clock, Flame } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface QuestionCardProps {
  id: string;
  title: string;
  description: string;
  tags: { id: string; name: string; color: string }[];
  votes: number;
  answers: number;
  views: number;
  status: string;
  difficulty: string;
  author: { name: string | null; image: string | null; reputation: number };
  createdAt: string;
  index?: number;
}

function getTimeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

function getDifficultyStyle(d: string) {
  switch (d) {
    case "EASY":
      return {
        text: "text-emerald-400",
        bg: "bg-emerald-400/10",
        border: "border-emerald-400/25",
        glow: "rgba(16, 185, 129, 0.3)",
      };
    case "MEDIUM":
      return {
        text: "text-amber-400",
        bg: "bg-amber-400/10",
        border: "border-amber-400/25",
        glow: "rgba(245, 158, 11, 0.3)",
      };
    case "HARD":
      return {
        text: "text-rose-400",
        bg: "bg-rose-400/10",
        border: "border-rose-400/25",
        glow: "rgba(244, 63, 94, 0.3)",
      };
    default:
      return {
        text: "text-foreground-muted",
        bg: "bg-white/5",
        border: "border-white/10",
        glow: "transparent",
      };
  }
}

function getStatusConfig(s: string) {
  switch (s) {
    case "RESOLVED":
      return {
        label: "Resolved",
        icon: CheckCircle,
        style: "text-emerald-400 bg-emerald-400/10 border-emerald-400/30",
        glow: "rgba(16, 185, 129, 0.4)",
      };
    case "PARTIALLY_ANSWERED":
      return {
        label: "Partial",
        icon: MessageSquare,
        style: "text-amber-400 bg-amber-400/10 border-amber-400/30",
        glow: "rgba(245, 158, 11, 0.4)",
      };
    default:
      return {
        label: "Unanswered",
        icon: Flame,
        style: "text-rose-400 animate-badge-shimmer border-rose-400/40",
        glow: "rgba(244, 63, 94, 0.4)",
      };
  }
}

export function QuestionCard({
  id, title, description, tags, votes, answers, views,
  status, difficulty, author, createdAt, index = 0,
}: QuestionCardProps) {
  const statusCfg = getStatusConfig(status);
  const diffStyle = getDifficultyStyle(difficulty);
  const isUnanswered = status === "UNANSWERED";
  const isResolved = status === "RESOLVED";
  const [voteState, setVoteState] = useState<"up" | "down" | null>(null);
  const [displayVotes, setDisplayVotes] = useState(votes);

  function handleVote(dir: "up" | "down", e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (voteState === dir) {
      setVoteState(null);
      setDisplayVotes(votes);
    } else {
      setVoteState(dir);
      setDisplayVotes(votes + (dir === "up" ? 1 : -1));
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.45,
        delay: index * 0.08,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
    >
      <Link href={`/dashboard/questions/${id}`} className="block cursor-none">
        <motion.article
          whileHover={{ scale: 1.012, y: -7 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className={cn(
            "group relative p-5 sm:p-6 rounded-2xl glass-card cursor-pointer overflow-hidden question-card-hover",
            isUnanswered && "needs-attention-card",
            isResolved && "resolved-card"
          )}
        >
          {/* Animated hover gradient sweep */}
          <motion.div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl"
            style={{
              background: "linear-gradient(135deg, var(--primary-glow) 0%, transparent 50%, var(--primary-glow) 100%)",
            }}
          />

          {/* Top-right corner glow for resolved */}
          {isResolved && (
            <div
              className="absolute top-0 right-0 w-40 h-40 pointer-events-none rounded-tr-2xl"
              style={{
                background: "radial-gradient(circle at top right, rgba(16,185,129,0.12), transparent 60%)",
              }}
            />
          )}

          <div className="flex gap-4 sm:gap-5 relative z-10">
            {/* ─── Vote column ─── */}
            <div className="flex flex-col items-center gap-0.5 pt-1 shrink-0">
              <motion.button
                whileHover={{ scale: 1.28, y: -2 }}
                whileTap={{ scale: 0.72, y: -8 }}
                transition={{ type: "spring", stiffness: 500, damping: 14 }}
                onClick={(e) => handleVote("up", e)}
                className={cn(
                  "p-1.5 rounded-lg transition-all duration-150 cursor-none",
                  voteState === "up"
                    ? "text-blue-400 bg-blue-400/10 vote-active-up"
                    : "text-foreground-muted hover:text-blue-400 hover:bg-blue-400/8"
                )}
              >
                <ArrowUp className="w-5 h-5" />
              </motion.button>

              <AnimatePresence mode="wait">
                <motion.span
                  key={displayVotes}
                  initial={{ opacity: 0, scale: 0.5, y: -5 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.5, y: 5 }}
                  transition={{ duration: 0.15 }}
                  className={cn(
                    "text-sm font-bold tabular-nums min-w-[1.5rem] text-center",
                    voteState === "up" && "text-blue-400",
                    voteState === "down" && "text-rose-400"
                  )}
                >
                  {displayVotes}
                </motion.span>
              </AnimatePresence>

              <motion.button
                whileHover={{ scale: 1.28, y: 2 }}
                whileTap={{ scale: 0.72, y: 8 }}
                transition={{ type: "spring", stiffness: 500, damping: 14 }}
                onClick={(e) => handleVote("down", e)}
                className={cn(
                  "p-1.5 rounded-lg transition-all duration-150 cursor-none",
                  voteState === "down"
                    ? "text-rose-400 bg-rose-400/10 vote-active-down"
                    : "text-foreground-muted hover:text-rose-400 hover:bg-rose-400/8"
                )}
              >
                <ArrowDown className="w-5 h-5" />
              </motion.button>
            </div>

            {/* ─── Content ─── */}
            <div className="flex-1 min-w-0">
              {/* Status + Difficulty row */}
              <div className="flex items-center gap-2 mb-2.5 flex-wrap">
                <span
                  className={cn(
                    "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wide border",
                    statusCfg.style
                  )}
                  style={{ boxShadow: `0 0 12px -4px ${statusCfg.glow}` }}
                >
                  <statusCfg.icon className="w-3 h-3" />
                  {statusCfg.label}
                </span>

                <span
                  className={cn(
                    "px-2 py-0.5 rounded-full text-[11px] font-semibold border",
                    diffStyle.text, diffStyle.bg, diffStyle.border
                  )}
                  style={{ boxShadow: `0 0 10px -4px ${diffStyle.glow}` }}
                >
                  {difficulty.charAt(0) + difficulty.slice(1).toLowerCase()}
                </span>

                {isUnanswered && (
                  <motion.span
                    animate={{ opacity: [0.55, 1, 0.55] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="text-[10px] text-rose-400/80 font-medium ml-1"
                  >
                    ● Help needed
                  </motion.span>
                )}
              </div>

              {/* Title */}
              <h3
                className="text-[17px] sm:text-lg font-semibold leading-snug mb-1.5 transition-colors duration-200 line-clamp-2"
                style={{}}
              >
                <span className="text-foreground group-hover:text-[var(--primary-hover)] transition-colors duration-200">
                  {title}
                </span>
              </h3>

              {/* Description */}
              <p className="text-[13px] text-foreground-muted/80 line-clamp-2 mb-3 leading-relaxed">
                {description}
              </p>

              {/* Bottom row: tags + meta */}
              <div className="flex items-center justify-between gap-4">
                <div className="flex gap-1.5 flex-wrap">
                  {tags.map((tag) => (
                    <span
                      key={tag.id}
                      className="tag-pill"
                      style={{ borderLeftColor: tag.color, borderLeftWidth: 2 }}
                    >
                      {tag.name}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-3 text-[11px] text-foreground-muted/70 shrink-0">
                  <span className="flex items-center gap-1 hover:text-foreground-muted transition-colors">
                    <MessageSquare className="w-3 h-3" /> {answers}
                  </span>
                  <span className="flex items-center gap-1 hover:text-foreground-muted transition-colors">
                    <Eye className="w-3 h-3" /> {views}
                  </span>
                  <span className="flex items-center gap-1 hover:text-foreground-muted transition-colors">
                    <Clock className="w-3 h-3" /> {getTimeAgo(createdAt)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.article>
      </Link>
    </motion.div>
  );
}
