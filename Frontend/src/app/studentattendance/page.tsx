"use client";  // Mark this file as a Client Component

import React, { useState } from "react";
import StudentSidebar from "@/components/studentsidebar"; // Ensure correct import

// Define a Student interface for better type safety
interface Student {
  id: number;
  name: string;
  present: boolean;
  note: string;
}

const ManageStudentsWithAttendance = () => {
  // Define the logged-in student's name (this could come from authentication)
  const loggedInStudentName = "Alice Johnson";

  // Manage Students state
  const [students] = useState([
    {
      name: "John Herlelr",
      subjects: [
        { subject: "Mathematics", grade: "A" },
        { subject: "Science", grade: "B" },
        { subject: "History", grade: "A-" },
      ],
      note: "",
    },
    {
      name: "Jane Fdfdwe",
      subjects: [
        { subject: "Mathematics", grade: "C" },
        { subject: "Science", grade: "A" },
        { subject: "English", grade: "B+" },
      ],
      note: "",
    },
    {
      name: "Alice Johnson",  // This is the logged-in student
      subjects: [
        { subject: "Mathematics", grade: "A+" },
        { subject: "Science", grade: "A" },
        { subject: "History", grade: "A-" },
      ],
      note: "",
    },
    {
      name: "Bob Smith",
      subjects: [
        { subject: "Mathematics", grade: "B-" },
        { subject: "Science", grade: "C+" },
        { subject: "English", grade: "B" },
      ],
      note: "",
    },
  ]);

  // Filter out only the logged-in student's data
  const loggedInStudent = students.find(student => student.name === loggedInStudentName);

  // Manage Attendance state with example notes
  const [attendanceStudents] = useState<Student[]>([
    { id: 1, name: "John Herlelr", present: true, note: "Present and participated actively" },
    { id: 2, name: "Jane Fdfdwe", present: false, note: "Absent due to illness" },
    { id: 3, name: "Alice Johnson", present: true, note: "Present and on time" },
    { id: 4, name: "Bob Smith", present: false, note: "Absent, family emergency" },
    { id: 5, name: "Emma Lee", present: true, note: "Present, no issues" },
    { id: 6, name: "Luke Fox", present: true, note: "Present and contributed to discussion" },
    { id: 7, name: "Mia Wong", present: false, note: "Absent, late flight" },
    { id: 8, name: "Zoe Cruz", present: false, note: "Absent, sick leave" },
  ]);

  return (
    <div className="flex">
      {/* Sidebar */}
      <StudentSidebar />

      <div className="flex-1 p-6">
        {/* Attendance Section */}
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold">Grades</h1>
        </header>

        {/* Table Section for Grades */}
        <div className="overflow-x-auto mb-12">
          <table className="table-auto w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-blue-900 text-white">
                <th className="border border-gray-300 px-4 py-2">Subject</th>
                <th className="border border-gray-300 px-4 py-2">Grade</th>
                <th className="border border-gray-300 px-4 py-2">Note</th>
              </tr>
            </thead>
            <tbody>
              {/* Render only the logged-in student's data */}
              {loggedInStudent && loggedInStudent.subjects.map((subject, subjectIndex) => (
                <tr key={subjectIndex} className="text-center">
                  <td className="border border-gray-300 px-4 py-2">{subject.subject}</td>
                  <td className="border border-gray-300 px-4 py-2">{subject.grade}</td>
                  <td className="border border-gray-300 px-4 py-2">{loggedInStudent.note || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Attendance Section */}
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold">Attendance Report</h1>
        </header>

        {/* Table Section for Attendance */}
        <div className="overflow-x-auto">
          <table className="table-auto w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-blue-900 text-white">
                <th className="border border-gray-300 px-4 py-2">Attendance</th>
                <th className="border border-gray-300 px-4 py-2">Notes</th>
              </tr>
            </thead>
            <tbody>
              {attendanceStudents
                .filter(student => student.name === loggedInStudentName) // Only show the logged-in student's attendance
                .map((student) => (
                <tr key={student.id} className="text-center">
                  <td className="border border-gray-300 px-4 py-2">
                    {student.present ? "Present" : "Absent"}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">{student.note || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageStudentsWithAttendance;
