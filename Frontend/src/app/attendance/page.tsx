"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import { Dialog } from "@mui/material";

interface AttendanceRecord {
  date: string;
  status: string;
  note: string;
}

interface Student {
  id: number;
  child_name: string;
}

const Student_List: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await fetch("http://localhost/Student_Management_main1/backend/get_student.php");
        const data = await res.json();
        setStudents(data?.pre_enrollment ?? []);
      } catch (err) {
        console.error("Error loading students:", err);
      }
    };

    fetchStudents();
  }, []);

  const handleViewAttendance = async (student: Student) => {
    setSelectedStudent(student);
    try {
      const res = await fetch(`http://localhost/Student_Management_main1/backend/get_attendance_history.php?student_id=${student.id}`);
      const data = await res.json();
      setAttendance(data?.attendance ?? []);
      setOpenDialog(true);
    } catch (err) {
      console.error("Error loading attendance:", err);
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="p-6 flex-1">
        <header className="text-center mt-10 mb-6">
          <h1 className="text-4xl font-bold">Student Attendance</h1>
        </header>

        <div className="overflow-x-auto">
          <table className="table-auto w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-blue-900 text-white">
                <th className="border px-4 py-2">Name</th>
                <th className="border px-4 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.id} className="text-center">
                  <td className="border px-4 py-2">{student.child_name}</td>
                  <td className="border px-4 py-2">
                    <button
                      className="bg-blue-500 text-white py-1 px-4 rounded"
                      onClick={() => handleViewAttendance(student)}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Attendance Dialog */}
        <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">
              Attendance History: {selectedStudent?.child_name}
            </h2>
            {attendance.length > 0 ? (
              <table className="table-auto w-full border border-gray-300">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border px-4 py-2">Date</th>
                    <th className="border px-4 py-2">Status</th>
                    <th className="border px-4 py-2">Note</th>
                  </tr>
                </thead>
                <tbody>
                  {attendance.map((record, index) => (
                    <tr key={index}>
                      <td className="border px-4 py-2">{record.date}</td>
                      <td className="border px-4 py-2">{record.status}</td>
                      <td className="border px-4 py-2">{record.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No attendance history found.</p>
            )}
          </div>
          <div className="p-4 flex justify-end">
            <button
              className="bg-red-500 text-white px-4 py-2 rounded"
              onClick={() => setOpenDialog(false)}
            >
              Close
            </button>
          </div>
        </Dialog>
      </div>
    </div>
  );
};

export default Student_List;
