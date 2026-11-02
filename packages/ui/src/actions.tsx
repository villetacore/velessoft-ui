"use client";
import React, { forwardRef } from "react";
import { cls, sizeClass, type Size } from "./utils.js";
import { Spinner } from "./feedback.js";

export type ButtonVariant = "primary" | "secondary" | "danger" | "ghost";
export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: Size;
  block?: boolean;
  loading?: boolean;
  /** Replaces children while loading. */
  loadingText?: React.ReactNode;
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "secondary",
      size,
      block,
      loading = false,
      loadingText,
      disabled,
      children,
      className,
      type = "button",
      ...props
    },
    ref,
  ) => {
    return (
      <button
        {...props}
        ref={ref}
        type={type}
        className={cls(
          "vs-button",
          `vs-${variant}`,
          sizeClass(size),
          block && "vs-block",
          className,
        )}
        disabled={disabled || loading}
        aria-busy={loading || undefined}
      >
        {loading && <Spinner decorative />}
        {loading && loadingText !== undefined ? loadingText : children}
      </button>
    );
  },
);

export type IconButtonProps = Omit<ButtonProps, "aria-label" | "block"> & {
  /** Accessible name; icon-only buttons must have one. */
  label: string;
};

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ label, className, title, ...props }, ref) => (
    <Button
      {...props}
      ref={ref}
      aria-label={label}
      title={title ?? label}
      className={cls("vs-icon-button", className)}
    />
  ),
);

export function ButtonGroup({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      role="group"
      {...props}
      className={cls("vs-button-group", className)}
    />
  );
}
