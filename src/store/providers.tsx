"use client";

import { Provider } from "react-redux";
import { useEffect } from "react";
import { store } from "./store";
import { setAuthLoading, setUser } from "./slices/authSlice";

function AuthHydrator() {
  useEffect(() => {
    (async () => {
      store.dispatch(setAuthLoading());
      const res = await fetch("/api/auth/me", { method: "GET" });
      const data = await res.json().catch(() => ({ user: null }));
      store.dispatch(setUser(data.user ?? null));
    })();
  }, []);

  return null;
}

export function ReduxProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <AuthHydrator />
      {children}
    </Provider>
  );
}