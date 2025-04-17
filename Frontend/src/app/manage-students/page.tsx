"use client";
import React, { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";

interface Student {
  id: number;
  child_name: string;
  schedule: string;
  age: number | string;
  email: string;
  address: string;
}

const ManageStudents: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchStudents = async () => {
      const res = await fetch("http://localhost/Student_Management_main1/backend/get_student.php");
      const data = await res.json();
      setStudents(data.students);
    };
    fetchStudents();
  }, []);
  
  const handleSaveEditedStudent = async () => {
    if (!editingStudent) return;
  
    try {
      const response = await fetch("http://localhost/Student_Management_main1/backend/update_schedule.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: editingStudent.id,
          schedule: editingStudent.schedule,
        }),
      });
  
      const result = await response.json();
  
      if (result.status === "success") {
        setStudents((prevStudents) =>
          prevStudents.map((s) => (s.id === editingStudent.id ? editingStudent : s))
        );
        setIsModalOpen(false);
        setEditingStudent(null);
      } else {
        alert("Failed to update schedule.");
      }
    } catch (err) {
      console.error("Update failed", err);
    }
  };

  const handleEditStudent = (student: Student) => {
    setEditingStudent(student);
    setIsModalOpen(true);
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (editingStudent) {
      setEditingStudent({ ...editingStudent, [name]: value });
    }
  };

  const groupedStudents = students.reduce<Record<string, Student[]>>((groups, student) => {
    const schedule = student.schedule.trim();
    if (!schedule) return groups;

    if (!groups[schedule]) {
      groups[schedule] = [];
    }
    groups[schedule].push(student);
    return groups;
  }, {});

  return (
    <div className="flex">
      <Sidebar />

      <div className="p-6 flex-1">
        <header className="text-center mt-10 mb-6">
          <h1 className="text-4xl font-bold">Manage Your Students</h1>
        </header>

        {Object.keys(groupedStudents).length > 0 ? (
          Object.keys(groupedStudents).map((schedule) => (
            <div key={schedule} className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Schedule: {schedule}</h2>
              <div className="overflow-x-auto">
                <table className="table-auto w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-blue-900 text-white">
                      <th className="border border-gray-300 px-4 py-2">Name</th>
                      <th className="border border-gray-300 px-4 py-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {groupedStudents[schedule].map((student) => (
                      <tr key={student.id} className="text-center">
                        <td className="border border-gray-300 px-4 py-2">{student.child_name}</td>
                        <td className="border border-gray-300 px-4 py-2">
                          <button className="text-blue-500 mr-2" onClick={() => handleEditStudent(student)}>Edit Schedule</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center mt-4 text-gray-600">No students available for the given schedules.</p>
        )}

        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
              <h2 className="text-xl font-semibold mb-4">Edit Student Schedule</h2>
              <select
                name="schedule"
                value={editingStudent ? editingStudent.schedule : ""}
                onChange={handleEditInputChange}
                className="w-full p-2 border rounded mb-4"
              >
                <option value="">Select New Schedule</option>
                <option value="Morning (7:00 AM - 9:00 AM)">Morning (7:00 AM - 9:00 AM)</option>
                <option value="Morning (9:00 AM - 11:00 AM)">Morning (9:00 AM - 11:00 AM)</option>
                <option value="Afternoon (1:00 PM - 3:00 PM)">Afternoon (1:00 PM - 3:00 PM)</option>
              </select>

              <div className="flex justify-end space-x-4">
                <button
                  className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditingStudent(null);
                  }}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                  onClick={handleSaveEditedStudent}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageStudents;