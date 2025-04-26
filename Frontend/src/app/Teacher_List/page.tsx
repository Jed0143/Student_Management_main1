"use client";

import React, { useState, useEffect, useRef, ChangeEvent } from "react";
import Sidebar from "@/components/Sidebar";
import { Dialog, TextField } from "@mui/material";

interface Teacher {
  id: number;
  fullname: string;
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
    fullname: "",
    email: "",
    password: "",
    role: "admin", // Fixed role as 'admin'
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
    setOpenAddDialog(true);
  };

  const handleSaveNewTeacher = async (fullname: string, email: string, password: string, role: string) => {
    try {
      const response = await fetch('http://localhost/Student_Management_main1/backend/save_teacher.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fullname, email, password, role }),
      });

      const textResponse = await response.text();
      console.log('Raw response:', textResponse);

      try {
        const data = JSON.parse(textResponse);
        if (data.status === 'success') {
          alert(data.message);
          setOpenAddDialog(false);
          fetchTeachers(); // Refresh teacher list
        } else {
          alert(`Error: ${data.message}`);
        }
      } catch (error) {
        console.error('JSON parsing error:', error);
        alert('Failed to parse response from server.');
      }
    } catch (error) {
      console.error('Error saving teacher:', error);
      alert('Failed to save teacher');
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
                <th className="border px-4 py-2">Password</th>
                <th className="border px-4 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {teachers.map((teacher) => (
                <tr key={teacher.id} className="text-center">
                  <td className="border px-4 py-2">{teacher.fullname}</td>
                  <td className="border px-4 py-2">{teacher.email}</td>
                  <td className="border px-4 py-2">{teacher.password}</td>
                  <td className="border px-4 py-2">
                    <button
                      className="bg-blue-500 text-white py-1 px-4 rounded"
                      onClick={() => handleViewTeacherDetails(teacher)}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Teacher Details Dialog */}
        <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
          <div className="p-6" ref={printRef}>
            <h2 className="text-2xl font-bold mb-4">
              Teacher Details: {selectedTeacher?.fullname}
            </h2>
            {selectedTeacher ? (
              <div>
                <p><strong>Email:</strong> {selectedTeacher.email}</p>
                <p><strong>Password:</strong> {selectedTeacher.password}</p>
                <p><strong>Role:</strong> {selectedTeacher.role}</p>
              </div>
            ) : (
              <p>No teacher details found.</p>
            )}
          </div>
          <div className="p-4 flex justify-end space-x-4">
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

        {/* Add Teacher Form Dialog */}
        <Dialog open={openAddDialog} onClose={() => setOpenAddDialog(false)} maxWidth="md" fullWidth>
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Add New Teacher</h2>
            <form className="space-y-4">
              <div>
                <TextField
                  label="Full Name"
                  variant="outlined"
                  fullWidth
                  name="fullname"
                  value={newTeacher.fullname}
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
                <TextField
                  label="Password"
                  type="password"
                  variant="outlined"
                  fullWidth
                  name="password"
                  value={newTeacher.password}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <label className="block font-medium text-gray-700 mb-1">Role</label>
                <p className="border border-gray-300 rounded-md p-2 bg-gray-100">admin</p> {/* Fixed Role */}
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
                  onClick={() => handleSaveNewTeacher(
                    newTeacher.fullname,
                    newTeacher.email,
                    newTeacher.password,
                    newTeacher.role // "admin" is fixed
                  )}
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
