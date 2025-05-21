"use client";

import React, { useEffect, useState } from "react";
import StudentSidebar from "../studentsidebar/studentsidebar";
import { Dialog } from "@headlessui/react";
import Image from "next/image";


const My_Profile = () => {
  const [students, setStudents] = useState<any[]>([]);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewData, setViewData] = useState<any>(null);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editData, setEditData] = useState<any>(null);

  useEffect(() => {
    const storedEmail = localStorage.getItem("userEmail");
    if (storedEmail) {
      fetchStudentData(storedEmail);
    }
  }, []);

  const fetchStudentData = async (email: string) => {
    try {
      const response = await fetch(
        `http://localhost/Student_Management_main1/backend/get_id.php?email=${encodeURIComponent(email)}`
      );
      if (response.ok) {
        const data = await response.json();
        setStudents(data);
      } else {
        console.error("Error fetching student data:", response.status);
      }
    } catch (error) {
      console.error("Error fetching student data:", error);
    }
  };

  const handleView = (student: any) => {
    setViewData(student);
    setIsViewModalOpen(true);
  };

  const handleEdit = (student: any) => {
    setEditData({ ...student });
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "http://localhost/Student_Management_main1/backend/update_student_profile.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editData),
        }
      );

      if (response.ok) {
        alert("Student details updated!");
        setIsEditModalOpen(false);
        fetchStudentData(editData.email); // Refresh data
      } else {
        alert("Failed to update student details.");
      }
    } catch (error) {
      console.error("Update error:", error);
    }
  };

  return (
    <div className="flex min-h-screen">
      <StudentSidebar>{null}</StudentSidebar>

      <div className="flex-1 p-6 bg-blue-200 bg-cover bg-center">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-blue-900">My Profile</h1>
        </header>

        <div className="bg-white shadow border max-w-3xl mx-auto">
          <table className="w-full table text-left">
            <thead>
              <tr className="text-blue-800 border">
                <th className="px-4 py-2 border">Full Name</th>
                <th className="px-4 py-2 border">Schedule</th>
                <th className="px-4 py-2 border">Action</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student, index) => (
                <tr key={index} className="border-b hover:bg-blue-50">
                  <td className="px-4 py-2 border">{student.full_name}</td>
                  <td className="px-4 py-2 border">{student.schedule || "N/A"}</td>
                    <td className="px-4 py-2 border flex justify-center space-x-2">
                      <button
                        onClick={() => handleView(student)}
                        className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                      >
                        View
                      </button>
                      <button
                        onClick={() => handleEdit(student)}
                        className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-sm"
                      >
                        Edit Details
                      </button>
                    </td>
                </tr>
              ))}
              {students.length === 0 && (
                <tr>
                  <td colSpan={3} className="text-center py-4 text-blue-800">
                    Loading profile...
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* View Modal */}
        <Dialog
          open={isViewModalOpen}
          onClose={() => setIsViewModalOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
        >
          <Dialog.Panel className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-auto relative">
            <img src="/logo.jpg" alt="Logo" className="absolute top-4 right-4 h-24 w-24" />
            <Dialog.Title className="text-2xl font-semibold text-blue-900 mb-6">
              Student Profile
            </Dialog.Title>

            {viewData && (
              <div className="space-y-4 text-sm text-gray-700">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p><strong>Full Name:</strong> {viewData.full_name}</p>
                    <p><strong>Gender:</strong> {viewData.gender}</p>
                    <p><strong>Birthdate:</strong> {viewData.birthday}</p>
                    <p><strong>Age:</strong> {viewData.age}</p>
                    <p><strong>Address:</strong> {viewData.address}</p>
                  </div>
                  <div className="space-y-1">
                    <p><strong>First Language:</strong> {viewData.first_language}</p>
                    <p><strong>Second Language:</strong> {viewData.second_language}</p>
                  </div>
                </div>
                <hr className="my-4 border-gray-300" />
                <div className="space-y-1">
                  <p><strong>Mother Name:</strong> {viewData.mother_name}</p>
                  <p><strong>Mother Work:</strong> {viewData.mother_work}</p>
                  <p><strong>Mother Contact:</strong> {viewData.mother_contact}</p>
                  <p><strong>Father Name:</strong> {viewData.father_name}</p>
                  <p><strong>Father Work:</strong> {viewData.father_work}</p>
                  <p><strong>Father Contact:</strong> {viewData.father_contact}</p>
                </div>
                <hr className="my-4 border-gray-300" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p><strong>Guardian Name:</strong> {viewData.guardian}</p>
                    <p><strong>Guardian Contact:</strong> {viewData.guardian_contact}</p>
                    <p><strong>Guardian Relationship:</strong> {viewData.guardian_relationship}</p>
                  </div>
                </div>
                                <hr className="my-4 border-gray-300" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                  <p><strong>Emergency Name:</strong> {viewData.emergency_name}</p>
                  <p><strong>Emergency Contact:</strong> {viewData.emergency_contact}</p>
                  </div>
                </div>
                <hr className="my-4 border-gray-300" />
                <div className="space-y-1">
                  <p><strong>Email:</strong> {viewData.email}</p>
                  <p><strong>Schedule:</strong> {viewData.schedule || "N/A"}</p>
                </div>
                <div className="fixed bottom-10 left-1/2 transform -translate-x-1/2">
                  <button
                    onClick={() => window.print()}
                    className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
                    title="Print (Fn + P)"
                  >
                    Print
                  </button>
                </div>
              </div>
            )}
          </Dialog.Panel>
        </Dialog>

        {/* Edit Modal */}
<Dialog
  open={isEditModalOpen}
  onClose={() => setIsEditModalOpen(false)}
  className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
>
  <Dialog.Panel className="bg-white rounded-lg p-6 w-full max-w-3xl max-h-[90vh] overflow-auto relative">
    <Dialog.Title className="text-2xl font-semibold text-yellow-700 mb-6">
      Edit Student Details
    </Dialog.Title>

    {editData && (
      <form onSubmit={handleEditSubmit} className="space-y-4 text-sm text-gray-700">
        {/* Personal Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label>Full Name:</label>
            <input
              type="text"
              value={editData.full_name} disabled
              onChange={(e) => setEditData({ ...editData, full_name: e.target.value })}
              className="w-full border px-2 py-1 rounded"
            />

            <label>Gender:</label>
            <input
              type="text"
              value={editData.gender} disabled
              onChange={(e) => setEditData({ ...editData, gender: e.target.value })}
              className="w-full border px-2 py-1 rounded"
            />

            <label>Birthdate:</label>
            <input
              type="date"
              value={editData.birthday} disabled
              onChange={(e) => setEditData({ ...editData, birthday: e.target.value })}
              className="w-full border px-2 py-1 rounded"
            />

            <label>Age:</label>
            <input
              type="number"
              value={editData.age} disabled
              onChange={(e) => setEditData({ ...editData, age: e.target.value })}
              className="w-full border px-2 py-1 rounded"
            />
          </div>

          <div className="space-y-2">
            <label>First Language:</label>
            <input
              type="text"
              value={editData.first_language}
              onChange={(e) => setEditData({ ...editData, first_language: e.target.value })}
              className="w-full border px-2 py-1 rounded"
            />

            <label>Second Language:</label>
            <input
              type="text"
              value={editData.second_language}
              onChange={(e) => setEditData({ ...editData, second_language: e.target.value })}
              className="w-full border px-2 py-1 rounded"
            />

            <label>Address:</label>
            <input
              type="text"
              value={editData.address}
              onChange={(e) => setEditData({ ...editData, address: e.target.value })}
              className="w-full border px-2 py-1 rounded"
            />
          </div>
        </div>

        <hr className="my-4" />

        {/* Parent Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label>Mother Name:</label>
            <input
              type="text"
              value={editData.mother_name} disabled
              onChange={(e) => setEditData({ ...editData, mother_name: e.target.value })}
              className="w-full border px-2 py-1 rounded"
            />

            <label>Mother Work:</label>
            <input
              type="text"
              value={editData.mother_work}
              onChange={(e) => setEditData({ ...editData, mother_work: e.target.value })}
              className="w-full border px-2 py-1 rounded"
            />

            <label>Mother Contact:</label>
            <input
              type="text"
              value={editData.mother_contact}
              onChange={(e) => setEditData({ ...editData, mother_contact: e.target.value })}
              className="w-full border px-2 py-1 rounded"
            />
          </div>

          <div className="space-y-2">
            <label>Father Name:</label>
            <input
              type="text"
              value={editData.father_name} disabled
              onChange={(e) => setEditData({ ...editData, father_name: e.target.value })}
              className="w-full border px-2 py-1 rounded"
            />

            <label>Father Work:</label>
            <input
              type="text"
              value={editData.father_work}
              onChange={(e) => setEditData({ ...editData, father_work: e.target.value })}
              className="w-full border px-2 py-1 rounded"
            />

            <label>Father Contact:</label>
            <input
              type="text"
              value={editData.father_contact}
              onChange={(e) => setEditData({ ...editData, father_contact: e.target.value })}
              className="w-full border px-2 py-1 rounded"
            />
          </div>
        </div>

        <hr className="my-4" />

        {/* Guardian Information */}
        <div>
          <label>Guardian:</label>
            <input
              type="text"
              value={editData.guardian}
              onChange={(e) => setEditData({ ...editData, guardian: e.target.value })}
              className="w-full border px-2 py-1 rounded"
            />
          <label>Guardian Contact:</label>
            <input
              type="number"
              value={editData.guardian_contact}
              onChange={(e) => setEditData({ ...editData, guardian_contact: e.target.value })}
              className="w-full border px-2 py-1 rounded"
            />
          <label>Guardian Relationship:</label>
            <input
              type="text"
              value={editData.guardian_relationship}
                onChange={(e) => setEditData({ ...editData, guardian_relationship: e.target.value })}
                className="w-full border px-2 py-1 rounded"
              />
            </div>

        <hr className="my-4" />

        {/* Emergency Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label>Emergency Name:</label>
            <input
              type="text"
              value={editData.emergency_name}
              onChange={(e) => setEditData({ ...editData, emergency_name: e.target.value })}
              className="w-full border px-2 py-1 rounded"
            />

            <label>Emergency Contact:</label>
            <input
              type="text"
              value={editData.emergency_contact}
              onChange={(e) => setEditData({ ...editData, emergency_contact: e.target.value })}
              className="w-full border px-2 py-1 rounded"
            />
          </div>
        </div>

        {/* Save & Cancel Buttons */}
        <div className="flex justify-end space-x-2 mt-6">
          <button
            type="button"
            onClick={() => setIsEditModalOpen(false)}
            className="px-3 py-1 bg-gray-400 text-white rounded hover:bg-gray-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-3 py-1 bg-yellow-600 text-white rounded hover:bg-yellow-700"
          >
            Save Changes
          </button>
        </div>
      </form>
    )}
  </Dialog.Panel>
</Dialog>

      </div>
    </div>
  );
};

export default My_Profile;
