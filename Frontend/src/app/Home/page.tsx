import React from "react";
import StudentSidebar from "@/components/studentsidebar";

const Dashboard = () => {
  return (
    <div className="flex">
      {/* StudentSidebar */}
      <StudentSidebar />

      {/* Main Content */}
      <div className="flex-1 p-6 bg-blue-200">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-blue-900">Welcome to the Student Dashboard</h1>
          <p className="mt-2 text-lg text-gray-600">Your academic and activity updates appear here.</p>
        </header>

        {/* Child Overview Section */}
        <div className="bg-white shadow-lg rounded-lg p-6 mt-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Children Overview</h2>
          <p className="text-gray-600">No child data available.</p>
        </div>

        {/* Upcoming Events Section */}
        <div className="bg-white shadow-lg rounded-lg p-6 mt-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Upcoming Events</h2>
          <p className="text-gray-600">No upcoming events.</p>
        </div>

        {/* Quick Notifications Section */}
        <div className="bg-white shadow-lg rounded-lg p-6 mt-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Quick Notifications</h2>
          <p className="text-gray-600">No notifications at this time.</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
