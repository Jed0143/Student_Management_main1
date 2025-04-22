"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Sidebar = () => {
  const [isSidebarVisible, setSidebarVisible] = useState(true);
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

  const menuItems = [
    { name: "Enrollees", href: "/Enrollees" },
    { name: "Schedules", href: "/Manage_Students" },
    { name: "Attendance", href: "/Attendance" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    sessionStorage.removeItem("userToken");
    router.push("/");
  };

  return (
    <div className="flex h-screen">
      <div
        ref={sidebarRef}
        className={`bg-blue-900 text-white fixed top-0 left-0 h-full flex flex-col transition-all duration-300 ${
          isSidebarVisible ? "w-64 p-4 md:w-64 md:p-4" : "w-16"
        }`}
      >
        <div className="flex items-center p-2">
          <button
            onClick={toggleSidebar}
            className="absolute top-4 left-4 p-2 bg-blue-900 rounded-3xl hover:bg-blue-700 transition-all"
          >
            {isSidebarVisible ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
          </button>
          {isSidebarVisible && (
            <h2 className="text-2xl font-bold text-blue-300 ml-10">Admin Panel</h2>
          )}
        </div>

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

        {isSidebarVisible && (
          <button
            onClick={handleLogout}
            className="w-full p-2 mt-auto bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            Log Out
          </button>
        )}
      </div>

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
