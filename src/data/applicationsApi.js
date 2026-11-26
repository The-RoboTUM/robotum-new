import { supabase } from "@lib/supabaseClient";
import { logger } from "@utils/logger";

// Membership applications from the form at /join/apply.
// Database setup: supabase/migrations/0008_applications.sql.
// The public site can only *submit* - reading happens in Supabase / admin.

export const APPLICATION_CV_BUCKET = "applications-cv";

/** Turn Supabase errors into a message an applicant can act on. */
function toUserMessage(error, fallback) {
  const msg = String(error?.message || "").toLowerCase();
  if (msg.includes("failed to fetch") || msg.includes("network")) {
    return "We couldn't reach our server. Check your connection and try again - your answers are still saved.";
  }
  if (msg.includes("too large") || msg.includes("exceeded")) {
    return "Your CV file is too large. Please upload a smaller PDF.";
  }
  if (msg.includes("mime") || msg.includes("invalid file")) {
    return "Your CV must be a PDF file.";
  }
  if (msg.includes("could not find the function") || msg.includes("bucket not found")) {
    return "Applications can't be received right now. Please try again later or email us.";
  }
  return fallback;
}

/**
 * Upload the CV (if any), then store the application.
 * @param {{ answers: object, round?: string, cvFile?: File|null }} input
 * @returns {Promise<string>} the new application's id
 */
export async function submitApplication({ answers, round, cvFile }) {
  let cvPath = null;

  if (cvFile) {
    cvPath = `${crypto.randomUUID()}.pdf`;
    const { error: uploadError } = await supabase.storage
      .from(APPLICATION_CV_BUCKET)
      .upload(cvPath, cvFile, {
        contentType: "application/pdf",
        upsert: false,
      });

    if (uploadError) {
      logger.error("CV upload failed:", uploadError);
      throw new Error(
        toUserMessage(
          uploadError,
          "We couldn't upload your CV. Please try again.",
        ),
      );
    }
  }

  // Don't store the browser-only helper field.
  const cleanAnswers = { ...(answers ?? {}) };
  delete cleanAnswers.cvFileName;

  const { data, error } = await supabase.rpc("submit_application", {
    p_answers: cleanAnswers,
    p_round: round ?? null,
    p_cv_path: cvPath,
  });

  if (error) {
    logger.error("Submitting application failed:", error);
    throw new Error(
      toUserMessage(
        error,
        "Something went wrong while sending your application. Please try again.",
      ),
    );
  }

  return data;
}
