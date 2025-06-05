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

export default function TrainingExecutiveDashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { profile, leadershipLevel } = useSelector(
    (state: RootState) => state.auth
  );

  useEffect(() => {
    // Check if user is authenticated and has correct role
    const token = getCookie("auth_token");
    // if (!token) {
    //   router.push("/signin");
    //   return;
    // }

    // Set loading to false after a brief delay
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-gradient-to-br from-purple-900 to-purple-800">
        <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg text-center">
          <Loader2 className="h-12 w-12 mx-auto animate-spin text-indigo-600" />
          <h2 className="mt-4 text-xl font-semibold">
            Loading executive dashboard...
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-gradient-to-br from-blue-900 to-blue-800 py-8 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1200px]">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div className="mb-4 md:mb-0">
            <h1 className="text-3xl font-bold text-white">
              Training Executive Dashboard
            </h1>
            <p className="text-blue-200 mt-2">
              Manage training programs and participants
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
              <CardTitle>Trainees</CardTitle>
              <CardDescription>
                Manage trainee accounts and progress
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm font-medium">
                  Total Trainees: <span className="font-bold">120</span>
                </p>
                <p className="text-sm font-medium">
                  Active This Week: <span className="font-bold">87</span>
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                onClick={() => router.push("/training-executive/trainees")}
                className="w-full bg-blue-900 hover:bg-blue-800 text-white"
              >
                Manage Trainees
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>

          <Card className="bg-white shadow-xl">
            <CardHeader>
              <CardTitle>Training Programs</CardTitle>
              <CardDescription>Manage all training materials</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-amber-600">
                <BookOpen className="h-5 w-5" />
                <span className="text-sm font-medium">4 active programs</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                onClick={() => router.push("/training-executive/programs")}
                className="w-full bg-blue-900 hover:bg-blue-800 text-white"
              >
                Manage Programs
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>

          <Card className="bg-white shadow-xl">
            <CardHeader>
              <CardTitle>Analytics</CardTitle>
              <CardDescription>Training performance metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm">
                <p>View detailed analytics on training performance and progress.</p>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                onClick={() => router.push("/training-executive/analytics")}
                className="w-full bg-blue-900 hover:bg-blue-800 text-white"
              >
                View Analytics
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
