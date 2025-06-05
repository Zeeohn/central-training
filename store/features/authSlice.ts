import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserProfile {
  // This is for adding user profile fields based on the API response from Central Systems
  [key: string]: any;
}

interface AuthState {
  email: string;
  isLoading: boolean;
  error: string | null;
  message: string | null;
  token: string | null;
  profile: UserProfile | null;
  leadershipLevel: string | null;
  role: string | null;
}

const initialState: AuthState = {
  email: "",
  isLoading: false,
  error: null,
  message: null,
  token: null,
  profile: null,
  leadershipLevel: null,
  role: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setEmail: (state, action: PayloadAction<string>) => {
      state.email = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setMessage: (state, action: PayloadAction<string | null>) => {
      state.message = action.payload;
    },
    resetAuth: (state) => {
      state.email = "";
      state.isLoading = false;
      state.error = null;
      state.message = null;
      state.token = null;
      state.profile = null;
      state.leadershipLevel = null;
      state.role = null;
    },
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
    },
    setProfile: (state, action: PayloadAction<UserProfile>) => {
      state.profile = action.payload;
    },
    setLeadershipLevel: (state, action: PayloadAction<string>) => {
      state.leadershipLevel = action.payload;
    },
    setRole: (state, action: PayloadAction<string>) => {
      state.role = action.payload;
    },
  },
});

export const {
  setEmail,
  setLoading,
  setError,
  setMessage,
  resetAuth,
  setToken,
  setProfile,
  setLeadershipLevel,
  setRole,
} = authSlice.actions;
export default authSlice.reducer;
