"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "../Sidebar/Sidebar";
import {
  Button,
  Dialog,
  TextField,
  InputAdornment,
} from "@mui/material";

interface Student {
  id: number;
  full_name: string;
  email: string;
  contact_no: string;
  password: string;
  address: string;
  birthday: string;
  schedule: string;
  status: string;
  gender: string;
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
}

const Student_List: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openPasswordDialog, setOpenPasswordDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const fetchStudents = async () => {
    try {
      const response = await fetch("http://localhost/Student_Management_main1/backend/get_info.php");
      const data = await response.json();
      if (Array.isArray(data)) setStudents(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleChangePassword = async () => {
    if (!newPassword || !confirmPassword) return alert("Please enter both password fields.");
    if (newPassword !== confirmPassword) return alert("Passwords do not match!");
    if (!selectedStudent?.id) return alert("No student selected.");

    try {
      const response = await fetch("http://localhost/Student_Management_main1/backend/cp.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: selectedStudent.id, new_password: newPassword }),
      });

      const result = await response.json();
      if (response.ok && result.status === "success") {
        alert("Password updated successfully!");
        setOpenPasswordDialog(false);
        setNewPassword("");
        setConfirmPassword("");
      } else {
        alert(`Error: ${result.message || "Something went wrong."}`);
      }
    } catch (error) {
      console.error("Error changing password:", error);
      alert("Failed to change password.");
    }
  };

  const handleRemoveStudent = async (id: number) => {
    if (!confirm("Are you sure you want to remove this student?")) return;

    try {
      const response = await fetch("http://localhost/Student_Management_main1/backend/delete_student.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      const result = await response.json();
      if (response.ok && result.status === "success") {
        alert("Student removed successfully.");
        fetchStudents();
      } else {
        alert(`Error: ${result.message || "Failed to remove student."}`);
      }
    } catch (error) {
      console.error("Error removing student:", error);
      alert("Failed to remove student.");
    }
  };

  const handleViewDetails = (student: Student) => {
    setSelectedStudent(student);
    setOpenDialog(true);
  };

  const openPasswordChangeDialog = (student: Student) => {
    setSelectedStudent(student);
    setNewPassword("");
    setConfirmPassword("");
    setOpenPasswordDialog(true);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const filteredStudents = students.filter((student) =>
    student.full_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderDetails = () => {
    if (!selectedStudent) return null;

    const entries = [
      ["Name", selectedStudent.full_name],
      ["Email", selectedStudent.email],
      ["Address", selectedStudent.address],
      ["Birthdate", selectedStudent.birthday],
      ["Schedule", selectedStudent.schedule],
      ["Status", selectedStudent.status],
      ["Gender", selectedStudent.gender],
      ["First Language", selectedStudent.first_language],
      ["Second Language", selectedStudent.second_language],
      ["Guardian Name", selectedStudent.guardian],
      ["Guardian Contact", selectedStudent.guardian_contact],
      ["Guardian Relationship", selectedStudent.guardian_relationship],
      ["Mother's Name", selectedStudent.mother_name],
      ["Mother's Address", selectedStudent.mother_address],
      ["Mother's Work", selectedStudent.mother_work],
      ["Mother's Contact", selectedStudent.mother_contact],
      ["Father's Name", selectedStudent.father_name],
      ["Father's Address", selectedStudent.father_address],
      ["Father's Work", selectedStudent.father_work],
      ["Father's Contact", selectedStudent.father_contact],
      ["Emergency Contact Name", selectedStudent.emergency_name],
      ["Emergency Contact Number", selectedStudent.emergency_contact],
    ];

    return entries.map(([label, value]) => (
      <p key={label}>
        <strong>{label}:</strong> {value || "-"}
      </p>
    ));
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="p-6 flex-1">
        <header className="text-center mt-10 mb-6">
          <h1 className="text-4xl font-bold">Student List</h1>
        </header>

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

        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-blue-900 text-white">
              <th className="border px-4 py-2">Name</th>
              <th className="border px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((student) => (
              <tr key={student.id} className="text-center">
                <td className="border px-4 py-2">{student.full_name}</td>
                <td className="border px-4 py-2 space-x-2">
                  <button
                    className="bg-blue-500 text-white py-1 px-4 rounded"
                    onClick={() => handleViewDetails(student)}
                  >
                    View
                  </button>
                  <button
                    className="bg-yellow-500 text-white py-1 px-4 rounded"
                    onClick={() => openPasswordChangeDialog(student)}
                  >
                    Change Password
                  </button>
                  <button
                    className="bg-red-600 text-white py-1 px-4 rounded"
                    onClick={() => handleRemoveStudent(student.id)}
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* View Details Dialog */}
        <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Student Details</h2>
            <div className="grid grid-cols-1 gap-2 text-sm">{renderDetails()}</div>
            <div className="mt-6 text-right">
              <Button onClick={() => setOpenDialog(false)} color="primary">
                Close
              </Button>
            </div>
          </div>
        </Dialog>

        {/* Change Password Dialog */}
        <Dialog open={openPasswordDialog} onClose={() => setOpenPasswordDialog(false)} maxWidth="sm" fullWidth>
          <div className="p-6">
            <h2 className="text-xl font-bold mb-4">Change Password</h2>
            <div className="space-y-4">
              <TextField
                label="New Password"
                type="password"
                fullWidth
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <TextField
                label="Confirm Password"
                type={showConfirmPassword ? "text" : "password"}
                fullWidth
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <button
                        type="button"
                        className="text-blue-600 font-semibold"
                        onClick={toggleConfirmPasswordVisibility}
                      >
                        {showConfirmPassword ? "Hide" : "Show"}
                      </button>
                    </InputAdornment>
                  ),
                }}
              />
            </div>
            <div className="flex justify-end space-x-4 mt-6">
              <button
                className="bg-gray-400 text-white px-4 py-2 rounded"
                onClick={() => setOpenPasswordDialog(false)}
              >
                Cancel
              </button>
              <button
                className="bg-blue-600 text-white px-6 py-2 rounded"
                onClick={handleChangePassword}
              >
                Update Password
              </button>
            </div>
          </div>
        </Dialog>
      </div>
    </div>
  );
};

export default Student_List;
