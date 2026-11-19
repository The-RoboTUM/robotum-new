// src/pages/admin/AdminResetPassword.jsx
// Landing page of the password-reset email. Supabase signs the user in from
// the link (tokens in the URL), so a session exists here if the link was valid.
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { hasActiveSession, updatePassword } from "@data";
import Button from "@components/ui/Button";
import PageLoader from "@components/sections/common-sections/PageLoader";
import AdminBanner from "@components/admin/AdminBanner";
import AdminAuthCard, { AuthField, AuthLink } from "@components/admin/AdminAuthCard";
import { MIN_PASSWORD_LENGTH } from "@config/auth";
import { validateNewPassword } from "@utils/passwordRules";

export default function AdminResetPassword() {
  const navigate = useNavigate();
  const [status, setStatus] = useState("checking"); // checking | ready | invalid
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    let cancelled = false;
    hasActiveSession().then((ok) => {
      if (!cancelled) setStatus(ok ? "ready" : "invalid");
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    const problem = validateNewPassword(password, confirmation);
    if (problem) {
      setErrorMsg(problem);
      return;
    }

    setErrorMsg("");
    setSubmitting(true);
    try {
      const { ok, error } = await updatePassword(password);
      if (!ok) {
        setErrorMsg(error);
        return;
      }
      // Still signed in from the reset link: AdminRoute decides where they land.
      navigate("/admin", { replace: true });
    } finally {
      setSubmitting(false);
    }
  };

  if (status === "checking") return <PageLoader />;

  if (status === "invalid") {
    return (
      <AdminAuthCard
        title="Link expired"
        subtitle="This reset link is invalid or has already been used."
        footer={
          <p>
            <AuthLink to="/admin/login">Back to sign in</AuthLink>
          </p>
        }
      >
        <div className="text-center">
          <Button to="/admin/forgot-password" variant="primary" className="justify-center">
            Request a new link
          </Button>
        </div>
      </AdminAuthCard>
    );
  }

  return (
    <AdminAuthCard title="Choose a new password">
      {errorMsg && <AdminBanner message={errorMsg} />}
      <form onSubmit={onSubmit} className="space-y-5" noValidate>
        <AuthField
          id="reset-password"
          label="New password"
          type="password"
          autoComplete="new-password"
          required
          minLength={MIN_PASSWORD_LENGTH}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          hint={`At least ${MIN_PASSWORD_LENGTH} characters.`}
        />
        <AuthField
          id="reset-password-confirm"
          label="Repeat new password"
          type="password"
          autoComplete="new-password"
          required
          value={confirmation}
          onChange={(e) => setConfirmation(e.target.value)}
        />
        <Button
          type="submit"
          variant="primary"
          className="w-full justify-center"
          disabled={submitting}
        >
          {submitting ? "Saving…" : "Save new password"}
        </Button>
      </form>
    </AdminAuthCard>
  );
}
