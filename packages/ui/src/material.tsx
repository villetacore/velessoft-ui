"use client";
import React, { forwardRef } from "react";
import { cls } from "./utils.js";
/** Optional frosted panel. Use data-material="solid" to disable transparency in its ancestor. */
export const GlassPanel = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { animate?: boolean }
>(({ className, animate = false, ...props }, ref) => (
  <div
    {...props}
    ref={ref}
    className={cls("vs-glass-panel", animate && "vs-reveal", className)}
  />
));
