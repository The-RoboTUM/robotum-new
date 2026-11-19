import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { signInAdmin, verifyAdminAccess } from "@data";
import Button from "@components/ui/Button";
import PageLoader from "@components/sections/common-sections/PageLoader";
import AdminBanner from "@components/admin/AdminBanner";
import AdminAuthCard, { AuthField, AuthLink } from "@components/admin/AdminAuthCard";

export default function AdminLogin() {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [submitting, setSubmitting] = useState(false);
  // Messages handed over by AdminRoute (no access) or other auth pages (notice).
  const [errorMsg, setErrorMsg] = useState(location.state?.error || "");
  const notice = location.state?.notice || "";
  const [initialChecking, setInitialChecking] = useState(true);

  // Already signed in with access (also right after clicking the email
  // confirmation link, which lands here with a fresh session) → go to /admin.
  useEffect(() => {
    let cancelled = false;

    const checkExistingSession = async () => {
      const { allowed, error } = await verifyAdminAccess();
      if (cancelled) return;
      if (allowed) {
        navigate("/admin", { replace: true });
      } else {
        if (error) setErrorMsg(error);
        setInitialChecking(false);
      }
    };

    checkExistingSession();

    return () => {
      cancelled = true;
    };
  }, [navigate]);

  const fromPath = location.state?.from || "/admin";

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
      navigate(fromPath, { replace: true });
    } finally {
      setSubmitting(false);
    }
  };

  if (initialChecking) {
    return <PageLoader />;
  }

  return (
    <AdminAuthCard
      title="roboTUM Admin"
      subtitle="Sign in with your roboTUM account."
      footer={
        <>
          <p>
            New here? <AuthLink to="/admin/signup">Create an account</AuthLink>
          </p>
          <p className="text-[11px] text-white/40">
            Open to Seniors, Project Leads, Department Heads and Board members.
          </p>
        </>
      }
    >
      {(errorMsg || notice) && (
        <div>
          <AdminBanner message={errorMsg} />
          {!errorMsg && <AdminBanner message={notice} tone="success" />}
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-5">
        <AuthField
          id="admin-email"
          label="Email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@robotum.info"
        />

        <div className="space-y-2">
          <AuthField
            id="admin-password"
            label="Password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />
          <p className="text-right text-xs">
            <AuthLink to="/admin/forgot-password">Forgot password?</AuthLink>
          </p>
        </div>

        <Button
          type="submit"
          variant="primary"
          className="w-full justify-center"
          disabled={submitting}
        >
          {submitting ? "Signing in…" : "Sign in"}
        </Button>
      </form>
    </AdminAuthCard>
  );
}
