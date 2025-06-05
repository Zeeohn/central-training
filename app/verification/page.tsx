"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { useMutation } from "@tanstack/react-query";
import { authApi } from "@/services/api";
import {
  setToken,
  setProfile,
  setLeadershipLevel,
} from "@/store/features/authSlice";
import type { RootState } from "@/store/store";
import { useToast } from "@/hooks/use-toast";
import { setCookie } from "cookies-next";

export default function Verification() {
  const [code, setCode] = useState<string[]>(["", "", "", "", "", ""]);
  const [isVerifying, setIsVerifying] = useState(false);
  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  const router = useRouter();
  const dispatch = useDispatch();
  const { toast } = useToast();
  const email = useSelector((state: RootState) => state.auth.email);

  const { mutate: resendOtp, isPending: isResending } = useMutation({
    mutationFn: authApi.requestOtp,
    onSuccess: (data) => {
      toast({
        description: data.message,
        variant: "default",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to resend code",
        variant: "destructive",
      });
    },
  });

  const { mutate: addUser } = useMutation({
    mutationFn: authApi.addUser,
  });

  const { mutate: verifyOtp } = useMutation({
    mutationFn: (code: string) => authApi.verifyOtp(email, code),
    onSuccess: (data) => {
      if (data.registration_complete && data.profile) {
        addUser(data.profile, {
          onSuccess: (userData) => {
            setCookie("auth_token", userData.token, {
              maxAge: 5 * 60 * 60, // 5 hours
              path: "/",
              secure: process.env.NODE_ENV === "production",
              sameSite: "strict",
            });
            dispatch(setToken(userData.token));
            dispatch(setProfile(userData.user));
            if (userData.user.leadership_level) {
              dispatch(setLeadershipLevel(userData.user.leadership_level));
            }
            router.push("/trainee/interview-questions");
          },
          onError: (error: any) => {
            toast({
              title: "Error",
              description:
                error.response?.data?.message || "Failed to add user",
              variant: "destructive",
            });
          },
        });
      } else if (data.token) {
        toast({
          description: "You are being redirected to complete your profile",
          variant: "default",
        });
        const redirectUrl = `${
          process.env.NEXT_PUBLIC_CENTRAL_SYSTEM_FRONTEND_URL
        }/dashboard/onboard/individual?token=${
          data.token
        }&redirect=${encodeURIComponent(
          `${process.env.NEXT_PUBLIC_TRAINING_URL}/data-receiver`
        )}&email=${encodeURIComponent(email)}`;
        window.location.href = redirectUrl;
      }
    },
    onError: (error: any) => {
      setIsVerifying(false);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to verify code",
        variant: "destructive",
      });
    },
  });

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text");
    const digits = pastedData.match(/\d/g);

    if (digits && digits.length >= 6) {
      const newCode = [...code];
      for (let i = 0; i < 6; i++) {
        newCode[i] = digits[i] || "";
      }
      setCode(newCode);
      inputRefs[5].current?.focus();
    }
  };

  const handleChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);

      if (value !== "" && index < 5) {
        inputRefs[index + 1].current?.focus();
      }
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && code[index] === "" && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.every((digit) => digit !== "")) {
      setIsVerifying(true);
      verifyOtp(code.join(""));
    }
  };

  const handleResend = () => {
    if (email) {
      resendOtp(email);
    }
  };

  // Redirect to signin if email is not in state
  useEffect(() => {
    if (!email) {
      router.push("/signin");
    }
  }, [email, router]);

  if (!email) return null;

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-gradient-to-br from-purple-900 to-purple-800">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg relative">
        {isVerifying && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/50 rounded-lg">
            <div className="w-6 h-6 border-2 border-indigo-900 rounded-full border-t-transparent animate-spin" />
          </div>
        )}

        <h1 className="mb-2 text-center text-2xl font-bold text-gray-800">
          Account Verification
        </h1>
        <p className="mb-8 text-center text-sm text-gray-600">
          6-digit verification code has been sent to your email.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="mb-8 flex justify-center space-x-4">
            {code.map((digit, index) => (
              <input
                key={index}
                ref={inputRefs[index]}
                type="text"
                maxLength={1}
                className="h-14 w-14 rounded-md border border-gray-300 text-center text-xl focus:border-purple-500 focus:outline-none"
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={index === 0 ? handlePaste : undefined}
                inputMode="numeric"
                pattern="[0-9]"
                disabled={isVerifying || isResending}
              />
            ))}
          </div>

          <div className="mb-8 text-center text-sm">
            <span className="text-gray-600">Didn't receive the code? </span>
            <button
              type="button"
              onClick={handleResend}
              className="text-purple-600 hover:underline disabled:opacity-50 disabled:no-underline"
              disabled={isResending || isVerifying}
            >
              {isResending ? "Resending..." : "Resend it"}
            </button>
          </div>

          <button
            type="submit"
            className="w-full rounded bg-indigo-900 py-2 text-white hover:bg-indigo-800 focus:outline-none disabled:opacity-50"
            disabled={
              !code.every((digit) => digit !== "") || isVerifying || isResending
            }
          >
            {isVerifying ? "Verifying..." : "Verify Code"}
          </button>
        </form>
      </div>
    </div>
  );
}
