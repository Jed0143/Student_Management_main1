"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation"; // Import useRouter

const PreEnrollment = () => {
  const [formData, setFormData] = useState({
    childName: "",
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


  useEffect(() => {
    const fetchSlots = async () => {
      try {
        const res = await fetch("http://localhost/Student_Management_main1/backend/get_enrollment_count.php");
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
        const data = await res.json();
        setSlotsRemaining(typeof data.slots_remaining === "number" ? data.slots_remaining : null);
      } catch (err) {
        console.error("Failed to fetch slot count:", err);
        setSlotsRemaining(null);
      }
    };
    fetchSlots();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;

    if (type === "file") {
      const file = (e.target as HTMLInputElement).files?.[0] || null;
      setFormData((prevData) => ({ ...prevData, [name]: file }));
    } else {
      setFormData((prevData) => ({ ...prevData, [name]: value }));
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
      if (value !== null) {
        formDataToSend.append(key, value as unknown as Blob);
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
      <div className="w-full max-w-4xl px-8 py-10 bg-white rounded-lg shadow-2xl relative">
        <Link href="/" className="absolute top-4 left-4 px-4 py-2 bg-blue-600 text-white rounded-lg">
          Back
        </Link>
        <h1 className="text-4xl font-extrabold text-blue-900 mb-8 text-center">REGISTRATION FORM</h1>

        {slotsRemaining !== null && (
          slotsRemaining <= 0 ? (
            <p className="text-red-500 font-semibold">Enrollment is full. Please try again later.</p>
          ) : (
            <p className="text-green-500 font-semibold">Slots remaining: {slotsRemaining}</p>
          )
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block font-semibold">Name of Child</label>
            <input
              type="text"
              name="childName"
              className="w-full p-2 border rounded"
              value={formData.childName}
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
                className="w-full p-2 border rounded"
                value={formData.secondLanguage}
                onChange={handleChange}
                required
                disabled={isFormDisabled}
              />
            </div>
          </div>

          <div className="text-xl font-extrabold text-red-500">MOTHER:</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input
              type="text"
              name="motherName"
              className="w-full p-2 border rounded"
              placeholder="Name"
              value={formData.motherName}
              onChange={handleChange}
              required
              disabled={isFormDisabled}
            />
            <input
              type="text"
              name="motherAddress"
              className="w-full p-2 border rounded"
              placeholder="Address"
              value={formData.motherAddress}
              onChange={handleChange}
              required
              disabled={isFormDisabled}
            />
            <input
              type="text"
              name="motherContact"
              className="w-full p-2 border rounded"
              placeholder="Contact"
              value={formData.motherContact}
              onChange={handleChange}
              required
              disabled={isFormDisabled}
            />
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

          <div className="text-xl font-extrabold text-red-500">FATHER:</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input
              type="text"
              name="fatherName"
              className="w-full p-2 border rounded"
              placeholder="Name"
              value={formData.fatherName}
              onChange={handleChange}
              required
              disabled={isFormDisabled}
            />
            <input
              type="text"
              name="fatherAddress"
              className="w-full p-2 border rounded"
              placeholder="Address"
              value={formData.fatherAddress}
              onChange={handleChange}
              required
              disabled={isFormDisabled}
            />
            <input
              type="text"
              name="fatherContact"
              className="w-full p-2 border rounded"
              placeholder="Contact"
              value={formData.fatherContact}
              onChange={handleChange}
              required
              disabled={isFormDisabled}
            />
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

          <div className="text-xl font-extrabold text-red-500">GUARDIAN:</div>
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
              placeholder="Guardian Contact"
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

          <div className="text-xl font-extrabold text-red-500">IN CASE OF EMERGENCY:</div>
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
              className="w-full p-2 border rounded"
              placeholder="Emergency Contact Number"
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
            <input
              type="email"
              name="email"
              className="w-full p-2 border rounded"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Email"
              disabled={isFormDisabled}
            />
          </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Password */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                className="w-full p-2 border rounded pr-10"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
                disabled={isFormDisabled}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-sm text-blue-600"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>

            {/* Confirm Password */}
            <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              className="w-full p-2 border rounded pr-10"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              disabled={isFormDisabled}
            />
            </div>
          </div>


          <div className="flex justify-center">
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg"
              disabled={isFormDisabled}
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PreEnrollment;
