"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Tag } from "lucide-react";

interface TagData {
  id: string;
  name: string;
  color: string;
  _count: { questions: number };
}

export default function TagsPage() {
  const [tags, setTags] = useState<TagData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/tags", { signal: controller.signal })
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setTags(data);
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
            initial={{ rotate: -20, scale: 0 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
            className="p-2.5 rounded-xl bg-primary/10 border border-primary/20"
          >
            <Tag className="w-6 h-6 text-primary" />
          </motion.div>
          <div>
            <h1 className="text-3xl font-bold">Browse Tags</h1>
            <p className="text-foreground-muted text-sm mt-0.5">Explore questions by topic. Click any tag to filter.</p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="skeleton h-28 rounded-2xl" />
          ))}
        </div>
      ) : error || tags.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
          <div className="text-5xl mb-3">🏷️</div>
          <p className="text-foreground-muted">No tags found yet.</p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {tags.map((tag, i) => (
            <motion.div
              key={tag.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.04, duration: 0.25 }}
            >
              <Link href={`/dashboard?tag=${tag.name}`}>
                <motion.div
                  whileHover={{ scale: 1.04, y: -3 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ duration: 0.2 }}
                  className="group p-5 rounded-2xl glass-card hover:shadow-glow cursor-pointer h-full"
                >
                  <div
                    className="w-4 h-4 rounded-full mb-3 group-hover:shadow-[0_0_10px_2px] transition-shadow duration-300"
                    style={{ backgroundColor: tag.color, boxShadow: `0 0 0px ${tag.color}` }}
                  />
                  <h3 className="font-semibold text-sm mb-1 group-hover:text-primary transition-colors duration-150">
                    {tag.name}
                  </h3>
                  <p className="text-xs text-foreground-muted">
                    {tag._count.questions} question{tag._count.questions !== 1 ? "s" : ""}
                  </p>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
