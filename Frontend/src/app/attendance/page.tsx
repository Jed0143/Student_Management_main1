"use client";
import React, { ReactNode, useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";

interface Student {
  child_name: ReactNode;
  id: number;
  name: string;
  present: boolean;
  note: string;
  schedule: string;
  attendanceHistory: { date: string; present: boolean; note: string }[];
}

const AttendanceManager = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedSchedule, setSelectedSchedule] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [showModal, setShowModal] = useState(false);
  const [viewingStudent, setViewingStudent] = useState<Student | null>(null);

  // ✅ Fetch students on load
  useEffect(() => {
    fetch("http://localhost/Student_Management_main1/backend/get_student.php")
      .then((res) => res.json())
      .then((data) => {
        const studentsWithDefaults = data.students.map((student: any) => ({
          ...student,
          present: false,
          note: "",
          attendanceHistory: [],
        }));
        setStudents(studentsWithDefaults);
      })
      .catch((err) => console.error("Error fetching students:", err));
  }, []);

  const toggleAttendance = (studentId: number, note: string) => {
    setStudents((prev) =>
      prev.map((student) =>
        student.id === studentId
          ? {
              ...student,
              present: !student.present,
              attendanceHistory: [
                ...student.attendanceHistory,
                { date: selectedDate, present: !student.present, note },
              ],
            }
          : student
      )
    );
  };

  const handleNoteChange = (studentId: number, note: string) => {
    setStudents((prev) =>
      prev.map((student) => (student.id === studentId ? { ...student, note } : student))
    );
  };

  const handleSaveAttendance = () => {
    const attendanceData = students.map((student) => ({
      id: student.id,
      name: student.child_name,
      date: selectedDate,
      present: student.present,
      note: student.note,
    }));
  
    fetch("http://localhost/Student_Management_main1/backend/save_attendance.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ attendance: attendanceData }),
    })
      .then((res) => {
        if (!res.ok) {
          // If the response is not OK, throw an error
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log("Attendance saved:", data);
        alert("Attendance successfully saved!");
      })
      .catch((err) => {
        console.error("Error saving attendance:", err);
        alert("Failed to save attendance. Please check the server.");
      });
  };  
  

  const handleViewStudent = (student: Student) => {
    setViewingStudent(student);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setViewingStudent(null);
  };

  const filteredStudents = selectedSchedule
    ? students.filter((student) => student.schedule === selectedSchedule)
    : students;

  return (
    <div className="flex">
      <Sidebar />
      <div className="p-4 flex-1">
        <header className="text-center mt-8 mb-8">
          <h1 className="text-4xl font-bold">Attendance of Students</h1>
        </header>

        <div className="mb-4">
          <label className="block text-lg font-semibold">Select Date:</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-64 p-2 border rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block text-lg font-semibold">Select Schedule:</label>
          <select
            className="w-64 p-2 border rounded"
            value={selectedSchedule}
            onChange={(e) => setSelectedSchedule(e.target.value)}
          >
            <option value="">Select Schedules</option>
            {Array.from(new Set(students.map((s) => s.schedule))).map((schedule) => (
              <option key={schedule} value={schedule}>
                {schedule}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-4">Mark Attendance</h2>
          <div className="overflow-x-auto">
            <table className="table-auto w-full border border-gray-300">
              <thead>
                <tr className="bg-blue-900 text-white">
                  <th className="border px-4 py-2">Name</th>
                  <th className="border px-4 py-2">Present</th>
                  <th className="border px-4 py-2">Notes</th>
                  <th className="border px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student) => (
                  <tr key={student.id} className="text-center">
                    <td className="border px-4 py-2">{student.child_name}</td>
                    <td className="border px-4 py-2">
                      <input
                        type="checkbox"
                        checked={student.present}
                        onChange={() => toggleAttendance(student.id, student.note)}
                      />
                    </td>
                    <td className="border px-4 py-2">
                      <input
                        type="text"
                        placeholder="Add note"
                        value={student.note}
                        onChange={(e) => handleNoteChange(student.id, e.target.value)}
                        className="border rounded p-2"
                      />
                    </td>
                    <td className="border px-4 py-2">
                      <button
                        onClick={() => handleViewStudent(student)}
                        className="bg-green-500 text-white px-2 py-1 rounded"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="text-center mt-4">
            <button
              onClick={handleSaveAttendance}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Save Attendance
            </button>
          </div>
        </div>
      </div>

      {/* Modal for attendance history */}
      {showModal && viewingStudent && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-md w-1/2">
            <h2 className="text-2xl font-semibold mb-4">
              Attendance History for {viewingStudent.name}
            </h2>
            <table className="table-auto w-full border border-gray-300">
              <thead>
                <tr className="bg-blue-900 text-white">
                  <th className="border px-4 py-2">Date</th>
                  <th className="border px-4 py-2">Present/Absent</th>
                  <th className="border px-4 py-2">Notes</th>
                </tr>
              </thead>
              <tbody>
                {viewingStudent.attendanceHistory.map((entry, index) => (
                  <tr key={index} className="text-center">
                    <td className="border px-4 py-2">{entry.date}</td>
                    <td className="border px-4 py-2">{entry.present ? "Present" : "Absent"}</td>
                    <td className="border px-4 py-2">{entry.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mt-4 text-center">
              <button
                onClick={closeModal}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendanceManager;
