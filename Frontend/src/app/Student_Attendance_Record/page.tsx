"use client";

import React, { useState, useEffect } from "react";
import StudentSidebar from "../studentsidebar/studentsidebar";
import { Dialog } from "@headlessui/react";
import axios from "axios";  // Add this import

const StudentAttendanceHistory = () => {
  const [students, setStudents] = useState<{ id: number; full_name: string }[]>([]);
  const [attendanceHistory, setAttendanceHistory] = useState<{ date: string; status: string; reason: string }[]>([]);
  const [selectedStudentName, setSelectedStudentName] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const storedEmail = localStorage.getItem("userEmail");
    if (storedEmail) {
      fetchStudentData(storedEmail);
    }
  }, []);

  const fetchStudentData = async (email: string) => {
    try {
      const response = await fetch(
        `http://localhost/Student_Management_main1/backend/get_id.php?email=${encodeURIComponent(email)}`
      );
      if (response.ok) {
        const data = await response.json();
        setStudents(data);
      } else {
        console.error("Error fetching student data:", response.status);
      }
    } catch (error) {
      console.error("Error fetching student data:", error);
    }
  };

  const handleViewAttendance = async (studentName: string) => {
    const trimmedName = studentName.trim();
  
    if (!trimmedName) {
      console.error("Student name is empty or invalid.");
      return;
    }
  
    try {
      const response = await axios.get(
        "http://localhost/Student_Management_main1/backend/get_attendance_history.php",
        {
          params: { name: trimmedName },
        }
      );
  
      const data = response.data;
  
      if (Array.isArray(data)) {
        setAttendanceHistory(data);
      } else if (data?.error) {
        console.error("Backend error:", data.error);
      } else {
        console.error("Unexpected response format:", data);
      }
    } catch (error) {
      console.error("Error fetching attendance:", error);
    }
  };

  return (
    <div className="flex-col">
      <StudentSidebar>
      <div className="flex-1 p-4 overflow-auto">
        <h3 className="text-lg font-bold mt-0 mb-2">Student Attendance History</h3>
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-800 text-white">
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Action</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id}>
                <td className="p-2 border text-center">{student.full_name}</td>
                <td className="p-2 border text-center">
                  <button
                    className="px-3 py-1 bg-blue-500 text-white rounded"
                    onClick={() => {
                      setSelectedStudentName(student.full_name);
                      setIsDialogOpen(true);
                      handleViewAttendance(student.full_name);
                    }}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Attendance History Dialog */}
        <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)} className="relative z-50">
          <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Dialog.Panel className="w-full max-w-md rounded bg-white p-6 shadow-lg">
              <Dialog.Title className="text-lg font-semibold mb-2">
                Attendance History of {selectedStudentName}
              </Dialog.Title>

              <div className="overflow-y-auto max-h-80">
                <table className="w-full border mb-4">
                  <thead>
                    <tr className="bg-gray-200">
                      <th className="p-2 border">Date</th>
                      <th className="p-2 border">Status</th>
                      <th className="p-2 border">Reason</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendanceHistory.length > 0 ? (
                      attendanceHistory.map((record, index) => (
                        <tr key={index}>
                          <td className="p-2 border">{record.date}</td>
                          <td className="p-2 border">{record.status}</td>
                          <td className="p-2 border">{record.reason || "—"}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={3} className="text-center p-2">
                          No attendance records found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>

                {attendanceHistory.length > 0 && (
                  <div className="text-sm font-medium text-gray-700">
                    <p>Total Present: {attendanceHistory.filter(r => r.status === "Present").length}</p>
                    <p>Total Absent: {attendanceHistory.filter(r => r.status === "Absent").length}</p>
                  </div>
                )}
              </div>
            </Dialog.Panel>
          </div>
        </Dialog>
      </div>
      </StudentSidebar>
    </div>
  );
};

export default StudentAttendanceHistory;
