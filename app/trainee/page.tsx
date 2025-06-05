"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { getCookie } from "cookies-next";
import { Loader2, BookOpen, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function TraineeDashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { profile, leadershipLevel } = useSelector(
    (state: RootState) => state.auth
  );

  useEffect(() => {
    // Set loading to false after a brief delay
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleContinueToInterview = () => {
    router.push("/trainee/interview-questions");
  };

  const getLeadershipLevel = (level: string) => {
    switch (level) {
      case "WORKER":
        return "Worker";
      case "EXECUTIVE_ASSISTANT":
        return "Executive Assistant";
      case "ASSISTANT_HOD":
        return "Assistant HOD";
      case "HOD":
        return "HOD";
      case "MINISTER":
        return "Minister";
      case "PASTOR":
        return "Pastor";
      case "MEMBER":
        return "Member";
      default:
        return "Unknown Level";
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-gradient-to-br from-purple-900 to-purple-800">
        <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg text-center">
          <Loader2 className="h-12 w-12 mx-auto animate-spin text-indigo-600" />
          <h2 className="mt-4 text-xl font-semibold">
            Loading your dashboard...
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen bg-gradient-to-br from-purple-900 to-purple-800 py-8 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1200px]">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div className="mb-4 md:mb-0">
            <h1 className="text-3xl font-bold text-white">
              Happy are you,{" "}
              {profile?.cached_bio?.gender === "MALE"
                ? "Sir"
                : profile?.cached_bio?.gender === "FEMALE"
                ? "Lady"
                : ""}{" "}
              {profile?.name || "Trainee"}!
            </h1>
            <p className="text-purple-200 mt-2">
              {leadershipLevel
                ? `Leadership Level: ${getLeadershipLevel(
                    profile?.cached_bio?.leadership_level
                  )}`
                : "Your training portal is ready"}
            </p>
          </div>
          <img
            src="/images/word-sanctuary-logo-white.png"
            alt="Word Sanctuary"
            className="h-12 w-auto"
          />
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <Card className="bg-white shadow-xl">
            <CardHeader>
              <CardTitle>Training Profile</CardTitle>
              <CardDescription>
                Your personal training information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm font-medium">
                  Email: {profile?.email || "Not available"}
                </p>
                <p className="text-sm font-medium">
                  Telegram Contact:{" "}
                  {profile?.cached_bio?.phone_contact || "Not set"}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-xl">
            <CardHeader>
              <CardTitle>Interview Questions</CardTitle>
              <CardDescription>Start your training assessment</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-amber-600">
                <BookOpen className="h-5 w-5" />
                <span className="text-sm font-medium">Ready to begin</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                onClick={handleContinueToInterview}
                className="w-full bg-indigo-900 hover:bg-indigo-800 text-white"
              >
                Continue to Training Interview
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>

          <Card className="bg-white shadow-xl">
            <CardHeader>
              <CardTitle>Training Progress</CardTitle>
              <CardDescription>Track your learning journey</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm">
                <p>
                  Complete your interview questions to unlock more training
                  resources.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
