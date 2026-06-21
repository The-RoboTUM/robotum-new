import { useEffect, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { signInAdmin, verifyAdminAccess } from "@data";
import Button from "@components/ui/Button";
import PageLoader from "@components/sections/common-sections/PageLoader";
import * as assets from "@assets";

export default function AdminLogin() {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [initialChecking, setInitialChecking] = useState(true);

  // If already logged in as admin, redirect straight to /admin
  useEffect(() => {
    let cancelled = false;

    const checkExistingSession = async () => {
      const { allowed } = await verifyAdminAccess();
      if (cancelled) return;
      if (allowed) {
        navigate("/admin", { replace: true });
      } else {
        setInitialChecking(false);
      }
    };

    checkExistingSession();

    return () => {
      cancelled = true;
    };
  }, [navigate]);

  const fromPath = (location.state && location.state.from) || "/admin";

  const onSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSubmitting(true);

    try {
      const { ok, error } = await signInAdmin({ email, password });
      if (!ok) {
        setErrorMsg(error);
        return;
      }
      // Success → go to /admin or previous target
      navigate(fromPath, { replace: true });
    } finally {
      setSubmitting(false);
    }
  };

  if (initialChecking) {
    return <PageLoader />;
  }

  return (
    <main className="min-h-screen w-full bg-canvas hero-orbit-bg flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-card-lg p-8 space-y-8">
        {/* Logo / header */}
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="inline-flex items-center justify-center rounded-2xl border border-white/15 bg-black/20 px-6 py-3">
            <img
              src={assets.navLogo}
              alt="RoboTUM logo"
              className="h-10 w-auto"
            />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-white">RoboTUM Admin</h1>
            <p className="text-sm text-white/70 mt-1">
              Sign in with your admin credentials.
            </p>
          </div>
        </div>

        {/* Error message */}
        {errorMsg && (
          <div className="rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {errorMsg}
          </div>
        )}

        {/* Form */}
        <form onSubmit={onSubmit} className="space-y-5">
          <div className="space-y-2">
            <label
              htmlFor="admin-email"
              className="block text-sm font-medium text-white/80"
            >
              Email
            </label>
            <input
              id="admin-email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="field-input"
              placeholder="you@robotum.info"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="admin-password"
              className="block text-sm font-medium text-white/80"
            >
              Password
            </label>
            <input
              id="admin-password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="field-input"
              placeholder="••••••••"
            />
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              className="w-full justify-center"
              disabled={submitting}
            >
              {submitting ? "Signing in…" : "Sign in"}
            </Button>
          </div>
        </form>

        <p className="text-[11px] text-center text-white/40">
          This area is restricted to authorized RoboTUM admins.
        </p>

        {/* Optional: link back to public site */}
        <p className="text-center text-xs text-white/50">
          ← Back to{" "}
          <Link to="/" className="text-accent hover:underline">
            public site
          </Link>
        </p>
      </div>
    </main>
  );
}
