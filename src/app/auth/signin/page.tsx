"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, Loader2, ArrowRight, Sparkles, Shield } from "lucide-react";
import Link from "next/link";

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}

export default function SignInPage() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
  const authError = searchParams.get("error");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleCredentialLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!email) { setError("Email is required"); return; }
    setLoading(true);
    setError("");
    await signIn("credentials", {
      email,
      password: password || "demo",
      callbackUrl,
      redirect: true,
    });
  }

  async function handleGoogleLogin() {
    setGoogleLoading(true);
    await signIn("google", { callbackUrl });
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden"
      style={{ background: "var(--background)" }}
    >
      {/* Center radial glow */}
      <div className="login-center-glow" aria-hidden="true" />

      {/* Dot grid */}
      <div className="dot-grid-bg" aria-hidden="true" />

      <motion.div
        initial={{ opacity: 0, y: 36, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="w-full max-w-md relative z-10"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block cursor-none">
            <motion.div
              whileHover={{ scale: 1.06 }}
              className="flex items-center justify-center gap-2 mb-5"
            >
              <div
                className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-2xl font-black text-white"
                style={{ boxShadow: "0 0 40px var(--primary-glow), 0 4px 16px rgba(0,0,0,0.4)" }}
              >
                Q
              </div>
            </motion.div>
          </Link>
          <h1 className="text-3xl font-bold mb-2 tracking-tight">Welcome back</h1>
          <p className="text-foreground-muted">
            Sign in to continue to{" "}
            <span className="gradient-text font-semibold">StudyQ</span>
          </p>
        </div>

        {/* Main Card */}
        <motion.div
          className="relative p-8 rounded-3xl overflow-hidden"
          style={{
            background: "var(--card)",
            border: "1px solid var(--border-color)",
            backdropFilter: "blur(32px)",
            boxShadow: "0 32px 80px rgba(0,0,0,0.3), 0 0 60px -20px var(--login-glow)",
          }}
        >
          {/* Inner glow */}
          <div
            className="absolute inset-0 pointer-events-none rounded-3xl"
            style={{
              background: "radial-gradient(ellipse at 50% 0%, var(--primary-glow), transparent 60%)",
            }}
          />

          {/* Error message */}
          <AnimatePresence>
            {(error || authError) && (
              <motion.div
                initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                animate={{ opacity: 1, height: "auto", marginBottom: 24 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                className="p-3 rounded-xl border text-sm relative z-10"
                style={{
                  background: "rgba(244, 63, 94, 0.08)",
                  borderColor: "rgba(244, 63, 94, 0.25)",
                  color: "#f43f5e",
                }}
              >
                {error || "Authentication failed. Please try again."}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Google Button */}
          <motion.button
            whileHover={{ scale: 1.03, boxShadow: "0 8px 24px rgba(0,0,0,0.2)" }}
            whileTap={{ scale: 0.97 }}
            onClick={handleGoogleLogin}
            disabled={googleLoading}
            className="w-full flex items-center justify-center gap-3 px-4 py-3.5 rounded-2xl bg-white text-gray-800 font-semibold text-sm hover:bg-gray-50 transition-all disabled:opacity-60 cursor-none relative z-10"
            style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.2)" }}
          >
            {googleLoading ? (
              <Loader2 className="w-5 h-5 animate-spin text-gray-500" />
            ) : (
              <>
                <GoogleIcon className="w-5 h-5" />
                Continue with Google
              </>
            )}
          </motion.button>

          {/* Divider */}
          <div className="relative my-6 z-10">
            <div className="absolute inset-0 flex items-center">
              <div
                className="w-full h-px"
                style={{ background: "linear-gradient(90deg, transparent, var(--border-color), transparent)" }}
              />
            </div>
            <div className="relative flex justify-center">
              <span
                className="px-4 text-xs text-foreground-muted"
                style={{ background: "var(--card)" }}
              >
                or continue with email
              </span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleCredentialLogin} className="space-y-4 relative z-10">
            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground-muted uppercase tracking-widest">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-muted" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="input-glow w-full pl-10 pr-4 py-3 rounded-xl text-sm cursor-none"
                  style={{ cursor: "none" }}
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground-muted uppercase tracking-widest">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-muted" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password (any for demo)"
                  className="input-glow w-full pl-10 pr-4 py-3 rounded-xl text-sm cursor-none"
                  style={{ cursor: "none" }}
                />
              </div>
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={!loading ? { scale: 1.03 } : {}}
              whileTap={!loading ? { scale: 0.97 } : {}}
              className="btn-primary w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl font-semibold text-white disabled:opacity-60 cursor-none"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Sign In <ArrowRight className="w-4 h-4" />
                </>
              )}
            </motion.button>
          </form>

          {/* Demo hint */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-6 p-3 rounded-xl relative z-10"
            style={{
              background: "var(--primary-glow)",
              border: "1px solid var(--primary)",
            }}
          >
            <div className="flex items-center gap-2 text-xs text-foreground-muted">
              <Sparkles className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              <span>
                <strong className="text-blue-400">Demo mode:</strong> Enter any email to sign in.
                Use Google for real authentication.
              </span>
            </div>
          </motion.div>
        </motion.div>

        {/* Footer */}
        <p className="text-center text-xs text-foreground-muted mt-6">
          Don&apos;t have an account?{" "}
          <button
            type="button"
            onClick={() => {
              const emailInput = document.querySelector<HTMLInputElement>('input[type="email"]');
              emailInput?.focus();
              emailInput?.scrollIntoView({ behavior: "smooth", block: "center" });
            }}
            className="text-blue-400 hover:text-primary transition-colors font-medium cursor-none underline-offset-2 hover:underline"
          >
            Sign up for free
          </button>
        </p>
      </motion.div>
    </div>
  );
}
