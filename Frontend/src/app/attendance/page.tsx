"use client";

import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Checkbox,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import axios from "axios";

interface Student {
  id: number;
  name: string;
  schedule: string;
  status?: string;
  note?: string;
}

interface AttendanceRecord {
  student_id: number;
  status: string;
  note: string;
  date: string;
}

const AttendanceManager: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [attendanceData, setAttendanceData] = useState<{ [key: number]: { status: string; note: string } }>({});
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [attendanceHistory, setAttendanceHistory] = useState<AttendanceRecord[]>([]);
  const [enrollees, setEnrollees] = useState<any[]>([]); // for child_name

  useEffect(() => {
    fetchStudents();
    fetchEnrollees();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await axios.get("http://localhost/Student_Management_main1/backend/get_student.php");
      setStudents(response.data);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  const fetchEnrollees = async () => {
    try {
      const response = await axios.get("http://localhost/Student_Management_main1/backend/get_enrollees.php");
      setEnrollees(response.data);
    } catch (error) {
      console.error("Error fetching enrollees:", error);
    }
  };

  const handleAttendanceChange = (id: number, status: string) => {
    setAttendanceData((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        status,
      },
    }));
  };

  const handleNoteChange = (id: number, note: string) => {
    setAttendanceData((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        note,
      },
    }));
  };

  const saveAttendance = async () => {
    const records = Object.entries(attendanceData).map(([id, { status, note }]) => ({
      student_id: parseInt(id),
      status,
      note,
      date: new Date().toISOString().split("T")[0],
    }));

    try {
      await axios.post("http://localhost/Student_Management_main1/backend/save_attendance.php", records);
      alert("Attendance saved successfully!");
    } catch (error) {
      console.error("Error saving attendance:", error);
    }
  };

  const openDialog = async (student: Student) => {
    try {
      const response = await axios.get(
        `http://localhost/Student_Management_main1/backend/get_attendance_history.php?student_id=${student.id}`
      );
      setAttendanceHistory(response.data);
      setSelectedStudent(student);
      setDialogOpen(true);
    } catch (error) {
      console.error("Error fetching attendance history:", error);
    }
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setSelectedStudent(null);
    setAttendanceHistory([]);
  };

  return (
    <div className="p-4">
      <Typography variant="h4" className="mb-4">Attendance Manager</Typography>

      {/* Display Enrollees' Child Names */}
      <Card className="mb-4">
        <CardContent>
          <Typography variant="h6">Child Names from Enrollees</Typography>
          {enrollees.map((enrollee, index) => (
            <Typography key={index}>{enrollee.child_name}</Typography>
          ))}
        </CardContent>
      </Card>

      {/* Display Students */}
      {students.map((student) => (
        <Card key={student.id} className="mb-4">
          <CardContent>
            <Typography variant="h6">{student.name}</Typography>
            <Typography variant="body2" className="mb-2">Schedule: {student.schedule}</Typography>

            <div className="flex items-center space-x-4 mb-2">
              <label className="flex items-center space-x-2">
                <Checkbox
                  checked={attendanceData[student.id]?.status === "Present"}
                  onChange={() => handleAttendanceChange(student.id, "Present")}
                />
                <span>Present</span>
              </label>
              <label className="flex items-center space-x-2">
                <Checkbox
                  checked={attendanceData[student.id]?.status === "Absent"}
                  onChange={() => handleAttendanceChange(student.id, "Absent")}
                />
                <span>Absent</span>
              </label>
              <label className="flex items-center space-x-2">
                <Checkbox
                  checked={attendanceData[student.id]?.status === "Late"}
                  onChange={() => handleAttendanceChange(student.id, "Late")}
                />
                <span>Late</span>
              </label>
              <label className="flex items-center space-x-2">
                <Checkbox
                  checked={attendanceData[student.id]?.status === "Excused"}
                  onChange={() => handleAttendanceChange(student.id, "Excused")}
                />
                <span>Excused</span>
              </label>
            </div>

            <TextField
              label="Note"
              value={attendanceData[student.id]?.note || ""}
              onChange={(e) => handleNoteChange(student.id, e.target.value)}
              fullWidth
              margin="normal"
            />

            <Button variant="outlined" onClick={() => openDialog(student)}>
              View Attendance History
            </Button>
          </CardContent>
        </Card>
      ))}

      <Button variant="contained" onClick={saveAttendance}>
        Save Attendance
      </Button>

      <Dialog open={dialogOpen} onClose={closeDialog}>
        <DialogTitle>Attendance History - {selectedStudent?.name}</DialogTitle>
        <DialogContent>
          {attendanceHistory.length > 0 ? (
            attendanceHistory.map((record, index) => (
              <div key={index} className="mb-2">
                <Typography>Date: {record.date}</Typography>
                <Typography>Status: {record.status}</Typography>
                <Typography>Note: {record.note}</Typography>
              </div>
            ))
          ) : (
            <Typography>No attendance history found.</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog}>Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AttendanceManager;
