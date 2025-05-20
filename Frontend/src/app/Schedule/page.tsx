"use client";

import React, { useEffect, useState } from "react";
import StudentSidebar from "@/components/Sidebar";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
} from "@mui/material";

const Adashboard = () => {
  const [student, setStudent] = useState<any>(null);
  const [acceptedStudents, setAcceptedStudents] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [openScheduleDialog, setOpenScheduleDialog] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [selectedSchedule, setSelectedSchedule] = useState<string>("");
  const [selectedTeacher, setSelectedTeacher] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingTeachers, setLoadingTeachers] = useState<boolean>(false);

  useEffect(() => {
    const stored = localStorage.getItem("student");
    if (stored) {
      setStudent(JSON.parse(stored));
    }

    fetchAcceptedStudents();
    fetchTeachers();
  }, []);

  const fetchAcceptedStudents = () => {
    setLoading(true);
    fetch("http://localhost/Student_Management_main1/backend/get_accepted_students.php")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch students");
        }
        return response.json();
      })
      .then((data) => {
        setAcceptedStudents(data);
      })
      .catch((error) => {
        console.error("Error fetching students:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const fetchTeachers = () => {
    setLoadingTeachers(true);
    fetch("http://localhost/Student_Management_main1/backend/get_teacher.php")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch teachers");
        }
        return response.json();
      })
      .then((data) => {
        if (data.success) {
          setTeachers(data.teachers);
        } else {
          console.error("Backend error:", data.message);
          setTeachers([]);
        }
      })
      .catch((error) => {
        console.error("Error fetching teachers:", error);
      })
      .finally(() => {
        setLoadingTeachers(false);
      });
  };

  const handleSetSchedule = (id: string | number) => {
    const studentData = acceptedStudents.find(
      (stu) => Number(stu.id) === Number(id)
    );
    if (studentData) {
      setSelectedStudent(studentData);
      setSelectedSchedule(studentData.schedule || "");
      setSelectedTeacher(studentData.teacher || "");
      setOpenScheduleDialog(true);
    } else {
      console.error("Student not found with ID:", id);
    }
  };

  const handleCloseDialog = () => {
    setOpenScheduleDialog(false);
    setSelectedSchedule("");
    setSelectedTeacher("");
    setSelectedStudent(null);
  };

  const handleSaveSchedule = () => {
    if (selectedStudent && selectedSchedule && selectedTeacher) {
      const requestBody = {
        id: selectedStudent.id,
        name: selectedStudent.full_name,
        email: selectedStudent.email,
        schedule: selectedSchedule,
        teacher_name: selectedTeacher, // ✅ FIXED here
      };

      fetch(
        "http://localhost/Student_Management_main1/backend/save_student_schedule.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      )
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            alert("Schedule saved successfully!");
            fetchAcceptedStudents();
          } else {
            alert("Failed to save schedule: " + data.error);
          }
        })
        .catch((error) => {
          console.error("Fetch error:", error);
          alert("Failed to save schedule.");
        });

      handleCloseDialog();
    } else {
      alert("Please select a student, schedule, and teacher.");
    }
  };

  const filterBySchedule = (schedule: string) => {
    return acceptedStudents.filter((s) => s.schedule === schedule);
  };

  const filterWithoutSchedule = () => {
    return acceptedStudents.filter((s) => !s.schedule || s.schedule === "");
  };

  return (
    <div className="flex">
      <StudentSidebar />
      <div className="flex-1 p-6 bg-blue-200 min-h-screen">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-blue-900">
            List of Accepted Enrollees
          </h1>
        </header>

        <section className="bg-white p-6 rounded-lg shadow-md max-w-6xl mx-auto">
          <h2 className="text-2xl font-semibold text-blue-800 mb-4">
            List of Accepted Students
          </h2>
          <p className="mb-4 text-sm text-gray-600">
            Available shifts: <strong>7AM-9PM</strong>,{" "}
            <strong>9AM-11PM</strong>, <strong>1AM-3PM</strong>
          </p>

          {loading ? (
            <p className="text-center text-gray-600">Loading students...</p>
          ) : acceptedStudents.length > 0 ? (
            <div>
              <h3 className="text-xl font-semibold text-red-700 mt-4 mb-2">
                No Schedule Assigned
              </h3>
              <table className="w-full table-auto text-left mb-6">
                <thead>
                  <tr className="bg-red-100">
                    <th className="px-4 py-2">Name</th>
                    <th className="px-4 py-2">Email</th>
                    <th className="px-4 py-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filterWithoutSchedule().map((stu) => (
                    <tr key={stu.id} className="border-t">
                      <td className="px-4 py-2">{stu.full_name}</td>
                      <td className="px-4 py-2">{stu.email}</td>
                      <td className="px-4 py-2">
                        <button
                          onClick={() => handleSetSchedule(stu.id)}
                          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                        >
                          Set Schedule
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {["7AM-9PM", "9AM-11PM", "1AM-3PM"].map((time) => (
                <div key={time}>
                  <h3 className="text-xl font-semibold text-blue-800 mt-4 mb-2">
                    {time} Schedule
                  </h3>
                  <table className="w-full table-auto text-left mb-6">
                    <thead>
                      <tr className="bg-blue-100">
                        <th className="px-4 py-2">Name</th>
                        <th className="px-4 py-2">Email</th>
                        <th className="px-4 py-2">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filterBySchedule(time).map((stu) => (
                        <tr key={stu.id} className="border-t">
                          <td className="px-4 py-2">{stu.full_name}</td>
                          <td className="px-4 py-2">{stu.email}</td>
                          <td className="px-4 py-2">
                            <button
                              onClick={() => handleSetSchedule(stu.id)}
                              className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                            >
                              Change Schedule
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-600">No accepted students yet.</p>
          )}
        </section>
      </div>

      <Dialog
        open={openScheduleDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Select a Schedule</DialogTitle>
        <DialogContent>
          <p>Select a schedule for the student:</p>
          <div className="space-y-4 mt-4">
            {["7AM-9PM", "9AM-11PM", "1AM-3PM"].map((slot) => (
              <button
                key={slot}
                onClick={() => setSelectedSchedule(slot)}
                className={`w-full py-2 px-4 rounded border ${
                  selectedSchedule === slot
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200"
                }`}
              >
                {slot}
              </button>
            ))}
          </div>

          <p className="mt-6 mb-2 font-semibold">Select a Teacher:</p>

          {loadingTeachers ? (
            <p>Loading teachers...</p>
          ) : teachers.length > 0 ? (
            <div className="space-y-2">
              {teachers.map((teacher) => (
                <button
                  key={teacher.id}
                  onClick={() => setSelectedTeacher(teacher.full_name)}
                  className={`w-full py-2 px-4 rounded border ${
                    selectedTeacher === teacher.full_name
                      ? "bg-green-600 text-white"
                      : "bg-gray-200"
                  }`}
                >
                  {teacher.full_name}
                </button>
              ))}
            </div>
          ) : (
            <p>No teachers found.</p>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="secondary">
            Cancel
          </Button>
          <Button
            onClick={handleSaveSchedule}
            color="primary"
            disabled={!selectedSchedule || !selectedTeacher}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Adashboard;
