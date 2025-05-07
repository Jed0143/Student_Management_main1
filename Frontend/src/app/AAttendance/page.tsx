"use client";

import React, { ReactNode, useEffect, useState } from "react";
import StudentSidebar from "@/components/Sidebar2";
import { Dialog } from "@headlessui/react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface Student {
  id: number;
  full_name: string;
  present: boolean | null;
  reason: string;
}

const My_Attendance = () => {
  const [attendanceStudents, setAttendanceStudents] = useState<Student[]>([]);
  const [studentList, setStudentList] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [attendanceRecord, setAttendanceRecord] = useState<any>(null);
  const [isAttendanceDialogOpen, setIsAttendanceDialogOpen] = useState(false);
  const [attendanceStatus, setAttendanceStatus] = useState<{ [key: number]: string }>({});
  const [attendanceNote, setAttendanceNote] = useState<{ [key: number]: string }>({});


  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await axios.get(
          "http://localhost/Student_Management_main1/backend/get_mystudent.php"
        );
        const students = res.data ?? [];
        const data = students.map((student: any) => ({
          id: student.id,
          full_name: student.full_name,
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
        student.full_name === name ? { ...student, present: status === "present" } : student
      )
    );
  };

  const updateReason = (name: string, reason: string) => {
    setAttendanceStudents((prev) =>
      prev.map((student) =>
        student.full_name === name ? { ...student, reason } : student
      )
    );
  };

  const today = new Date().toISOString().split("T")[0]; // "2025-05-06"

  const saveAttendance = async () => {
    const today = new Date().toISOString().split("T")[0];
  
    const attendanceData = attendanceStudents.map((student) => ({
      id: student.id,
      full_name: student.full_name,
      attendance: [
        {
          date: today,
          status: student.present ? "present" : "absent",
          note: student.reason || "none",
        },
      ],
    }));
  
    try {
      const response = await axios.post(
        "http://localhost/Student_Management_main1/backend/save_attendance.php",
        { students: attendanceData },
        { headers: { "Content-Type": "application/json" } }
      );
  
      console.log("Saved:", response.data);
      alert("Attendance saved successfully!");
    } catch (error) {
      console.error("Failed to save attendance:", error);
    }
  };
  
  
  

  const viewAttendanceRecord = async (studentName: string) => {
    try {
      const res = await axios.get(
        `http://localhost/Student_Management_main1/backend/get_attendance.php?student_name=${encodeURIComponent(studentName)}`
      );
      const attendanceHistory = res.data.records ?? [];
      const student = studentList.find((s) => s.full_name === studentName);

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
      <StudentSidebar children={undefined} />
      <div className="flex-1 p-6">
        <header className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-4xl font-bold mb-2">Attendance</h1>
            <p className="text-lg font-medium">Date: {selectedDate.toISOString().split("T")[0]}</p>
          </div>
          <div className="flex flex-col items-start">
            <label className="font-semibold mb-1">Select Date</label>
            <DatePicker
              selected={selectedDate}
              onChange={(date: Date | null) => {
                if (date) {
                  setSelectedDate(date);
                }
              }}
              className="border px-4 py-2 rounded"
              dateFormat="dd/MM/yyyy"
            />
          </div>
        </header>

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
                  <tr key={student.full_name} className="text-center">
                    <td className="border px-4 py-2">{student.full_name}</td>
                    <td className="border px-4 py-2">
                      <input
                        type="radio"
                        name={`status-${student.full_name}`}
                        checked={student.present === true}
                        onChange={() => handleStatusChange(student.full_name, "present")}
                      />
                    </td>
                    <td className="border px-4 py-2">
                      <input
                        type="radio"
                        name={`status-${student.full_name}`}
                        checked={student.present === false}
                        onChange={() => handleStatusChange(student.full_name, "absent")}
                      />
                    </td>
                    <td className="border px-4 py-2">
                      <input
                        type="text"
                        value={student.reason}
                        onChange={(e) => updateReason(student.full_name, e.target.value)}
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
                disabled={attendanceStudents.some((student) => student.present === null)}
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
                <tr key={student.full_name} className="text-center">
                  <td className="border px-4 py-2">{student.full_name}</td>
                  <td className="border px-4 py-2">
                    <button
                      onClick={() => viewAttendanceRecord(student.full_name)}
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

        <Dialog open={isAttendanceDialogOpen} onClose={() => setIsAttendanceDialogOpen(false)} className="fixed inset-0 flex items-center justify-center z-50">
          <div className="fixed inset-0 bg-black opacity-30" />
          <Dialog.Panel className="max-w-md w-full p-6 bg-white rounded-lg shadow-lg z-10">
            <Dialog.Title className="text-2xl font-bold mb-4">Attendance Record</Dialog.Title>
            <div>
              {attendanceRecord ? (
                <div>
                  <p className="font-semibold">Name: {attendanceRecord.studentInfo?.full_name}</p>
                  <h3 className="font-bold mt-4 mb-2">Attendance History:</h3>
                  {attendanceRecord.attendanceHistory.length > 0 ? (
                    <ul className="list-disc pl-5 text-sm">
                      {attendanceRecord.attendanceHistory.map((entry: any, idx: number) => (
                        <li key={idx}>
                          <p>
                            <span className="font-semibold">Date:</span> {entry.date}{" "}
                            <span className="font-semibold">Status:</span> {entry.status}{" "}
                            <span className="font-semibold">Note:</span> {entry.note}
                          </p>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>No attendance records available.</p>
                  )}
                </div>
              ) : (
                <p>Loading attendance record...</p>
              )}
            </div>
          </Dialog.Panel>
        </Dialog>
      </div>
    </div>
  );
};

export default My_Attendance;
