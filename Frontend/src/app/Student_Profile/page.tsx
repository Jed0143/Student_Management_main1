"use client";

import React, { useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import StudentSidebar from "@/components/studentsidebar";
import { Dialog } from "@headlessui/react";

const My_Profile = () => {
  const [student, setStudent] = useState<any>(null);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);
  const [editData, setEditData] = useState<any>(null);

  useEffect(() => {
    const stored = localStorage.getItem("userId");
    if (stored) {
      const userId = JSON.parse(stored);
      fetchStudentData(userId);
    }
  }, []);

  const fetchStudentData = async (userId: string) => {
    try {
      const response = await fetch(`http://localhost/Student_Management_main1/backend/get_id.php?id=${userId}`);
      if (response.ok) {
        const data = await response.json();
        setStudent(data);
        setEditData(data);
      } else {
        console.error("Error fetching student data:", response.status);
      }
    } catch (error) {
      console.error("Error fetching student data:", error);
    }
  };

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: "Student_Profile",
    onAfterPrint: () => setIsPrintModalOpen(false),
  });

  const handleEdit = () => {
    setIsEditModalOpen(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditData({
      ...editData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`http://localhost/Student_Management_main1/backend/update_student.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editData),
      });
      if (response.ok) {
        const updatedData = await response.json();
        setStudent(updatedData);
        setIsEditModalOpen(false);
      } else {
        console.error("Error saving student data:", response.status);
      }
    } catch (error) {
      console.error("Error saving student data:", error);
    }
  };

  return (
    <div className="flex min-h-screen">
      <StudentSidebar children={undefined} />

      <div className="flex-1 p-6 bg-cover bg-center min-h-screen bg-blue-200">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-blue-900">My Profile</h1>
        </header>

        {student ? (
          <>
            {/* Student Profile (Printable) */}
            <div ref={printRef} className="bg-white bg-opacity-90 p-8 rounded-lg shadow-md max-w-4xl mx-auto">
              <div className="grid grid-cols-2 gap-6 text-gray-700 text-lg">
                <div>
                  <p><strong>Full Name:</strong> {student.name}</p>
                  <p><strong>Gender:</strong> {student.Gender}</p>
                  <p><strong>Birthdate:</strong> {student.birthday}</p>
                  <p><strong>Age:</strong> {student.age}</p>
                  <p><strong>Date Registered:</strong> {student.date}</p>
                  <p><strong>Address:</strong> {student.address}</p>
                  <p><strong>First Language:</strong> {student.first_language}</p>
                  <p><strong>Second Language:</strong> {student.second_language}</p>
                </div>
                <div>
                  <p><strong>Guardian Name:</strong> {student.guardian}</p>
                  <p><strong>Guardian Contact:</strong> {student.guardian_contact}</p>
                  <p><strong>Guardian Relationship:</strong> {student.guardian_relationship}</p>
                  <p><strong>Mother's Name:</strong> {student.mother_name}</p>
                  <p><strong>Mother's Address:</strong> {student.mother_address}</p>
                  <p><strong>Mother's Work:</strong> {student.mother_work}</p>
                  <p><strong>Mother's Contact:</strong> {student.mother_contact}</p>
                  <p><strong>Father's Name:</strong> {student.fathers_name}</p>
                  <p><strong>Father's Address:</strong> {student.father_address}</p>
                  <p><strong>Father's Work:</strong> {student.father_work}</p>
                  <p><strong>Father's Contact:</strong> {student.father_contact}</p>
                  <p><strong>Emergency Name:</strong> {student.emergency_name}</p>
                  <p><strong>Emergency Contact:</strong> {student.emergency_contact}</p>
                  <p><strong>Email:</strong> {student.email}</p>
                  <p><strong>Schedule:</strong> {student.schedule}</p>
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-center gap-4 print:hidden">
              <button
                onClick={handleEdit}
                className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
              >
                Edit Details
              </button>
              <button
                onClick={() => {
                  setIsPrintModalOpen(true);
                  handlePrint();
                }}
                className="px-6 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition"
              >
                Print Profile
              </button>
            </div>
          </>
        ) : (
          <p className="text-center">Loading profile...</p>
        )}

        {/* Edit Modal */}
        <Dialog open={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
  <Dialog.Panel className="bg-white rounded-lg p-6 w-full max-w-3xl max-h-[80vh] overflow-y-auto">
    <Dialog.Title className="text-xl font-bold mb-4">Edit Profile</Dialog.Title>
    <div className="grid grid-cols-2 gap-4">
      {editData && Object.entries(editData).map(([key, value]) => (
        typeof value === "string" &&
        key !== "role" && 
        key !== "schedule" &&
        key !== "password" && 
        key !== "confirm_password" && 
        key !== "date" && (
          <div key={key} className="flex flex-col">
            <label htmlFor={key} className="font-medium text-gray-700">{key.replace("_", " ").toUpperCase()}</label>
            <input
              id={key}
              type="text"
              name={key}
              value={value}
              onChange={handleChange}
              placeholder={`Enter ${key}`}
              className="border p-2 rounded mt-2"
            />
          </div>
        )
      ))}
    </div>
    <div className="flex justify-end mt-6 gap-4">
      <button
        onClick={() => setIsEditModalOpen(false)}
        className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
      >
        Cancel
      </button>
      <button
        onClick={handleSave}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Save
      </button>
    </div>
  </Dialog.Panel>
</Dialog>


      </div>
    </div>
  );
};

export default My_Profile;
