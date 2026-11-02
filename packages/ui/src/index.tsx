import React, { forwardRef, useId, useEffect, useRef } from "react";
type Tone = "primary" | "secondary" | "danger";
const cls = (...names: (string | undefined | false)[]) =>
  names.filter(Boolean).join(" ");
export const Button = forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: Tone;
    loading?: boolean;
  }
>(
  (
    {
      variant = "secondary",
      loading = false,
      disabled,
      children,
      className,
      type = "button",
      ...props
    },
    ref,
  ) => (
    <button
      {...props}
      ref={ref}
      type={type}
      className={cls("vs-button", `vs-${variant}`, className)}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
    >
      {loading ? "Сохранение…" : children}
    </button>
  ),
);
type Field = { label: string; hint?: string; error?: string };
export const Input = forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & Field
>(({ label, hint, error, id, className, ...props }, ref) => {
  const uid = useId();
  const key = id || uid;
  return (
    <div className="vs-field">
      <label htmlFor={key}>
        {label}
        {props.required ? " *" : ""}
      </label>
      <input
        {...props}
        ref={ref}
        id={key}
        className={cls("vs-input", className)}
        aria-invalid={error ? true : props["aria-invalid"]}
        aria-describedby={
          [
            props["aria-describedby"],
            hint ? key + "-hint" : null,
            error ? key + "-error" : null,
          ]
            .filter(Boolean)
            .join(" ") || undefined
        }
      />
      {hint && <small id={key + "-hint"}>{hint}</small>}
      {error && (
        <small className="vs-error" id={key + "-error"}>
          {error}
        </small>
      )}
    </div>
  );
});
export const Textarea = forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement> & Field
>(({ label, hint, error, id, className, ...props }, ref) => {
  const uid = useId(),
    key = id || uid;
  return (
    <div className="vs-field">
      <label htmlFor={key}>
        {label}
        {props.required ? " *" : ""}
      </label>
      <textarea
        {...props}
        ref={ref}
        id={key}
        className={cls("vs-input", className)}
        aria-invalid={error ? true : props["aria-invalid"]}
        aria-describedby={
          [
            props["aria-describedby"],
            hint ? key + "-hint" : null,
            error ? key + "-error" : null,
          ]
            .filter(Boolean)
            .join(" ") || undefined
        }
      />
      {hint && <small id={key + "-hint"}>{hint}</small>}
      {error && (
        <small className="vs-error" id={key + "-error"}>
          {error}
        </small>
      )}
    </div>
  );
});
export const Select = forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement> & Field
>(({ label, hint, error, id, className, children, ...props }, ref) => {
  const uid = useId(),
    key = id || uid;
  return (
    <div className="vs-field">
      <label htmlFor={key}>
        {label}
        {props.required ? " *" : ""}
      </label>
      <select
        {...props}
        ref={ref}
        id={key}
        className={cls("vs-input", className)}
        aria-invalid={error ? true : props["aria-invalid"]}
        aria-describedby={
          [
            props["aria-describedby"],
            hint ? key + "-hint" : null,
            error ? key + "-error" : null,
          ]
            .filter(Boolean)
            .join(" ") || undefined
        }
      >
        {children}
      </select>
      {hint && <small id={key + "-hint"}>{hint}</small>}
      {error && (
        <small className="vs-error" id={key + "-error"}>
          {error}
        </small>
      )}
    </div>
  );
});
export const Checkbox = forwardRef<
  HTMLInputElement,
  Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> & { label: string }
>(({ label, className, ...props }, ref) => (
  <label className={cls("vs-checkbox", className)}>
    <input {...props} ref={ref} type="checkbox" />
    {label}
  </label>
));
export function Badge({
  tone = "neutral",
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & {
  tone?: "neutral" | "success" | "error";
}) {
  return (
    <span {...props} className={cls("vs-badge", `vs-${tone}`, className)} />
  );
}
export function Alert({
  tone = "info",
  title,
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  tone?: "info" | "error" | "success";
  title: string;
}) {
  return (
    <div
      role={tone === "error" ? "alert" : "status"}
      {...props}
      className={cls("vs-alert", `vs-${tone}`, className)}
    >
      <strong>{title}</strong>
      <div>{children}</div>
    </div>
  );
}
export function Dialog({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null),
    id = useId();
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const previous = document.activeElement as HTMLElement | null;
    if (open && !el.open) el.showModal();
    else if (!open && el.open) el.close();
    return () => {
      if (el.open) el.close();
      if (open) previous?.focus();
    };
  }, [open]);
  return (
    <dialog
      ref={ref}
      className="vs-dialog"
      aria-labelledby={id}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
    >
      <div className="vs-dialog-heading">
        <h2 id={id}>{title}</h2>
        <Button aria-label="Закрыть диалог" onClick={onClose}>
          ×
        </Button>
      </div>
      {children}
    </dialog>
  );
}
