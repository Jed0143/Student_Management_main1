"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation"; // Import useRouter
import StudentSidebar from "@/components/studentsidebar";

const PreEnrollment = () => {
  const [formData, setFormData] = useState({
    name: "",
    Gender: "",
    birthday: "",
    age: "",
    registered: "",
    address: "",
    firstLanguage: "",
    secondLanguage: "",
    guardian: "",
    guardianContact: "",
    guardianRelationship: "",
    motherName: "",
    motherAddress: "",
    motherWork: "",
    motherContact: "",
    fatherName: "",
    fatherAddress: "",
    fatherWork: "",
    fatherContact: "",
    emergencyName: "",
    emergencyContact: "",
    emergencyWork: "",
    date: new Date().toISOString().split("T")[0],
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [slotsRemaining, setSlotsRemaining] = useState<number | null>(null);
  const isFormDisabled = slotsRemaining !== null && slotsRemaining <= 0;
  const router = useRouter(); // Initialize useRouter
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
  
    if (type === "file") {
      const file = (e.target as HTMLInputElement).files?.[0] || null;
      setFormData((prevData) => ({ ...prevData, [name]: file }));
    } else {
      let newValue = value;
  
      if (name === "childName") {
        // Only letters and spaces
        newValue = value.replace(/[^A-Za-z\s]/g, '');
      }
  
      if (name === "address") {
        // Allow letters, numbers, spaces
        newValue = value.replace(/[^A-Za-z0-9\s]/g, '');
      }

      if (name === "firstLanguage") {
        // Only letters and spaces
        newValue = value.replace(/[^A-Za-z\s]/g, '');
      }

      if (name === "secondLanguage") {
        // Only letters and spaces
        newValue = value.replace(/[^A-Za-z\s]/g, '');
      }

      if (name === "motherName") {
        // Only letters and spaces
        newValue = value.replace(/[^A-Za-z\s]/g, '');
      }

      if (name === "motherAddress") {
        // Allow letters, numbers, spaces
        newValue = value.replace(/[^A-Za-z0-9\s]/g, '');
      }

      if (name === "motherContact") {
        // Only digits
        newValue = value.replace(/\D/g, '');
  
        // Limit to 11 digits
        if (newValue.length > 11) {
          newValue = newValue.slice(0, 11);
        }
  
        // Force "09" at the start
        if (!newValue.startsWith('09')) {
          newValue = '09';
        }
      }

      if (name === "motherWork") {
        // Only letters and spaces
        newValue = value.replace(/[^A-Za-z\s]/g, '');
      }

      if (name === "fatherName") {
        // Only letters and spaces
        newValue = value.replace(/[^A-Za-z\s]/g, '');
      }

      if (name === "fatherAddress") {
        // Allow letters, numbers, spaces
        newValue = value.replace(/[^A-Za-z0-9\s]/g, '');
      }

      if (name === "fatherContact") {
        // Only digits
        newValue = value.replace(/\D/g, '');
  
        // Limit to 11 digits
        if (newValue.length > 11) {
          newValue = newValue.slice(0, 11);
        }
  
        // Force "09" at the start
        if (!newValue.startsWith('09')) {
          newValue = '09';
        }
      }

      if (name === "fatherWork") {
        // Only letters and spaces
        newValue = value.replace(/[^A-Za-z\s]/g, '');
      }
  
      setFormData((prevData) => ({ ...prevData, [name]: newValue }));
    }
  
    if (name === "birthday") {
      calculateAge(value);
    }
  };  
  

  const fillGuardianFromFather = () => {
    setFormData((prevData) => ({
      ...prevData,
      guardian: prevData.fatherName,
      guardianContact: prevData.fatherContact,
    }));
  };

  const fillGuardianFromMother = () => {
    setFormData((prevData) => ({
      ...prevData,
      guardian: prevData.motherName,
      guardianContact: prevData.motherContact,
    }));
  };

  const fillEmergencyFromFather = () => {
    setFormData((prevData) => ({
      ...prevData,
      emergencyName: prevData.fatherName,
      emergencyContact: prevData.fatherContact,
      emergencyWork: prevData.fatherWork,
    }));
  };

  const fillEmergencyFromMother = () => {
    setFormData((prevData) => ({
      ...prevData,
      emergencyName: prevData.motherName,
      emergencyContact: prevData.motherContact,
      emergencyWork: prevData.motherWork,
    }));
  };

  const calculateAge = (birthday: string) => {
    if (!birthday) return;
    const birthDate = new Date(birthday);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    setFormData((prevData) => ({ ...prevData, age: age.toString() }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  
    // ✅ Do validation BEFORE building FormData
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match.");
      return;
    }
  
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      alert("Please enter a valid email.");
      return;
    }
  
    if (formData.password.length < 6) {
      alert("Password should be at least 6 characters.");
      return;
    }
  
    const formDataToSend = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      // Ensure the value is not null or undefined before appending
      if (value !== null && value !== undefined) {
        formDataToSend.append(key, value as Blob | string);
      }
    });
  
    try {
      const response = await fetch("http://localhost/Student_Management_main1/backend/save_enrollment.php", {
        method: "POST",
        body: formDataToSend,
      });
  
      const text = await response.text(); // Get raw text response
      console.log("Raw response:", text);
  
      try {
        const data = JSON.parse(text);
        console.log("Server JSON:", data);
  
        if (data.status === "success") {
          alert("Enrollment saved successfully!");
          router.push("/"); // Redirect to homepage
        } else {
          alert("Error: " + data.message);
        }
      } catch (error) {
        console.error("Raw response (not JSON):", text);
        alert("Server returned an invalid response.");
      }
    } catch (err) {
      alert("Submission failed.");
    }
  };  

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-br from-blue-600 to-blue-900">
      <StudentSidebar children={undefined} />
      <div className="w-full max-w-4xl px-8 py-10 bg-white rounded-lg shadow-2xl relative">
        <h1 className="text-4xl font-extrabold text-blue-900 mb-8 text-center">REGISTRATION FORM FOR PARENT</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block font-semibold">Name of Child</label>
            <input
              type="text"
              name="name"
              placeholder="First Name, Middle Name, Last Name(ex: Juan Santos Cruz)"
              className="w-full p-2 border rounded"
              value={formData.name}
              onChange={handleChange}
              required
              disabled={isFormDisabled}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block font-semibold">Gender</label>
              <select
                name="Gender"
                className="w-full p-2 border rounded"
                value={formData.Gender}
                onChange={handleChange}
                required
                disabled={isFormDisabled}
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold">Birthday</label>
              <input
                type="date"
                name="birthday"
                className="w-full p-2 border rounded"
                value={formData.birthday}
                onChange={handleChange}
                required
                disabled={isFormDisabled}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block font-semibold">Age</label>
              <input
                type="text"
                name="age"
                className="w-full p-2 border rounded bg-gray-100"
                value={formData.age}
                readOnly
              />
            </div>

            <div>
              <label className="block font-semibold">Address</label>
              <input
                type="text"
                name="address"
                placeholder="Enter Address"
                className="w-full p-2 border rounded"
                value={formData.address}
                onChange={handleChange}
                required
                disabled={isFormDisabled}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block font-semibold">First Language</label>
              <input
                type="text"
                name="firstLanguage"
                placeholder="Enter First Languange"
                className="w-full p-2 border rounded"
                value={formData.firstLanguage}
                onChange={handleChange}
                required
                disabled={isFormDisabled}
              />
            </div>
            <div>
              <label className="block font-semibold">Second Language</label>
              <input
                type="text"
                name="secondLanguage"
                placeholder="Enter Second Languange"
                className="w-full p-2 border rounded"
                value={formData.secondLanguage}
                onChange={handleChange}
                required
                disabled={isFormDisabled}
              />
            </div>
          </div>

          <div className="text-xl font-extrabold text-black-500">MOTHER:</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
            <label className="block font-semibold">Name of Mother</label>
            <input
              type="text"
              name="motherName"
              className="w-full p-2 border rounded"
              placeholder="First Name, Middle Name, Last Name(ex: Michelle Santos Cruz)"
              value={formData.motherName}
              onChange={handleChange}
              required
              disabled={isFormDisabled}
            />
              </div>
              <div>
              <label className="block font-semibold">Address</label>
            <input
              type="text"
              name="motherAddress"
              className="w-full p-2 border rounded"
              placeholder="Enter Address"
              value={formData.motherAddress}
              onChange={handleChange}
              required
              disabled={isFormDisabled}
            />
            </div>
            <div>
            <label className="block font-semibold">Mother Contact</label>
            <input
              type="text"
              name="motherContact"
              className="w-full p-2 border rounded"
              placeholder="ex: 09*********"
              value={formData.motherContact}
              onChange={handleChange}
              required
              disabled={isFormDisabled}
            />
            </div>
            <div>
            <label className="block font-semibold">Work</label>
            <input
              type="text"
              name="motherWork"
              className="w-full p-2 border rounded"
              placeholder="Work"
              value={formData.motherWork}
              onChange={handleChange}
              required
              disabled={isFormDisabled}
            />
            </div>
          </div>

          <div className="text-xl font-extrabold text-black-500">FATHER:</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
            <label className="block font-semibold">Name of Father</label>
            <input
              type="text"
              name="fatherName"
              className="w-full p-2 border rounded"
              placeholder="First Name, Middle Name, Last Name(ex: Miguel Santos Cruz)"
              value={formData.fatherName}
              onChange={handleChange}
              required
              disabled={isFormDisabled}
            />
            </div>
            <div>
            <label className="block font-semibold">Address</label>
            <input
              type="text"
              name="fatherAddress"
              className="w-full p-2 border rounded"
              placeholder="Enter Address"
              value={formData.fatherAddress}
              onChange={handleChange}
              required
              disabled={isFormDisabled}
            />
            </div>
            <div>
            <label className="block font-semibold">Father Contact</label>
            <input
              type="text"
              name="fatherContact"
              className="w-full p-2 border rounded"
              placeholder="ex: 09*********"
              value={formData.fatherContact}
              onChange={handleChange}
              required
              disabled={isFormDisabled}
            />
            </div>
            <div>
            <label className="block font-semibold">Work</label>
            <input
              type="text"
              name="fatherWork"
              className="w-full p-2 border rounded"
              placeholder="Work"
              value={formData.fatherWork}
              onChange={handleChange}
              required
              disabled={isFormDisabled}
            />
            </div>
          </div>

          <div className="text-xl font-extrabold text-black-500">GUARDIAN:</div>
          <div className="flex space-x-4">
            <button
              type="button"
              className="px-4 py-2 bg-gray-600 text-white rounded-lg"
              onClick={fillGuardianFromFather}
              disabled={isFormDisabled}
            >
              Same as Father
            </button>
            <button
              type="button"
              className="px-4 py-2 bg-gray-600 text-white rounded-lg"
              onClick={fillGuardianFromMother}
              disabled={isFormDisabled}
            >
              Same as Mother
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input
              type="text"
              name="guardian"
              className="w-full p-2 border rounded"
              placeholder="Guardian Name"
              value={formData.guardian}
              onChange={handleChange}
              required
              disabled={isFormDisabled}
            />
            <input
              type="text"
              name="guardianContact"
              className="w-full p-2 border rounded"
              placeholder="ex: 09*********"
              value={formData.guardianContact}
              onChange={handleChange}
              required
              disabled={isFormDisabled}
            />
            <input
              type="text"
              name="guardianRelationship"
              className="w-full p-2 border rounded"
              placeholder="Relationship to Student (e.g., Aunt, Uncle, Grandparent)"
              value={formData.guardianRelationship}
              onChange={handleChange}
              required
              disabled={isFormDisabled}
            />

          </div>

          <div className="text-xl font-extrabold text-black-500">IN CASE OF EMERGENCY:</div>
          <div className="flex space-x-4">
            <button
              type="button"
              className="px-4 py-2 bg-gray-600 text-white rounded-lg"
              onClick={fillEmergencyFromFather}
              disabled={isFormDisabled}
            >
              Same as Father
            </button>
            <button
              type="button"
              className="px-4 py-2 bg-gray-600 text-white rounded-lg"
              onClick={fillEmergencyFromMother}
              disabled={isFormDisabled}
            >
              Same as Mother
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input
              type="text"
              name="emergencyName"
              className="w-full p-2 border rounded"
              placeholder="Emergency Contact Name"
              value={formData.emergencyName}
              onChange={handleChange}
              required
              disabled={isFormDisabled}
            />
            <input
              type="text"
              name="emergencyContact"
              placeholder="ex: 09*********"
              className="w-full p-2 border rounded"
              value={formData.emergencyContact}
              onChange={handleChange}
              required
              disabled={isFormDisabled}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input
              type="date"
              name="date"
              className="w-full p-2 border rounded bg-gray-100"
              value={formData.date}
              readOnly
            />
            </div>

          <div className="text-center mt-8">
            <button
              type="submit"
              className="px-6 py-3 bg-blue-700 hover:bg-blue-900 text-white font-bold rounded-lg transition"
              disabled={isFormDisabled}
            >
              {isFormDisabled ? "No Slots Available" : "Submit Registration"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PreEnrollment;