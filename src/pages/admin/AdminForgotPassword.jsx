// src/pages/admin/AdminForgotPassword.jsx
import { useState } from "react";
import { requestPasswordReset } from "@data";
import Button from "@components/ui/Button";
import AdminBanner from "@components/admin/AdminBanner";
import AdminAuthCard, { AuthField, AuthLink } from "@components/admin/AdminAuthCard";
import { AUTH_REDIRECT_PATHS } from "@config/auth";
import { authRedirectUrl } from "@utils/passwordRules";

export default function AdminForgotPassword() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [sent, setSent] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSubmitting(true);
    try {
      const { ok, error } = await requestPasswordReset({
        email,
        redirectTo: authRedirectUrl(AUTH_REDIRECT_PATHS.passwordReset),
      });
      if (!ok) {
        setErrorMsg(error);
        return;
      }
      setSent(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AdminAuthCard
      title="Reset your password"
      subtitle={sent ? undefined : "We’ll email you a link to choose a new one."}
      footer={
        <p>
          Remembered it? <AuthLink to="/admin/login">Back to sign in</AuthLink>
        </p>
      }
    >
      {sent ? (
        // Same message whether or not an account exists, so the form can't be
        // used to find out who has one.
        <AdminBanner
          tone="success"
          message={`If there’s an account for ${email.trim()}, a reset link is on its way. Check your spam folder too.`}
        />
      ) : (
        <>
          {errorMsg && <AdminBanner message={errorMsg} />}
          <form onSubmit={onSubmit} className="space-y-5">
            <AuthField
              id="forgot-email"
              label="Email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@robotum.info"
            />
            <Button
              type="submit"
              variant="primary"
              className="w-full justify-center"
              disabled={submitting}
            >
              {submitting ? "Sending…" : "Send reset link"}
            </Button>
          </form>
        </>
      )}
    </AdminAuthCard>
  );
}
