"use client";

import Sidebar from "@/components/Sidebar";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Dialog } from "@headlessui/react";

interface Student {
  id: number;
  full_name: string;
  gender: string;
  birthday: string;
  age: number;
  first_language?: string;
  second_language?: string;
  guardian?: string;
  guardian_contact?: string;
  guardian_relationship?: string;
  email: string;
  password: string;
  mother_name?: string;
  mother_address?: string;
  mother_work?: string;
  mother_contact?: string;
  father_name?: string;
  father_address?: string;
  father_work?: string;
  father_contact?: string;
  emergency_name?: string;
  emergency_contact?: string;
  address?: string;
  status: string;
  role: string;
  schedule?: string;
  teacher_name?: string;
}

const normalizeSchedule = (str: string) =>
  str.toLowerCase().replace(/–/g, "-").trim();

const scheduleDisplayMap: Record<string, string> = {
  "7am-9am": "Morning 7-9 AM",
  "9am-11am": "Late Morning 9-11 AM",
  "1pm-3pm": "Afternoon 1-3 PM",
  // add more mappings as needed
};

const StudentList: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [scheduleSearchTerm, setScheduleSearchTerm] = useState(""); // new state for schedule search
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    axios
      .get("http://localhost/Student_Management_main1/backend/get_accepted_students.php")
      .then((response) => {
        setStudents(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Failed to fetch accepted students:", error);
        setError("Failed to load students. Please try again later.");
        setLoading(false);
      });
  }, []);

  const openDialog = (student: Student) => {
    setSelectedStudent(student);
    setIsOpen(true);
  };

  const closeDialog = () => {
    setSelectedStudent(null);
    setIsOpen(false);
  };

  // Filter students based on search term (name) AND schedule search term (schedule)
  const filteredStudents = students.filter((student) => {
    const nameMatch = student.full_name.toLowerCase().includes(searchTerm.toLowerCase());
    const normalizedStudentSchedule = normalizeSchedule(student.schedule || "");
    const scheduleMatch = normalizedStudentSchedule.includes(scheduleSearchTerm.toLowerCase().trim());

    return nameMatch && scheduleMatch;
  });

  return (
    <div className="flex">
      <Sidebar />
      <div className="p-4 flex-1">
        <h2 className="text-4xl font-bold mb-4 text-center pt-10">
          List of Students
        </h2>

        {/* Search Bars */}
        <div className="mb-4 flex space-x-4 max-w-md">
          <input
            type="text"
            placeholder="Search by full name..."
            className="border border-gray-300 rounded px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <input
            type="text"
            placeholder="Search by schedule..."
            className="border border-gray-300 rounded px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={scheduleSearchTerm}
            onChange={(e) => setScheduleSearchTerm(e.target.value)}
          />
        </div>

        {/* Loading / Error States */}
        {loading && (
          <p className="text-center text-gray-600">Loading students...</p>
        )}
        {error && (
          <p className="text-center text-red-600 font-semibold">{error}</p>
        )}

        {/* Student Table */}
        {!loading && !error && (
          <table className="w-full table-auto border border-collapse">
            <thead className="bg-blue-800">
              <tr>
                <th className="border px-4 py-2 text-white">Full Name</th>
                <th className="border px-4 py-2 text-white">Email</th>
                <th className="border px-4 py-2 text-white">Schedule</th>
                <th className="border px-4 py-2 text-white">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student) => (
                  <tr key={student.id}>
                    <td className="border px-4 py-2">{student.full_name}</td>
                    <td className="border px-4 py-2">{student.email}</td>
                    <td className="border px-4 py-2">
                      {scheduleDisplayMap[normalizeSchedule(student.schedule || "")] || student.schedule || "N/A"}
                    </td>
                    <td className="border px-4 py-2 text-center">
                      <button
                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                        onClick={() => openDialog(student)}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="border px-4 py-2 text-center" colSpan={4}>
                    No students found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}

        {/* View Details Dialog */}
        <Dialog
          open={isOpen}
          onClose={closeDialog}
          className="fixed z-50 inset-0 overflow-y-auto"
        >
          <div className="flex items-center justify-center min-h-screen px-4">
            <Dialog.Panel className="bg-white p-6 rounded shadow-md w-full max-w-xl">
              <Dialog.Title className="text-lg font-semibold mb-4">
                Student Details
              </Dialog.Title>
              {selectedStudent && (
                <div className="space-y-2 max-h-[70vh] overflow-y-auto">
                  <p>
                    <strong>Full Name:</strong> {selectedStudent.full_name || "N/A"}
                  </p>
                  <p>
                    <strong>Gender:</strong> {selectedStudent.gender || "N/A"}
                  </p>
                  <p>
                    <strong>Birthday:</strong> {selectedStudent.birthday || "N/A"}
                  </p>
                  <p>
                    <strong>Age:</strong> {selectedStudent.age ?? "N/A"}
                  </p>
                  <p>
                    <strong>Address:</strong> {selectedStudent.address || "N/A"}
                  </p>
                  <p>
                    <strong>Guardian:</strong> {selectedStudent.guardian || "N/A"}
                  </p>
                  <p>
                    <strong>Guardian Contact:</strong>{" "}
                    {selectedStudent.guardian_contact || "N/A"}
                  </p>
                  <p>
                    <strong>Guardian Relationship:</strong>{" "}
                    {selectedStudent.guardian_relationship || "N/A"}
                  </p>
                  <p>
                    <strong>Father Name:</strong> {selectedStudent.father_name || "N/A"}
                  </p>
                  <p>
                    <strong>Mother Name:</strong> {selectedStudent.mother_name || "N/A"}
                  </p>
                  <p>
                    <strong>Emergency Contact:</strong>{" "}
                    {selectedStudent.emergency_name
                      ? `${selectedStudent.emergency_name} - ${selectedStudent.emergency_contact || "N/A"}`
                      : "N/A"}
                  </p>
                  <p>
                    <strong>Schedule:</strong>{" "}
                    {scheduleDisplayMap[normalizeSchedule(selectedStudent.schedule || "")] ||
                      selectedStudent.schedule ||
                      "N/A"}
                  </p>
                  <p>
                    <strong>Teacher:</strong> {selectedStudent.teacher_name || "N/A"}
                  </p>
                </div>
              )}
              <div className="mt-4 text-right">
                <button
                  className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
                  onClick={closeDialog}
                >
                  Close
                </button>
              </div>
            </Dialog.Panel>
          </div>
        </Dialog>
      </div>
    </div>
  );
};

export default StudentList;
