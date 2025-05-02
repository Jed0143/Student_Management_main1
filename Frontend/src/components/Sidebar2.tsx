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
    { name: "List of Accepted Student", href: "/ADashboard" },
    { name: "Attendance", href: "/AAttendance" },
    { name: "List of Modules", href: "/List_Modules" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    sessionStorage.removeItem("userToken");
    router.push("/");
  };

  const handleChangePassword = () => {
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const handleSavePassword = () => {
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    console.log("Password saved:", newPassword);
    setModalVisible(false);
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
            src="/logo.jpg" // make sure this logo exists in your /public
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
              onClick={handleChangePassword}
              className="w-full p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              Change My Password
            </button>

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

      {/* Modal */}
      {isModalVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-60">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80">
            <h2 className="text-xl font-semibold mb-4">Change Password</h2>

            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              className="w-full p-2 border border-gray-300 rounded-lg mb-4"
            />

            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              className="w-full p-2 border border-gray-300 rounded-lg mb-4"
            />

            <div className="flex justify-between mt-4">
              <button
                onClick={handleCloseModal}
                className="p-2 bg-gray-300 text-black rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleSavePassword}
                className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar2;
