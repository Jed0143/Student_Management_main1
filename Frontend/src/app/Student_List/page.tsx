"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import { Dialog } from "@mui/material";

interface Student {
  id: number;
  child_name: string;
  Gender: string;
  birthday: string;
  age: string;
  registered: string;
  address: string;
  first_language: string;
  second_language: string;
  guardian: string;
  guardian_contact: string;
  guardian_relationship: string;
  mother_name: string;
  mother_address: string;
  mother_work: string;
  mother_contact: string;
  father_name: string;
  father_address: string;
  father_work: string;
  father_contact: string;
  emergency_name: string;
  emergency_contact: string;
  emergency_work: string;
  date: string;
  email: string;
  password: string;
  confirm_password: string;
  schedule?: string;
}

const Student_List: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await fetch("http://localhost/Student_Management_main1/backend/get_student.php");
        const data = await res.json();
        const studentsData = data?.pre_enrollment ?? [];
        setStudents(studentsData);
      } catch (err) {
        console.error("Error loading students:", err);
      }
    };

    fetchStudents();
  }, []);

  const groupedStudents = students.reduce<Record<string, Student[]>>((groups, student) => {
    const schedule = student.schedule?.trim() || "No Schedule";
    if (!groups[schedule]) groups[schedule] = [];
    groups[schedule].push(student);
    return groups;
  }, {});

  const handleViewDetails = (student: Student) => {
    setSelectedStudent(student);
    setOpenDialog(true);
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="p-6 flex-1">
        <header className="text-center mt-10 mb-6">
          <h1 className="text-4xl font-bold">Schedules</h1>
        </header>

        {Object.entries(groupedStudents).map(([schedule, students]) => (
          <div key={schedule} className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Schedule: {schedule}</h2>
            <table className="table-auto w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-blue-900 text-white">
                  <th className="border px-4 py-2">Name</th>
                  <th className="border px-4 py-2">Email</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student.id} className="text-center">
                    <td className="border px-4 py-2">{student.child_name}</td>
                    <td className="border px-4 py-2">{student.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}

        {/* Student List Table */}
        <div className="mt-10">
          <h2 className="text-2xl font-bold mb-4">Student List</h2>
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
                      onClick={() => handleViewDetails(student)}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Student Details Dialog */}
        <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Pre-Enrollment Details</h2>
            {selectedStudent && (
              <div className="grid grid-cols-2 gap-4 text-sm">
                <p><strong>Name:</strong> {selectedStudent.child_name}</p>
                <p><strong>Gender:</strong> {selectedStudent.Gender}</p>
                <p><strong>Birthday:</strong> {selectedStudent.birthday}</p>
                <p><strong>Age:</strong> {selectedStudent.age}</p>
                <p><strong>Registered:</strong> {selectedStudent.registered}</p>
                <p><strong>Address:</strong> {selectedStudent.address}</p>
                <p><strong>First Language:</strong> {selectedStudent.first_language}</p>
                <p><strong>Second Language:</strong> {selectedStudent.second_language}</p>
                <p><strong>Guardian:</strong> {selectedStudent.guardian}</p>
                <p><strong>Guardian Contact:</strong> {selectedStudent.guardian_contact}</p>
                <p><strong>Guardian Relationship:</strong> {selectedStudent.guardian_relationship}</p>
                <p><strong>Mother's Name:</strong> {selectedStudent.mother_name}</p>
                <p><strong>Mother's Address:</strong> {selectedStudent.mother_address}</p>
                <p><strong>Mother's Work:</strong> {selectedStudent.mother_work}</p>
                <p><strong>Mother's Contact:</strong> {selectedStudent.mother_contact}</p>
                <p><strong>Father's Name:</strong> {selectedStudent.father_name}</p>
                <p><strong>Father's Address:</strong> {selectedStudent.father_address}</p>
                <p><strong>Father's Work:</strong> {selectedStudent.father_work}</p>
                <p><strong>Father's Contact:</strong> {selectedStudent.father_contact}</p>
                <p><strong>Emergency Contact Name:</strong> {selectedStudent.emergency_name}</p>
                <p><strong>Emergency Contact:</strong> {selectedStudent.emergency_contact}</p>
                <p><strong>Emergency Work:</strong> {selectedStudent.emergency_work}</p>
                <p><strong>Email:</strong> {selectedStudent.email}</p>
                <p><strong>Date:</strong> {selectedStudent.date}</p>
              </div>
            )}
            <div className="mt-6 text-right">
              <button
                className="bg-red-500 text-white px-4 py-2 rounded"
                onClick={() => setOpenDialog(false)}
              >
                Close
              </button>
            </div>
          </div>
        </Dialog>
      </div>
    </div>
  );
};

export default Student_List;
