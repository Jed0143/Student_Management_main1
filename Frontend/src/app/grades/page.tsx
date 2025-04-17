"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar";

type Grade = {
  id: number;
  student: string;
  subject: string;
  grade: string;
};

const Grades = () => {
  const [grades, setGrades] = useState<Grade[]>([]);
  const [newGrade, setNewGrade] = useState<Omit<Grade, "id">>({ student: "", subject: "", grade: "" });

  useEffect(() => {
    setGrades([
      { id: 1, student: "John Doe", subject: "Math", grade: "A" },
      { id: 2, student: "Jane Smith", subject: "Science", grade: "B+" },
    ]);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewGrade({ ...newGrade, [e.target.name]: e.target.value });
  };

  const handleAddGrade = () => {
    if (newGrade.student && newGrade.subject && newGrade.grade) {
      const newId = grades.length > 0 ? grades[grades.length - 1].id + 1 : 1;
      setGrades((prevGrades) => [...prevGrades, { id: newId, ...newGrade }]);
      setNewGrade({ student: "", subject: "", grade: "" }); // No 'id' here
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="p-6 w-full">
        <h1 className="text-2xl font-bold mb-4">Grades Management</h1>
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Student</th>
              <th className="border p-2">Subject</th>
              <th className="border p-2">Grade</th>
            </tr>
          </thead>
          <tbody>
            {grades.map((grade) => (
              <tr key={grade.id} className="text-center">
                <td className="border p-2">{grade.student}</td>
                <td className="border p-2">{grade.subject}</td>
                <td className="border p-2">{grade.grade}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">Add New Grade</h2>
          <input
            type="text"
            name="student"
            placeholder="Student Name"
            value={newGrade.student}
            onChange={handleChange}
            className="border p-2 mr-2"
          />
          <input
            type="text"
            name="subject"
            placeholder="Subject"
            value={newGrade.subject}
            onChange={handleChange}
            className="border p-2 mr-2"
          />
          <input
            type="text"
            name="grade"
            placeholder="Grade"
            value={newGrade.grade}
            onChange={handleChange}
            className="border p-2 mr-2"
          />
          <button onClick={handleAddGrade} className="bg-blue-500 text-white p-2 rounded">Add</button>
        </div>
      </div>
    </div>
  );
};

export default Grades;
