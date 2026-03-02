"use client";

import { useAppSelector } from "@/store/hooks";

export function UserBadge() {
  const { user, status } = useAppSelector((s) => s.auth);

  if (status === "loading") return <p style={{ margin: 0 }}>Loading user...</p>;
  if (!user) return <p style={{ margin: 0, opacity: 0.7 }}>Not signed in</p>;

  return <p style={{ margin: 0 }}>👤 {user.email}</p>;
}