"use client";

import { useState, useEffect, ReactNode } from 'react';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import Sidebar from "@/components/Sidebar";

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
}

const EnrolleesList: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]); 
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [studentDetails, setStudentDetails] = useState<Student | null>(null);
  const [openSelectScheduleDialog, setOpenSelectScheduleDialog] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch("http://localhost/Student_Management_main1/backend/get_info_en.php");
        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();
        if (Array.isArray(data)) setStudents(data);
        else console.error("Fetched data is not an array:", data);
      } catch (error) {
        console.error("There was an error fetching the students:", error);
      }
    };

    fetchStudents();
  }, []);

  const handleView = (student: Student) => {
    setStudentDetails(student); // Set the student details
    setOpenViewDialog(true); // Open the view details dialog
  };

  const handleSelectSchedule = async (decision: "accept" | "deny") => {
    if (!selectedStudent || isProcessing) return;

    setIsProcessing(true);

    try {
      if (decision === "accept") {
        const updateStatusResponse = await fetch("http://localhost/Student_Management_main1/backend/update_student_status.php", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: selectedStudent.id,
            status: "accept",
          }),
        });

        if (!updateStatusResponse.ok) {
          alert("Failed to update student status.");
          return;
        }

        alert("✅ Student accepted.");
        setStudents((prev) => prev.filter((e) => e.id !== selectedStudent.id));
      } else if (decision === "deny") {
        const deleteStudentResponse = await fetch("http://localhost/Student_Management_main1/backend/delete_student.php", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: selectedStudent.id }),
        });

        const result = await deleteStudentResponse.json();

        if (!deleteStudentResponse.ok) {
          alert("Failed to delete student: " + result.message);
          return;
        }

        alert("❌ " + result.message);
        // Fetch updated list of students after deletion
        const updatedStudents = students.filter((e) => e.id !== selectedStudent.id);
        setStudents(updatedStudents);
      }
    } catch (error) {
      console.error("Error during acceptance/denial process:", error);
      alert("⚠️ Something went wrong. Please try again.");
    } finally {
      setOpenSelectScheduleDialog(false);
      setIsProcessing(false);
    }
  };

  const renderDetails = () => {
    if (!studentDetails) return null;

    return (
      <>
        <p><strong>Name:</strong> {studentDetails.full_name}</p>
        <p><strong>Email:</strong> {studentDetails.email}</p>
        <p><strong>Schedule:</strong> {studentDetails.schedule}</p>
        <p><strong>Gender:</strong> {studentDetails.gender}</p>
        <p><strong>Birthday:</strong> {studentDetails.birthday}</p>
        <p><strong>First Language:</strong> {studentDetails.first_language}</p>
        <p><strong>Second Language:</strong> {studentDetails.second_language}</p>
        <p><strong>Guardian:</strong> {studentDetails.guardian}</p>
        <p><strong>Guardian Contact:</strong> {studentDetails.guardian_contact}</p>
        <p><strong>Guardian Relationship:</strong> {studentDetails.guardian_relationship}</p>
        <p><strong>Mother's Name:</strong> {studentDetails.mother_name}</p>
        <p><strong>Mother's Address:</strong> {studentDetails.mother_address}</p>
        <p><strong>Mother's Work:</strong> {studentDetails.mother_work}</p>
        <p><strong>Mother's Contact:</strong> {studentDetails.mother_contact}</p>
        <p><strong>Father's Name:</strong> {studentDetails.father_name}</p>
        <p><strong>Father's Address:</strong> {studentDetails.father_address}</p>
        <p><strong>Father's Work:</strong> {studentDetails.father_work}</p>
        <p><strong>Father's Contact:</strong> {studentDetails.father_contact}</p>
        <p><strong>Emergency Name:</strong> {studentDetails.emergency_name}</p>
        <p><strong>Emergency Contact:</strong> {studentDetails.emergency_contact}</p>
        <p><strong>Address:</strong> {studentDetails.address}</p>
      </>
    );
  };

  return (
    <div className="flex">
      <Sidebar />

      <main className="p-6 flex-1">
        <header className="text-center mt-10 mb-6">
          <h1 className="text-4xl font-bold">List of Enrollees</h1>
        </header>

        <div className="overflow-x-auto">
          <table className="table-auto w-full border-collapse border border-gray-300">
            <thead className="bg-blue-900 text-white">
              <tr>
                <th className="border px-4 py-2">Full Name</th>
                <th className="border px-4 py-2">Email Address</th>
                <th className="border px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.id} className="text-center">
                  <td className="border px-4 py-2">{student.full_name}</td>
                  <td className="border px-4 py-2">{student.email}</td>
                  <td className="border px-4 py-2 space-x-2">
                    <button
                      className="text-blue-600 hover:underline"
                      onClick={() => handleView(student)} // Open details view
                    >
                      View Details
                    </button>
                    <button
                      className="text-green-600 hover:underline"
                      onClick={() => {
                        setSelectedStudent(student);
                        setOpenSelectScheduleDialog(true);
                      }}
                    >
                      Accept Enrollee
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* View Details Dialog */}
        <Dialog open={openViewDialog} onClose={() => setOpenViewDialog(false)} maxWidth="md" fullWidth>
          <DialogTitle className="text-center font-semibold">
            Pre-Enrollment Information
          </DialogTitle>
          <DialogContent dividers>
            {studentDetails ? (
              <div className="grid grid-cols-2 gap-4">
                {renderDetails()}
              </div>
            ) : (
              <p>Loading information...</p>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenViewDialog(false)} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>

        {/* Accept/Deny Dialog */}
        <Dialog open={openSelectScheduleDialog} onClose={() => setOpenSelectScheduleDialog(false)}>
          <DialogTitle>Accept Enrollee</DialogTitle>
          <DialogContent>
            <p>Are you sure you want to accept or deny this enrollee?</p>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => handleSelectSchedule("deny")}
              color="error"
              disabled={isProcessing}
            >
              Deny
            </Button>
            <Button
              onClick={() => handleSelectSchedule("accept")}
              color="success"
              variant="contained"
              disabled={isProcessing}
            >
              Accept
            </Button>
          </DialogActions>
        </Dialog>
      </main>
    </div>
  );
};

export default EnrolleesList;
