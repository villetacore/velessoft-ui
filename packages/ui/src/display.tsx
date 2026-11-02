"use client";
import React, { useMemo, useState } from "react";
import { cls, sizeClass, type Size, type Tone } from "./utils.js";
import { useMessages } from "./i18n.js";

export function Card({
  title,
  description,
  actions,
  footer,
  tone,
  flat,
  interactive,
  className,
  children,
  ...props
}: Omit<React.HTMLAttributes<HTMLElement>, "title"> & {
  title?: React.ReactNode;
  description?: React.ReactNode;
  /** Shown at the top right of the header. */
  actions?: React.ReactNode;
  footer?: React.ReactNode;
  tone?: Tone;
  /** Removes the accent top border. */
  flat?: boolean;
  /** Adds a hover lift for clickable cards. */
  interactive?: boolean;
}) {
  return (
    <article
      {...props}
      className={cls(
        "vs-card",
        tone && `vs-${tone}`,
        flat && "vs-flat",
        interactive && "vs-interactive",
        className,
      )}
    >
      {(title || description || actions) && (
        <header className="vs-card-header">
          <div>
            {title && <h3>{title}</h3>}
            {description && <p>{description}</p>}
          </div>
          {actions}
        </header>
      )}
      {children}
      {footer && <footer className="vs-card-footer">{footer}</footer>}
    </article>
  );
}

export function Stack({
  direction = "column",
  gap = 12,
  align,
  justify,
  wrap,
  as: Tag = "div",
  className,
  style,
  ...props
}: React.HTMLAttributes<HTMLElement> & {
  direction?: "row" | "column";
  /** Pixels or any CSS length. */
  gap?: number | string;
  align?: React.CSSProperties["alignItems"];
  justify?: React.CSSProperties["justifyContent"];
  wrap?: boolean;
  as?: React.ElementType;
}) {
  return (
    <Tag
      {...props}
      className={cls(
        "vs-stack",
        direction === "row" && "vs-row",
        wrap && "vs-wrap",
        className,
      )}
      style={
        {
          "--vs-stack-gap": typeof gap === "number" ? `${gap}px` : gap,
          alignItems: align,
          justifyContent: justify,
          ...style,
        } as React.CSSProperties
      }
    />
  );
}

export function Grid({
  min = 220,
  gap = 12,
  className,
  style,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  /** Minimum column width in pixels; columns wrap automatically. */
  min?: number;
  gap?: number;
}) {
  return (
    <div
      {...props}
      className={cls("vs-grid", className)}
      style={
        {
          "--vs-grid-min": `${min}px`,
          "--vs-stack-gap": `${gap}px`,
          ...style,
        } as React.CSSProperties
      }
    />
  );
}

export function Divider({
  label,
  orientation = "horizontal",
  className,
}: {
  label?: React.ReactNode;
  orientation?: "horizontal" | "vertical";
  className?: string;
}) {
  if (label)
    return (
      <div role="separator" className={cls("vs-divider-label", className)}>
        {label}
      </div>
    );
  return (
    <hr
      aria-orientation={orientation}
      className={cls(
        "vs-divider",
        orientation === "vertical" && "vs-vertical",
        className,
      )}
    />
  );
}

export const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("");

export function Avatar({
  name,
  src,
  size = "md",
  round,
  tone,
  className,
}: {
  /** Person or project name: used as alt text and for initials. */
  name: string;
  src?: string;
  size?: Size;
  round?: boolean;
  tone?: Tone;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  return (
    <span
      className={cls(
        "vs-avatar",
        sizeClass(size),
        round && "vs-round",
        tone && `vs-${tone}`,
        className,
      )}
      role={src && !failed ? undefined : "img"}
      aria-label={src && !failed ? undefined : name}
      title={name}
    >
      {src && !failed ? (
        <img src={src} alt={name} onError={() => setFailed(true)} />
      ) : (
        <span aria-hidden="true">{initials(name)}</span>
      )}
    </span>
  );
}

export function AvatarGroup({
  children,
  max,
  className,
}: {
  children: React.ReactNode;
  /** Show at most this many avatars followed by a "+N" counter. */
  max?: number;
  className?: string;
}) {
  const list = React.Children.toArray(children);
  const shown = max ? list.slice(0, max) : list;
  const rest = list.length - shown.length;
  return (
    <span className={cls("vs-avatar-group", className)}>
      {shown}
      {rest > 0 && <span className="vs-avatar vs-neutral">+{rest}</span>}
    </span>
  );
}

export function Kbd({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  return <kbd {...props} className={cls("vs-kbd", className)} />;
}

export type TableColumn<T> = {
  key: string;
  header: React.ReactNode;
  /** Defaults to `row[key]`. */
  render?: (row: T) => React.ReactNode;
  align?: "left" | "right";
  /** Enables header sorting; return a comparable value. */
  sortValue?: (row: T) => string | number;
};

export function Table<T>({
  columns,
  rows,
  rowKey,
  caption,
  striped,
  hover = true,
  compact,
  emptyText,
  className,
}: {
  columns: TableColumn<T>[];
  rows: T[];
  rowKey: (row: T, index: number) => React.Key;
  caption?: React.ReactNode;
  striped?: boolean;
  hover?: boolean;
  compact?: boolean;
  emptyText?: React.ReactNode;
  className?: string;
}) {
  const t = useMessages();
  const [sort, setSort] = useState<{ key: string; dir: 1 | -1 } | null>(null);
  const sorted = useMemo(() => {
    const column = sort && columns.find((c) => c.key === sort.key);
    if (!column?.sortValue) return rows;
    const value = column.sortValue;
    return [...rows].sort((a, b) => {
      const x = value(a),
        y = value(b);
      return (x < y ? -1 : x > y ? 1 : 0) * sort!.dir;
    });
  }, [rows, columns, sort]);
  const cell = (column: TableColumn<T>, row: T) =>
    column.render
      ? column.render(row)
      : String((row as Record<string, unknown>)[column.key] ?? "");
  return (
    <div className="vs-table-wrap">
      <table
        className={cls(
          "vs-table",
          striped && "vs-striped",
          hover && "vs-hover",
          compact && "vs-compact",
          className,
        )}
      >
        {caption && <caption>{caption}</caption>}
        <thead>
          <tr>
            {columns.map((column) => {
              const active = sort?.key === column.key;
              return (
                <th
                  key={column.key}
                  scope="col"
                  className={
                    column.align === "right" ? "vs-numeric" : undefined
                  }
                  aria-sort={
                    active
                      ? sort!.dir === 1
                        ? "ascending"
                        : "descending"
                      : undefined
                  }
                >
                  {column.sortValue ? (
                    <button
                      type="button"
                      onClick={() =>
                        setSort({
                          key: column.key,
                          dir: active && sort!.dir === 1 ? -1 : 1,
                        })
                      }
                    >
                      {column.header}{" "}
                      {active ? (sort!.dir === 1 ? "↑" : "↓") : "↕"}
                    </button>
                  ) : (
                    column.header
                  )}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {sorted.length === 0 ? (
            <tr>
              <td colSpan={columns.length}>{emptyText ?? t.noData}</td>
            </tr>
          ) : (
            sorted.map((row, i) => (
              <tr key={rowKey(row, i)}>
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className={
                      column.align === "right" ? "vs-numeric" : undefined
                    }
                  >
                    {cell(column, row)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export function Accordion({
  items,
  exclusive,
  className,
}: {
  items: {
    title: React.ReactNode;
    content: React.ReactNode;
    defaultOpen?: boolean;
  }[];
  /** Only one section open at a time (uses the native `name` attribute). */
  exclusive?: boolean;
  className?: string;
}) {
  const name = React.useId();
  return (
    <div className={cls("vs-accordion", className)}>
      {items.map((item, i) => (
        <details
          key={i}
          open={item.defaultOpen}
          name={exclusive ? name : undefined}
        >
          <summary>{item.title}</summary>
          <div className="vs-accordion-content">{item.content}</div>
        </details>
      ))}
    </div>
  );
}

export function Stat({
  label,
  value,
  delta,
  tone,
  className,
}: {
  label: React.ReactNode;
  value: React.ReactNode;
  delta?: React.ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <div className={cls("vs-stat", tone && `vs-${tone}`, className)}>
      <span className="vs-stat-label">{label}</span>
      <span className="vs-stat-value">{value}</span>
      {delta && <span className="vs-stat-delta">{delta}</span>}
    </div>
  );
}

export function EmptyState({
  icon = "[ ]",
  title,
  description,
  actions,
  className,
}: {
  icon?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cls("vs-empty-state", className)}>
      <span className="vs-empty-state-icon" aria-hidden="true">
        {icon}
      </span>
      <h3>{title}</h3>
      {description && <p>{description}</p>}
      {actions && <div className="vs-empty-state-actions">{actions}</div>}
    </div>
  );
}
