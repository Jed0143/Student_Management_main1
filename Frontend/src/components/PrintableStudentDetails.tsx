import React, { forwardRef } from "react";

const PrintableStudentDetails = forwardRef(({ studentDetails }: any, ref: any) => {
  if (!studentDetails) return null;

  return (
    <div ref={ref} className="space-y-6 p-4">
      {/* Child Information */}
      <h2 className="text-2xl font-bold mb-2">Child Information</h2>
      <p><strong>Name:</strong> {studentDetails.child_name}</p>
      <p><strong>Gender:</strong> {studentDetails.Gender}</p>
      <p><strong>Birthdate:</strong> {studentDetails.birthday}</p>
      <p><strong>Age:</strong> {studentDetails.age}</p>
      <p><strong>Address:</strong> {studentDetails.address}</p>
      <p><strong>First Language:</strong> {studentDetails.first_language}</p>
      <p><strong>Second Language:</strong> {studentDetails.second_language}</p>

      {/* Guardian Information */}
      <h2 className="text-2xl font-bold mb-2">Guardian Information</h2>
      <p><strong>Name:</strong> {studentDetails.guardian}</p>
      <p><strong>Contact Number:</strong> {studentDetails.guardian_contact}</p>

      {/* Mother's Information */}
      <h2 className="text-2xl font-bold mb-2">Mother's Information</h2>
      <p><strong>Name:</strong> {studentDetails.mother_name}</p>
      <p><strong>Address:</strong> {studentDetails.mother_address}</p>
      <p><strong>Occupation:</strong> {studentDetails.mother_work}</p>
      <p><strong>Contact:</strong> {studentDetails.mother_contact}</p>

      {/* Father's Information */}
      <h2 className="text-2xl font-bold mb-2">Father's Information</h2>
      <p><strong>Name:</strong> {studentDetails.father_name}</p>
      <p><strong>Address:</strong> {studentDetails.father_address}</p>
      <p><strong>Occupation:</strong> {studentDetails.father_work}</p>
      <p><strong>Contact:</strong> {studentDetails.father_contact}</p>

      {/* Emergency Contact */}
      <h2 className="text-2xl font-bold mb-2">Emergency Contact</h2>
      <p><strong>Name:</strong> {studentDetails.emergency_name}</p>
      <p><strong>Contact Number:</strong> {studentDetails.emergency_contact}</p>

      {/* Submission Record */}
      <h2 className="text-2xl font-bold mb-2">Submission Record</h2>
      <p><strong>Email Address:</strong> {studentDetails.email}</p>
      <p><strong>Date Submitted:</strong> {studentDetails.date}</p>
    </div>
  );
});

export default PrintableStudentDetails;
