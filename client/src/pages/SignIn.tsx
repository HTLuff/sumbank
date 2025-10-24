// src/pages/SignIn.tsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function SignIn() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const canSubmit = email.trim() !== "" && pw.trim() !== "";

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setLoading(true);
    // mock auth flow
    await new Promise((r) => setTimeout(r, 600));
    setLoading(false);
    navigate("/balance");
  }

  return (
    <div className="min-h-dvh bg-white text-neutral-900">
      {/* App header */}
      <header className="mx-auto max-w-md px-6 pt-10">
        {/* Logo placeholder */}
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-fuchsia-500 via-rose-500 to-amber-400" />
          <span className="text-xl font-semibold tracking-tight">sum bank</span>
        </div>
      </header>

      {/* Main content */}
      <main className="mx-auto max-w-md px-6 pt-10">
        <h1 className="text-2xl font-semibold leading-tight">Welcome back</h1>
        <p className="mt-2 text-sm text-neutral-600">
          Sign in to see your balance and recent transfers
        </p>

        <form onSubmit={onSubmit} className="mt-8 space-y-5">
          {/* Email */}
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              inputMode="email"
              autoComplete="email"
              className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-base outline-none ring-0 transition focus:border-neutral-400 focus:ring-0"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPw ? "text" : "password"}
                autoComplete="current-password"
                className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 pr-12 text-base outline-none ring-0 transition focus:border-neutral-400 focus:ring-0"
                placeholder="••••••••"
                value={pw}
                onChange={(e) => setPw(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPw((s) => !s)}
                className="absolute inset-y-0 right-0 mr-1 my-1 rounded-lg px-3 text-sm text-neutral-600 hover:bg-neutral-100 active:bg-neutral-200"
                aria-label={showPw ? "Hide password" : "Show password"}
              >
                {showPw ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={!canSubmit || loading}
            className={`w-full rounded-xl px-4 py-3 text-base font-semibold text-white transition
              ${
                !canSubmit || loading
                  ? "bg-neutral-300"
                  : "bg-neutral-900 hover:bg-neutral-800 active:bg-black"
              }`}
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>

          {/* Secondary actions */}
          <div className="flex items-center justify-between pt-1">
            <Link
              to="/signup"
              className="text-sm font-medium text-neutral-800 underline underline-offset-4 hover:opacity-80"
            >
              Create an account
            </Link>
            <button
              type="button"
              className="text-sm text-neutral-600 hover:text-neutral-800"
              onClick={() => alert("Password reset coming soon")}
            >
              Forgot password
            </button>
          </div>
        </form>

        {/* Footer help */}
        <p className="mt-10 text-center text-xs text-neutral-500">
          By continuing you agree to our Terms and Privacy
        </p>
      </main>
    </div>
  );
}
