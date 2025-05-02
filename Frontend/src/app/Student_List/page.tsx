"use client";

import React, { useState, ReactNode } from "react";
import Sidebar from "@/components/Sidebar";
import { Button, Dialog } from "@mui/material";

interface Student {
  name: string;
  id: number;
  schedule: string;
}

const Student_List: React.FC = () => {
  const [students] = useState<Student[]>([
    { id: 1, name: "Ana Mendoza", schedule: "9AM-11PM" },
    { id: 2, name: "Aime Aime", schedule: "1PM-3PM" },
    { id: 3, name: "Miraniep Formentera", schedule: "3PM-5PM" },
  ]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [openDialog, setOpenDialog] = useState(false);

  const groupedStudents = students.reduce<Record<string, Student[]>>((groups, student) => {
    const schedule = student.schedule?.trim() || "No Schedule";
    if (!groups[schedule]) groups[schedule] = [];
    groups[schedule].push(student);
    return groups;
  }, {});

  const handleViewDetails = (student: Student) => {
    setSelectedStudent(student);
    setOpenDialog(true);
  };

  const renderDetails = () => {
    if (!selectedStudent) return null;

    switch (selectedStudent.name) {
      case "Ana Mendoza":
        return (
          <>
            <p><strong>Name:</strong> Ana Mendoza</p>
            <p><strong>Gender:</strong> Female</p>
            <p><strong>Birthday:</strong> 2019-01-01</p>
            <p><strong>Age:</strong> 6</p>
            <p><strong>First Language:</strong> Filipino</p>
            <p><strong>Second Language:</strong> English</p>
            <p><strong>Guardian:</strong> Mendoza</p>
            <p><strong>Guardian Contact:</strong> 094321232</p>
            <p><strong>Guardian Relationship:</strong> Mother</p>
            <p><strong>Mother Name:</strong> Mendoza</p>
            <p><strong>Mother Address:</strong> Rizal</p>
            <p><strong>Mother Work:</strong> none</p>
            <p><strong>Mother Contact:</strong> 094321232</p>
            <p><strong>Father Name:</strong> James</p>
            <p><strong>Father Address:</strong> Rizal</p>
            <p><strong>Father Work:</strong> none</p>
            <p><strong>Father Contact:</strong> 09876543211</p>
            <p><strong>Emergency Name:</strong> Mendoza</p>
            <p><strong>Emergency Contact:</strong> 094321232</p>
            <p><strong>Date:</strong> 2025-04-26</p>
            <p><strong>Email:</strong> ana@gmail.com</p>
            <p><strong>Address:</strong> Rizal</p>
            <p><strong>Schedule:</strong> 9AM-11PM</p>
          </>
        );
      case "Aime Aime":
        return (
          <>
            <p><strong>Name:</strong> Aime Aime</p>
            <p><strong>Gender:</strong> Female</p>
            <p><strong>Birthday:</strong> 2018-05-10</p>
            <p><strong>Age:</strong> 7</p>
            <p><strong>First Language:</strong> Tagalog</p>
            <p><strong>Second Language:</strong> English</p>
            <p><strong>Guardian:</strong> Aime Sr.</p>
            <p><strong>Guardian Contact:</strong> 09123456789</p>
            <p><strong>Guardian Relationship:</strong> Mother</p>
            <p><strong>Mother Name:</strong> Aime Sr.</p>
            <p><strong>Mother Address:</strong> Antipolo</p>
            <p><strong>Mother Work:</strong> Vendor</p>
            <p><strong>Mother Contact:</strong> 09123456789</p>
            <p><strong>Father Name:</strong> Juan Aime</p>
            <p><strong>Father Address:</strong> Antipolo</p>
            <p><strong>Father Work:</strong> Driver</p>
            <p><strong>Father Contact:</strong> 09999888877</p>
            <p><strong>Emergency Name:</strong> Aime Sr.</p>
            <p><strong>Emergency Contact:</strong> 09123456789</p>
            <p><strong>Date:</strong> 2025-04-27</p>
            <p><strong>Email:</strong> aime@gmail.com</p>
            <p><strong>Address:</strong> Antipolo</p>
            <p><strong>Schedule:</strong> 1PM-3PM</p>
          </>
        );
      case "Miraniep Formentera":
        return (
          <>
            <p><strong>Name:</strong> Miraniep Formentera</p>
            <p><strong>Gender:</strong> Female</p>
            <p><strong>Birthday:</strong> 2017-08-15</p>
            <p><strong>Age:</strong> 8</p>
            <p><strong>First Language:</strong> Cebuano</p>
            <p><strong>Second Language:</strong> English</p>
            <p><strong>Guardian:</strong> Maria Formentera</p>
            <p><strong>Guardian Contact:</strong> 09778889900</p>
            <p><strong>Guardian Relationship:</strong> Aunt</p>
            <p><strong>Mother Name:</strong> Maria Formentera</p>
            <p><strong>Mother Address:</strong> Quezon City</p>
            <p><strong>Mother Work:</strong> Clerk</p>
            <p><strong>Mother Contact:</strong> 09778889900</p>
            <p><strong>Father Name:</strong> Jose Formentera</p>
            <p><strong>Father Address:</strong> Quezon City</p>
            <p><strong>Father Work:</strong> Technician</p>
            <p><strong>Father Contact:</strong> 09667775544</p>
            <p><strong>Emergency Name:</strong> Maria Formentera</p>
            <p><strong>Emergency Contact:</strong> 09778889900</p>
            <p><strong>Date:</strong> 2025-04-28</p>
            <p><strong>Email:</strong> miraniep@gmail.com</p>
            <p><strong>Address:</strong> Quezon City</p>
            <p><strong>Schedule:</strong> 3PM-5PM</p>
          </>
        );
      default:
        return <p>No details available</p>;
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="p-6 flex-1">
        <header className="text-center mt-10 mb-6">
          <h1 className="text-4xl font-bold">Schedules</h1>
        </header>

        {Object.entries(groupedStudents).map(([schedule, students]) => (
          <div key={schedule} className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Schedule: {schedule}</h2>
            <table className="table-auto w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-blue-900 text-white">
                  <th className="border px-4 py-2">Name</th>
                  <th className="border px-4 py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student.id} className="text-center">
                    <td className="border px-4 py-2">{student.name}</td>
                    <td className="border px-4 py-2">
                      <button
                        className="bg-blue-500 text-white py-1 px-4 rounded"
                        onClick={() => handleViewDetails(student)}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}

        <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Pre-Enrollment Details</h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              {renderDetails()}
            </div>
            <div className="mt-6 text-right">
              <Button onClick={() => setOpenDialog(false)} color="primary">
                Close
              </Button>
            </div>
          </div>
        </Dialog>
      </div>
    </div>
  );
};

export default Student_List;
