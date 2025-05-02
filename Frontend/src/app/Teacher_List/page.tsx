"use client";

import React, { useState, useEffect, useRef, ChangeEvent } from "react";
import Sidebar from "@/components/Sidebar";
import { Dialog, TextField } from "@mui/material";

interface Teacher {
  id: number;
  name: string;
  email: string;
  password: string;
  role: string;
}

const Teacher_List: React.FC = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [newTeacher, setNewTeacher] = useState<Teacher>({
    id: 0,
    name: "",
    email: "",
    password: "teacher1234", // default password
    role: "admin",
  });

  const printRef = useRef<HTMLDivElement>(null);

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

  const handleViewTeacherDetails = (teacher: Teacher) => {
    setSelectedTeacher(teacher);
    setOpenDialog(true);
  };

  const handleAddTeacher = () => {
    setNewTeacher({
      id: 0,
      name: "",
      email: "",
      password: "teacher1234",
      role: "admin",
    });
    setOpenAddDialog(true);
  };

  const handleDeleteTeacher = async (id: number) => {
    if (!confirm('Are you sure you want to delete this teacher?')) return;

    try {
      const response = await fetch(`http://localhost/Student_Management_main1/backend/delete_teacher.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });

      const textResponse = await response.text();
      console.log('Raw response:', textResponse);

      const data = JSON.parse(textResponse);
      if (data.status === 'success') {
        alert(data.message);
        fetchTeachers();
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error('Error deleting teacher:', error);
      alert('Failed to delete teacher.');
    }
  };

  const handleSaveNewTeacher = async (teacher: Teacher) => {
    if (!teacher.name || !teacher.email || !teacher.password) {
      alert("Please fill out all fields (name, email, password).");
      return;
    }

    try {
      const response = await fetch('http://localhost/Student_Management_main1/backend/save_teacher.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(teacher),
      });

      const textResponse = await response.text();
      console.log('Raw response:', textResponse);

      const data = JSON.parse(textResponse);
      if (data.status === 'success') {
        alert(data.message);
        setOpenAddDialog(false);
        fetchTeachers();
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error('Error saving teacher:', error);
      alert('Failed to save teacher.');
    }
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setNewTeacher((prevTeacher) => ({
      ...prevTeacher,
      [name]: value,
    }));
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
                  <td className="border px-4 py-2">{teacher.name}</td>
                  <td className="border px-4 py-2">{teacher.email}</td>
                  <td className="border px-4 py-2 space-x-2">
                    <button
                      className="bg-blue-500 text-white py-1 px-3 rounded"
                      onClick={() => handleViewTeacherDetails(teacher)}
                    >
                      View
                    </button>
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

        {/* View Dialog */}
        <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
          <div className="p-6" ref={printRef}>
            <h2 className="text-2xl font-bold mb-4">
              Teacher Details: {selectedTeacher?.name}
            </h2>
            {selectedTeacher ? (
              <div>
                <p><strong>Email:</strong> {selectedTeacher.email}</p>
                <p><strong>Role:</strong> {selectedTeacher.role}</p>
              </div>
            ) : (
              <p>No teacher details found.</p>
            )}
          </div>
          <div className="p-4 flex justify-end">
            <button
              className="bg-red-500 text-white px-4 py-2 rounded"
              onClick={() => setOpenDialog(false)}
            >
              Close
            </button>
          </div>
        </Dialog>

        {/* Add Teacher Button */}
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
              <div>
                <TextField
                  label="Full Name"
                  variant="outlined"
                  fullWidth
                  name="name"
                  value={newTeacher.name}
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
                    if (!newTeacher.name || !newTeacher.email) {
                      alert("Please fill out Full Name and Email first!");
                      return;
                    }
                    handleSaveNewTeacher(newTeacher);
                  }}
                >
                  Save
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
