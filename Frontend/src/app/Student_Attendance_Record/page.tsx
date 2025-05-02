"use client";

import React, { useEffect, useState, useRef } from "react";
import StudentSidebar from "@/components/studentsidebar";

const My_Attendance = () => {
  const [attendanceRecords, setAttendanceRecords] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<string>("");
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchStudents(); // Fetch students on initial load
  }, []);

  // Fetch students from backend or use dummy data
  const fetchStudents = async () => {
    try {
      const response = await fetch(`http://localhost/Student_Management_main1/backend/get_all_students.php`);
      if (response.ok) {
        const data = await response.json();
        setStudents(data); // Assuming data contains a list of student names
      } else {
        console.error("Error fetching students:", response.status);
        setStudents(generateDummyStudents()); // Use dummy data if fetch fails
      }
    } catch (error) {
      console.error("Error fetching students:", error);
      setStudents(generateDummyStudents()); // Use dummy data if there's an error
    }
  };

  // Generate dummy students data
  const generateDummyStudents = () => {
    return [
      { id: "1", name: "John Doe" },
      { id: "2", name: "Jane Smith" },
      { id: "3", name: "Michael Johnson" },
      { id: "4", name: "Emily Davis" },
      { id: "5", name: "Daniel Lee" }
    ];
  };

  // Fetch attendance records for selected student or use dummy data
  const fetchAttendanceRecords = async (userId: string) => {
    try {
      const response = await fetch(
        `http://localhost/Student_Management_main1/backend/get_attendance.php?id=${userId}`
      );
      if (response.ok) {
        const data = await response.json();
        setAttendanceRecords(data);
      } else {
        console.error("Error fetching attendance records:", response.status);
        setAttendanceRecords(generateDummyAttendance()); // Use dummy data if fetch fails
      }
    } catch (error) {
      console.error("Error fetching attendance records:", error);
      setAttendanceRecords(generateDummyAttendance()); // Use dummy data if there's an error
    }
  };

  // Generate dummy attendance records data
  const generateDummyAttendance = () => {
    return [
      { id: "1", attendance_date: "2025-04-01", status: "Present", notes: "On time" },
      { id: "2", attendance_date: "2025-04-02", status: "Absent", notes: "Sick" },
      { id: "3", attendance_date: "2025-04-03", status: "Present", notes: "On time" },
      { id: "4", attendance_date: "2025-04-04", status: "Absent", notes: "Vacation" },
      { id: "5", attendance_date: "2025-04-05", status: "Present", notes: "On time" },
      { id: "6", attendance_date: "2025-04-06", status: "Present", notes: "On time" },
      { id: "7", attendance_date: "2025-04-07", status: "Absent", notes: "Sick" },
      { id: "8", attendance_date: "2025-04-08", status: "Present", notes: "On time" },
      { id: "9", attendance_date: "2025-04-09", status: "Present", notes: "On time" },
      { id: "10", attendance_date: "2025-04-10", status: "Absent", notes: "Appointment" }
    ];
  };

  // Handle student selection change
  const handleStudentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const studentId = e.target.value;
    setSelectedStudent(studentId);
    fetchAttendanceRecords(studentId); // Fetch attendance for the selected student
  };

  return (
    <div className="flex">
      <StudentSidebar children={undefined} />

      <div className="flex-1 p-6">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold">Attendance Record</h1>
        </header>

        {/* Student Selection ComboBox */}
        <div className="mb-6 text-center">
          <label htmlFor="student" className="text-lg font-semibold">Select Student: </label>
          <select
            id="student"
            value={selectedStudent}
            onChange={handleStudentChange}
            className="ml-4 p-2 border rounded-md"
          >
            <option value="">-- Choose a Student --</option>
            {students.map((student) => (
              <option key={student.id} value={student.id}>
                {student.name}
              </option>
            ))}
          </select>
        </div>

        {/* Attendance Table */}
        <div className="overflow-x-auto">
          <table className="table-auto w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-blue-900 text-white">
                <th className="border border-gray-300 px-4 py-2">Date</th>
                <th className="border border-gray-300 px-4 py-2">Present/Absent</th>
                <th className="border border-gray-300 px-4 py-2">Reason/Notes</th>
              </tr>
            </thead>
            <tbody>
              {attendanceRecords.length > 0 ? (
                attendanceRecords.slice(0, 10).map((record) => (
                  <tr key={record.id} className="text-center">
                    <td className="border border-gray-300 px-4 py-2">{record.attendance_date}</td>
                    <td className="border border-gray-300 px-4 py-2">{record.status}</td>
                    <td className="border border-gray-300 px-4 py-2">{record.notes || "—"}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="border border-gray-300 px-4 py-8 text-center text-gray-500">
                    No attendance records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default My_Attendance;
