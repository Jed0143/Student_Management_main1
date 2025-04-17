// pages/management-student.js
import React from "react";
import Sidebar from "@/components/Sidebar";

const ManageStudents = () => {
  return (
    <div className="p-6">
    {/* Sidebar */}
    <Sidebar />
      {/* Header */}
      <header className="text-center mb-12">
      <h1 className="text-8xl font-bold">Settings</h1>
      <p className="text-4xl">Welcome to the Settings!</p>
      </header>
    </div>
  );
};

export default ManageStudents;
