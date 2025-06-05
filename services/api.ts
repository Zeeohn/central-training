import axios from "axios";
import type { OtpResponse } from "@/types/api";

const API_URL = process.env.NEXT_PUBLIC_TRAINING_API_URL;
const CENTRAL_SYSTEM_API_URL = process.env.NEXT_PUBLIC_CENTRAL_SYSTEM_API_URL;

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export interface VerificationResponse {
  verified: boolean;
  registration_complete: boolean;
  profile?: any;
  success?: boolean;
  token?: string;
  message?: string;
}

export interface AddUserResponse {
  token: string;
  user: any;
}

export const authApi = {
  requestOtp: async (email: string) => {
    const response = await axios.post(
      `${CENTRAL_SYSTEM_API_URL}/auth/access/request/external/login`,
      {
        email,
      }
    );
    return response.data as OtpResponse;
  },

  verifyOtp: async (email: string, code: string) => {
    const response = await axios.post(
      `${CENTRAL_SYSTEM_API_URL}/auth/access/request/external/verify`,
      {
        email,
        otp: code,
      }
    );
    return response.data as VerificationResponse;
  },

  addUser: async (profile: any) => {
    const response = await api.post("/user/add-user", profile);
    console.log("Add user response: ", response.data);
    return response.data.responseObject as AddUserResponse;
  },
};
