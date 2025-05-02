"use client";

import React, { useEffect, useState } from "react";
import StudentSidebar from "@/components/Sidebar2";
import { Dialog } from "@headlessui/react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface Student {
  id: number; // Ensure student has an ID
  name: string;
  present: boolean | null;
  reason: string;
}

const schedules = ["7AM-9AM", "9AM-11AM", "1PM-3PM"];

const My_Attendance = () => {
  const [attendanceStudents, setAttendanceStudents] = useState<Student[]>([]);
  const [studentList, setStudentList] = useState<Student[]>([]);
  const [selectedSchedule, setSelectedSchedule] = useState(schedules[0]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [attendanceRecord, setAttendanceRecord] = useState<any>(null);
  const [isAttendanceDialogOpen, setIsAttendanceDialogOpen] = useState(false);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await axios.get("http://localhost/Student_Management_main1/backend/get_student.php");
        const students = res.data ?? [];  // assuming the response contains an array of student names
        
        // Create the student objects with their names and initialize other fields (present, reason)
        const data = students.map((student: any) => ({
          id: student.id, // Ensure each student has an ID
          name: student.name,
          present: null,
          reason: "",
        }));

        setAttendanceStudents(data);
        setStudentList(data);
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching students:", err);
        setIsLoading(false);
      }
    };

    fetchStudents();
  }, []);

  const handleStatusChange = (name: string, status: "present" | "absent") => {
    setAttendanceStudents((prev) =>
      prev.map((student) =>
        student.name === name ? { ...student, present: status === "present" } : student
      )
    );
  };

  const updateReason = (name: string, reason: string) => {
    setAttendanceStudents((prev) =>
      prev.map((student) =>
        student.name === name ? { ...student, reason } : student
      )
    );
  };

  const saveAttendance = async () => {
    try {
      const attendanceData = attendanceStudents.map((student) => ({
        id: student.id, // Ensure student has an `id`
        attendance: [
          {
            date: selectedDate.toISOString().split("T")[0], // Format date as YYYY-MM-DD
            status: student.present === true ? "present" : student.present === false ? "absent" : "pending",
            note: student.reason,
          },
        ],
      }));

      await axios.post("http://localhost/Student_Management_main1/backend/save_attendance.php", {
        schedule: selectedSchedule,
        students: attendanceData,
      });

      alert("Attendance saved successfully!");
    } catch (error) {
      console.error("Error saving attendance:", error);
      alert("Failed to save attendance.");
    }
  };

  const viewAttendanceRecord = async (studentName: string) => {
    try {
      const res = await axios.get(
        `http://localhost/Student_Management_main1/backend/get_attendance.php?student_name=${encodeURIComponent(studentName)}`
      );
      const attendanceHistory = res.data.records ?? [];
      
      // Debugging: Log the response data to inspect it
      console.log("Attendance history:", attendanceHistory);

      const student = studentList.find((s) => s.name === studentName);

      setAttendanceRecord({
        studentInfo: student,
        attendanceHistory,
      });

      setIsAttendanceDialogOpen(true);
    } catch (error) {
      console.error("Error fetching attendance record:", error);
      alert("Failed to load full attendance details.");
    }
  };

  return (
    <div className="flex">
      <StudentSidebar />
      <div className="flex-1 p-6">
        <header className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-4xl font-bold mb-2">Attendance</h1>
            <p className="text-lg font-medium">
              Date: {selectedDate.toISOString().split("T")[0]}
            </p>
          </div>
          <div className="flex flex-col items-start">
            <label className="font-semibold mb-1">Select Date</label>
            <DatePicker
              selected={selectedDate}
              onChange={(date: Date) => setSelectedDate(date)}
              className="border px-4 py-2 rounded"
              dateFormat="dd/MM/yyyy"
            />
          </div>
        </header>

        <div className="mb-4">
          <label className="block mb-2 font-semibold">Select Schedule:</label>
          <select
            value={selectedSchedule}
            onChange={(e) => setSelectedSchedule(e.target.value)}
            className="px-4 py-2 border rounded"
          >
            {schedules.map((time) => (
              <option key={time} value={time}>
                {time}
              </option>
            ))}
          </select>
        </div>

        {isLoading ? (
          <p>Loading students...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="table-auto w-full border-collapse border border-gray-300 mb-6 rounded-lg shadow">
              <thead>
                <tr className="bg-blue-900 text-white">
                  <th className="border px-4 py-2">Name</th>
                  <th className="border px-4 py-2">Present</th>
                  <th className="border px-4 py-2">Absent</th>
                  <th className="border px-4 py-2">Reason</th>
                </tr>
              </thead>
              <tbody>
                {attendanceStudents.map((student) => (
                  <tr key={student.name} className="text-center">
                    <td className="border px-4 py-2">{student.name}</td>
                    <td className="border px-4 py-2">
                      <input
                        type="radio"
                        name={`status-${student.name}`}
                        checked={student.present === true}
                        onChange={() => handleStatusChange(student.name, "present")}
                      />
                    </td>
                    <td className="border px-4 py-2">
                      <input
                        type="radio"
                        name={`status-${student.name}`}
                        checked={student.present === false}
                        onChange={() => handleStatusChange(student.name, "absent")}
                      />
                    </td>
                    <td className="border px-4 py-2">
                      <input
                        type="text"
                        value={student.reason}
                        onChange={(e) => updateReason(student.name, e.target.value)}
                        placeholder="Enter reason..."
                        className="px-3 py-1 w-full border rounded"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="text-right">
              <button
                onClick={saveAttendance}
                className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 font-semibold"
              >
                Save Attendance
              </button>
            </div>
          </div>
        )}

        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Student List</h2>
          <table className="table-auto w-full border-collapse border border-gray-300 mb-6 rounded-lg shadow">
            <thead>
              <tr className="bg-blue-900 text-white">
                <th className="border px-4 py-2">Name</th>
                <th className="border px-4 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {studentList.map((student) => (
                <tr key={student.name} className="text-center">
                  <td className="border px-4 py-2">{student.name}</td>
                  <td className="border px-4 py-2">
                    <button
                      onClick={() => viewAttendanceRecord(student.name)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      View Attendance Record
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Dialog open={isAttendanceDialogOpen} onClose={() => setIsAttendanceDialogOpen(false)}>
          <Dialog.Panel className="max-w-md w-full p-6 bg-white rounded-lg shadow-lg">
            <Dialog.Title className="text-2xl font-bold mb-4">Attendance Record</Dialog.Title>
            <div>
              {attendanceRecord ? (
                <div>
                  <p className="font-semibold">Name: {attendanceRecord.studentInfo?.name}</p>
                  <h3 className="font-bold mt-4 mb-2">Attendance History:</h3>
                  {attendanceRecord.attendanceHistory.length > 0 ? (
                    <ul className="list-disc pl-5 text-sm">
                      {attendanceRecord.attendanceHistory.map((entry: any, idx: number) => (
                        <li key={idx}>
                          {entry.date} - {entry.schedule} - {entry.status}
                          {entry.reason ? ` (Reason: ${entry.reason})` : ""}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>No records found.</p>
                  )}
                </div>
              ) : (
                <p>No attendance data available for this student.</p>
              )}
            </div>
            <div className="mt-4">
              <button
                onClick={() => setIsAttendanceDialogOpen(false)}
                className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700"
              >
                Close
              </button>
            </div>
          </Dialog.Panel>
        </Dialog>
      </div>
    </div>
  );
};

export default My_Attendance;
