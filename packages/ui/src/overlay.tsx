"use client";
import React, {
  cloneElement,
  isValidElement,
  useEffect,
  useLayoutEffect,
  useId,
  useRef,
  useState,
} from "react";
import { cls, ids, placeFloating, trackPlacement } from "./utils.js";
import { useMessages } from "./i18n.js";
import { Button } from "./actions.js";

export type DialogProps = {
  open: boolean;
  /** A request to close; the consumer sets `open` to false. */
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: "sm" | "md" | "lg";
  closeLabel?: string;
  /** Request closing when the backdrop is clicked. */
  closeOnBackdrop?: boolean;
  className?: string;
};

export function Dialog({
  open,
  onClose,
  title,
  children,
  footer,
  size = "md",
  closeLabel,
  closeOnBackdrop = false,
  className,
}: DialogProps) {
  const t = useMessages();
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
      className={cls("vs-dialog", size !== "md" && `vs-${size}`, className)}
      aria-labelledby={id}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => {
        if (!closeOnBackdrop || e.target !== e.currentTarget) return;
        const r = e.currentTarget.getBoundingClientRect();
        const inside =
          e.clientX >= r.left &&
          e.clientX <= r.right &&
          e.clientY >= r.top &&
          e.clientY <= r.bottom;
        if (!inside) onClose();
      }}
    >
      <div className="vs-dialog-heading">
        <h2 id={id}>{title}</h2>
        <Button aria-label={closeLabel ?? t.closeDialog} onClick={onClose}>
          ×
        </Button>
      </div>
      {children}
      {footer && <div className="vs-dialog-footer">{footer}</div>}
    </dialog>
  );
}

export function Drawer({
  side = "right",
  closeOnBackdrop = true,
  className,
  ...props
}: Omit<DialogProps, "size"> & { side?: "left" | "right" }) {
  return (
    <Dialog
      {...props}
      closeOnBackdrop={closeOnBackdrop}
      className={cls("vs-drawer", side === "left" && "vs-left", className)}
    />
  );
}

/** Closes on Escape and on pointer down outside `ref` while `active`. */
function useDismiss(
  active: boolean,
  ref: React.RefObject<HTMLElement | null>,
  onDismiss: (reason: "escape" | "outside") => void,
) {
  const latest = useRef(onDismiss);
  latest.current = onDismiss;
  useEffect(() => {
    if (!active) return;
    const key = (e: KeyboardEvent) =>
      e.key === "Escape" && latest.current("escape");
    const down = (e: PointerEvent | MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        latest.current("outside");
    };
    document.addEventListener("keydown", key);
    document.addEventListener("mousedown", down);
    return () => {
      document.removeEventListener("keydown", key);
      document.removeEventListener("mousedown", down);
    };
  }, [active, ref]);
}

export function Tooltip({
  content,
  children,
  placement = "top",
  delay = 300,
}: {
  content: React.ReactNode;
  /** A single focusable element, such as a Button. */
  children: React.ReactElement<{ "aria-describedby"?: string }>;
  placement?: "top" | "bottom" | "left" | "right";
  delay?: number;
}) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const timer = useRef<number | undefined>(undefined);
  const anchor = useRef<HTMLSpanElement>(null);
  const show = (wait: number) => {
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setOpen(true), wait);
  };
  const hide = () => {
    window.clearTimeout(timer.current);
    setOpen(false);
  };
  useEffect(() => () => window.clearTimeout(timer.current), []);
  useDismiss(open, anchor, (reason) => reason === "escape" && hide());
  const child = isValidElement(children)
    ? cloneElement(children, {
        "aria-describedby": ids(children.props["aria-describedby"], id),
      })
    : children;
  return (
    <span
      ref={anchor}
      className="vs-tooltip-anchor"
      onPointerEnter={() => show(delay)}
      onPointerLeave={hide}
      onFocus={() => show(0)}
      onBlur={hide}
    >
      {child}
      <span
        role="tooltip"
        id={id}
        className="vs-tooltip"
        data-placement={placement}
        hidden={!open}
      >
        {content}
      </span>
    </span>
  );
}

export type MenuItem =
  | {
      type?: "item";
      label: React.ReactNode;
      onSelect?: () => void;
      href?: string;
      disabled?: boolean;
      danger?: boolean;
      shortcut?: string;
      icon?: React.ReactNode;
    }
  | { type: "separator" }
  | { type: "label"; label: React.ReactNode };

export function Menu({
  label,
  items,
  align = "start",
  variant = "secondary",
  triggerLabel,
  className,
}: {
  /** Trigger content. */
  label: React.ReactNode;
  items: MenuItem[];
  align?: "start" | "end";
  variant?: "primary" | "secondary" | "ghost";
  /** Accessible name when the trigger shows only an icon. */
  triggerLabel?: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const list = useRef<HTMLDivElement>(null);
  const menuId = useId();
  const focusItem = (index: number | "first" | "last") => {
    const nodes = Array.from(
      list.current?.querySelectorAll<HTMLElement>(
        '[role="menuitem"]:not(:disabled)',
      ) ?? [],
    );
    if (!nodes.length) return;
    const current = nodes.indexOf(document.activeElement as HTMLElement);
    const next =
      index === "first"
        ? 0
        : index === "last"
          ? nodes.length - 1
          : (current + index + nodes.length) % nodes.length;
    nodes[next]?.focus();
  };
  const close = (refocus = true) => {
    setOpen(false);
    if (refocus) trigger.current?.focus();
  };
  useDismiss(open, root, (reason) => close(reason === "escape"));
  useLayoutEffect(() => {
    if (!open || !trigger.current || !list.current) return;
    const stop = trackPlacement(() =>
      placeFloating(trigger.current!, list.current!, align),
    );
    focusItem("first");
    return stop;
  }, [open, align]);
  return (
    <div ref={root} className={cls("vs-menu-anchor", className)}>
      <Button
        ref={trigger}
        variant={variant}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        aria-label={triggerLabel}
        onClick={() => setOpen((v) => !v)}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown" || e.key === "ArrowUp") {
            e.preventDefault();
            setOpen(true);
          }
        }}
      >
        {label}
      </Button>
      <div
        ref={list}
        id={menuId}
        role="menu"
        className="vs-menu"
        data-align={align}
        hidden={!open}
        onKeyDown={(e) => {
          const moves: Record<string, number | "first" | "last"> = {
            ArrowDown: 1,
            ArrowUp: -1,
            Home: "first",
            End: "last",
          };
          if (e.key in moves) {
            e.preventDefault();
            focusItem(moves[e.key]);
          } else if (e.key === "Tab") close(false);
        }}
      >
        {items.map((item, i) => {
          if (item.type === "separator")
            return (
              <hr key={i} role="separator" className="vs-menu-separator" />
            );
          if (item.type === "label")
            return (
              <div key={i} className="vs-menu-label" role="presentation">
                {item.label}
              </div>
            );
          const props = {
            role: "menuitem",
            tabIndex: -1,
            className: cls("vs-menu-item", item.danger && "vs-danger"),
            onClick: () => {
              item.onSelect?.();
              close();
            },
          };
          const body = (
            <>
              {item.icon}
              {item.label}
              {item.shortcut && <kbd>{item.shortcut}</kbd>}
            </>
          );
          return item.href && !item.disabled ? (
            <a key={i} href={item.href} {...props}>
              {body}
            </a>
          ) : (
            <button key={i} type="button" disabled={item.disabled} {...props}>
              {body}
            </button>
          );
        })}
      </div>
    </div>
  );
}
