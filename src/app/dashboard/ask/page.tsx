"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Plus, X, Loader2, CheckCircle, AlertCircle, Sparkles } from "lucide-react";

export default function AskQuestionPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [difficulty, setDifficulty] = useState("MEDIUM");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  function addTag() {
    const tag = tagInput.trim();
    if (tag && !tags.includes(tag) && tags.length < 5) {
      setTags([...tags, tag]);
      setTagInput("");
    }
  }

  function removeTag(tag: string) {
    setTags(tags.filter((t) => t !== tag));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      setError("Title and description are required.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          difficulty,
          tags,
          authorId: (session?.user as any)?.id || "demo-user",
        }),
      });

      if (!res.ok) throw new Error("Failed to post");
      setSubmitted(true);
      setTimeout(() => router.push("/dashboard"), 1500);
    } catch {
      setError("Something went wrong. Please try again.");
      setSubmitting(false);
    }
  }

  const difficulties = [
    { value: "EASY", label: "Easy", style: "text-emerald-400 border-emerald-400/30 bg-emerald-400/10", glow: "rgba(16,185,129,0.3)" },
    { value: "MEDIUM", label: "Medium", style: "text-amber-400 border-amber-400/30 bg-amber-400/10", glow: "rgba(245,158,11,0.3)" },
    { value: "HARD", label: "Hard", style: "text-rose-400 border-rose-400/30 bg-rose-400/10", glow: "rgba(244,63,94,0.3)" },
  ];

  return (
    <div className="max-w-2xl mx-auto relative">
      {/* Dot grid background behind form */}
      <div className="dot-grid-bg" aria-hidden="true" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="relative z-10"
      >
        {/* Header */}
        <div className="flex items-center gap-3 mb-2">
          <div
            className="w-1 h-8 rounded-full"
            style={{
              background: "linear-gradient(180deg, var(--primary), var(--primary-light))",
              boxShadow: "0 0 12px var(--primary-glow)",
            }}
          />
          <h1 className="text-3xl font-bold tracking-tight">Ask a Question</h1>
        </div>
        <p className="text-foreground-muted mb-8 ml-4">
          Describe your problem clearly so others can help.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="space-y-2"
          >
            <label className="text-sm font-semibold text-foreground-muted flex items-center gap-2">
              <span>Title</span>
              <span className="text-xs text-blue-400/60 font-normal">Be specific and clear</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., How to implement binary search in Python?"
              className="input-glow w-full px-4 py-3 rounded-xl text-base cursor-none"
              style={{ cursor: "none" }}
              maxLength={200}
            />
            <p className="text-xs text-foreground-muted/60 text-right">
              <span className={title.length > 180 ? "text-rose-400" : ""}>{title.length}</span>/200
            </p>
          </motion.div>

          {/* Description */}
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15, duration: 0.4 }}
            className="space-y-2"
          >
            <label className="text-sm font-semibold text-foreground-muted flex items-center gap-2">
              <span>Description</span>
              <span className="text-xs text-blue-400/60 font-normal px-2 py-0.5 rounded-md bg-blue-400/10 border border-blue-400/20">
                Supports Markdown
              </span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Explain your problem in detail. Include code snippets, error messages, and what you've already tried..."
              rows={10}
              className="input-glow w-full px-4 py-3 rounded-xl text-base resize-none font-mono text-sm cursor-none"
              style={{ cursor: "none" }}
            />
          </motion.div>

          {/* Difficulty */}
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="space-y-2"
          >
            <label className="text-sm font-semibold text-foreground-muted">Difficulty</label>
            <div className="flex gap-3">
              {difficulties.map((d) => (
                <motion.button
                  key={d.value}
                  type="button"
                  whileHover={{ scale: 1.07, y: -2 }}
                  whileTap={{ scale: 0.93 }}
                  onClick={() => setDifficulty(d.value)}
                  className={`px-5 py-2 rounded-xl text-sm font-semibold border transition-all cursor-none ${
                    difficulty === d.value ? d.style : "border-[var(--border-color)] text-foreground-muted hover:border-primary/40 hover:text-foreground"
                  }`}
                  style={difficulty === d.value ? { boxShadow: `0 0 20px -6px ${d.glow}` } : {}}
                >
                  {d.label}
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Tags */}
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.25, duration: 0.4 }}
            className="space-y-2"
          >
            <label className="text-sm font-semibold text-foreground-muted">
              Tags{" "}
              <span className="text-xs font-normal text-foreground-muted/60">
                (up to 5)
              </span>
            </label>
            <div className="flex gap-2 items-center">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") { e.preventDefault(); addTag(); }
                }}
                placeholder="Type a tag and press Enter"
                className="input-glow flex-1 px-4 py-2.5 rounded-xl text-sm cursor-none"
                style={{ cursor: "none" }}
              />
              <motion.button
                type="button"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={addTag}
                className="p-2.5 rounded-xl text-foreground-muted hover:text-foreground transition-all cursor-none"
                style={{
                  background: "var(--primary-glow)",
                  border: "1px solid var(--primary)",
                }}
              >
                <Plus className="w-4 h-4" />
              </motion.button>
            </div>

            <AnimatePresence>
              {tags.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex flex-wrap gap-2 mt-2"
                >
                  {tags.map((tag) => (
                    <motion.span
                      key={tag}
                      initial={{ opacity: 0, scale: 0.75 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.75 }}
                      className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-sm font-medium"
                      style={{
                        background: "var(--primary-glow)",
                        border: "1px solid var(--primary)",
                        color: "var(--primary-light)",
                      }}
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="hover:opacity-70 transition-opacity cursor-none"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </motion.span>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10, height: 0 }}
                animate={{ opacity: 1, y: 0, height: "auto" }}
                exit={{ opacity: 0, y: -10, height: 0 }}
                className="flex items-center gap-2 p-3 rounded-xl text-sm"
                style={{
                  background: "rgba(244, 63, 94, 0.08)",
                  border: "1px solid rgba(244, 63, 94, 0.2)",
                  color: "#f43f5e",
                }}
              >
                <AlertCircle className="w-4 h-4 shrink-0" />
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Submit */}
          <motion.button
            type="submit"
            disabled={submitting || submitted}
            whileHover={!submitting && !submitted ? { scale: 1.03, y: -2 } : {}}
            whileTap={!submitting && !submitted ? { scale: 0.97 } : {}}
            className={`w-full py-3.5 rounded-2xl font-semibold text-white transition-all flex items-center justify-center gap-2 cursor-none ${
              submitted
                ? ""
                : "btn-primary"
            }`}
            style={
              submitted
                ? {
                    background: "var(--success)",
                    boxShadow: "0 0 30px rgba(16, 185, 129, 0.4)",
                  }
                : {}
            }
          >
            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.span
                  key="success"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-2"
                >
                  <CheckCircle className="w-5 h-5" /> Posted!
                </motion.span>
              ) : submitting ? (
                <motion.span
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-2"
                >
                  <Loader2 className="w-5 h-5 animate-spin" /> Posting...
                </motion.span>
              ) : (
                <motion.span
                  key="idle"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-2"
                >
                  <Send className="w-5 h-5" /> Post Question
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}
