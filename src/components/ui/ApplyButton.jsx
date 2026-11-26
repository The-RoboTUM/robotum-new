import Button from "@components/ui/Button";
import {
  applications,
  applicationsOpen,
  hasApplicationForm,
} from "@config/applications";
import { applicationForm } from "@config/applicationForm";

/**
 * The single place that decides what the "apply" call to action does.
 * Three states, driven by src/config/applications.js:
 *   open + link      → opens the Google Form in a new tab
 *   open, no link yet→ disabled "coming soon" (never ships a dead link)
 *   closed           → disabled "Applications closed"
 */
export default function ApplyButton({
  label = "Start application",
  variant = "primary",
  size = "md",
  className,
  fullWidth = false,
}) {
  if (!applicationsOpen) {
    return (
      <Button
        variant="secondaryStatic"
        size={size}
        disabled
        fullWidth={fullWidth}
        className={className}
      >
        Applications closed
      </Button>
    );
  }

  // On-site form (src/config/applicationForm.js) replaces the Google Form.
  if (applicationForm.useOwnForm) {
    return (
      <Button
        to={applicationForm.path}
        variant={variant}
        size={size}
        fullWidth={fullWidth}
        className={className}
      >
        {label} →
      </Button>
    );
  }

  if (!hasApplicationForm) {
    return (
      <Button
        variant="secondaryStatic"
        size={size}
        disabled
        fullWidth={fullWidth}
        className={className}
      >
        Form link coming soon
      </Button>
    );
  }

  return (
    <Button
      as="a"
      href={applications.formUrl}
      target="_blank"
      variant={variant}
      size={size}
      fullWidth={fullWidth}
      className={className}
    >
      {label} →
    </Button>
  );
}
