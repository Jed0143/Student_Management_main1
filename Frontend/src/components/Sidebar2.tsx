"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Sidebar2 = ({ children }: { children: React.ReactNode }) => {
  const [isSidebarVisible, setSidebarVisible] = useState(true);
  const [isModalVisible, setModalVisible] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loggedInEmail, setLoggedInEmail] = useState("");
  const [loggedInPassword, setLoggedInPassword] = useState("");
  const sidebarRef = useRef<HTMLDivElement | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  const toggleSidebar = () => {
    setSidebarVisible((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node) &&
        isSidebarVisible
      ) {
        setSidebarVisible(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isSidebarVisible]);

  useEffect(() => {
    const email = localStorage.getItem("userEmail") || sessionStorage.getItem("userEmail");
    const password = localStorage.getItem("userPassword") || sessionStorage.getItem("userPassword");

    if (email) setLoggedInEmail(email);
    if (password) setLoggedInPassword(password);
  }, []);

  const menuItems = [
    { name: "List of Accepted Student", href: "/ADashboard" },
    { name: "Attendance", href: "/AAttendance" },
    { name: "List of Modules", href: "/List_Modules" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    sessionStorage.removeItem("userToken");
    router.push("/");
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className={`bg-blue-900 text-white fixed top-0 left-0 h-full flex flex-col transition-all duration-300 ${
          isSidebarVisible ? "w-64 p-4 md:w-64 md:p-4" : "w-16"
        }`}
      >
        {/* Toggle Button */}
        <div className="flex items-center justify-center relative h-12">
          <button
            onClick={toggleSidebar}
            className="absolute top-0 left-2 p-2 bg-blue-800 rounded-3xl hover:bg-blue-900 transition-all"
          >
            {isSidebarVisible ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
          </button>
        </div>

        {/* Logo and Label */}
        <div className="flex flex-col items-center mt-1 mb-6">
          <Image
            src="/logo.jpg"
            alt="Logo"
            width={isSidebarVisible ? 80 : 40}
            height={isSidebarVisible ? 80 : 40}
            className="rounded-full transition-all duration-300"
          />
          {isSidebarVisible && (
            <span className="mt-2 text-lg font-semibold text-white">TEACHER</span>
          )}
        </div>

        {/* Menu Items */}
        {isSidebarVisible && (
          <div className="mt-0 px-2">
            <ul className="space-y-4">
              {menuItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`block p-2 rounded-lg text-lg transition-all ${
                      pathname === item.href
                        ? "bg-blue-700 text-white"
                        : "hover:bg-blue-700 hover:text-blue-300"
                    }`}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Bottom Buttons */}
        {isSidebarVisible && (
          <div className="mt-auto space-y-4">
            <button
              onClick={handleLogout}
              className="w-full p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              Log Out
            </button>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div
        className={`flex-1 transition-all duration-300 ${
          isSidebarVisible ? "ml-64" : "ml-16"
        } p-4`}
      >
        {children}
      </div>
    </div>
  );
};

export default Sidebar2;
