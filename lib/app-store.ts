"use client";

import { create } from "zustand";

export type AppNotification = {
  id: string;
  title: string;
  body: string;
  href: string;
  time: string;
  read: boolean;
};

type AppStore = {
  notifications: AppNotification[];
  emailAlerts: boolean;
  productTips: boolean;
  markRead: (id: string) => void;
  markAllRead: () => void;
  setEmailAlerts: (value: boolean) => void;
  setProductTips: (value: boolean) => void;
};

export const useAppStore = create<AppStore>((set) => ({
  notifications: [
    {
      id: "n1",
      title: "Mapping ready",
      body: "Class 10 Biology unit test has been extracted. Open Exams to review highlights.",
      href: "/exams",
      time: "2 min ago",
      read: false,
    },
    {
      id: "n2",
      title: "Unanswered questions",
      body: "Q4 and Q13 had no answer detected on the last script.",
      href: "/exams",
      time: "1 hr ago",
      read: false,
    },
    {
      id: "n3",
      title: "How sample papers work",
      body: "You can load the built-in Biology papers from the upload screen.",
      href: "/help",
      time: "Yesterday",
      read: true,
    },
  ],
  emailAlerts: true,
  productTips: false,
  markRead(id) {
    set((state) => ({
      notifications: state.notifications.map((item) =>
        item.id === id ? { ...item, read: true } : item,
      ),
    }));
  },
  markAllRead() {
    set((state) => ({
      notifications: state.notifications.map((item) => ({ ...item, read: true })),
    }));
  },
  setEmailAlerts(value) {
    set({ emailAlerts: value });
  },
  setProductTips(value) {
    set({ productTips: value });
  },
}));

export function unreadCount(notifications: AppNotification[]): number {
  return notifications.filter((item) => !item.read).length;
}
