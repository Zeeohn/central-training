"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { authApi } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import { useDispatch } from "react-redux";
import {
  setToken,
  setProfile,
  setLeadershipLevel,
} from "@/store/features/authSlice";
import { setCookie, getCookie, deleteCookie } from "cookies-next";
import { Loader2 } from "lucide-react";

export default function DataReceiver() {
  const [isProcessing, setIsProcessing] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const dispatch = useDispatch();
  const { toast } = useToast();

  const { mutate: addUser } = useMutation({
    mutationFn: authApi.addUser,
    onSuccess: (data) => {
      console.log("Data from Add user in the data-receiver: ", data);
      // Store token in cookie
      setCookie("auth_token", data.token, {
        maxAge: 5 * 60 * 60, // 5 hours
        path: "/",
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });

      // Store user data and token in Redux state
      dispatch(setToken(data.token));
      dispatch(setProfile(data.user));

      // Store leadership level specifically
      if (data.user.leadership_level) {
        dispatch(setLeadershipLevel(data.user.leadership_level));
      }

      toast({
        description: "Login successful. Redirecting to dashboard...",
        variant: "default",
      });

      // Redirect to welcome page
      setTimeout(() => {
        router.push("/trainee/interview-questions");
      }, 1000);
    },
    onError: (error: any) => {
      setIsProcessing(false);
      setError(error.response?.data?.message || "Failed to process user data");
      toast({
        title: "Error",
        description:
          error.response?.data?.message || "Failed to process user data",
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    // Read profile data from cookie on mount
    const processProfileData = () => {
      try {
        const cookieValue = getCookie("profile_data");
        if (!cookieValue) {
          setIsProcessing(false);
          setError("No profile data found. Please try again.");
          toast({
            title: "Error",
            description: "No profile data found. Please try again.",
            variant: "destructive",
          });
          return;
        }
        let profileData: Record<string, any> = {};
        try {
          profileData = JSON.parse(cookieValue as string);
        } catch (e) {
          setIsProcessing(false);
          setError("Invalid profile data. Please try again.");
          toast({
            title: "Error",
            description: "Invalid profile data. Please try again.",
            variant: "destructive",
          });
          return;
        }
        // Clear the cookie after reading
        deleteCookie("profile_data");
        // Call the API with the profile data
        addUser(profileData);
      } catch (error) {
        console.error("Error processing profile data from cookie:", error);
        setIsProcessing(false);
        setError("Failed to process profile data. Please try again.");
        toast({
          title: "Error",
          description: "Failed to process profile data. Please try again.",
          variant: "destructive",
        });
      }
    };
    // Process the profile data after a short delay to ensure cookie is set
    const timer = setTimeout(processProfileData, 100);
    return () => clearTimeout(timer);
  }, [addUser, toast]);

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-gradient-to-br from-purple-900 to-purple-800">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg text-center">
        <div className="mb-6 flex justify-center">
          <img
            src="/images/word-sanctuary-logo-black.png"
            alt="Word Sanctuary"
            className="h-16 w-auto"
          />
        </div>

        {isProcessing ? (
          <>
            <h1 className="mb-4 text-2xl font-bold text-gray-900">
              Processing Your Information
            </h1>
            <div className="flex justify-center mb-4">
              <Loader2 className="h-12 w-12 animate-spin text-indigo-600" />
            </div>
            <p className="text-gray-600">
              Please wait while we set up your account...
            </p>
          </>
        ) : error ? (
          <>
            <h1 className="mb-4 text-2xl font-bold text-red-600">
              Something Went Wrong
            </h1>
            <p className="mb-6 text-gray-600">{error}</p>
            <button
              onClick={() => router.push("/signin")}
              className="w-full rounded bg-indigo-900 py-2 text-white hover:bg-indigo-800 focus:outline-none"
            >
              Return to Sign In
            </button>
          </>
        ) : null}
      </div>
    </div>
  );
}
