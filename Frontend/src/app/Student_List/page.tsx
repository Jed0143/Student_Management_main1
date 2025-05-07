"use client";

import React, { useState, useEffect, ChangeEvent } from "react";
import Sidebar from "@/components/Sidebar";
import { Button, Dialog, TextField } from "@mui/material";

interface Student {
  id: number;
  full_name: string;
  schedule: string;
  email: string;
  gender: string;
  birthday: string;
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
  address: string;
  password: string;
}

const Student_List: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingPassword, setEditingPassword] = useState<{ [key: number]: boolean }>({});
  const [passwords, setPasswords] = useState<{ [key: number]: string }>({});

  const fetchStudents = async () => {
    try {
      const response = await fetch("http://localhost/Student_Management_main1/backend/get_info.php");
      if (!response.ok) throw new Error("Network response was not ok");
      const data = await response.json();
      if (Array.isArray(data)) setStudents(data);
      else console.error("Fetched data is not an array:", data);
    } catch (error) {
      console.error("There was an error fetching the students:", error);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleEditPassword = (id: number) => {
    setEditingPassword((prev) => ({ ...prev, [id]: true }));
  };

  const handlePasswordChange = (id: number, event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { value } = event.target as HTMLInputElement;
    setPasswords((prev) => ({ ...prev, [id]: value }));
  };

  const handleSavePassword = async (id: number) => {
    const newPassword = passwords[id];
    if (!newPassword) return;

    try {
      const response = await fetch("http://localhost/Student_Management_main1/backend/update_student_password.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, password: newPassword }),
      });

      const data = await response.json();
      if (data.status === "success" || data.message === "Password updated successfully") {
        alert("Password updated successfully!");
        setEditingPassword((prev) => ({ ...prev, [id]: false }));
        fetchStudents(); // 🔄 Refresh the list
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error("Error updating password:", error);
      alert("Failed to update password.");
    }
  };

  const filteredStudents = students.filter((student) =>
    student.full_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const groupedStudents = filteredStudents.reduce<Record<string, Student[]>>((groups, student) => {
    const schedule = student.schedule?.trim() || "No Schedule";
    if (!groups[schedule]) groups[schedule] = [];
    groups[schedule].push(student);
    return groups;
  }, {});

  const handleViewDetails = (student: Student) => {
    setSelectedStudent(student);
    setOpenDialog(true);
  };

  const renderDetails = () => {
    if (!selectedStudent) return null;

    return (
      <>
        <p><strong>Name:</strong> {selectedStudent.full_name}</p>
        <p><strong>Email:</strong> {selectedStudent.email}</p>
        <p><strong>Schedule:</strong> {selectedStudent.schedule}</p>
        <p><strong>Gender:</strong> {selectedStudent.gender}</p>
        <p><strong>Birthday:</strong> {selectedStudent.birthday}</p>
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
        <p><strong>Emergency Name:</strong> {selectedStudent.emergency_name}</p>
        <p><strong>Emergency Contact:</strong> {selectedStudent.emergency_contact}</p>
        <p><strong>Address:</strong> {selectedStudent.address}</p>
      </>
    );
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="p-6 flex-1">
        <header className="text-center mt-10 mb-6">
          <h1 className="text-4xl font-bold">Schedules</h1>
        </header>

        {/* Search bar */}
        <div className="mb-6 flex justify-end pr-6">
          <div className="w-full max-w-md">
            <input
              type="text"
              placeholder="Search student by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {Object.entries(groupedStudents).map(([schedule, students]) => (
          <div key={schedule} className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Schedule: {schedule}</h2>
            <table className="table-auto w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-blue-900 text-white">
                  <th className="border px-4 py-2">Name</th>
                  <th className="border px-4 py-2">Password</th>
                  <th className="border px-4 py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student.id} className="text-center">
                    <td className="border px-4 py-2">{student.full_name}</td>
                    <td className="border px-4 py-2">
                      {editingPassword[student.id] ? (
                        <TextField
                          value={passwords[student.id] || ""}
                          onChange={(e) => handlePasswordChange(student.id, e)}
                          size="small"
                        />
                      ) : (
                        student.password
                      )}
                    </td>
                    <td className="border px-4 py-2">
                      <button
                        className="bg-blue-500 text-white py-1 px-4 rounded"
                        onClick={() => handleViewDetails(student)}
                      >
                        View details
                      </button>
                      {editingPassword[student.id] ? (
                        <button
                          className="bg-green-500 text-white py-1 px-4 rounded ml-2"
                          onClick={() => handleSavePassword(student.id)}
                        >
                          Save
                        </button>
                      ) : (
                        <button
                          className="bg-yellow-500 text-white py-1 px-4 rounded ml-2"
                          onClick={() => handleEditPassword(student.id)}
                        >
                          Change Password
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}

        {/* View Details Dialog */}
        <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Student Details</h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              {renderDetails()}
            </div>
            <div className="mt-6 text-right">
              <Button onClick={() => setOpenDialog(false)} color="primary">
                Close
              </Button>
            </div>
          </div>
        </Dialog>
      </div>
    </div>
  );
};

export default Student_List;
