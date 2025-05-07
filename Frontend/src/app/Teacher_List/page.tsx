"use client";

import React, { useState, useEffect, ChangeEvent } from "react";
import Sidebar from "@/components/Sidebar";
import { Dialog, TextField } from "@mui/material";

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
    password: "teacher1234", // default password
    role: "admin",
  });
  const [editingPassword, setEditingPassword] = useState<number | null>(null);
  const [editedPassword, setEditedPassword] = useState<string>("");
  const [isSaving, setIsSaving] = useState<boolean>(false);  // Track saving status

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
      password: "teacher1234",
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
      console.log("Raw Response:", textResponse);

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

    setIsSaving(true);  // Set saving state to true

    try {
      const response = await fetch("http://localhost/Student_Management_main1/backend/save_teacher.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(teacher),
      });

      const textResponse = await response.text();
      console.log("Raw response:", textResponse);

      const data = JSON.parse(textResponse);
      if (data.status === "success") {
        alert(data.message);
        setOpenAddDialog(false);
        window.location.reload(); // Full page reload to refresh the teachers list
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error("Error saving teacher:", error);
      alert("Failed to save teacher.");
    } finally {
      setIsSaving(false);  // Set saving state back to false
    }
  };

  const handlePasswordChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, id: number) => {
    setEditedPassword(event.target.value);
    setEditingPassword(id);
  };

  const handleSavePassword = async (id: number) => {
    if (!editedPassword) {
      alert("Please enter a new password.");
      return;
    }

    try {
      const response = await fetch("http://localhost/Student_Management_main1/backend/update_teacher_password.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, password: editedPassword }),
      });

      const result = await response.json();
      if (result.status === "success") {
        alert("Password updated successfully.");
        setEditingPassword(null);
        fetchTeachers();
      } else {
        alert(`Error: ${result.message}`);
      }
    } catch (error) {
      console.error("Error updating password:", error);
      alert("Error updating password.");
    }
  };

  function handleInputChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void {
    const { name, value } = event.target;
    setNewTeacher((prev) => ({
      ...prev,
      [name]: value,
    }));
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
                <th className="border px-4 py-2">Password</th>
                <th className="border px-4 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {teachers.map((teacher) => (
                <tr key={teacher.id} className="text-center">
                  <td className="border px-4 py-2">{teacher.full_name}</td>
                  <td className="border px-4 py-2">{teacher.email}</td>
                  <td className="border px-4 py-2">
                    {editingPassword === teacher.id ? (
                      <div className="flex items-center space-x-2">
                        <TextField
                          type="text"
                          value={editedPassword}
                          onChange={(e) => handlePasswordChange(e, teacher.id)}
                          size="small"
                          variant="outlined"
                        />
                      </div>
                    ) : (
                      <span>{teacher.password}</span>
                    )}
                  </td>
                  <td className="border px-4 py-2 space-x-2">
                    {editingPassword === teacher.id ? (
                      <button
                        className="bg-green-500 text-white px-4 py-2 rounded"
                        onClick={() => handleSavePassword(teacher.id)}
                      >
                        Save
                      </button>
                    ) : (
                      <button
                        className="bg-yellow-500 text-white py-1 px-3 rounded"
                        onClick={() => {
                          setEditingPassword(teacher.id);
                          setEditedPassword(teacher.password);
                        }}
                      >
                        Change Password
                      </button>
                    )}
                    <button
                      className="bg-red-500 text-white py-1 px-3 rounded"
                      onClick={() => handleDeleteTeacher(teacher.id)}
                    >
                      Remove
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

        <Dialog open={openAddDialog} onClose={() => setOpenAddDialog(false)} maxWidth="md" fullWidth>
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Add New Teacher</h2>
            <form className="space-y-4">
              <div>
                <TextField
                  label="Full Name"
                  variant="outlined"
                  fullWidth
                  name="full_name"
                  value={newTeacher.full_name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <TextField
                  label="Email (Gmail)"
                  variant="outlined"
                  fullWidth
                  name="email"
                  value={newTeacher.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <label className="block font-medium text-gray-700 mb-1">Role</label>
                <p className="border border-gray-300 rounded-md p-2 bg-gray-100">admin</p>
              </div>
              <div>
                <label className="block font-medium text-gray-700 mb-1">Default Password</label>
                <p className="border border-gray-300 rounded-md p-2 bg-gray-100">teacher1234</p>
              </div>

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
                  onClick={() => {
                    if (!newTeacher.full_name || !newTeacher.email) {
                      alert("Please fill out Full Name and Email first!");
                      return;
                    }
                    handleSaveNewTeacher(newTeacher);
                  }}
                  disabled={isSaving}  // Disable the Save button if saving is in progress
                >
                  {isSaving ? "Saving..." : "Save"}  {/* Show 'Saving...' while saving */}
                </button>
              </div>
            </form>
          </div>
        </Dialog>
      </div>
    </div>
  );
};

export default Teacher_List;
