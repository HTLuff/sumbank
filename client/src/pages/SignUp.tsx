import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function SignUp() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [cpw, setCpw] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const pwOk = pw.length >= 8;
  const match = pw === cpw;
  const canSubmit = name.trim() && email.trim() && pwOk && match;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setLoading(true);
    // mock signup
    await new Promise((r) => setTimeout(r, 700));
    setLoading(false);
    navigate("/balance");
  }

  return (
    <div className="min-h-dvh bg-white text-neutral-900">
      {/* Header */}
      <header className="mx-auto max-w-md px-6 pt-10">
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-fuchsia-500 via-rose-500 to-amber-400" />
          <span className="text-xl font-semibold tracking-tight">sum bank</span>
        </div>
      </header>

      {/* Main */}
      <main className="mx-auto max-w-md px-6 pt-10">
        <h1 className="text-2xl font-semibold leading-tight">
          Create your account
        </h1>
        <p className="mt-2 text-sm text-neutral-600">
          It takes less than a minute
        </p>

        <form onSubmit={onSubmit} className="mt-8 space-y-5">
          {/* Name */}
          <div className="space-y-2">
            <label htmlFor="name" className="block text-sm font-medium">
              Full name
            </label>
            <input
              id="name"
              className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-base outline-none transition focus:border-neutral-400"
              placeholder="Test User"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              inputMode="email"
              autoComplete="email"
              className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-base outline-none transition focus:border-neutral-400"
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
                autoComplete="new-password"
                className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 pr-12 text-base outline-none transition focus:border-neutral-400"
                placeholder="At least 8 characters"
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
            {!pwOk && pw.length > 0 && (
              <p className="text-xs text-rose-600">Use at least 8 characters</p>
            )}
          </div>

          {/* Confirm password */}
          <div className="space-y-2">
            <label htmlFor="confirm" className="block text-sm font-medium">
              Confirm password
            </label>
            <input
              id="confirm"
              type={showPw ? "text" : "password"}
              autoComplete="new-password"
              className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-base outline-none transition focus:border-neutral-400"
              placeholder="Repeat your password"
              value={cpw}
              onChange={(e) => setCpw(e.target.value)}
            />
            {cpw.length > 0 && !match && (
              <p className="text-xs text-rose-600">Passwords do not match</p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={!canSubmit || !!loading}
            className={`w-full rounded-xl px-4 py-3 text-base font-semibold text-white transition
            ${
              !canSubmit || loading
                ? "bg-neutral-300"
                : "bg-neutral-900 hover:bg-neutral-800 active:bg-black"
            }`}
          >
            {loading ? "Creating account…" : "Create account"}
          </button>

          {/* Secondary */}
          <div className="flex items-center justify-between pt-1">
            <Link
              to="/signin"
              className="text-sm font-medium text-neutral-800 underline underline-offset-4 hover:opacity-80"
            >
              Already have an account
            </Link>
            <button
              type="button"
              className="text-sm text-neutral-600 hover:text-neutral-800"
              onClick={() => alert("Terms coming soon")}
            >
              Terms
            </button>
          </div>
        </form>

        <p className="mt-10 text-center text-xs text-neutral-500">
          By continuing you agree to our Terms and Privacy
        </p>
      </main>
    </div>
  );
}
