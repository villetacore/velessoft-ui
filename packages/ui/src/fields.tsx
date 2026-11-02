"use client";
import React, { forwardRef, useId } from "react";
import { cls, ids, useControllable } from "./utils.js";

export type FieldProps = { label: string; hint?: string; error?: string };

/** Connects label, hint and error to a control through generated ids. */
function useField(
  id: string | undefined,
  { hint, error }: Omit<FieldProps, "label">,
  describedBy?: string,
) {
  const uid = useId();
  const key = id || uid;
  return {
    key,
    describedBy: ids(
      describedBy,
      hint && key + "-hint",
      error && key + "-error",
    ),
  };
}

function FieldText({
  id,
  hint,
  error,
}: {
  id: string;
  hint?: string;
  error?: string;
}) {
  return (
    <>
      {hint && <small id={id + "-hint"}>{hint}</small>}
      {error && (
        <small className="vs-error" id={id + "-error"}>
          {error}
        </small>
      )}
    </>
  );
}

function FieldLabel({
  id,
  label,
  required,
}: {
  id: string;
  label: string;
  required?: boolean;
}) {
  return (
    <label htmlFor={id}>
      {label}
      {required ? " *" : ""}
    </label>
  );
}

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> &
  FieldProps & {
    /** Static text or element shown before the input, e.g. "https://". */
    startAddon?: React.ReactNode;
    endAddon?: React.ReactNode;
  };

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    { label, hint, error, id, className, startAddon, endAddon, ...props },
    ref,
  ) => {
    const f = useField(id, { hint, error }, props["aria-describedby"]);
    const input = (
      <input
        {...props}
        ref={ref}
        id={f.key}
        className={cls("vs-input", className)}
        aria-invalid={error ? true : props["aria-invalid"]}
        aria-describedby={f.describedBy}
      />
    );
    return (
      <div className="vs-field">
        <FieldLabel id={f.key} label={label} required={props.required} />
        {startAddon || endAddon ? (
          <div className="vs-input-group">
            {startAddon && <span className="vs-input-addon">{startAddon}</span>}
            {input}
            {endAddon && <span className="vs-input-addon">{endAddon}</span>}
          </div>
        ) : (
          input
        )}
        <FieldText id={f.key} hint={hint} error={error} />
      </div>
    );
  },
);

export const Textarea = forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement> & FieldProps
>(({ label, hint, error, id, className, ...props }, ref) => {
  const f = useField(id, { hint, error }, props["aria-describedby"]);
  return (
    <div className="vs-field">
      <FieldLabel id={f.key} label={label} required={props.required} />
      <textarea
        {...props}
        ref={ref}
        id={f.key}
        className={cls("vs-input", className)}
        aria-invalid={error ? true : props["aria-invalid"]}
        aria-describedby={f.describedBy}
      />
      <FieldText id={f.key} hint={hint} error={error} />
    </div>
  );
});

export const Select = forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement> & FieldProps
>(({ label, hint, error, id, className, children, ...props }, ref) => {
  const f = useField(id, { hint, error }, props["aria-describedby"]);
  return (
    <div className="vs-field">
      <FieldLabel id={f.key} label={label} required={props.required} />
      <select
        {...props}
        ref={ref}
        id={f.key}
        className={cls("vs-input", className)}
        aria-invalid={error ? true : props["aria-invalid"]}
        aria-describedby={f.describedBy}
      >
        {children}
      </select>
      <FieldText id={f.key} hint={hint} error={error} />
    </div>
  );
});

type ChoiceProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> & {
  label: React.ReactNode;
};

export const Checkbox = forwardRef<HTMLInputElement, ChoiceProps>(
  ({ label, className, ...props }, ref) => (
    <label className={cls("vs-checkbox", className)}>
      <input {...props} ref={ref} type="checkbox" />
      {label}
    </label>
  ),
);

export const Switch = forwardRef<HTMLInputElement, ChoiceProps>(
  ({ label, className, ...props }, ref) => (
    <label className={cls("vs-switch", className)}>
      <input {...props} ref={ref} type="checkbox" role="switch" />
      <span className="vs-switch-track" aria-hidden="true" />
      {label}
    </label>
  ),
);

export type RadioOption = {
  value: string;
  label: React.ReactNode;
  disabled?: boolean;
};

export type RadioGroupProps = Omit<
  React.FieldsetHTMLAttributes<HTMLFieldSetElement>,
  "onChange" | "defaultValue"
> &
  FieldProps & {
    options: RadioOption[];
    name?: string;
    value?: string;
    defaultValue?: string;
    onChange?: (value: string) => void;
    orientation?: "vertical" | "horizontal";
    required?: boolean;
  };

export function RadioGroup({
  label,
  hint,
  error,
  options,
  name,
  value,
  defaultValue = "",
  onChange,
  orientation = "vertical",
  required,
  disabled,
  className,
  id,
  ...props
}: RadioGroupProps) {
  const f = useField(id, { hint, error });
  const [current, setCurrent] = useControllable(value, defaultValue, onChange);
  return (
    <fieldset
      {...props}
      id={f.key}
      disabled={disabled}
      className={cls("vs-field", className)}
      aria-describedby={f.describedBy}
      aria-invalid={error ? true : undefined}
    >
      <legend>
        {label}
        {required ? " *" : ""}
      </legend>
      <div
        className={cls(
          "vs-radio-group",
          orientation === "horizontal" && "vs-horizontal",
        )}
      >
        {options.map((option) => (
          <label className="vs-radio" key={option.value}>
            <input
              type="radio"
              name={name || f.key}
              value={option.value}
              checked={current === option.value}
              disabled={option.disabled}
              required={required}
              onChange={() => setCurrent(option.value)}
            />
            {option.label}
          </label>
        ))}
      </div>
      <FieldText id={f.key} hint={hint} error={error} />
    </fieldset>
  );
}

export type SliderProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "type" | "value" | "defaultValue" | "onChange"
> &
  Omit<FieldProps, "error"> & {
    value?: number;
    defaultValue?: number;
    onChange?: (value: number) => void;
    showValue?: boolean;
    formatValue?: (value: number) => string;
  };

export const Slider = forwardRef<HTMLInputElement, SliderProps>(
  (
    {
      label,
      hint,
      id,
      className,
      value,
      defaultValue,
      onChange,
      min = 0,
      max = 100,
      showValue = true,
      formatValue = String,
      ...props
    },
    ref,
  ) => {
    const f = useField(id, { hint }, props["aria-describedby"]);
    const [current, setCurrent] = useControllable(
      value,
      defaultValue ?? Number(min),
      onChange,
    );
    return (
      <div className="vs-field">
        <div className="vs-slider-header">
          <FieldLabel id={f.key} label={label} />
          {showValue && <output htmlFor={f.key}>{formatValue(current)}</output>}
        </div>
        <input
          {...props}
          ref={ref}
          id={f.key}
          type="range"
          min={min}
          max={max}
          value={current}
          aria-valuetext={formatValue(current)}
          onChange={(e) => setCurrent(Number(e.target.value))}
          className={cls("vs-slider", className)}
          aria-describedby={f.describedBy}
        />
        <FieldText id={f.key} hint={hint} />
      </div>
    );
  },
);
