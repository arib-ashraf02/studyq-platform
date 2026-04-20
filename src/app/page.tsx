"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { useRef } from "react";
import {
  ArrowRight, BookOpen, Users, Sparkles, Zap, MessageSquare, Trophy,
  Code2, GraduationCap, Brain, Lightbulb, Sun, Moon
} from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

const features = [
  {
    icon: BookOpen,
    title: "Ask Anything",
    description: "Post questions with rich Markdown, code blocks, and tags. Get help from the community.",
    gradient: "from-blue-500/20 to-indigo-500/20",
    glow: "rgba(59, 130, 246, 0.4)",
  },
  {
    icon: Users,
    title: "Collaborative Answers",
    description: "Multiple perspectives on every problem. Upvote the best solutions.",
    gradient: "from-cyan-500/20 to-blue-500/20",
    glow: "rgba(6, 182, 212, 0.4)",
  },
  {
    icon: Zap,
    title: "Needs Attention Feed",
    description: "Unanswered questions are prioritized so no one gets left behind.",
    gradient: "from-amber-500/20 to-orange-500/20",
    glow: "rgba(245, 158, 11, 0.4)",
  },
  {
    icon: MessageSquare,
    title: "Threaded Discussions",
    description: "Engage in deep conversations with nested replies on every question and answer.",
    gradient: "from-blue-500/20 to-indigo-500/20",
    glow: "rgba(79, 70, 229, 0.4)",
  },
  {
    icon: Trophy,
    title: "Earn Reputation",
    description: "Get points for quality answers, earn badges, and climb the leaderboard.",
    gradient: "from-yellow-500/20 to-amber-500/20",
    glow: "rgba(234, 179, 8, 0.4)",
  },
  {
    icon: Sparkles,
    title: "Smart Discovery",
    description: "Find questions through tags, search, filters, and AI-powered suggestions.",
    gradient: "from-emerald-500/20 to-teal-500/20",
    glow: "rgba(16, 185, 129, 0.4)",
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 36 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] } },
};

// Floating icons in hero
const floatingIcons = [
  { icon: Code2, x: "8%", y: "20%", size: 28, delay: 0, duration: 7 },
  { icon: Brain, x: "88%", y: "25%", size: 24, delay: 1.5, duration: 9 },
  { icon: GraduationCap, x: "12%", y: "72%", size: 32, delay: 0.8, duration: 8 },
  { icon: Lightbulb, x: "85%", y: "68%", size: 22, delay: 2, duration: 6 },
  { icon: BookOpen, x: "5%", y: "47%", size: 20, delay: 3, duration: 10 },
  { icon: Trophy, x: "92%", y: "48%", size: 20, delay: 1, duration: 8.5 },
];

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const { theme, setTheme } = useTheme();

  // Parallax for hero content and orbs
  const heroY = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const orbTopY = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const orbBotY = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0.3]);

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: "var(--background)" }}>

      {/* ── Landing Nav ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 sm:px-10 py-4 navbar-glass">
        <Link href="/" className="flex items-center gap-2.5 group">
          <motion.div
            whileHover={{ rotate: 12, scale: 1.12 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
            className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-sm font-black text-white shadow-glow"
          >
            Q
          </motion.div>
          <span className="text-xl font-bold tracking-tight">
            Study<span className="gradient-text">Q</span>
          </span>
        </Link>

        <div className="flex items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setTheme(theme.id === "dark" ? "light" : "dark")}
            className="nav-icon-btn cursor-none"
            title={theme.id === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {theme.id === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </motion.button>
          <Link href="/auth/signin">
            <motion.button
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.94 }}
              className="btn-secondary px-5 py-2 rounded-xl text-sm font-medium cursor-none"
            >
              Sign In
            </motion.button>
          </Link>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section
        ref={heroRef}
        className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 text-center"
      >
        {/* Floating icons */}
        {floatingIcons.map(({ icon: Icon, x, y, size, delay, duration }, i) => (
          <motion.div
            key={i}
            className="hero-floating-icon hidden md:block"
            style={{ left: x, top: y }}
            animate={{
              y: [0, -18, 0],
              rotate: [0, i % 2 === 0 ? 8 : -8, 0],
            }}
            transition={{
              duration,
              delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <Icon size={size} />
          </motion.div>
        ))}

        {/* Parallax wrapper */}
        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="max-w-4xl w-full">

          {/* Badge pill */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 mb-8 rounded-full glass-card-static border border-white/10 text-sm text-foreground-muted cursor-none"
          >
            <motion.span
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="w-4 h-4 text-blue-400" />
            </motion.span>
            <span>Built for students, by learners</span>
          </motion.div>

          {/* Main heading */}
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="heading-glow text-5xl sm:text-7xl font-extrabold tracking-tight mb-6 leading-[1.1]"
          >
            Never get stuck
            <br />
            <span
              className="gradient-text animate-text-glow"
              style={{ display: "inline-block" }}
            >
              studying alone
            </span>
          </motion.h1>

          {/* Sub heading */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.7 }}
            className="text-lg sm:text-xl text-foreground-muted max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Log questions you couldn&apos;t solve during study sessions, and let the community help.
            Earn reputation by answering others.{" "}
            <span className="text-foreground/80">Knowledge grows when shared.</span>
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link href="/dashboard">
              <motion.button
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.94 }}
                className="group btn-primary flex items-center gap-3 px-8 py-4 rounded-2xl font-semibold text-lg text-white cursor-none"
              >
                Start Learning
                <motion.div
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <ArrowRight className="w-5 h-5" />
                </motion.div>
              </motion.button>
            </Link>
            <Link href="/dashboard/tags">
              <motion.button
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.94 }}
                className="btn-secondary px-8 py-4 rounded-2xl font-semibold text-lg cursor-none"
              >
                Browse Topics
              </motion.button>
            </Link>
          </motion.div>

          {/* Stats strip */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1, duration: 0.8 }}
            className="flex items-center justify-center gap-8 mt-14 text-sm text-foreground-muted"
          >
            {[
              { label: "Questions Asked", value: "500+" },
              { label: "Active Learners", value: "120+" },
              { label: "Answers Given", value: "1.2k+" },
            ].map(({ label, value }) => (
              <div key={label} className="text-center">
                <p className="text-xl font-bold gradient-text">{value}</p>
                <p className="text-xs mt-0.5">{label}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6 }}
          className="absolute bottom-8"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            className="w-6 h-10 border-2 border-white/15 rounded-full flex justify-center pt-2 cursor-none"
            style={{ boxShadow: "0 0 12px var(--primary-glow)" }}
          >
            <motion.div
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: "var(--primary-light)" }}
            />
          </motion.div>
        </motion.div>
      </section>

      {/* ── Features Section ── */}
      <section className="relative z-10 max-w-6xl mx-auto px-4 py-28">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-sm font-semibold text-blue-400 uppercase tracking-widest mb-3"
          >
            Powerful Features
          </motion.p>
          <h2 className="text-3xl sm:text-5xl font-bold mb-4 tracking-tight">
            Everything you need to{" "}
            <span className="gradient-text">learn better</span>
          </h2>
          <p className="text-foreground-muted text-lg max-w-xl mx-auto leading-relaxed">
            A platform designed to make collaborative learning effortless and rewarding.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={item}
              whileHover={{ y: -8, scale: 1.02 }}
              transition={{ duration: 0.3 }}
              className="group p-6 rounded-2xl glass-card cursor-default relative overflow-hidden"
            >
              {/* Inner glow on hover */}
              <div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{ background: `radial-gradient(circle at 30% 30%, ${feature.glow.replace("0.4", "0.06")}, transparent 70%)` }}
              />

              {/* Icon */}
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_0_20px_-4px_${feature.glow}]`}>
                <feature.icon className="w-6 h-6 text-white/80 group-hover:text-white transition-colors" />
              </div>

              <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors duration-300">{feature.title}</h3>
              <p className="text-sm text-foreground-muted leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── CTA Section ── */}
      <section className="relative z-10 max-w-4xl mx-auto px-4 py-24 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.97 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7 }}
          className="relative p-12 sm:p-16 rounded-3xl glass-card border border-white/[0.08] overflow-hidden"
        >
          {/* CTA gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-transparent to-indigo-900/15 pointer-events-none" />

          {/* Glow orb behind */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full pointer-events-none"
            style={{ background: "radial-gradient(circle, var(--primary-glow), transparent 70%)" }}
          />

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-sm font-semibold text-blue-400 uppercase tracking-widest mb-4 relative z-10"
          >
            Join the Community
          </motion.p>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 relative z-10 tracking-tight">
            Ready to level up your{" "}
            <span className="gradient-text">learning?</span>
          </h2>
          <p className="text-foreground-muted mb-10 relative z-10 text-lg">
            Join the community. Ask your first question today and start your journey.
          </p>
          <Link href="/dashboard/ask">
            <motion.button
              whileHover={{ scale: 1.07 }}
              whileTap={{ scale: 0.95 }}
              className="btn-primary relative z-10 px-10 py-4 rounded-2xl font-semibold text-lg text-white cursor-none"
            >
              Ask Your First Question
            </motion.button>
          </Link>
        </motion.div>
      </section>

      {/* ── Footer ── */}
      <footer className="relative z-10 py-8 text-center text-sm text-foreground-muted">
        <div className="section-divider mb-8 max-w-2xl mx-auto" />
        <p>© 2026 StudyQ. Built with ❤️ for learners everywhere.</p>
      </footer>
    </div>
  );
}
