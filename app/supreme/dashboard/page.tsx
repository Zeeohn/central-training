"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { getCookie } from "cookies-next";
import { Loader2, Shield, Database, Globe, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function SuperAdminDashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { profile } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    // Check if user is authenticated and has superadmin role
    // This would be enhanced with proper role checking
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg text-center">
          <Loader2 className="h-12 w-12 mx-auto animate-spin text-gray-600" />
          <h2 className="mt-4 text-xl font-semibold">
            Loading super admin dashboard...
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 py-8 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1200px]">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div className="mb-4 md:mb-0">
            <h1 className="text-3xl font-bold text-white">
              Super Admin Dashboard
            </h1>
            <p className="text-gray-300 mt-2">
              Complete system administration and oversight
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
              <CardTitle>Administrator Management</CardTitle>
              <CardDescription>
                Manage admin accounts and permissions
              </CardDescription>
            </CardHeader>
            <CardContent className="flex items-center gap-4">
              <Shield className="h-10 w-10 text-gray-600" />
              <div>
                <p className="text-2xl font-bold">0</p>
                <p className="text-sm text-gray-500">Admin Accounts</p>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full bg-gray-800 hover:bg-gray-900 text-white">
                Manage Administrators
              </Button>
            </CardFooter>
          </Card>

          <Card className="bg-white shadow-xl">
            <CardHeader>
              <CardTitle>System Configuration</CardTitle>
              <CardDescription>
                Configure platform settings and options
              </CardDescription>
            </CardHeader>
            <CardContent className="flex items-center gap-4">
              <Database className="h-10 w-10 text-gray-600" />
              <div>
                <p className="text-sm">System settings, backup, and maintenance</p>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full bg-gray-800 hover:bg-gray-900 text-white">
                System Settings
              </Button>
            </CardFooter>
          </Card>

          <Card className="bg-white shadow-xl">
            <CardHeader>
              <CardTitle>Global Analytics</CardTitle>
              <CardDescription>
                Platform-wide metrics and reporting
              </CardDescription>
            </CardHeader>
            <CardContent className="flex items-center gap-4">
              <Globe className="h-10 w-10 text-gray-600" />
              <div>
                <p className="text-sm">Comprehensive analytics and advanced reporting</p>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full bg-gray-800 hover:bg-gray-900 text-white">
                View Analytics
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
