"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";
import {
  ArrowUp, ArrowDown, CheckCircle, MessageSquare, Clock, Eye, Send,
  Loader2, ChevronDown, ChevronUp, User, Award, ArrowLeft,
} from "lucide-react";
import { Confetti } from "@/components/ui/Confetti";

function getTimeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

function CommentThread({ comments }: { comments: any[] }) {
  const [showAll, setShowAll] = useState(false);
  const displayed = showAll ? comments : comments.slice(0, 2);

  return (
    <div className="mt-4 pt-4 border-t border-[var(--border-color)]">
      <AnimatePresence>
        {displayed.map((c: any) => (
          <motion.div
            key={c.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
            className="flex gap-3 py-2"
          >
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary/50 to-accent/50 flex items-center justify-center text-white text-xs shrink-0 mt-0.5">
              {c.author?.name?.charAt(0) || "?"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm">
                <span className="font-medium text-primary">{c.author?.name}</span>{" "}
                <span className="text-foreground-muted">{c.content}</span>
              </p>
              <span className="text-xs text-foreground-muted">{getTimeAgo(c.createdAt)}</span>

              {/* Nested replies */}
              {c.replies?.length > 0 && (
                <div className="ml-4 mt-2 pl-4 border-l border-[var(--border-color)]">
                  {c.replies.map((r: any) => (
                    <div key={r.id} className="flex gap-2 py-1">
                      <div className="w-5 h-5 rounded-full flex items-center justify-center text-xs shrink-0" style={{ background: "var(--card-hover)", border: "1px solid var(--border-color)" }}>
                        {r.author?.name?.charAt(0) || "?"}
                      </div>
                      <p className="text-xs">
                        <span className="font-medium">{r.author?.name}</span>{" "}
                        <span className="text-foreground-muted">{r.content}</span>
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {comments.length > 2 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="flex items-center gap-1 text-xs text-primary hover:text-primary-hover transition-colors mt-1"
        >
          {showAll ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          {showAll ? "Show less" : `Show ${comments.length - 2} more comments`}
        </button>
      )}
    </div>
  );
}

export default function QuestionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const [question, setQuestion] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [newAnswer, setNewAnswer] = useState("");
  const [submittingAnswer, setSubmittingAnswer] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (params.id) {
      fetch(`/api/questions/${params.id}`)
        .then((r) => r.json())
        .then((data) => { setQuestion(data); setLoading(false); })
        .catch(() => setLoading(false));
    }
  }, [params.id]);

  async function submitAnswer() {
    if (!newAnswer.trim()) return;
    setSubmittingAnswer(true);
    try {
      // Use the current session user's ID, falling back to question author as demo
      const authorId = (session?.user as any)?.id || question.authorId;
      await fetch(`/api/questions/${params.id}/answers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newAnswer, authorId }),
      });
      setNewAnswer("");
      // Refetch
      const res = await fetch(`/api/questions/${params.id}`);
      setQuestion(await res.json());
    } catch (err) {
      console.error(err);
    }
    setSubmittingAnswer(false);
  }

  async function acceptAnswer(answerId: string) {
    try {
      await fetch(`/api/questions/${params.id}/accept`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answerId }),
      });
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
      // Refetch
      const res = await fetch(`/api/questions/${params.id}`);
      setQuestion(await res.json());
    } catch (err) {
      console.error(err);
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="skeleton h-10 w-3/4 rounded-xl" />
        <div className="skeleton h-4 w-1/2 rounded" />
        <div className="skeleton h-40 rounded-2xl" />
        <div className="skeleton h-40 rounded-2xl" />
      </div>
    );
  }

  if (!question) {
    return (
      <div className="text-center py-20">
        <p className="text-2xl mb-2">😕</p>
        <p className="text-foreground-muted">Question not found.</p>
      </div>
    );
  }

  const statusColor = question.status === "RESOLVED"
    ? "text-green-400 bg-green-400/10 border-green-400/30"
    : question.status === "PARTIALLY_ANSWERED"
      ? "text-yellow-400 bg-yellow-400/10 border-yellow-400/30"
      : "text-red-400 bg-red-400/10 border-red-400/30";

  return (
    <div>
      <Confetti active={showConfetti} />

      {/* Back button */}
      <motion.button
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => router.back()}
        className="flex items-center gap-1.5 text-sm text-foreground-muted hover:text-foreground transition-colors mb-6 cursor-none group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
        Back to questions
      </motion.button>

      {/* Question header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${statusColor}`}>
            {question.status === "RESOLVED" && <CheckCircle className="w-3.5 h-3.5" />}
            {question.status.replace("_", " ")}
          </span>
          {question.tags?.map((tag: any) => (
            <span
              key={tag.id}
              className="tag-pill px-2.5 py-1 rounded-md text-xs font-medium bg-[var(--background-secondary)] border border-[var(--border-color)] text-foreground-muted"
              style={{ borderLeftColor: tag.color, borderLeftWidth: 2 }}
            >
              {tag.name}
            </span>
          ))}
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold mb-4">{question.title}</h1>

        <div className="flex items-center gap-4 text-sm text-foreground-muted mb-6">
          <span className="flex items-center gap-1.5">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-xs">
              {question.author?.name?.charAt(0) || "?"}
            </div>
            {question.author?.name}
          </span>
          <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {getTimeAgo(question.createdAt)}</span>
          <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" /> {question.views} views</span>
          <span className="flex items-center gap-1"><MessageSquare className="w-3.5 h-3.5" /> {question._count?.answers} answers</span>
        </div>

        {/* Question body */}
        <div className="p-6 rounded-2xl glass-card mb-8">
          <div className="prose prose-sm max-w-none whitespace-pre-wrap leading-relaxed" style={{ color: 'var(--foreground)' }}>
            {question.description}
          </div>

          {question.comments?.length > 0 && (
            <CommentThread comments={question.comments} />
          )}
        </div>
      </motion.div>

      {/* Answers */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-primary" />
          {question.answers?.length || 0} Answer{question.answers?.length !== 1 ? "s" : ""}
        </h2>

        <div className="space-y-4">
          <AnimatePresence>
            {question.answers?.map((answer: any, i: number) => (
              <motion.div
                key={answer.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.3 }}
                className={`p-5 rounded-2xl glass-card ${
                  answer.isAccepted
                    ? "border-green-500/30 shadow-[0_0_20px_rgba(34,197,94,0.1)]"
                    : ""
                }`}
              >
                {/* Accepted badge */}
                {answer.isAccepted && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center gap-2 mb-3 text-green-400 text-sm font-semibold"
                  >
                    <CheckCircle className="w-5 h-5" />
                    Accepted Answer
                  </motion.div>
                )}

                <div className="flex gap-4">
                  {/* Vote column */}
                  <div className="flex flex-col items-center gap-1">
                    <motion.button
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.8, y: -4 }}
                      className="p-1 text-foreground-muted hover:text-primary transition-colors"
                    >
                      <ArrowUp className="w-5 h-5" />
                    </motion.button>
                    <span className="text-sm font-bold">{answer._count?.votes || 0}</span>
                    <motion.button
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.8, y: 4 }}
                      className="p-1 text-foreground-muted hover:text-danger transition-colors"
                    >
                      <ArrowDown className="w-5 h-5" />
                    </motion.button>

                    {/* Accept button */}
                    {!answer.isAccepted && question.status !== "RESOLVED" && (
                      <motion.button
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.8 }}
                        onClick={() => acceptAnswer(answer.id)}
                        className="mt-2 p-1.5 rounded-lg text-foreground-muted hover:text-green-400 hover:bg-green-400/10 transition-all"
                        title="Accept this answer"
                      >
                        <CheckCircle className="w-5 h-5" />
                      </motion.button>
                    )}
                  </div>

                  {/* Answer content */}
                  <div className="flex-1 min-w-0">
                    <div className="prose prose-sm max-w-none whitespace-pre-wrap leading-relaxed mb-4" style={{ color: 'var(--foreground)' }}>
                      {answer.content}
                    </div>

                    <div className="flex items-center gap-3 text-xs text-foreground-muted">
                      <span className="flex items-center gap-1.5">
                        <div className="w-5 h-5 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-[10px]">
                          {answer.author?.name?.charAt(0) || "?"}
                        </div>
                        {answer.author?.name}
                      </span>
                      <span className="flex items-center gap-1">
                        <Award className="w-3 h-3" /> {answer.author?.reputation}
                      </span>
                      <span>{getTimeAgo(answer.createdAt)}</span>
                    </div>

                    {answer.comments?.length > 0 && (
                      <CommentThread comments={answer.comments} />
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Post answer form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
        className="p-6 rounded-2xl glass-card"
      >
        <h3 className="text-lg font-semibold mb-4">Your Answer</h3>
        <textarea
          value={newAnswer}
          onChange={(e) => setNewAnswer(e.target.value)}
          placeholder="Write your answer here... (Supports Markdown)"
          rows={6}
          className="input-glow w-full px-4 py-3 rounded-xl text-sm font-mono resize-none mb-4"
        />
        <motion.button
          whileHover={!submittingAnswer ? { scale: 1.02 } : {}}
          whileTap={!submittingAnswer ? { scale: 0.98 } : {}}
          onClick={submitAnswer}
          disabled={submittingAnswer || !newAnswer.trim()}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-primary to-accent text-white font-semibold shadow-glow hover:shadow-glow-lg transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submittingAnswer ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> Posting...</>
          ) : (
            <><Send className="w-4 h-4" /> Post Answer</>
          )}
        </motion.button>
      </motion.div>
    </div>
  );
}
