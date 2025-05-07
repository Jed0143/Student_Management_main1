"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

interface AttendanceRecord {
  date: string;
  status: string;
  note: string;
  full_name: string;
}

interface Student {
  id: number;
  student_id: number;
  full_name: string;
  date: string;
  status: string;
  note: string;
}

const Student_List: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); // Student search
  const [dateSearchQuery, setDateSearchQuery] = useState(""); // Date search

  useEffect(() => {
    fetch("http://localhost/Student_Management_main1/backend/get_student_attendance.php")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data)) {
          const attendanceData = data.data as Student[];

          const uniqueStudentsMap = new Map<string, Student>();
          attendanceData.forEach((student) => {
            const normalizedName = student.full_name.trim().toLowerCase();
            if (!uniqueStudentsMap.has(normalizedName)) {
              uniqueStudentsMap.set(normalizedName, student);
            }
          });

          const uniqueStudents = Array.from(uniqueStudentsMap.values());
          setStudents(uniqueStudents);
        } else {
          console.error("Invalid student data format:", data);
        }
      })
      .catch((err) => console.error("Failed to fetch students:", err));
  }, []);

  const handleViewAttendance = (student: Student) => {
    setSelectedStudent(student);
    setDateSearchQuery(""); // Reset date search when opening dialog
    const fullName = encodeURIComponent(student.full_name.trim());

    fetch(`http://localhost/Student_Management_main1/backend/get_attendance.php?full_name=${fullName}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data)) {
          setAttendance(data.data);
        } else {
          console.error("Invalid attendance data:", data);
          setAttendance([]);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch attendance:", err);
        setAttendance([]);
      });

    setOpenDialog(true);
  };

  const filteredStudents = students.filter((student) =>
    student.full_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex">
      <Sidebar />
      <div className="p-6 flex-1">
        <header className="text-center mt-10 mb-6">
          <h1 className="text-4xl font-bold">Student Attendance</h1>
        </header>

        {/* Search Bar for Students */}
        <div className="mb-4 flex justify-end">
          <input
            type="text"
            placeholder="Search by name"
            className="border border-gray-300 px-4 py-2 rounded w-72"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="overflow-x-auto">
          <table className="table-auto w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-blue-900 text-white">
                <th className="border px-4 py-2">Name</th>
                <th className="border px-4 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student) => (
                  <tr key={student.id} className="text-center">
                    <td className="border px-4 py-2">{student.full_name}</td>
                    <td className="border px-4 py-2">
                      <button
                        className="bg-blue-500 text-white py-1 px-4 rounded"
                        onClick={() => handleViewAttendance(student)}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={2} className="text-center border px-4 py-2">
                    No students found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Attendance Dialog */}
        <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
          <DialogTitle className="text-2xl font-bold">
            Attendance History: {selectedStudent?.full_name}
          </DialogTitle>
          <DialogContent dividers>
            {/* Date Search Bar */}
            <div className="mb-4 flex justify-end">
              <input
                type="text"
                placeholder="Search by date (YYYY-MM-DD)"
                className="border border-gray-300 px-4 py-2 rounded w-72"
                value={dateSearchQuery}
                onChange={(e) => setDateSearchQuery(e.target.value)}
              />
            </div>

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
                  {attendance
                    .filter((record) =>
                      record.date.toLowerCase().includes(dateSearchQuery.toLowerCase())
                    )
                    .map((record, index) => (
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
