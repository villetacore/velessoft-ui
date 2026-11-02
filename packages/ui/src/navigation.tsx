"use client";
import React, { useId, useRef } from "react";
import { cls, useControllable } from "./utils.js";
import { useMessages } from "./i18n.js";

export type TabItem = {
  value: string;
  label: React.ReactNode;
  content: React.ReactNode;
  disabled?: boolean;
};

export function Tabs({
  items,
  value,
  defaultValue,
  onChange,
  label,
  className,
}: {
  items: TabItem[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  /** Accessible name of the tab list. */
  label?: string;
  className?: string;
}) {
  const base = useId();
  const listRef = useRef<HTMLDivElement>(null);
  const enabled = items.filter((item) => !item.disabled);
  const [current, setCurrent] = useControllable(
    value,
    defaultValue ?? enabled[0]?.value ?? "",
    onChange,
  );
  const select = (next: TabItem | undefined) => {
    if (!next) return;
    setCurrent(next.value);
    Array.from(
      listRef.current?.querySelectorAll<HTMLElement>('[role="tab"]') ?? [],
    )
      .find((tab) => tab.dataset.value === next.value)
      ?.focus();
  };
  const onKeyDown = (e: React.KeyboardEvent) => {
    const index = enabled.findIndex((item) => item.value === current);
    const map: Record<string, TabItem | undefined> = {
      ArrowRight: enabled[(index + 1) % enabled.length],
      ArrowLeft: enabled[(index - 1 + enabled.length) % enabled.length],
      Home: enabled[0],
      End: enabled[enabled.length - 1],
    };
    if (e.key in map) {
      e.preventDefault();
      select(map[e.key]);
    }
  };
  return (
    <div className={cls("vs-tabs", className)}>
      <div
        ref={listRef}
        role="tablist"
        aria-label={label}
        className="vs-tab-list"
        onKeyDown={onKeyDown}
      >
        {items.map((item) => {
          const selected = item.value === current;
          return (
            <button
              key={item.value}
              type="button"
              role="tab"
              id={`${base}-tab-${item.value}`}
              aria-controls={`${base}-panel-${item.value}`}
              aria-selected={selected}
              tabIndex={selected ? 0 : -1}
              disabled={item.disabled}
              data-value={item.value}
              className="vs-tab"
              onClick={() => setCurrent(item.value)}
            >
              {item.label}
            </button>
          );
        })}
      </div>
      {items.map((item) => (
        <div
          key={item.value}
          role="tabpanel"
          id={`${base}-panel-${item.value}`}
          aria-labelledby={`${base}-tab-${item.value}`}
          className="vs-tab-panel"
          hidden={item.value !== current}
          tabIndex={0}
        >
          {item.content}
        </div>
      ))}
    </div>
  );
}

export function SegmentedControl({
  label,
  options,
  value,
  defaultValue,
  onChange,
  name,
  className,
}: {
  /** Accessible name of the group. */
  label: string;
  options: { value: string; label: React.ReactNode; disabled?: boolean }[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  name?: string;
  className?: string;
}) {
  const uid = useId();
  const [current, setCurrent] = useControllable(
    value,
    defaultValue ?? options[0]?.value ?? "",
    onChange,
  );
  return (
    <div
      role="radiogroup"
      aria-label={label}
      className={cls("vs-segmented", className)}
    >
      {options.map((option) => (
        <label key={option.value}>
          <input
            type="radio"
            name={name || uid}
            value={option.value}
            checked={current === option.value}
            disabled={option.disabled}
            onChange={() => setCurrent(option.value)}
          />
          <span>{option.label}</span>
        </label>
      ))}
    </div>
  );
}

export function Breadcrumbs({
  items,
  label,
  className,
}: {
  items: { label: React.ReactNode; href?: string }[];
  label?: string;
  className?: string;
}) {
  const t = useMessages();
  return (
    <nav
      aria-label={label ?? t.breadcrumbs}
      className={cls("vs-breadcrumbs", className)}
    >
      <ol>
        {items.map((item, i) => {
          const last = i === items.length - 1;
          return (
            <li key={i}>
              {last || !item.href ? (
                <span aria-current={last ? "page" : undefined}>
                  {item.label}
                </span>
              ) : (
                <a href={item.href}>{item.label}</a>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

/** Page numbers with ellipses, e.g. 1 … 4 5 6 … 20. */
export function paginationRange(page: number, count: number, siblings = 1) {
  const pages: (number | "gap")[] = [];
  const start = Math.max(2, page - siblings);
  const end = Math.min(count - 1, page + siblings);
  pages.push(1);
  if (start > 2) pages.push(start === 3 ? 2 : "gap");
  for (let p = start; p <= end; p++) pages.push(p);
  if (end < count - 1) pages.push(end === count - 2 ? count - 1 : "gap");
  if (count > 1) pages.push(count);
  return pages;
}

export function Pagination({
  page,
  pageCount,
  onPageChange,
  siblings = 1,
  label,
  className,
}: {
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
  siblings?: number;
  label?: string;
  className?: string;
}) {
  const t = useMessages();
  if (pageCount < 1) return null;
  return (
    <nav
      aria-label={label ?? t.pagination}
      className={cls("vs-pagination", className)}
    >
      <ul>
        <li>
          <button
            type="button"
            aria-label={t.previous}
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
          >
            ←
          </button>
        </li>
        {paginationRange(page, pageCount, siblings).map((p, i) => (
          <li key={i}>
            {p === "gap" ? (
              <span className="vs-ellipsis" aria-hidden="true">
                …
              </span>
            ) : (
              <button
                type="button"
                aria-label={t.page(p)}
                aria-current={p === page ? "page" : undefined}
                onClick={() => onPageChange(p)}
              >
                {p}
              </button>
            )}
          </li>
        ))}
        <li>
          <button
            type="button"
            aria-label={t.next}
            disabled={page >= pageCount}
            onClick={() => onPageChange(page + 1)}
          >
            →
          </button>
        </li>
      </ul>
    </nav>
  );
}
