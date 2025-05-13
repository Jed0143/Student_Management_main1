"use client";

import React, { useState, useEffect, ChangeEvent } from "react";
import Sidebar from "@/components/Sidebar";
import { Dialog, TextField, InputAdornment } from "@mui/material";

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
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const [openPasswordDialog, setOpenPasswordDialog] = useState(false);
  const [selectedTeacherId, setSelectedTeacherId] = useState<number | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const fetchTeachers = async () => {
    try {
      const res = await fetch("http://localhost/Student_Management_main1/backend/get_teacher.php");
      const data = await res.json();
      setTeachers(data?.teachers ?? []);
    } catch (err) {
      console.error("Error loading teachers:", err);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  const handleAddTeacher = () => {
    setNewTeacher({
      id: 0,
      full_name: "",
      email: "",
      password: "",
      role: "admin",
    });
    setOpenAddDialog(true);
  };

  const handleDeleteTeacher = async (id: number) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this teacher?");
    if (!confirmDelete) return;

    try {
      const response = await fetch("http://localhost/Student_Management_main1/backend/delete_teacher.php?action=delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      const textResponse = await response.text();
      const result = JSON.parse(textResponse);
      if (result.status === "success") {
        alert("Teacher deleted successfully!");
        fetchTeachers();
      } else {
        alert(`Error: ${result.message}`);
      }
    } catch (error) {
      console.error("Error deleting teacher:", error);
      alert("Error deleting teacher.");
    }
  };

  const handleSaveNewTeacher = async (teacher: Teacher) => {
    if (!teacher.full_name || !teacher.email || !teacher.password) {
      alert("Please fill out all fields (name, email, password).");
      return;
    }

    setIsSaving(true);

    try {
      const response = await fetch("http://localhost/Student_Management_main1/backend/save_teacher.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(teacher),
      });

      const textResponse = await response.text();
      const data = JSON.parse(textResponse);
      if (data.status === "success") {
        alert(data.message);
        setOpenAddDialog(false);
        window.location.reload();
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error("Error saving teacher:", error);
      alert("Failed to save teacher.");
    } finally {
      setIsSaving(false);
    }
  };

const handleChangePassword = async () => {
  if (!newPassword || !confirmPassword) {
    alert("Please enter both password fields.");
    return;
  }

  if (newPassword !== confirmPassword) {
    alert("Passwords do not match!");
    return;
  }

  // Log the selected teacher id to check if it's set correctly
  console.log("Changing password for teacher ID:", selectedTeacherId);

  if (!selectedTeacherId) {
    alert("No teacher selected.");
    return;
  }

  try {
    const response = await fetch("http://localhost/Student_Management_main1/backend/change_password.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: selectedTeacherId, // Make sure the id is correct
        new_password: newPassword, // Ensure the new password is being sent correctly
      }),
    });

    const result = await response.json();
    console.log(result); // Log the result to see the response

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



  function handleInputChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void {
    const { name, value } = event.target;
    setNewTeacher((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

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
                    <button
                      className="bg-red-500 text-white py-1 px-3 rounded"
                      onClick={() => handleDeleteTeacher(teacher.id)}
                    >
                      Remove
                    </button>
                    <button
                      className="bg-yellow-500 text-white py-1 px-3 rounded"
                      onClick={() => {
                        setSelectedTeacherId(teacher.id);
                        setOpenPasswordDialog(true);
                      }}
                    >
                      Change Password
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 text-center">
          <button
            className="bg-green-500 text-white px-6 py-2 rounded"
            onClick={handleAddTeacher}
          >
            Create/Add Teacher
          </button>
        </div>

        {/* Add Teacher Dialog */}
        <Dialog open={openAddDialog} onClose={() => setOpenAddDialog(false)} maxWidth="md" fullWidth>
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Add New Teacher</h2>
            <form className="space-y-4">
              <TextField
                label="First Name, Middle Name, Last Name"
                variant="outlined"
                fullWidth
                name="full_name"
                value={newTeacher.full_name}
                onChange={handleInputChange}
                required
              />
              <TextField
                label="Email (Gmail)"
                variant="outlined"
                fullWidth
                name="email"
                value={newTeacher.email}
                onChange={handleInputChange}
                required
              />
              <TextField
                label="Password"
                variant="outlined"
                fullWidth
                name="password"
                type="password"
                value={newTeacher.password}
                onChange={handleInputChange}
                required
              />
              <input type="hidden" name="role" value="admin" />
              <div className="flex justify-end space-x-4 mt-4">
                <button
                  type="button"
                  className="bg-red-500 text-white px-4 py-2 rounded"
                  onClick={() => setOpenAddDialog(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="bg-green-500 text-white px-6 py-2 rounded"
                  onClick={() => handleSaveNewTeacher(newTeacher)}
                  disabled={isSaving}
                >
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

export default Teacher_List;
