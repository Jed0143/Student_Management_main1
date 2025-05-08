"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import StudentSidebar from "@/components/Sidebar2";

interface Student {
  id: number;
  full_name: string;
  schedule: string;
  status: string;
  reason: string;
}

const AttendanceManager = () => {
  const [date, setDate] = useState<string>("");
  const [students, setStudents] = useState<Student[]>([]);
  const [error, setError] = useState<string>("");

  // Fetch students on component mount
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get("http://localhost/Student_Management_main1/backend/get_accepted.php");
        console.log("Fetched students:", response.data);

        if (response.data && Array.isArray(response.data)) {
          // Add default fields for status and reason
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
        console.error("Error fetching student data:", err);
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
      prev.map((student) =>
        student.id === id ? { ...student, reason } : student
      )
    );
  };

  const handleSave = async () => {
    if (!date) {
      alert("Please select a date.");
      return;
    }
  
    const payload = {
      date,
      students, // Ensure this is an array of student objects with the required fields
    };
  
    console.log("Payload being sent:", payload); // Debugging step
    try {
      const response = await axios.post(
        "http://localhost/Student_Management_main1/backend/save_attendance.php",
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      alert("Attendance saved successfully!");
    } catch (error) {
      console.error("Error saving attendance:", error);
      alert("Failed to save attendance.");
    }
  };  
  
  return (
    <div className="flex">
      <StudentSidebar children={undefined} />
      <div className="p-4 max-w-4xl mx-auto w-full">
        <h2 className="text-xl font-bold mb-4">Attendance Manager</h2>

        {error && <div className="text-red-500 mb-4">{error}</div>}

        <div className="mb-4">
          <label className="block">Date:</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="border p-1 w-full"
          />
        </div>

        <table className="w-full border mt-4">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Schedule</th>
              <th className="p-2 border">Present</th>
              <th className="p-2 border">Absent</th>
              <th className="p-2 border">Reason (if absent)</th>
            </tr>
          </thead>
          <tbody>
            {students.length > 0 ? (
              students.map((student) => (
                <tr key={student.id}>
                  <td className="p-2 border">{student.full_name}</td>
                  <td className="p-2 border">{student.schedule}</td>
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
                <td colSpan={5} className="text-center p-4">
                  No students available.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <button
          onClick={handleSave}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
        >
          Save Attendance
        </button>
      </div>
    </div>
  );
};

export default AttendanceManager;
