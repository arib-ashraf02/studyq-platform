"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { QuestionCard } from "@/components/ui/QuestionCard";
import { SkeletonList } from "@/components/ui/Skeleton";
import { AlertTriangle, Flame } from "lucide-react";

export default function NeedsAttentionPage() {
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/questions?status=UNANSWERED", { signal: controller.signal })
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setQuestions(data);
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

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <motion.div
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 14 }}
            className="relative p-2.5 rounded-xl bg-danger/10 border border-danger/20"
          >
            <Flame className="w-6 h-6 text-danger" />
            {/* Pulsing ring */}
            <motion.div
              animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0 rounded-xl border-2 border-danger/30"
            />
          </motion.div>
          <div>
            <h1 className="text-3xl font-bold">Needs Attention</h1>
            <p className="text-foreground-muted text-sm mt-0.5">
              These questions haven&apos;t received any answers yet. Help a fellow student out!
            </p>
          </div>
        </div>

        {!loading && questions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: "auto" }}
            className="inline-flex items-center gap-2 px-3 py-1.5 mt-3 rounded-full bg-danger/10 border border-danger/20 text-danger text-xs font-semibold"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            {questions.length} question{questions.length !== 1 ? "s" : ""} waiting for answers
          </motion.div>
        )}
      </div>

      {loading ? (
        <SkeletonList count={4} />
      ) : error ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
          <p className="text-foreground-muted">Failed to load. Please try again.</p>
        </motion.div>
      ) : questions.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16"
        >
          <div className="text-6xl mb-4">🎉</div>
          <h3 className="text-xl font-semibold mb-2">All caught up!</h3>
          <p className="text-foreground-muted">Every question has received at least one answer.</p>
        </motion.div>
      ) : (
        <div className="space-y-4">
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
        </div>
      )}
    </div>
  );
}
