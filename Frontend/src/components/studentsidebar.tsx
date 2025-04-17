"use client";

import React, { useState } from "react";
import Link from "next/link";

const StudentSidebar = () => {
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div
        className={`bg-blue-800 text-white transition-all duration-300 fixed top-0 left-0 h-full flex flex-col justify-between overflow-hidden ${
          isSidebarVisible ? "w-64 p-4 md:w-64 md:p-4 " : "w-16"
        }`}
      >
        {/* Sidebar Content */}
        <div className="flex flex-col items-start p-2"> {/* Align to the start instead of center */}
          {/* Toggle Button */}
          <button
            onClick={toggleSidebar}
            aria-label="Toggle Sidebar"
            className="absolute top-4 left-4 p-2 bg-blue-700 rounded-3xl hover:bg-blue-900 transition-all"
          >
            {isSidebarVisible ? "<" : ">"}
          </button>

          {isSidebarVisible && (
            <>
              {/* Profile Name */}
              <div className="flex flex-col items-start mb-8"> {/* Align to the start instead of center */}
                <h3 className="mt-2 text-lg font-semibold">John Doe</h3>
                <p className="text-sm text-blue-300">Grade 10 - Section A</p>
              </div>

              {/* Navigation Links */}
              <ul className="space-y-2 w-full">
                <li className="p-2 rounded hover:bg-blue-700">
                  <Link href="/studentdashboard" className="text-lg hover:text-blue-300">
                    Home
                  </Link>
                </li>
                <li className="p-2 rounded hover:bg-blue-700">
                  <Link href="/studentattendance" className="text-lg hover:text-blue-300">
                    Educational Performance
                  </Link>
                </li>
                <li className="p-2 rounded hover:bg-blue-700">
                  <Link href="/studentcommunication" className="text-lg hover:text-blue-300">
                    Communication
                  </Link>
                </li>
                <li className="p-2 rounded hover:bg-blue-700">
                  <Link href="/aboutus" className="text-lg hover:text-blue-300">
                    About Us
                  </Link>
                </li>
              </ul>
            </>
          )}
        </div>

        {/* Logout Button */}
        {isSidebarVisible && (
          <div className="mb-4 w-full">
            <button
              aria-label="Log Out"
              className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg transition duration-300"
            >
              Log Out
            </button>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div
        className={`flex-1 p-4 transition-all duration-300 ${
          isSidebarVisible ? "pl-64" : "pl-16"
        }`}
      >
        {/* Your main content goes here */}
      </div>
    </div>
  );
};

export default StudentSidebar;