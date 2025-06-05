"use client";

import { useState, useEffect, ReactNode, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { deleteCookie, getCookie } from "cookies-next";
import Image from "next/image";
import { RiDashboardLine } from "react-icons/ri";
import { PiBookOpenUserBold } from "react-icons/pi";
import { SlSettings } from "react-icons/sl";
import { FiUser, FiLogOut } from "react-icons/fi";
import { IoMenu, IoClose } from "react-icons/io5";
import { resetAuth } from "@/store/features/authSlice";
import { persistor } from "@/store/store";

interface TraineeLayoutProps {
  children: ReactNode;
}

export default function TraineeLayout({ children }: TraineeLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { profile } = useSelector((state: RootState) => state.auth);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();

  // Check authentication
  useEffect(() => {
    // const token = getCookie("auth_token");
    // if (!token) {
    //   router.push("/signin");
    // }
  }, [router]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setProfileDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    // Remove token or perform logout actions
    deleteCookie("auth_token");
    dispatch(resetAuth());
    persistor.purge();
    router.push("/signin");
  };

  const navItems = [
    {
      name: "Dashboard",
      href: "/trainee",
      icon: <RiDashboardLine size={28} />,
    },
    {
      name: "Assessments",
      href: "/trainee/assessments",
      icon: <PiBookOpenUserBold size={28} />,
    },
    {
      name: "Settings",
      href: "/trainee/settings",
      icon: <SlSettings size={28} />,
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Top navbar */}
      <header className="bg-white shadow-md h-16 fixed top-0 left-0 right-0 z-50">
        <div className="flex items-center justify-between h-full px-4">
          {/* Left section - Icon */}
          <div className="flex flex-row items-center md:gap-2">
            <div className="w-20 h-20 relative">
              <Image
                src="/images/word-sanctuary-logo-black.png"
                alt="Word Sanctuary"
                fill
                style={{ objectFit: "contain" }}
              />
            </div>
            <p className="hidden md:flex font-open font-bold text-md">
              Word Sanctuary Trainings
            </p>
          </div>

          <div className="flex flex-row items-center">
            <div className="md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-md text-gray-700"
              >
                {mobileMenuOpen ? <IoClose size={28} /> : <IoMenu size={28} />}
              </button>
            </div>

            {/* Right section - Profile dropdown */}
            <div className="" ref={dropdownRef}>
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-100"
              >
                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center relative">
                  {profile?.cached_bio?.passport ? (
                    <Image
                      src={profile.cached_bio.passport}
                      alt="Profile"
                      // width={32}
                      // height={32}
                      className="rounded-full w-10 h-10"
                      fill
                      style={{ objectFit: "contain" }}
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-purple-200 flex items-center justify-center">
                      <FiUser className="text-purple-600" size={24} />
                    </div>
                  )}
                  <FiUser className="text-purple-600" />
                </div>
              </button>

              {/* Profile dropdown */}
              {profileDropdownOpen && (
                <div className="absolute right-4 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <FiLogOut className="mr-2" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="flex pt-16 min-h-screen">
        {/* Sidebar */}
        <aside
          className={`${
            mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          } fixed md:translate-x-0 top-16 left-0 z-30 h-auto min-h-screen w-[180px] transition-transform duration-300 ease-in-out md:sticky bg-white shadow-lg`}
        >
          <div className="flex flex-col h-full min-h-[calc(100vh-4rem)]">
            {/* Navigation */}
            <nav className="flex-1 px-2 pt-12">
              <ul className="space-y-8 flex flex-col gap-4 justify-center">
                {navItems.map((item) => {
                  const isActive =
                    pathname === item.href ||
                    pathname.startsWith(`${item.href}/`);

                  return (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className={`flex flex-row gap-2 items-center px-2 text-center ${
                          isActive
                            ? "text-purple-600 font-medium"
                            : "text-black hover:text-purple-600"
                        }`}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <div
                          className={`${
                            isActive ? "text-purple-600" : "text-purple-500"
                          }`}
                        >
                          {item.icon}
                        </div>
                        <div className="text-[14px] font-open font-bold">
                          {item.name}
                        </div>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </div>
        </aside>

        {/* Main content */}
        <div className="flex-1 min-h-screen bg-gray-100">
          {/* Backdrop for mobile sidebar */}
          {mobileMenuOpen && (
            <div
              className="fixed inset-0 bg-black/30 z-20 md:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
          )}

          {/* Page content */}
          <main className="min-h-screen p-4">{children}</main>
        </div>
      </div>
    </div>
  );
}
