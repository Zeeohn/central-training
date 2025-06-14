"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
import axios from "axios";

export default function DataReceiver() {
  const [isProcessing, setIsProcessing] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const dispatch = useDispatch();
  const { toast } = useToast();
  const searchParams = useSearchParams();

  // Function to validate email format
  const isValidEmail = (email: string): boolean => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };

  // Function to check auth token
  const checkAuthToken = (): boolean => {
    const authToken = getCookie("auth_token");
    return !!authToken; // Return true if token exists
  };

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

  // Function to fetch user profile by email
  const fetchUserProfileByEmail = async (email: string) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_CENTRAL_SYSTEM_API_URL}/individuals/getbyemail`,
        { email }
      );

      if (response.data && response.data.success) {
        // Call addUser with the profile data
        addUser(response.data.profile || response.data);
      } else {
        throw new Error("Could not retrieve profile data");
      }
    } catch (error: any) {
      console.error("Error fetching profile by email:", error);
      setIsProcessing(false);
      setError(error.response?.data?.message || "Failed to fetch user profile");
      toast({
        title: "Error",
        description:
          error.response?.data?.message || "Failed to fetch user profile",
        variant: "destructive",
      });

      // Redirect to sign in page after a delay on error
      setTimeout(() => {
        router.push("/signin");
      }, 3000);
    }
  };

  useEffect(() => {
    const processRequest = async () => {
      try {
        // Check for email in URL query params (could be encoded)
        const emailParam = searchParams.get("email");
        const decodedEmail = emailParam ? decodeURIComponent(emailParam) : null;

        console.log("Decoded email from query params:", decodedEmail);

        // If email is present in the query params
        if (decodedEmail) {
          // Validate email format
          if (!isValidEmail(decodedEmail)) {
            setIsProcessing(false);
            setError("Invalid email format. Please try again.");
            toast({
              title: "Error",
              description: "Invalid email format. Please try again.",
              variant: "destructive",
            });

            // Redirect to sign in page after a short delay
            setTimeout(() => {
              router.push("/signin");
            }, 3000);
            return;
          }

          // Fetch user profile by email
          await fetchUserProfileByEmail(decodedEmail);
        }
        // No email in query params - check for existing auth token
        else {
          if (checkAuthToken()) {
            // Auth token exists, redirect to dashboard
            router.push("/trainee/interview-questions");
          } else {
            // No auth token, redirect to sign in
            router.push("/signin");
          }
        }
      } catch (error) {
        console.error("Error in data receiver:", error);
        setIsProcessing(false);
        setError("Something went wrong. Please try again.");
        toast({
          title: "Error",
          description: "Something went wrong. Please try again.",
          variant: "destructive",
        });

        // Redirect to sign in page after a delay
        setTimeout(() => {
          router.push("/signin");
        }, 3000);
      }
    };

    // Process the request after a short delay
    const timer = setTimeout(processRequest, 100);
    return () => clearTimeout(timer);
  }, [searchParams, router, toast, addUser]);

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
