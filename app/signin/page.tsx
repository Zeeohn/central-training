"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { useMutation } from "@tanstack/react-query";
import { authApi } from "@/services/api";
import { setEmail, setError, setMessage } from "@/store/features/authSlice";
import type { OtpResponse } from "@/types/api";
import type { AppDispatch } from "@/store/store";
import { useToast } from "@/hooks/use-toast";

const isValidEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export default function SignIn() {
  const [emailInput, setEmailInput] = useState("");
  const [isNavigating, setIsNavigating] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { toast } = useToast();

  const { mutate: requestOtp, isPending } = useMutation<
    OtpResponse,
    Error,
    string
  >({
    mutationFn: authApi.requestOtp,
    onSuccess: (data) => {
      dispatch(setEmail(emailInput));
      dispatch(setMessage(data.message));
      dispatch(setError(null));
      toast({
        description: data.message,
        variant: "default",
      });
      setIsNavigating(true);
      setTimeout(() => {
        router.push("/verification");
      }, 2000);
    },
    onError: (error: Error) => {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to send OTP";
      dispatch(setError(errorMessage));
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailInput && isValidEmail(emailInput)) {
      requestOtp(emailInput);
    }
  };

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-gradient-to-br from-purple-900 to-purple-800">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg relative">
        {(isPending || isNavigating) && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/50 rounded-lg">
            <div className="w-6 h-6 border-2 border-indigo-900 rounded-full border-t-transparent animate-spin" />
          </div>
        )}
        <div className="mb-6 flex justify-center">
          <img
            src="/images/word-sanctuary-logo-black.png"
            alt="Word Sanctuary"
            className="h-16 w-auto"
          />
          </div>

        <h1 className="mb-2 text-center text-2xl font-bold text-purple-900">
          Sign in
        </h1>
        <p className="mb-6 text-center text-sm text-gray-600">
          Enter your email address to receive a one-time passcode
        </p>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="mb-1 block text-xs text-gray-500">
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email address"
              className={`w-full rounded border ${
                emailInput && !isValidEmail(emailInput)
                  ? "border-red-500"
                  : "border-gray-300"
              } px-3 py-2 focus:border-purple-500 focus:outline-none`}
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              required
              disabled={isPending || isNavigating}
            />
            {emailInput && !isValidEmail(emailInput) && (
              <p className="mt-1 text-xs text-red-500">
                Please enter a valid email address
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full rounded bg-indigo-900 py-2 text-white hover:bg-indigo-800 focus:outline-none disabled:opacity-50"
            disabled={isPending || isNavigating}
          >
            {isPending
              ? "Sending..."
              : isNavigating
              ? "Redirecting..."
              : "Get Code"}
          </button>
        </form>
      </div>
    </div>
  );
}
