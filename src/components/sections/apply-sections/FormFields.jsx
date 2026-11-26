// Small, accessible form primitives for the application form.
// Styling uses the shared .field-input / .card-inset classes from globals.css.
import clsx from "clsx";
import { applicationForm } from "@config/applicationForm";
import { countWords } from "@utils/applicationValidation";

export function FieldShell({ id, label, hint, error, required, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-white">
          {label}
          {required ? (
            <span className="text-accent" aria-hidden="true">
              {" "}
              *
            </span>
          ) : (
            <span className="text-white/50 font-normal"> (optional)</span>
          )}
        </label>
      )}
      {hint && (
        <p id={`${id}-hint`} className="text-xs text-white/50">
          {hint}
        </p>
      )}
      {children}
      {error && (
        <p id={`${id}-error`} role="alert" className="text-xs text-red-300">
          {error}
        </p>
      )}
    </div>
  );
}

const describedBy = (id, hint, error) =>
  clsx(hint && `${id}-hint`, error && `${id}-error`) || undefined;

export function TextField({
  id,
  label,
  hint,
  error,
  required,
  value,
  onChange,
  type = "text",
  autoComplete,
  inputMode,
}) {
  return (
    <FieldShell {...{ id, label, hint, error, required }}>
      <input
        id={id}
        name={id}
        type={type}
        value={value}
        autoComplete={autoComplete}
        inputMode={inputMode}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, hint, error)}
        className={clsx("field-input", error && "border-red-400/70")}
      />
    </FieldShell>
  );
}

export function SelectField({
  id,
  label,
  hint,
  error,
  required,
  value,
  onChange,
  options,
  placeholder = "Please choose…",
}) {
  return (
    <FieldShell {...{ id, label, hint, error, required }}>
      <select
        id={id}
        name={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, hint, error)}
        className={clsx(
          "field-input appearance-auto",
          !value && "text-white/50",
          error && "border-red-400/70",
        )}
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => {
          const { value: v, label: l } =
            typeof opt === "string" ? { value: opt, label: opt } : opt;
          return (
            <option key={v} value={v} className="bg-primary text-white">
              {l}
            </option>
          );
        })}
      </select>
    </FieldShell>
  );
}

/** Long answer with a live word count against the ~150 word target. */
export function LongAnswerField({
  id,
  label,
  hint,
  error,
  required,
  value,
  onChange,
  rows = 6,
}) {
  const words = countWords(value);
  const { targetWords, maxWords } = applicationForm;
  const over = words > maxWords;

  return (
    <FieldShell {...{ id, label, hint, error, required }}>
      <textarea
        id={id}
        name={id}
        rows={rows}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={error ? true : undefined}
        aria-describedby={clsx(describedBy(id, hint, error), `${id}-count`)}
        className={clsx(
          "field-input resize-y leading-relaxed",
          error && "border-red-400/70",
        )}
      />
      <p
        id={`${id}-count`}
        className={clsx(
          "self-end text-xs tabular-nums",
          over ? "text-red-300" : "text-white/50",
        )}
      >
        {words} words · aim for about {targetWords}
      </p>
    </FieldShell>
  );
}

/** Single choice shown as selectable cards (radio buttons). */
export function RadioCards({
  name,
  legend,
  error,
  required,
  value,
  onChange,
  options,
  columns = "sm:grid-cols-3",
}) {
  return (
    <fieldset
      className="flex flex-col gap-2"
      aria-describedby={error ? `${name}-error` : undefined}
    >
      <legend className="mb-1.5 text-sm font-medium text-white">
        {legend}
        {required && (
          <span className="text-accent" aria-hidden="true">
            {" "}
            *
          </span>
        )}
      </legend>
      <div className={clsx("grid grid-cols-1 gap-2", columns)}>
        {options.map((opt) => {
          const checked = value === opt.value;
          return (
            <label
              key={opt.value}
              className={clsx(
                "flex cursor-pointer items-start gap-3 rounded-xl border px-3 py-2.5 text-sm transition focus-within:ring-2 focus-within:ring-accent",
                checked
                  ? "border-accent bg-accent/15 text-white"
                  : "border-white/15 bg-canvas/30 text-white/80 hover:border-white/30",
              )}
            >
              <input
                type="radio"
                name={name}
                value={opt.value}
                checked={checked}
                onChange={() => onChange(opt.value)}
                className="mt-0.5 accent-accent"
              />
              <span className="flex flex-col">
                <span>{opt.label}</span>
                {opt.hint && (
                  <span className="text-xs text-white/50">{opt.hint}</span>
                )}
              </span>
            </label>
          );
        })}
      </div>
      {error && (
        <p id={`${name}-error`} role="alert" className="text-xs text-red-300">
          {error}
        </p>
      )}
    </fieldset>
  );
}

/** Toggleable chips (checkboxes) with an optional maximum. */
export function ChipCheckboxGroup({
  name,
  legend,
  hint,
  error,
  required,
  values,
  onChange,
  options,
  max,
}) {
  const atMax = max && values.length >= max;

  const toggle = (opt) =>
    onChange(
      values.includes(opt)
        ? values.filter((v) => v !== opt)
        : [...values, opt],
    );

  return (
    <fieldset
      className="flex flex-col gap-2"
      aria-describedby={error ? `${name}-error` : undefined}
    >
      <legend className="mb-1.5 text-sm font-medium text-white">
        {legend}
        {required && (
          <span className="text-accent" aria-hidden="true">
            {" "}
            *
          </span>
        )}
      </legend>
      {hint && <p className="-mt-1 text-xs text-white/50">{hint}</p>}
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const checked = values.includes(opt);
          const disabled = !checked && atMax;
          return (
            <label
              key={opt}
              className={clsx(
                "inline-flex select-none items-center rounded-full border px-3 py-1.5 text-sm transition focus-within:ring-2 focus-within:ring-accent",
                checked
                  ? "border-accent bg-accent/20 text-white"
                  : "border-white/15 bg-white/5 text-white/75",
                disabled
                  ? "cursor-not-allowed opacity-40"
                  : "cursor-pointer hover:border-white/30",
              )}
            >
              <input
                type="checkbox"
                className="sr-only"
                name={name}
                checked={checked}
                disabled={disabled}
                onChange={() => toggle(opt)}
              />
              {opt}
            </label>
          );
        })}
      </div>
      {max && (
        <p className="text-xs text-white/50 tabular-nums">
          {values.length} / {max} selected
        </p>
      )}
      {error && (
        <p id={`${name}-error`} role="alert" className="text-xs text-red-300">
          {error}
        </p>
      )}
    </fieldset>
  );
}
