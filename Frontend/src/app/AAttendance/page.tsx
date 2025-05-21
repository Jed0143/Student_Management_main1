"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import StudentSidebar from "../Sidebar2/Sidebar2";
import { Dialog } from "@headlessui/react";

interface Student {
  id: number;
  full_name: string;
  schedule: string;
  status: string;
  reason: string;
}

interface AttendanceRecord {
  date: string;
  status: string;
  reason: string;
}

const AttendanceManager = () => {
  const [date, setDate] = useState<string>("");
  const [students, setStudents] = useState<Student[]>([]);
  const [error, setError] = useState<string>("");
  const [selectedSchedule, setSelectedSchedule] = useState<string>("All");

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [attendanceHistory, setAttendanceHistory] = useState<AttendanceRecord[]>([]);
  const [selectedStudentName, setSelectedStudentName] = useState("");

  const getTodayDate = (): string => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  useEffect(() => {
    setDate(getTodayDate());

    const fetchStudents = async () => {
      try {
        const response = await axios.get(
          "http://localhost/Student_Management_main1/backend/get_accepted.php"
        );
        if (response.data && Array.isArray(response.data)) {
          const studentsWithDefaults = response.data.map((student: any) => ({
            ...student,
            status: "",
            reason: "",
          }));
          setStudents(studentsWithDefaults);
        } else {
          setError("No student data found.");
        }
      } catch (err) {
        setError("Failed to load student data.");
      }
    };

    fetchStudents();
  }, []);

  const handleStatusChange = (id: number, status: string) => {
    setStudents((prev) =>
      prev.map((student) =>
        student.id === id
          ? { ...student, status, reason: status === "Absent" ? student.reason : "" }
          : student
      )
    );
  };

  const handleReasonChange = (id: number, reason: string) => {
    setStudents((prev) =>
      prev.map((student) => (student.id === id ? { ...student, reason } : student))
    );
  };

  const handleSave = async () => {
    if (!date) {
      alert("Please select a date.");
      return;
    }

    const payload = {
      date,
      students,
    };

    try {
      await axios.post(
        "http://localhost/Student_Management_main1/backend/save_attendance.php",
        payload,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      alert("Attendance saved successfully!");
    } catch (error) {
      alert("Failed to save attendance.");
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
  
  

  const uniqueSchedules = Array.from(new Set(students.map((s) => s.schedule)));
  const filteredStudents =
    selectedSchedule === "All"
      ? students
      : students.filter((s) => s.schedule === selectedSchedule);

  return (
    <div className="flex_col">
      <StudentSidebar>
      <div className="p-8 max-w-8xl mx-auto w-full">

        {error && <div className="text-red-500 mb-4">{error}</div>}

        <div className="mb-4">
          <label className="block">Date:</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="border p-1 w-52"
          />
        </div>

        <div className="mb-4">
          <label className="block">Select Schedule:</label>
          <select
            value={selectedSchedule}
            onChange={(e) => setSelectedSchedule(e.target.value)}
            className="border p-1 w-52"
          >
            <option value="All">All</option>
            {uniqueSchedules.map((schedule, idx) => (
              <option key={idx} value={schedule}>
                {schedule}
              </option>
            ))}
          </select>
        </div>

        <table className="w-full border mt-4">
          <thead>
            <tr className="bg-blue-900 text-white">
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Present</th>
              <th className="p-2 border">Absent</th>
              <th className="p-2 border">Reason (if absent)</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.length > 0 ? (
              filteredStudents.map((student) => (
                <tr key={student.id}>
                  <td className="p-2 border text-center">{student.full_name}</td>
                  <td className="p-2 border text-center">
                    <input
                      type="radio"
                      name={`status-${student.id}`}
                      checked={student.status === "Present"}
                      onChange={() => handleStatusChange(student.id, "Present")}
                    />
                  </td>
                  <td className="p-2 border text-center">
                    <input
                      type="radio"
                      name={`status-${student.id}`}
                      checked={student.status === "Absent"}
                      onChange={() => handleStatusChange(student.id, "Absent")}
                    />
                  </td>
                  <td className="p-2 border">
                    <input
                      type="text"
                      value={student.reason}
                      onChange={(e) => handleReasonChange(student.id, e.target.value)}
                      className="border p-1 w-full"
                      placeholder="Enter reason"
                      disabled={student.status !== "Absent"}
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="text-center p-4">
                  No students available.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <button onClick={handleSave} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded">
          Save Attendance
        </button>

        {/* Attendance History Table */}
        <h3 className="text-lg font-bold mt-10 mb-2">Student Attendance History</h3>
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
                    View Attendance Record
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

              <div className="flex justify-end mt-4">
                <button
                  onClick={() => setIsDialogOpen(false)}
                  className="px-4 py-2 bg-gray-400 text-white rounded"
                >
                  Close
                </button>
              </div>
            </Dialog.Panel>
          </div>
        </Dialog>
      </div>
      </StudentSidebar>
    </div>
  );
};

export default AttendanceManager;
