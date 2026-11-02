"use client";
import React, { createContext, useContext } from "react";

export type Messages = {
  saving: string;
  loading: string;
  closeDialog: string;
  close: string;
  remove: string;
  previous: string;
  next: string;
  page: (page: number) => string;
  pagination: string;
  breadcrumbs: string;
  notifications: string;
  noData: string;
};

export const ru: Messages = {
  saving: "Сохранение…",
  loading: "Загрузка…",
  closeDialog: "Закрыть диалог",
  close: "Закрыть",
  remove: "Удалить",
  previous: "Назад",
  next: "Вперёд",
  page: (page) => `Страница ${page}`,
  pagination: "Страницы",
  breadcrumbs: "Навигационная цепочка",
  notifications: "Уведомления",
  noData: "Нет данных",
};

export const en: Messages = {
  saving: "Saving…",
  loading: "Loading…",
  closeDialog: "Close dialog",
  close: "Close",
  remove: "Remove",
  previous: "Previous",
  next: "Next",
  page: (page) => `Page ${page}`,
  pagination: "Pagination",
  breadcrumbs: "Breadcrumb",
  notifications: "Notifications",
  noData: "No data",
};

const MessagesContext = createContext<Messages>(ru);

/** Sets labels used by components (loading, close, pagination…). Defaults to Russian. */
export function VelessoftProvider({
  messages,
  children,
}: {
  messages?: Partial<Messages>;
  children: React.ReactNode;
}) {
  const parent = useContext(MessagesContext);
  return (
    <MessagesContext.Provider value={{ ...parent, ...messages }}>
      {children}
    </MessagesContext.Provider>
  );
}

export const useMessages = () => useContext(MessagesContext);
