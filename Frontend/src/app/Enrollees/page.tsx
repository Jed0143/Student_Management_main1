"use client";

import { useState, useEffect } from 'react';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem
} from '@mui/material';
import Sidebar from "@/components/Sidebar";
import PrintableStudentDetails from "@/components/PrintableStudentDetails";

interface Enrollee {
  id: number;
  child_name: string;
  email: string;
  schedule?: string;
}

const EnrolleesList: React.FC = () => {
  const [enrollees, setEnrollees] = useState<Enrollee[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Enrollee | null>(null);
  const [schedule, setSchedule] = useState<string>('');
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [openSelectScheduleDialog, setOpenSelectScheduleDialog] = useState(false);
  const [studentDetails, setStudentDetails] = useState<any>(null);

  useEffect(() => {
    fetchEnrollees();
  }, []);

  const fetchEnrollees = async () => {
    try {
      const response = await fetch("http://localhost/Student_Management_main1/backend/get_enrollees.php");
      const data = await response.json();
      if (Array.isArray(data)) setEnrollees(data);
      else setEnrollees([]);
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
        setOpenViewDialog(true);
      }
    } catch (error) {
      console.error("Error fetching student details:", error);
      alert("Unable to load student details.");
    }
  };

  const handleSelectSchedule = async () => {
    if (selectedStudent && schedule) {
      try {
        const updatedStudent = { ...selectedStudent, schedule };

        setEnrollees(prevEnrollees =>
          prevEnrollees.map(student =>
            student.id === selectedStudent.id ? updatedStudent : student
          )
        );

        await fetch("http://localhost/Student_Management_main1/backend/update_student_schedule.php", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: selectedStudent.id,
            schedule: updatedStudent.schedule,
          }),
        });

        alert("Schedule selected and updated successfully.");
      } catch (error) {
        console.error("Error selecting schedule:", error);
        alert("An error occurred while selecting the schedule.");
      }
    }
    setOpenSelectScheduleDialog(false);
  };

  return (
    <div className="flex">
      <Sidebar />

      <main className="p-6 flex-1">
        <header className="text-center mt-10 mb-6">
          <h1 className="text-4xl font-bold">List of Enrollees</h1>
        </header>

        <div className="mb-4">
          <Button variant="contained" color="primary" onClick={fetchEnrollees}>
            Refresh List
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="table-auto w-full border-collapse border border-gray-300">
            <thead className="bg-blue-900 text-white">
              <tr>
                <th className="border px-4 py-2">Full Name</th>
                <th className="border px-4 py-2">Email Address</th>
                <th className="border px-4 py-2">Schedule</th>
                <th className="border px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {enrollees.map((student) => (
                <tr key={student.id} className="text-center">
                  <td className="border px-4 py-2">{student.child_name}</td>
                  <td className="border px-4 py-2">{student.email}</td>
                  <td className="border px-4 py-2">{student.schedule || '—'}</td>
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
                        setSchedule(student.schedule || '');
                        setOpenSelectScheduleDialog(true);
                      }}
                    >
                      Choose Schedule
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

        {/* Choose Schedule Dialog */}
        <Dialog open={openSelectScheduleDialog} onClose={() => setOpenSelectScheduleDialog(false)}>
          <DialogTitle>Choose a Schedule</DialogTitle>
          <DialogContent>
            <Select
              className="w-full mb-2"
              value={schedule}
              onChange={(e) => setSchedule(e.target.value)}
            >
              <MenuItem value="Morning (7:00 AM - 9:00 AM)">Morning (7:00 AM – 9:00 AM)</MenuItem>
              <MenuItem value="Morning (9:00 AM - 11:00 AM)">Morning (9:00 AM – 11:00 AM)</MenuItem>
              <MenuItem value="Afternoon (1:00 PM - 3:00 PM)">Afternoon (1:00 PM – 3:00 PM)</MenuItem>
            </Select>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenSelectScheduleDialog(false)}>Cancel</Button>
            <Button onClick={handleSelectSchedule} color="primary">Confirm Schedule</Button>
          </DialogActions>
        </Dialog>
      </main>
    </div>
  );
};

export default EnrolleesList;
