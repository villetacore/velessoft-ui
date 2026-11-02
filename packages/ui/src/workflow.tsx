"use client";
import React, { forwardRef, useRef, useState, useEffect } from "react";
import { Input, type InputProps } from "./fields.js";
import { Button, type ButtonProps } from "./actions.js";
import { useControllable, cls } from "./utils.js";

export type SearchInputProps = Omit<
  InputProps,
  "type" | "value" | "defaultValue" | "onChange" | "endAddon"
> & {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  clearLabel: string;
};
/** Native search field. Clearing restores focus and reports the empty string. */
export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  (
    {
      value,
      defaultValue = "",
      onValueChange,
      clearLabel,
      disabled,
      readOnly,
      ...props
    },
    ref,
  ) => {
    const [text, setText] = useControllable(value, defaultValue, onValueChange);
    const local = useRef<HTMLInputElement | null>(null);
    return (
      <Input
        {...props}
        type="search"
        value={text}
        disabled={disabled}
        readOnly={readOnly}
        ref={(el) => {
          local.current = el;
          if (typeof ref === "function") ref(el);
          else if (ref) ref.current = el;
        }}
        onChange={(e) => setText(e.target.value)}
        endAddon={
          <span>
            {text && !readOnly ? (
              <Button
                disabled={disabled}
                aria-label={clearLabel}
                onClick={() => {
                  setText("");
                  local.current?.focus();
                }}
              >
                ×
              </Button>
            ) : null}
          </span>
        }
      />
    );
  },
);
export type PasswordInputProps = Omit<InputProps, "type" | "endAddon"> & {
  showLabel: string;
  hideLabel: string;
};
/** Visibility is local UI state; the password is never persisted by this component. */
export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ showLabel, hideLabel, disabled, ...props }, ref) => {
    const [visible, setVisible] = useState(false);
    return (
      <Input
        autoComplete="current-password"
        {...props}
        ref={ref}
        disabled={disabled}
        type={visible ? "text" : "password"}
        endAddon={
          <Button
            disabled={disabled}
            aria-pressed={visible}
            onClick={() => setVisible(!visible)}
          >
            {visible ? hideLabel : showLabel}
          </Button>
        }
      />
    );
  },
);
export type CopyButtonProps = Omit<
  ButtonProps,
  "onClick" | "children" | "loading" | "loadingText"
> & {
  value: string;
  label: string;
  copiedLabel: string;
  errorLabel: string;
  onCopied?: () => void;
};
/** Clipboard API requires HTTPS or localhost and a user gesture. Failure stays visible. */
export function CopyButton({
  value,
  label,
  copiedLabel,
  errorLabel,
  onCopied,
  disabled,
  ...props
}: CopyButtonProps) {
  const [status, setStatus] = useState<"idle" | "pending" | "copied" | "error">(
    "idle",
  );
  const mounted = useRef(true);
  const busy = useRef(false);
  const latest = useRef(value);
  latest.current = value;
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);
  useEffect(() => {
    setStatus("idle");
  }, [value]);
  async function copy() {
    if (busy.current) return;
    busy.current = true;
    setStatus("pending");
    const requested = value;
    let success = false;
    try {
      await navigator.clipboard.writeText(requested);
      success = true;
    } catch {
      success = false;
    } finally {
      busy.current = false;
    }
    if (!mounted.current) return;
    if (latest.current === requested) setStatus(success ? "copied" : "error");
    else setStatus("idle");
    if (success) onCopied?.();
  }
  return (
    <span className="vs-copy">
      <Button
        {...props}
        disabled={disabled}
        loading={status === "pending"}
        onClick={copy}
      >
        {label}
      </Button>
      <span
        role="status"
        className={status === "error" ? "vs-error" : "vs-muted"}
      >
        {status === "copied"
          ? copiedLabel
          : status === "error"
            ? errorLabel
            : ""}
      </span>
    </span>
  );
}
export type StepItem = {
  id: string;
  label: React.ReactNode;
  description?: React.ReactNode;
  disabled?: boolean;
};
/** Informational progress list by default. onStepChange turns steps into navigation buttons. */
export function Stepper({
  items,
  current,
  label,
  onStepChange,
  className,
}: {
  items: StepItem[];
  current: string;
  label: string;
  onStepChange?: (id: string) => void;
  className?: string;
}) {
  const active = items.findIndex((item) => item.id === current);
  return (
    <ol aria-label={label} className={cls("vs-stepper", className)}>
      {items.map((item, i) => (
        <li
          key={item.id}
          aria-current={item.id === current ? "step" : undefined}
          data-complete={(active >= 0 && i < active) || undefined}
        >
          <span className="vs-step-number" aria-hidden="true">
            {i + 1}
          </span>
          <div>
            {onStepChange ? (
              <button
                type="button"
                disabled={item.disabled}
                onClick={() => onStepChange(item.id)}
              >
                {item.label}
              </button>
            ) : (
              <strong>{item.label}</strong>
            )}
            {item.description && <p>{item.description}</p>}
          </div>
        </li>
      ))}
    </ol>
  );
}
export type DescriptionItem = {
  id: string;
  term: React.ReactNode;
  description: React.ReactNode;
};
export function DescriptionList({
  items,
  className,
  ...props
}: React.HTMLAttributes<HTMLDListElement> & { items: DescriptionItem[] }) {
  return (
    <dl {...props} className={cls("vs-description-list", className)}>
      {items.map((item) => (
        <div key={item.id}>
          <dt>{item.term}</dt>
          <dd>{item.description}</dd>
        </div>
      ))}
    </dl>
  );
}
