import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type User = { id: string; email: string };

type AuthState = {
  user: User | null;
  status: "idle" | "loading" | "ready";
};

const initialState: AuthState = {
  user: null,
  status: "idle",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthLoading: (state) => {
      state.status = "loading";
    },
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
      state.status = "ready";
    },
  },
});

export const { setUser, setAuthLoading } = authSlice.actions;
export default authSlice.reducer;