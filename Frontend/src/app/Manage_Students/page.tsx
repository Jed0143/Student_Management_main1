"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";

interface Student {
  id: number;
  child_name: string;
  email: string;
  schedule?: string;
}

const Manage_Students: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await fetch("http://localhost/Student_Management_main1/backend/get_student.php");
        const data = await res.json();
        const studentsData = data?.pre_enrollment ?? [];

        setStudents(studentsData);
      } catch (err) {
        console.error("Error loading students:", err);
      }
    };

    fetchStudents();
  }, []);

  const groupedStudents = students.reduce<Record<string, Student[]>>((groups, student) => {
    const schedule = student.schedule?.trim() || "No Schedule";
    if (!groups[schedule]) {
      groups[schedule] = [];
    }
    groups[schedule].push(student);
    return groups;
  }, {});

  return (
    <div className="flex">
      <Sidebar />
      <div className="p-6 flex-1">
        <header className="text-center mt-10 mb-6">
          <h1 className="text-4xl font-bold">Schedules</h1>
        </header>

        {Object.keys(groupedStudents).length > 0 ? (
          Object.entries(groupedStudents).map(([schedule, students]) => (
            <div key={schedule} className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Schedule: {schedule}</h2>
              <div className="overflow-x-auto">
                <table className="table-auto w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-blue-900 text-white">
                      <th className="border px-4 py-2">Name</th>
                      <th className="border px-4 py-2">Email</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((student) => (
                      <tr key={student.id} className="text-center">
                        <td className="border px-4 py-2">{student.child_name}</td>
                        <td className="border px-4 py-2">{student.email}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center mt-4 text-gray-600">No students available.</p>
        )}
      </div>
    </div>
  );
};

export default Manage_Students;
