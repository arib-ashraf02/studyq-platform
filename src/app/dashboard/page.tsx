"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { QuestionCard } from "@/components/ui/QuestionCard";
import { SkeletonList } from "@/components/ui/Skeleton";
import { Flame, Clock, TrendingUp, Eye, X, Plus, Tag, Search } from "lucide-react";

const tabs = [
  { id: "newest", label: "Newest", icon: Clock },
  { id: "unanswered", label: "Needs Attention", icon: Flame },
  { id: "votes", label: "Top Voted", icon: TrendingUp },
  { id: "views", label: "Most Viewed", icon: Eye },
];

export default function DashboardPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("newest");

  // Read search/tag filters from URL
  const searchQuery = searchParams.get("search") || "";
  const tagFilter = searchParams.get("tag") || "";

  const fetchQuestions = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("sort", activeTab);
      if (searchQuery) params.set("search", searchQuery);
      if (tagFilter) params.set("tag", tagFilter);
      const res = await fetch(`/api/questions?${params.toString()}`);
      const data = await res.json();
      setQuestions(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setQuestions([]);
    }
    setLoading(false);
  }, [activeTab, searchQuery, tagFilter]);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  function clearFilter() {
    router.push("/dashboard");
  }

  const isFiltered = searchQuery || tagFilter;

  return (
    <div>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-6"
      >
        <div className="flex items-center gap-3 mb-2">
          <div
            className="w-1 h-8 rounded-full"
            style={{
              background: "linear-gradient(180deg, var(--primary), var(--primary-light))",
              boxShadow: "0 0 12px var(--primary-glow)",
            }}
          />
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        </div>
        <p className="text-foreground-muted ml-4">Browse questions, help others, earn reputation.</p>
      </motion.div>

      {/* Active filter banner */}
      <AnimatePresence>
        {isFiltered && (
          <motion.div
            initial={{ opacity: 0, height: 0, marginBottom: 0 }}
            animate={{ opacity: 1, height: "auto", marginBottom: 24 }}
            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
            className="flex items-center justify-between px-4 py-2.5 rounded-xl"
            style={{ background: "var(--primary-glow)", border: "1px solid var(--primary)" }}
          >
            <div className="flex items-center gap-2 text-sm">
              {searchQuery && (
                <span className="flex items-center gap-1.5 text-foreground-muted">
                  <Search className="w-3.5 h-3.5 text-primary" />
                  Searching for: <strong className="text-primary">"{searchQuery}"</strong>
                </span>
              )}
              {tagFilter && (
                <span className="flex items-center gap-1.5 text-foreground-muted">
                  <Tag className="w-3.5 h-3.5 text-primary" />
                  Tag: <strong className="text-primary">{tagFilter}</strong>
                </span>
              )}
            </div>
            <button
              onClick={clearFilter}
              className="flex items-center gap-1 text-xs text-foreground-muted hover:text-foreground transition-colors cursor-none"
            >
              <X className="w-3.5 h-3.5" /> Clear
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tab bar */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="flex items-center gap-1 mb-8 p-1.5 rounded-2xl w-fit overflow-x-auto"
        style={{
          background: "var(--card)",
          border: "1px solid var(--border-color)",
          backdropFilter: "blur(12px)",
        }}
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="relative cursor-none shrink-0"
          >
            <motion.div
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors z-10 relative cursor-none ${
                activeTab === tab.id ? "text-white" : "text-foreground-muted hover:text-foreground"
              }`}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
            >
              <tab.icon
                className={`w-4 h-4 transition-colors ${
                  activeTab === tab.id ? "text-blue-400" : ""
                }`}
                style={
                  activeTab === tab.id
                    ? { filter: "drop-shadow(0 0 6px var(--primary-glow))" }
                    : undefined
                }
              />
              {tab.label}
            </motion.div>

            {activeTab === tab.id && (
              <motion.div
                layoutId="tab-indicator"
                className="tab-active-bg absolute inset-0 rounded-xl bg-blue-500/10 border border-blue-500/20"
                style={{ zIndex: 0 }}
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
          </button>
        ))}
      </motion.div>

      {/* Question list */}
      {loading ? (
        <SkeletonList count={4} />
      ) : questions.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center py-20"
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 2.5, repeat: Infinity }}
            className="text-6xl mb-5"
          >
            {isFiltered ? "🔍" : "🤔"}
          </motion.div>
          <h3 className="text-xl font-semibold mb-2">
            {isFiltered ? "No results found" : "No questions yet"}
          </h3>
          <p className="text-foreground-muted mb-6">
            {isFiltered
              ? `No questions matched "${searchQuery || tagFilter}". Try a different search.`
              : "Be the first to ask a question!"}
          </p>
          <div className="flex gap-3 justify-center">
            {isFiltered && (
              <button
                onClick={clearFilter}
                className="btn-secondary px-5 py-2.5 rounded-xl text-sm font-medium cursor-none"
              >
                Clear Filter
              </button>
            )}
            <Link href="/dashboard/ask">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-primary flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-white cursor-none"
              >
                <Plus className="w-4 h-4" /> Ask a Question
              </motion.button>
            </Link>
          </div>
        </motion.div>
      ) : (
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          {questions.map((q: any, i: number) => (
            <QuestionCard
              key={q.id}
              id={q.id}
              title={q.title}
              description={q.description}
              tags={q.tags}
              votes={q.votes}
              answers={q.answers}
              views={q.views}
              status={q.status}
              difficulty={q.difficulty}
              author={q.author}
              createdAt={q.createdAt}
              index={i}
            />
          ))}
        </motion.div>
      )}
    </div>
  );
}
