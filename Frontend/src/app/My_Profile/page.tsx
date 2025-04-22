"use client";

import React, { useEffect, useState } from "react";
import StudentSidebar from "@/components/studentsidebar";

const My_Profile = () => {
  const [student, setStudent] = useState<any>(null);

  useEffect(() => {
    const stored = localStorage.getItem("student");
    if (stored) {
      setStudent(JSON.parse(stored));
    }
  }, []);

  return (
    <div className="flex">
      <StudentSidebar />

      <div className="flex-1 p-6 bg-blue-200">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-blue-900">Welcome to the Student Dashboard</h1>
          <p className="mt-2 text-lg text-gray-600">Your academic and activity updates appear here.</p>
        </header>
      </div>
    </div>
  );
};

export default My_Profile;
