"use client";

import React, { useState, ReactNode } from "react";
import Sidebar from "@/components/Sidebar";
import { Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";

interface AttendanceRecord {
  date: string;
  status: string;
  note: string;
}

interface Student {
  name: ReactNode;
  id: number;
  child_name: string;
}

const Student_List: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [openDialog, setOpenDialog] = useState(false);

  // Fetch students on mount (optional)
  React.useEffect(() => {
    fetch("http://localhost/Student_Management_main1/backend/get_students.php")
      .then((res) => res.json())
      .then((data) => setStudents(data))
      .catch((err) => console.error("Failed to fetch students:", err));
  }, []);

  const handleViewAttendance = (student: Student) => {
    setSelectedStudent(student);
    fetch(`http://localhost/Student_Management_main1/backend/get_attendance.php?student_id=${student.id}`)
      .then((res) => res.json())
      .then((data: AttendanceRecord[]) => setAttendance(data))
      .catch((err) => {
        console.error("Failed to fetch attendance:", err);
        setAttendance([]);
      });
    setOpenDialog(true);
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
                  <td className="border px-4 py-2">{student.name}</td>
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
          <DialogTitle className="text-2xl font-bold">
            Attendance History: {selectedStudent?.name}
          </DialogTitle>
          <DialogContent dividers>
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
          </DialogContent>
          <DialogActions>
            <button
              className="bg-red-500 text-white px-4 py-2 rounded"
              onClick={() => setOpenDialog(false)}
            >
              Close
            </button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
};

export default Student_List;
