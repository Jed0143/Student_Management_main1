"use client";

import React, { useState, useEffect, ChangeEvent, useCallback } from "react";
import Sidebar from "@/components/Sidebar";
import { Dialog, TextField, Snackbar } from "@mui/material";

interface Teacher {
  id: number;
  full_name: string;
  email: string;
  password: string;
  role: string;
}

const Teacher_List: React.FC = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [newTeacher, setNewTeacher] = useState<Teacher>({
    id: 0,
    full_name: "",
    email: "",
    password: "",
    role: "admin",
  });
  const [confirmNewTeacherPassword, setConfirmNewTeacherPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [openPasswordDialog, setOpenPasswordDialog] = useState(false);
  const [selectedTeacherId, setSelectedTeacherId] = useState<number | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const fetchTeachers = useCallback(async () => {
    try {
      const res = await fetch("http://localhost/Student_Management_main1/backend/get_teacher.php");
      const data = await res.json();
      setTeachers(data?.teachers ?? []);
    } catch (err) {
      console.error("Error loading teachers:", err);
    }
  }, []);

  useEffect(() => {
    fetchTeachers();
  }, [fetchTeachers]);

  const handleAddTeacher = () => {
    setNewTeacher({
      id: 0,
      full_name: "",
      email: "",
      password: "",
      role: "admin",
    });
    setConfirmNewTeacherPassword("");
    setOpenAddDialog(true);
  };

  const handleDeleteTeacher = async (id: number) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this teacher?");
    if (!confirmDelete) return;

    try {
      const response = await fetch("http://localhost/Student_Management_main1/backend/delete_teacher.php?action=delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      const result = await response.json();
      if (result.status === "success") {
        setSnackbarMessage("Teacher deleted successfully!");
        setSnackbarOpen(true);
        fetchTeachers();
      } else {
        setSnackbarMessage(`Error: ${result.message}`);
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.error("Error deleting teacher:", error);
      setSnackbarMessage("Error deleting teacher.");
      setSnackbarOpen(true);
    }
  };

  const handleSaveNewTeacher = async (teacher: Teacher) => {
    if (!teacher.full_name || !teacher.email || !teacher.password) {
      alert("Please fill out all fields (name, email, password).");
      return;
    }

    if (teacher.password !== confirmNewTeacherPassword) {
      alert("Passwords do not match!");
      return;
    }

    setIsSaving(true);

    try {
      const response = await fetch("http://localhost/Student_Management_main1/backend/save_teacher.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(teacher),
      });

      const data = await response.json();
      if (data.status === "success") {
        setSnackbarMessage(data.message);
        setSnackbarOpen(true);
        setOpenAddDialog(false);
        fetchTeachers();
      } else {
        setSnackbarMessage(`Error: ${data.message}`);
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.error("Error saving teacher:", error);
      setSnackbarMessage("Failed to save teacher.");
      setSnackbarOpen(true);
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (!newPassword || !confirmNewPassword) {
      alert("Please enter both password fields.");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      alert("Passwords do not match!");
      return;
    }

    if (!selectedTeacherId) {
      alert("No teacher selected.");
      return;
    }

    try {
      const response = await fetch("http://localhost/Student_Management_main1/backend/change_password.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: selectedTeacherId,
          new_password: newPassword,
        }),
      });

      const result = await response.json();

      if (response.ok && result.status === "success") {
        setSnackbarMessage("Password updated successfully!");
        setSnackbarOpen(true);
        setOpenPasswordDialog(false);
        setNewPassword("");
        setConfirmNewPassword("");
      } else {
        setSnackbarMessage(`Error: ${result.message || "Something went wrong."}`);
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.error("Error changing password:", error);
      setSnackbarMessage("Failed to change password.");
      setSnackbarOpen(true);
    }
  };

  function handleInputChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void {
    const { name, value } = event.target;
    setNewTeacher((prev) => ({ ...prev, [name]: value }));
  }

  return (
    <div className="flex">
      <Sidebar />
      <div className="p-6 flex-1">
        <header className="text-center mt-10 mb-6">
          <h1 className="text-4xl font-bold">Teacher List</h1>
        </header>

        <div className="overflow-x-auto">
          <table className="table-auto w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-blue-900 text-white">
                <th className="border px-4 py-2">Name</th>
                <th className="border px-4 py-2">Email</th>
                <th className="border px-4 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {teachers.map((teacher) => (
                <tr key={teacher.id} className="text-center">
                  <td className="border px-4 py-2">{teacher.full_name}</td>
                  <td className="border px-4 py-2">{teacher.email}</td>
                  <td className="border px-4 py-2 space-x-2">
                    <button className="bg-red-500 text-white py-1 px-3 rounded" onClick={() => handleDeleteTeacher(teacher.id)}>
                      Remove
                    </button>
                    <button className="bg-yellow-500 text-white py-1 px-3 rounded" onClick={() => {
                      setSelectedTeacherId(teacher.id);
                      setOpenPasswordDialog(true);
                    }}>
                      Change Password
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 text-center">
          <button className="bg-green-500 text-white px-6 py-2 rounded" onClick={handleAddTeacher}>
            Create/Add Teacher
          </button>
        </div>

        {/* Add Teacher Dialog */}
        <Dialog open={openAddDialog} onClose={() => setOpenAddDialog(false)} maxWidth="md" fullWidth>
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Add New Teacher</h2>
            <form className="space-y-4">
              <TextField label="Full Name" variant="outlined" fullWidth name="full_name" value={newTeacher.full_name} onChange={handleInputChange} required />
              <TextField label="Email (Gmail)" variant="outlined" fullWidth name="email" value={newTeacher.email} onChange={handleInputChange} required />

              {/* Password with show/hide */}
              <div className="relative">
                <TextField
                  label="Password"
                  variant="outlined"
                  fullWidth
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={newTeacher.password}
                  onChange={handleInputChange}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-blue-600"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>

              {/* Confirm Password*/}
              <div className="relative">
                <TextField
                  label="Confirm Password"
                  variant="outlined"
                  fullWidth
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmNewTeacherPassword}
                  onChange={(e) => setConfirmNewTeacherPassword(e.target.value)}
                  required
                />
              </div>

              <div className="flex justify-end space-x-4 mt-4">
                <button type="button" className="bg-red-500 text-white px-4 py-2 rounded" onClick={() => setOpenAddDialog(false)}>
                  Cancel
                </button>
                <button type="button" className="bg-green-500 text-white px-6 py-2 rounded" onClick={() => handleSaveNewTeacher(newTeacher)} disabled={isSaving}>
                  {isSaving ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </Dialog>

        {/* Change Password Dialog */}
        <Dialog open={openPasswordDialog} onClose={() => setOpenPasswordDialog(false)} maxWidth="sm" fullWidth>
          <div className="p-6">
            <h2 className="text-xl font-bold mb-4">Change Password</h2>
            <div className="space-y-4">
              {/* New Password Field with Show/Hide Toggle */}
              <div className="relative">
                <TextField
                  label="New Password"
                  type={showPassword ? "text" : "password"}
                  fullWidth
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-blue-600"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>

              {/* Confirm Password Field with Show/Hide Toggle */}
              <div className="relative">
                <TextField
                  label="Confirm Password"
                  type={showConfirmPassword ? "text" : "password"}
                  fullWidth
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="flex justify-end space-x-4 mt-6">
              <button className="bg-gray-400 text-white px-4 py-2 rounded" onClick={() => setOpenPasswordDialog(false)}>
                Cancel
              </button>
              <button className="bg-blue-600 text-white px-6 py-2 rounded" onClick={handleChangePassword}>
                Update Password
              </button>
            </div>
          </div>
        </Dialog>

        <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={() => setSnackbarOpen(false)} message={snackbarMessage} />
      </div>
    </div>
  );
};

export default Teacher_List;
