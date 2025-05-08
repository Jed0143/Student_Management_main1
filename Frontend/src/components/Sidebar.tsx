"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Sidebar = () => {
  const [isSidebarVisible, setSidebarVisible] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);
  const sidebarRef = useRef<HTMLDivElement | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const role = localStorage.getItem("userRole");
      setUserRole(role);
    }
  }, []);

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

  const menuItems = [
    { name: "Enrollees", href: "/Enrollees" },
    { name: "Student List", href: "/Student_List" },
    { name: "Admin/Teacher", href: "/Teacher_List" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    sessionStorage.removeItem("userToken");
    localStorage.removeItem("userRole");
    router.push("/");
  };

  const handleAdminTeacherClick = () => {
    if (userRole === "admin" || userRole === "teacher") {
      router.push("/Admin_Teacher");
    } else {
      alert("Access denied: You do not have permission to view this page.");
    }
  };

  return (
    <div className="flex h-screen">
      <div
        ref={sidebarRef}
        className={`bg-blue-900 text-white fixed top-0 left-0 h-full flex flex-col transition-all duration-300 ${
          isSidebarVisible ? "w-64 p-4 md:w-64 md:p-4" : "w-16"
        }`}
      >
        {/* Toggle Button */}
        <div className="flex items-center justify-center p-2 relative">
          <button
            onClick={toggleSidebar}
            className="absolute top-4 left-4 p-2 bg-blue-900 rounded-3xl hover:bg-blue-700 transition-all"
          >
            {isSidebarVisible ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
          </button>
        </div>

        {/* Logo and Role Label */}
        <div className="flex flex-col items-center mt-10 mb-6">
          <Image
            src="/logo.jpg" // Make sure this logo exists in your /public folder
            alt="Logo"
            width={isSidebarVisible ? 80 : 40}
            height={isSidebarVisible ? 80 : 40}
            className="rounded-full transition-all duration-300"
          />
          {isSidebarVisible && (
            <span className="mt-2 text-lg font-semibold text-white">SUPER ADMIN</span>
          )}
        </div>

        {/* Menu Items */}
        {isSidebarVisible && (
          <ul className="space-y-4 mt-6">
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
        )}

        {/* Admin/Teacher button */}
        {userRole === "admin" || userRole === "teacher" ? (
          <button
            onClick={handleAdminTeacherClick}
            className="w-full p-2 mt-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Admin/Teacher
          </button>
        ) : null}

        {/* Logout Button */}
        {isSidebarVisible && (
          <button
            onClick={handleLogout}
            className="w-full p-2 mt-auto bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            Log Out
          </button>
        )}
      </div>

      {/* Page Content */}
      <div
        className={`flex-1 p-4 transition-all duration-300 ${
          isSidebarVisible ? "ml-56" : "ml-8"
        }`}
      >
        {/* Page content goes here */}
      </div>
    </div>
  );
};

export default Sidebar;
