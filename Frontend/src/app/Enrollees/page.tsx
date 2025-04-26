"use client";

import { useState, useEffect } from 'react';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import Sidebar from "@/components/Sidebar";
import PrintableStudentDetails from "@/components/PrintableStudentDetails";

interface Enrollee {
  id: number;
  child_name: string;
  email: string;
  password?: string;
  schedule?: string;
  status?: string;
}

const EnrolleesList: React.FC = () => {
  const [enrollees, setEnrollees] = useState<Enrollee[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Enrollee | null>(null);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [openSelectScheduleDialog, setOpenSelectScheduleDialog] = useState(false);
  const [studentDetails, setStudentDetails] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    fetchEnrollees();
  }, []);

  const fetchEnrollees = async () => {
    try {
      const response = await fetch("http://localhost/Student_Management_main1/backend/get_enrollees.php");
      const data = await response.json();
      setEnrollees(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching enrollees:", error);
      alert("Unable to retrieve enrollee records.");
    }
  };

  const handleView = async (student: Enrollee) => {
    try {
      const res = await fetch(`http://localhost/Student_Management_main1/backend/get_pre_enrollment_details.php?email=${student.email}`);
      const data = await res.json();

      if (data.error) {
        alert("No pre-enrollment details found for this individual.");
      } else {
        setStudentDetails(data);
        setSelectedStudent({ ...student, password: data.password });
        setOpenViewDialog(true);
      }
    } catch (error) {
      console.error("Error fetching student details:", error);
      alert("Unable to load student details.");
    }
  };

  const handleSelectSchedule = async (decision: "accept" | "deny") => {
    if (!selectedStudent || isProcessing) return;

    setIsProcessing(true);

    try {
      if (decision === "accept") {
        const passwordToSend = selectedStudent.password || "defaultpassword123";

        const insertUserResponse = await fetch("http://localhost/Student_Management_main1/backend/insert_user.php", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: selectedStudent.email,
            password: passwordToSend,
            role: "parent",
          }),
        });

        const insertUserText = await insertUserResponse.text();
        let insertUserResult;
        try {
          insertUserResult = JSON.parse(insertUserText);
        } catch {
          console.error("Invalid JSON response from PHP:", insertUserText);
          alert("Server returned an unexpected response.");
          return;
        }

        if (insertUserResult.status !== "success") {
          alert("Failed to create user: " + insertUserResult.message);
          return;
        }

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

        alert("✅ Student accepted and user account created.");

        // ✅ Remove accepted student from the UI list only
        setEnrollees((prev) => prev.filter((e) => e.id !== selectedStudent.id));

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
        await fetchEnrollees(); // refresh list after denial
      }
    } catch (error) {
      console.error("Error during acceptance/denial process:", error);
      alert("⚠️ Something went wrong. Please try again.");
    } finally {
      setOpenSelectScheduleDialog(false);
      setIsProcessing(false);
    }
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
              {enrollees.map((student) => (
                <tr key={student.id} className="text-center">
                  <td className="border px-4 py-2">{student.child_name}</td>
                  <td className="border px-4 py-2">{student.email}</td>
                  <td className="border px-4 py-2 space-x-2">
                    <button
                      className="text-blue-600 hover:underline"
                      onClick={() => handleView(student)}
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
                      Accept Enrollees
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* View Details Dialog */}
        <Dialog open={openViewDialog} onClose={() => setOpenViewDialog(false)} maxWidth="md" fullWidth>
          <DialogTitle className="text-center font-semibold">Pre-Enrollment Information</DialogTitle>
          <DialogContent dividers className="space-y-6">
            {studentDetails ? (
              <PrintableStudentDetails studentDetails={studentDetails} />
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
