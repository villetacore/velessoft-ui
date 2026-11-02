"use client";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { cls, type Tone } from "./utils.js";
import { useMessages } from "./i18n.js";

export function Badge({
  tone = "neutral",
  variant = "outline",
  dot,
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & {
  tone?: Tone;
  variant?: "outline" | "solid";
  /** Shows a square status marker before the text. */
  dot?: boolean;
}) {
  return (
    <span
      {...props}
      className={cls(
        "vs-badge",
        `vs-${tone}`,
        variant === "solid" && "vs-solid",
        className,
      )}
    >
      {dot && <span className="vs-dot" aria-hidden="true" />}
      {children}
    </span>
  );
}

export function Tag({
  tone,
  onRemove,
  removeLabel,
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & {
  tone?: Tone;
  onRemove?: () => void;
  removeLabel?: string;
}) {
  const t = useMessages();
  const text = typeof children === "string" ? children : "";
  return (
    <span {...props} className={cls("vs-tag", tone && `vs-${tone}`, className)}>
      {children}
      {onRemove && (
        <button
          type="button"
          aria-label={removeLabel ?? `${t.remove} ${text}`.trim()}
          onClick={onRemove}
        >
          ×
        </button>
      )}
    </span>
  );
}

export function Alert({
  tone = "info",
  title,
  actions,
  children,
  className,
  ...props
}: Omit<React.HTMLAttributes<HTMLDivElement>, "title"> & {
  tone?: Exclude<Tone, "neutral">;
  title?: React.ReactNode;
  actions?: React.ReactNode;
}) {
  return (
    <div
      role={tone === "error" ? "alert" : "status"}
      {...props}
      className={cls("vs-alert", `vs-${tone}`, className)}
    >
      {title && <strong>{title}</strong>}
      {children && <div>{children}</div>}
      {actions && <div className="vs-alert-actions">{actions}</div>}
    </div>
  );
}

export function Spinner({
  label,
  size = "md",
  decorative,
  className,
}: {
  /** Announced text. Defaults to the localized "loading" message. */
  label?: string;
  size?: "md" | "lg";
  /** Hide from assistive technology when the parent already conveys state. */
  decorative?: boolean;
  className?: string;
}) {
  const t = useMessages();
  const classes = cls("vs-spinner", size === "lg" && "vs-lg", className);
  if (decorative) return <span className={classes} aria-hidden="true" />;
  return (
    <span role="status" className={classes}>
      <span className="vs-visually-hidden">{label ?? t.loading}</span>
    </span>
  );
}

export function Progress({
  value,
  max = 100,
  label,
  showValue = true,
  tone,
  className,
  ...props
}: Omit<React.HTMLAttributes<HTMLDivElement>, "children"> & {
  /** Omit for an indeterminate progress bar. */
  value?: number;
  max?: number;
  label?: string;
  showValue?: boolean;
  tone?: Tone;
}) {
  const indeterminate = value === undefined;
  const percent = indeterminate
    ? 0
    : Math.round((Math.min(Math.max(value, 0), max) / max) * 100);
  return (
    <div
      {...props}
      className={cls(
        "vs-progress",
        indeterminate && "vs-indeterminate",
        tone && `vs-${tone}`,
        className,
      )}
    >
      {label && (
        <div className="vs-progress-label">
          <span>{label}</span>
          {showValue && !indeterminate && <span>{percent}%</span>}
        </div>
      )}
      <div
        className="vs-progress-track"
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={indeterminate ? undefined : value}
      >
        <div
          className="vs-progress-bar"
          style={{ "--vs-value": `${percent}%` } as React.CSSProperties}
        />
      </div>
    </div>
  );
}

export function Skeleton({
  width,
  height,
  circle,
  lines = 1,
  className,
  style,
}: {
  width?: number | string;
  height?: number | string;
  circle?: boolean;
  /** Renders several text lines; the last one is shorter. */
  lines?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <span aria-hidden="true" style={{ display: "block" }}>
      {Array.from({ length: lines }, (_, i) => (
        <span
          key={i}
          className={cls("vs-skeleton", circle && "vs-circle", className)}
          style={{
            width: lines > 1 && i === lines - 1 ? "60%" : width,
            height: circle ? (height ?? width) : height,
            ...style,
          }}
        />
      ))}
    </span>
  );
}

export type ToastOptions = {
  title: React.ReactNode;
  description?: React.ReactNode;
  tone?: Exclude<Tone, "neutral">;
  /** Milliseconds before auto-dismiss; 0 keeps the toast until closed. */
  duration?: number;
};
type ToastItem = ToastOptions & { id: number };
type ToastApi = {
  toast: (options: ToastOptions) => number;
  dismiss: (id: number) => void;
};

const ToastContext = createContext<ToastApi | null>(null);

export function useToast(): ToastApi {
  const api = useContext(ToastContext);
  if (!api) throw new Error("useToast must be used inside <ToastProvider>");
  return api;
}

export function ToastProvider({
  children,
  placement = "bottom",
  duration = 5000,
}: {
  children: React.ReactNode;
  placement?: "top" | "bottom";
  duration?: number;
}) {
  const t = useMessages();
  const [items, setItems] = useState<ToastItem[]>([]);
  const counter = useRef(0);
  const dismiss = useCallback(
    (id: number) => setItems((list) => list.filter((item) => item.id !== id)),
    [],
  );
  const toast = useCallback(
    (options: ToastOptions) => {
      const id = ++counter.current;
      setItems((list) => [...list, { duration, ...options, id }]);
      return id;
    },
    [duration],
  );
  const api = useMemo(() => ({ toast, dismiss }), [toast, dismiss]);
  return (
    <ToastContext.Provider value={api}>
      {children}
      <section
        className={cls("vs-toaster", placement === "top" && "vs-top")}
        aria-label={t.notifications}
      >
        {items.map((item) => (
          <Toast
            key={item.id}
            item={item}
            onClose={dismiss}
            closeLabel={t.close}
          />
        ))}
      </section>
    </ToastContext.Provider>
  );
}

function Toast({
  item,
  onClose,
  closeLabel,
}: {
  item: ToastItem;
  onClose: (id: number) => void;
  closeLabel: string;
}) {
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (!item.duration || paused) return;
    const timer = window.setTimeout(() => onClose(item.id), item.duration);
    return () => window.clearTimeout(timer);
  }, [item.id, item.duration, paused, onClose]);
  return (
    <div
      role={item.tone === "error" ? "alert" : "status"}
      className={cls("vs-toast", item.tone && `vs-${item.tone}`)}
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <strong>{item.title}</strong>
      {item.description && <p>{item.description}</p>}
      <button
        type="button"
        aria-label={closeLabel}
        onClick={() => onClose(item.id)}
      >
        ×
      </button>
    </div>
  );
}
