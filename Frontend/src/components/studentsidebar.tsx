"use client";

import axios from "axios";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

const StudentSidebar = ({ children }: { children: React.ReactNode }) => {
  const [isSidebarVisible, setSidebarVisible] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const sidebarRef = useRef<HTMLDivElement | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  const toggleSidebar = () => {
    setSidebarVisible((prev) => !prev);
  };
  useEffect(() => {
    if (typeof window !== "undefined") {
      const email = localStorage.getItem("userEmail");
      const role = localStorage.getItem("userRole");
      if (email) {
        setUserEmail(email);
        fetch(
          "http://localhost/Student_Management_main1/backend/myid.php?email=" +
            encodeURIComponent(email)
        )
          .then((response) => response.json())
          .then((data) => {
            if (data.userId) {
              setUserId(data.userId);
              localStorage.setItem("userId", data.userId);
            } else {
              console.error("User ID not found:", data.error);
            }
          })
          .catch((error) => {
            console.error("Failed to fetch user ID:", error);
          });
      }
    }
  }, []);

  const menuItems = [
    { name: "Enroll", href: "/Pre_Enrollment" },
    { name: "Student Profile", href: "/Student_Profile" },
    { name: "Student Attendance Record", href: "/Student_Attendance_Record" },
    { name: "About Us", href: "/AboutUs" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    sessionStorage.removeItem("userToken");
    router.push("/");
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className={`bg-blue-800 text-white fixed top-0 left-0 h-full flex flex-col transition-all duration-300 z-50 ${
          isSidebarVisible ? "w-64 p-4 md:w-64 md:p-4" : "w-16"
        }`}
      >
        <div className="flex flex-col items-center p-2 relative">
          <button
            onClick={toggleSidebar}
            className="absolute top-4 left-4 p-2 bg-blue-800 rounded-3xl hover:bg-blue-900 transition-all"
          >
            {isSidebarVisible ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
          </button>

          {isSidebarVisible && (
            <div className="mt-10 text-center">
              <img
                src="/logo.jpg"
                alt="Logo"
                className="w-24 h-24 object-contain rounded-full mx-auto"
              />
              {isSidebarVisible && (
                <div className="text-center mt-2">
                  {userEmail && (
                    <span className="text-lg font-semibold text-white block">{userEmail}</span>
                  )}
                  {userId && (
                    <span className="text-sm text-gray-300 block">{userId}</span>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {isSidebarVisible && (
          <div className="mt-4 px-2 flex-1">
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

        {isSidebarVisible && (
          <div className="mt-auto">
            <div className="mt-4">
              <button
                onClick={handleLogout}
                className="w-full p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                Log Out
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div
        className={`flex-1 transition-all duration-300 overflow-y-auto ${
          isSidebarVisible ? "ml-64 p-4" : "ml-16 p-4"
        }`}
      >
        {children}
      </div>
    </div>
  );
};

export default StudentSidebar;
