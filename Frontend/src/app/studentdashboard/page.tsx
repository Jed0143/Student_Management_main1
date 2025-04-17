import React from "react";
import StudentSidebar from "@/components/studentsidebar";

const Dashboard = () => {
  // Example data for children (this can be dynamic based on the actual data)
  const children = [
    {
      name: "John Doe",
      grades: 85,
      attendance: 92,
      notifications: ["Absent 3 times this month", "Low grades in Math"],
    },
    {
      name: "Jane Doe",
      grades: 90,
      attendance: 95,
      notifications: ["Excellent performance in English"],
    },
  ];

  // Example upcoming events
  const events = [
    { title: "Parent-Teacher Meeting", date: "2024-12-15" },
    { title: "Winter Holidays", date: "2024-12-20" },
  ];

  return (
    <div className="flex">
      {/* StudentSidebar */}
      <StudentSidebar />

      {/* Main Content */}
      <div className="flex-1 p-6 bg-blue-200">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-blue-900">Parent Dashboard</h1>
          <p className="mt-2 text-lg text-gray-600">Overview of your childs academic performance and activities</p>
        </header>

        {/* Child Overview Section */}
        <div className="bg-white shadow-lg rounded-lg p-6 mt-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Children Overview</h2>
          <div className="space-y-4">
            {children.map((child, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-lg shadow-sm">
                <h3 className="text-lg font-bold text-gray-800">{child.name}</h3>
                <p>Grades: {child.grades}%</p>
                <p>Attendance: {child.attendance}%</p>
                <h4 className="font-semibold mt-2">Notifications:</h4>
                <ul className="list-disc list-inside">
                  {child.notifications.map((note, i) => (
                    <li key={i} className="text-sm text-gray-600">{note}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Events Section */}
        <div className="bg-white shadow-lg rounded-lg p-6 mt-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Upcoming Events</h2>
          <div className="space-y-6">
            {events.map((event, index) => (
              <div key={index}>
                <h3 className="font-medium text-gray-600">{event.title}:</h3>
                <p className="text-lg text-gray-800">{event.date}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Notifications Section */}
        <div className="bg-white shadow-lg rounded-lg p-6 mt-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Quick Notifications</h2>
          <ul className="space-y-4">
            <li className="text-gray-600">Attendance Alert: 3 students absent today.</li>
            <li className="text-gray-600">Grade Alert: 5 students have low grades in Math.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;