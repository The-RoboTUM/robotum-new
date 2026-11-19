// src/pages/admin/AdminSignup.jsx
// Self sign-up for the admin area. Who may sign up is decided server-side
// (Auth hook "Before User Created", migration 0006); the checks here are only
// early hints so people see problems before submitting.
import { useState } from "react";
import { signUpMember } from "@data";
import Button from "@components/ui/Button";
import AdminBanner from "@components/admin/AdminBanner";
import AdminAuthCard, { AuthField, AuthLink } from "@components/admin/AdminAuthCard";
import { AUTH_REDIRECT_PATHS, MIN_PASSWORD_LENGTH, ROBOTUM_EMAIL_DOMAIN } from "@config/auth";
import {
  authRedirectUrl,
  validateNewPassword,
  validateRobotumEmail,
} from "@utils/passwordRules";

export default function AdminSignup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [sentTo, setSentTo] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    const problem = validateRobotumEmail(email) || validateNewPassword(password, confirmation);
    if (problem) {
      setErrorMsg(problem);
      return;
    }

    setErrorMsg("");
    setSubmitting(true);
    try {
      const { ok, error } = await signUpMember({
        email,
        password,
        redirectTo: authRedirectUrl(AUTH_REDIRECT_PATHS.afterSignupConfirm),
      });
      if (!ok) {
        setErrorMsg(error);
        return;
      }
      setSentTo(email.trim());
      setPassword("");
      setConfirmation("");
    } finally {
      setSubmitting(false);
    }
  };

  if (sentTo) {
    return (
      <AdminAuthCard
        title="Check your inbox"
        subtitle={`We sent a confirmation link to ${sentTo}.`}
        footer={
          <p>
            Already confirmed? <AuthLink to="/admin/login">Sign in</AuthLink>
          </p>
        }
      >
        <div className="card-inset p-4 text-sm text-white/70 space-y-2">
          <p>Click the link in the email to activate your account. It also signs you in.</p>
          <p className="text-white/50">
            Nothing after a few minutes? Check your spam folder, or sign up again to get a new link.
          </p>
        </div>
      </AdminAuthCard>
    );
  }

  return (
    <AdminAuthCard
      title="Create your admin account"
      subtitle="For Seniors, Project Leads, Department Heads and Board members."
      footer={
        <p>
          Already have an account? <AuthLink to="/admin/login">Sign in</AuthLink>
        </p>
      }
    >
      {errorMsg && <AdminBanner message={errorMsg} />}

      <form onSubmit={onSubmit} className="space-y-5" noValidate>
        <AuthField
          id="signup-email"
          label="roboTUM email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={`first.last@${ROBOTUM_EMAIL_DOMAIN}`}
          hint="The address the club gave you - personal addresses won’t work."
        />
        <AuthField
          id="signup-password"
          label="Password"
          type="password"
          autoComplete="new-password"
          required
          minLength={MIN_PASSWORD_LENGTH}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          hint={`At least ${MIN_PASSWORD_LENGTH} characters. Separate from your Google password.`}
        />
        <AuthField
          id="signup-password-confirm"
          label="Repeat password"
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
          {submitting ? "Creating account…" : "Create account"}
        </Button>
      </form>
    </AdminAuthCard>
  );
}
