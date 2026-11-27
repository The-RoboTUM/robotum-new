// One application: contact, status, CV link and all answers.
import { useState } from "react";
import { DocumentArrowDownIcon } from "@heroicons/react/24/outline";
import Button from "@components/ui/Button";
import ApplicationAnswers from "@components/sections/apply-sections/ApplicationAnswers";
import { adminGetApplicationCvUrl, APPLICATION_STATUSES } from "@data";
import { logger } from "@utils/logger";
import { formatDate, fullName, StatusBadge } from "./applicationUi";

export default function ApplicationDetail({
  app,
  onStatusChange,
  savingStatus,
  onError,
}) {
  const [openingCv, setOpeningCv] = useState(false);

  const openCv = async () => {
    // Open the tab right away (inside the click) so popup blockers allow it,
    // then point it at the short-lived signed link.
    const tab = window.open("", "_blank");
    setOpeningCv(true);
    try {
      const url = await adminGetApplicationCvUrl(app.cv_path);
      if (tab) tab.location.href = url;
      else window.location.href = url;
    } catch (err) {
      logger.error(err);
      tab?.close();
      onError("Couldn't open the CV. Please try again.");
    } finally {
      setOpeningCv(false);
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-3 border-b border-white/10 pb-5">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-lg font-semibold text-white">{fullName(app)}</h2>
          <StatusBadge status={app.status} />
        </div>
        <p className="text-xs text-white/55">
          Submitted {formatDate(app.created_at)}
          {app.round ? ` · ${app.round}` : ""}
        </p>
        <div className="flex flex-wrap gap-x-5 gap-y-1 text-sm">
          <a
            href={`mailto:${app.email}`}
            className="rounded-sm text-accent underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            {app.email}
          </a>
          {app.answers?.phone && (
            <a
              href={`tel:${app.answers.phone.replace(/\s+/g, "")}`}
              className="rounded-sm text-white/75 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              {app.answers.phone}
            </a>
          )}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="flex flex-col gap-1 sm:w-56">
            <label htmlFor="application-status" className="text-xs text-white/70">
              Status
            </label>
            <select
              id="application-status"
              value={app.status}
              disabled={savingStatus}
              onChange={(e) => onStatusChange(app.id, e.target.value)}
              className="field-input"
            >
              {APPLICATION_STATUSES.map((s) => (
                <option key={s.value} value={s.value} className="bg-primary">
                  {s.label}
                </option>
              ))}
            </select>
          </div>
          {app.cv_path ? (
            <Button
              variant="secondary"
              size="sm"
              onClick={openCv}
              loading={openingCv}
              leadingIcon={() => <DocumentArrowDownIcon className="h-4 w-4" />}
            >
              Open CV
            </Button>
          ) : (
            <p className="text-xs text-white/45 sm:pb-2">No CV uploaded</p>
          )}
        </div>
      </div>

      <ApplicationAnswers
        answers={app.answers ?? {}}
        cvLabel={app.cv_path ? "Uploaded - use “Open CV” above" : ""}
      />
    </div>
  );
}
