"use client";
import React, { forwardRef, useId, useState } from "react";
import { Input, type InputProps } from "./fields.js";
import { Button, type ButtonProps } from "./actions.js";
import { useControllable, cls, ids } from "./utils.js";
import { CopyButton } from "./workflow.js";

/** Native number editing keeps temporary/empty values as strings; the app owns numeric parsing. */
export const NumberInput = forwardRef<
  HTMLInputElement,
  Omit<InputProps, "type">
>((props, ref) => <Input {...props} ref={ref} type="number" />);
/** Native date controls return YYYY-MM-DD without implicit timezone conversion. */
export const DateInput = forwardRef<HTMLInputElement, Omit<InputProps, "type">>(
  (props, ref) => <Input {...props} ref={ref} type="date" />,
);
export const TimeInput = forwardRef<HTMLInputElement, Omit<InputProps, "type">>(
  (props, ref) => <Input {...props} ref={ref} type="time" />,
);
export type FileInputProps = Omit<
  InputProps,
  "type" | "value" | "defaultValue" | "onChange" | "endAddon"
> & { onFilesChange?: (files: File[]) => void };
/** Native file selection only: never uploads automatically. accept is a chooser hint, not validation. */
export const FileInput = forwardRef<HTMLInputElement, FileInputProps>(
  ({ onFilesChange, ...props }, ref) => (
    <Input
      {...props}
      ref={ref}
      type="file"
      onChange={(e) => onFilesChange?.(Array.from(e.target.files ?? []))}
    />
  ),
);

export type MultiSelectOption = {
  value: string;
  label: string;
  disabled?: boolean;
};
/** Searchable checkbox list, deliberately not a partially implemented ARIA combobox. */
export function MultiSelect({
  label,
  options,
  value,
  defaultValue = [],
  onValueChange,
  searchLabel,
  emptyText,
  disabled,
  name,
  hint,
  error,
  className,
}: {
  label: string;
  options: MultiSelectOption[];
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
  searchLabel: string;
  emptyText: string;
  disabled?: boolean;
  name?: string;
  hint?: string;
  error?: string;
  className?: string;
}) {
  const [selected, setSelected] = useControllable(
    value,
    defaultValue,
    onValueChange,
  );
  const [query, setQuery] = useState("");
  const id = useId();
  const visible = options.filter((o) =>
    o.label.toLocaleLowerCase().includes(query.toLocaleLowerCase()),
  );
  return (
    <fieldset
      disabled={disabled}
      className={cls("vs-multiselect", className)}
      aria-describedby={ids(hint && id + "-hint", error && id + "-error")}
      aria-invalid={!!error || undefined}
    >
      <legend>{label}</legend>
      {hint && <small id={id + "-hint"}>{hint}</small>}
      <Input
        type="search"
        label={searchLabel}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <div className="vs-multiselect-options">
        {visible.length ? (
          visible.map((o) => (
            <label key={o.value} className="vs-checkbox">
              <input
                type="checkbox"
                checked={selected.includes(o.value)}
                disabled={o.disabled}
                onChange={(e) =>
                  setSelected(
                    e.target.checked
                      ? [...selected, o.value]
                      : selected.filter((v) => v !== o.value),
                  )
                }
              />
              {o.label}
            </label>
          ))
        ) : (
          <p role="status">{emptyText}</p>
        )}
      </div>
      {name &&
        selected.map((v) => (
          <input key={v} type="hidden" name={name} value={v} />
        ))}
      {error && (
        <small className="vs-field-error" id={id + "-error"}>
          {error}
        </small>
      )}
    </fieldset>
  );
}
export type ToggleProps = Omit<ButtonProps, "onChange" | "aria-pressed"> & {
  pressed?: boolean;
  defaultPressed?: boolean;
  onPressedChange?: (pressed: boolean) => void;
};
export const Toggle = forwardRef<HTMLButtonElement, ToggleProps>(
  (
    { pressed, defaultPressed = false, onPressedChange, onClick, ...props },
    ref,
  ) => {
    const [value, setValue] = useControllable(
      pressed,
      defaultPressed,
      onPressedChange,
    );
    return (
      <Button
        {...props}
        ref={ref}
        aria-pressed={value}
        onClick={(e) => {
          onClick?.(e);
          if (!e.defaultPrevented) setValue(!value);
        }}
      />
    );
  },
);
export function ToggleGroup({
  label,
  options,
  value,
  defaultValue = [],
  onValueChange,
  disabled,
}: {
  label: string;
  options: MultiSelectOption[];
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (v: string[]) => void;
  disabled?: boolean;
}) {
  const [selected, setSelected] = useControllable(
    value,
    defaultValue,
    onValueChange,
  );
  return (
    <div role="group" aria-label={label} className="vs-toggle-group">
      {options.map((o) => (
        <Toggle
          key={o.value}
          pressed={selected.includes(o.value)}
          disabled={disabled || o.disabled}
          onPressedChange={(pressed) =>
            setSelected(
              pressed
                ? [...selected, o.value]
                : selected.filter((v) => v !== o.value),
            )
          }
        >
          {o.label}
        </Toggle>
      ))}
    </div>
  );
}

/** Button disclosure. defaultOpen is initial-only; open/onOpenChange provide controlled usage. */
export function Collapsible({
  title,
  children,
  open,
  defaultOpen = false,
  onOpenChange,
  disabled = false,
  className,
}: {
  title: React.ReactNode;
  children: React.ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  disabled?: boolean;
  className?: string;
}) {
  const [current, setCurrent] = useControllable(
    open,
    defaultOpen,
    onOpenChange,
  );
  const id = useId();
  return (
    <div className={cls("vs-collapsible", className)}>
      <button
        type="button"
        disabled={disabled}
        aria-expanded={current}
        aria-controls={id}
        onClick={() => setCurrent(!current)}
      >
        {title}
        <span aria-hidden="true">{current ? "−" : "+"}</span>
      </button>
      <div id={id} hidden={!current} className="vs-collapsible-body">
        {children}
      </div>
    </div>
  );
}
export type TimelineItem = {
  id: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  dateTime?: string;
  time?: React.ReactNode;
};
export function Timeline({
  label,
  items,
  className,
}: {
  label: string;
  items: TimelineItem[];
  className?: string;
}) {
  return (
    <ol aria-label={label} className={cls("vs-timeline", className)}>
      {items.map((i) => (
        <li key={i.id}>
          <strong>{i.title}</strong>
          {i.time && <time dateTime={i.dateTime}>{i.time}</time>}
          {i.description && <div>{i.description}</div>}
        </li>
      ))}
    </ol>
  );
}
/** A layout group, not role=toolbar: native Tab order is retained for arbitrary children. */
export function Toolbar({
  label,
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { label: string }) {
  return (
    <div
      {...props}
      role="group"
      aria-label={label}
      className={cls("vs-toolbar", className)}
    >
      {children}
    </div>
  );
}
export function PageHeader({
  title,
  description,
  eyebrow,
  actions,
  level = 1,
  className,
}: {
  title: React.ReactNode;
  description?: React.ReactNode;
  eyebrow?: React.ReactNode;
  actions?: React.ReactNode;
  level?: 1 | 2;
  className?: string;
}) {
  const Heading = level === 1 ? "h1" : "h2";
  return (
    <div className={cls("vs-page-header", className)}>
      <div>
        {eyebrow && <small>{eyebrow}</small>}
        <Heading>{title}</Heading>
        {description && <p>{description}</p>}
      </div>
      {actions && <div className="vs-page-actions">{actions}</div>}
    </div>
  );
}
export type NavItem = {
  id: string;
  label: React.ReactNode;
  href: string;
  badge?: React.ReactNode;
};
export function NavList({
  label,
  items,
  current,
  className,
}: {
  label: string;
  items: NavItem[];
  current?: string;
  className?: string;
}) {
  return (
    <nav aria-label={label} className={className}>
      <ul className="vs-nav-list">
        {items.map((i) => (
          <li key={i.id}>
            <a
              href={i.href}
              aria-current={i.id === current ? "page" : undefined}
            >
              <span>{i.label}</span>
              {i.badge !== undefined && (
                <span className="vs-nav-badge">{i.badge}</span>
              )}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
export function CodeBlock({
  code,
  label,
  copyLabel,
  copiedLabel,
  errorLabel,
  className,
}: {
  code: string;
  label: string;
  copyLabel: string;
  copiedLabel: string;
  errorLabel: string;
  className?: string;
}) {
  return (
    <figure className={cls("vs-code-block", className)}>
      <figcaption>
        <span>{label}</span>
        <CopyButton
          value={code}
          label={copyLabel}
          copiedLabel={copiedLabel}
          errorLabel={errorLabel}
        />
      </figcaption>
      <pre tabIndex={0} aria-label={label}>
        <code>{code}</code>
      </pre>
    </figure>
  );
}
