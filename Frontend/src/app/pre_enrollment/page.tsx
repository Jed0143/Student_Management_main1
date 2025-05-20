"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation"; // Import useRouter
import StudentSidebar from "@/components/studentsidebar";



const PreEnrollment = () => {
  const [formData, setFormData] = useState({
    first_name: '',
    middle_name: '',
    last_name: '',
    gender: "",
    birthday: "",
    age: "",
    registered: "",
    street: '',
    barangay: '',
    city: '',
    province: '',
    postal: '',
    firstLanguage: "",
    secondLanguage: "",
    guardianFirstName: '',
    guardianMiddleName: '',
    guardianLastName: '',
    guardianContact: "",
    guardianRelationship: "",
    motherFirstName: "",
    motherMiddleName: "",
    motherLastName: "",
    motherStreet: "",
    motherBarangay: "",
    motherCity: "",
    motherProvince: "",
    motherZip: "",
    motherWork: "",
    motherContact: "",
    fatherFirstName: "",
    fatherMiddleName: "",
    fatherLastName: "",
    fatherStreet: '',
    fatherBarangay: '',
    fatherCity: '',
    fatherProvince: '',
    fatherZip: '',
    fatherWork: "",
    fatherContact: "",
    emergencyFirstName: '',
    emergencyMiddleName: '',
    emergencyLastName: '',
    emergencyContact: "",
    emergencyWork: "",
    date: new Date().toISOString().split("T")[0],
    email: "",
  });

  const [slotsRemaining, setSlotsRemaining] = useState<number | null>(null);
  const isFormDisabled = slotsRemaining !== null && slotsRemaining <= 0;
  const router = useRouter(); // Initialize useRouter
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isCustomRelationship, setIsCustomRelationship] = useState(false);

useEffect(() => {
    const storedEmail = localStorage.getItem("userEmail");
    if (storedEmail) {
      setFormData((prevData) => ({
        ...prevData,
        email: storedEmail,
      }));
    }
  }, []);

  const relationshipOptions = [
  "Mother", "Father", "Aunt", "Uncle", "Grandparent", "Sibling", "Other"
];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
  
    if (type === "file") {
      const file = (e.target as HTMLInputElement).files?.[0] || null;
      setFormData((prevData) => ({ ...prevData, [name]: file }));
    } else {
      let newValue = value;
  
      if (
        name === "first_name" ||
        name === "middle_name" ||
        name === "last_name"
      ) {
        newValue = value.replace(/[^A-Za-z\s]/g, '');
      }
  
      if (["street", "barangay", "city", "province"].includes(name)) {
        // Allow letters, numbers, and spaces only
        newValue = value.replace(/[^A-Za-z0-9\s]/g, '');
      }

      if (name === "postal") {
        // Allow numbers only for ZIP/Postal Code
        newValue = value.replace(/[^0-9]/g, '');
      }


      if (name === "firstLanguage") {
        // Only letters and spaces
        newValue = value.replace(/[^A-Za-z\s]/g, '');
      }

      if (name === "secondLanguage") {
        // Only letters and spaces
        newValue = value.replace(/[^A-Za-z\s]/g, '');
      }

      if (
        name === "motherFirstName" ||
        name === "motherMiddleName" ||
        name === "motherLastName"
      ) {
        // Allow only letters and spaces for all three name parts
        newValue = value.replace(/[^A-Za-z\s]/g, '');
      }

      if (
        name === "motherStreet" ||
        name === "motherBarangay" ||
        name === "motherCity" ||
        name === "motherProvince"
      ) {
        // Allow letters, numbers, and spaces only
        newValue = value.replace(/[^A-Za-z0-9\s]/g, '');
      }

      if (name === "motherZip") {
        // Allow numbers only for ZIP Code
        newValue = value.replace(/[^0-9]/g, '');
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

      if (
        name === "fatherFirstName" ||
        name === "fatherMiddleName" ||
        name === "fatherLastName"
      ) {
        // Allow only letters and spaces for all three name parts
        newValue = value.replace(/[^A-Za-z\s]/g, '');
      }
      if (
        name === "fatherStreet" ||
        name === "fatherBarangay" ||
        name === "fatherCity" ||
        name === "fatherProvince"
      ) {
        // Allow letters, numbers, spaces
        newValue = value.replace(/[^A-Za-z0-9\s]/g, '');
      }

      // Allow only numbers for ZIP code
      if (name === "fatherZip") {
        newValue = value.replace(/[^0-9]/g, '');
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

      if (
        name === "guardianFirstName" ||
        name === "guardianMiddleName" ||
        name === "guardianLastName"
      ) {
        // Allow only letters and spaces for all three name parts
        newValue = value.replace(/[^A-Za-z\s]/g, '');
      }

      if (
        name === "emergencyFirstName" ||
        name === "emergencyMiddleName" ||
        name === "emergencyLastName"
      ) {
        newValue = value.replace(/[^A-Za-z\s]/g, '');
      }
  
      setFormData((prevData) => ({ ...prevData, [name]: newValue }));
    }
  
    if (name === "birthday") {
      calculateAge(value);
    }
  };  

      const fillAddressMother = () => {
    setFormData((prevData) => ({
      ...prevData,
    motherStreet: prevData.street,
    motherBarangay: prevData.barangay,
    motherCity: prevData.city,
    motherProvince: prevData.province,
    motherZip: prevData.postal,
    }));
  };

    const fillAddressFather = () => {
    setFormData((prevData) => ({
      ...prevData,
    fatherStreet: prevData.street,
    fatherBarangay: prevData.barangay,
    fatherCity: prevData.city,
    fatherProvince: prevData.province,
    fatherZip: prevData.postal,
    }));
  };
  

  const fillGuardianFromFather = () => {
    setFormData((prevData) => ({
      ...prevData,
    guardianFirstName: prevData.fatherFirstName,
    guardianMiddleName: prevData.fatherMiddleName,
    guardianLastName: prevData.fatherLastName,
    guardianContact: prevData.fatherContact,
    }));
  };

const fillGuardianFromMother = () => {
  setFormData((prevData) => ({
    ...prevData,
    guardianFirstName: prevData.motherFirstName,
    guardianMiddleName: prevData.motherMiddleName,
    guardianLastName: prevData.motherLastName,
    guardianContact: prevData.motherContact,
  }));
};

  const fillEmergencyFromFather = () => {
    setFormData((prevData) => ({
      ...prevData,
    emergencyFirstName: prevData.fatherFirstName,
    emergencyMiddleName: prevData.fatherMiddleName,
    emergencyLastName: prevData.fatherLastName,
    guardianContact: prevData.fatherContact,
    }));
  };

const fillEmergencyFromMother = () => {
  setFormData((prevData) => ({
    ...prevData,
    emergencyFirstName: prevData.motherFirstName,
    emergencyMiddleName: prevData.motherMiddleName,
    emergencyLastName: prevData.motherLastName,
    emergencyContact: prevData.motherContact,
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

    // Make sure all required fields are filled
    if (
      !formData.first_name ||
      !formData.middle_name ||
      !formData.last_name ||
      !formData.gender ||
      !formData.birthday ||
      !formData.age ||
      !formData.street ||
      !formData.barangay ||
      !formData.city ||
      !formData.province ||
      !formData.postal
    ) {
      alert("Please fill out all required fields.");
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
          window.location.reload();
          router.push("/Pre_Enrollment"); // Redirect to homepage
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
      <StudentSidebar>{null}</StudentSidebar>
      <div className="w-full max-w-4xl px-8 py-10 bg-white rounded-lg shadow-2xl relative">
        <h1 className="text-4xl font-extrabold text-blue-900 mb-8 text-center">REGISTRATION FORM FOR PARENT</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block font-semibold">First Name</label>
            <input
              type="text"
              name="first_name"
              placeholder="Enter your First Name"
              className="w-full p-2 border rounded"
              value={formData.first_name}
              onChange={handleChange}
              required
              disabled={isFormDisabled}
            />
          </div>

            <div>
              <label className="block font-semibold">Middle Name</label>
              <input
                type="text"
                name="middle_name"
                placeholder="Enter your Middle Name"
                className="w-full p-2 border rounded"
                value={formData.middle_name}
                onChange={handleChange}
                disabled={isFormDisabled}
              />
            </div>

              <div>
                <label className="block font-semibold">Last Name</label>
                <input
                  type="text"
                  name="last_name"
                  placeholder="Enter your Last Name"
                  className="w-full p-2 border rounded"
                  value={formData.last_name}
                  onChange={handleChange}
                  required
                  disabled={isFormDisabled}
                />
              </div>
            </div>


          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block font-semibold">Gender</label>
              <select
                name="gender"
                className="w-full p-2 border rounded"
                value={formData.gender}
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
            </div>

            <div>
              <label className="block font-semibold">Address</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="street"
                  placeholder="Street Name"
                  className="w-full p-2 border rounded"
                  value={formData.street}
                  onChange={handleChange}
                  required
                  disabled={isFormDisabled}
                />
                <input
                  type="text"
                  name="barangay"
                  placeholder="Barangay"
                  className="w-full p-2 border rounded"
                  value={formData.barangay}
                  onChange={handleChange}
                  required
                  disabled={isFormDisabled}
                />
                <input
                  type="text"
                  name="city"
                  placeholder="City / Municipality"
                  className="w-full p-2 border rounded"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  disabled={isFormDisabled}
                />
                <input
                  type="text"
                  name="province"
                  placeholder="Province"
                  className="w-full p-2 border rounded"
                  value={formData.province}
                  onChange={handleChange}
                  required
                  disabled={isFormDisabled}
                />
                <input
                  type="text"
                  name="postal"
                  placeholder="Postal / ZIP Code"
                  className="w-full p-2 border rounded"
                  value={formData.postal}
                  onChange={handleChange}
                  required
                  disabled={isFormDisabled}
                />
              </div>
            </div>
          </div>

          <div className="text-xl font-extrabold text-black-500">MOTHER:</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block font-semibold mb-1">First Name</label>
            <input
              type="text"
              name="motherFirstName"
              className="w-full p-2 border rounded mb-2"
              placeholder="Enter your First Name"
              value={formData.motherFirstName}
              onChange={handleChange}
              required
              disabled={isFormDisabled}
            />
            <label className="block font-semibold mb-1">Middle Name</label>
            <input
              type="text"
              name="motherMiddleName"
              className="w-full p-2 border rounded mb-2"
              placeholder="Enter your Middle Name"
              value={formData.motherMiddleName}
              onChange={handleChange}
              disabled={isFormDisabled}
            />
            <label className="block font-semibold mb-1">Last Name</label>
            <input
              type="text"
              name="motherLastName"
              className="w-full p-2 border rounded"
              placeholder="Enter your Last Name"
              value={formData.motherLastName}
              onChange={handleChange}
              required
              disabled={isFormDisabled}
            />
          </div>

          
            <div>
            <button
              type="button"
              className="px-4 py-2 bg-gray-600 text-white rounded-lg"
              onClick={fillAddressMother}
              disabled={isFormDisabled}
            >
              Same Address
            </button>
              <label className="block font-semibold mb-1">Address</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="motherStreet"
                  className="w-full p-2 border rounded"
                  placeholder="Street Name"
                  value={formData.motherStreet}
                  onChange={handleChange}
                  required
                  disabled={isFormDisabled}
                />

                <input
                  type="text"
                  name="motherBarangay"
                  className="w-full p-2 border rounded"
                  placeholder="Barangay"
                  value={formData.motherBarangay}
                  onChange={handleChange}
                  required
                  disabled={isFormDisabled}
                />

                <input
                  type="text"
                  name="motherCity"
                  className="w-full p-2 border rounded"
                  placeholder="City / Municipality"
                  value={formData.motherCity}
                  onChange={handleChange}
                  required
                  disabled={isFormDisabled}
                />

                <input
                  type="text"
                  name="motherProvince"
                  className="w-full p-2 border rounded"
                  placeholder="Province"
                  value={formData.motherProvince}
                  onChange={handleChange}
                  required
                  disabled={isFormDisabled}
                />

                <input
                  type="text"
                  name="motherZip"
                  className="w-full p-2 border rounded"
                  placeholder="Postal / ZIP Code"
                  value={formData.motherZip}
                  onChange={handleChange}
                  required
                  disabled={isFormDisabled}
                />
              </div>
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
            <div>
            <label className="block font-semibold">Work</label>
            <input
              type="text"
              name="motherWork"
              className="w-full p-2 border rounded"
              placeholder="Enter Mother Work"
              value={formData.motherWork}
              onChange={handleChange}
              required
              disabled={isFormDisabled}
            />
            </div>

            </div>
          </div>
          <div className="text-xl font-extrabold text-black-500">FATHER:</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block font-semibold mb-1">First Name</label>
            <input
              type="text"
              name="fatherFirstName"
              className="w-full p-2 border rounded mb-2"
              placeholder="Enter your First Name"
              value={formData.fatherFirstName}
              onChange={handleChange}
              required
              disabled={isFormDisabled}
            />
            <label className="block font-semibold mb-1">Middle Name</label>
            <input
              type="text"
              name="fatherMiddleName"
              className="w-full p-2 border rounded mb-2"
              placeholder="Enter your Middle Name"
              value={formData.fatherMiddleName}
              onChange={handleChange}
              disabled={isFormDisabled}
            />
            <label className="block font-semibold mb-1">Last Name</label>
            <input
              type="text"
              name="fatherLastName"
              className="w-full p-2 border rounded"
              placeholder="Enter your Last Name"
              value={formData.fatherLastName}
              onChange={handleChange}
              required
              disabled={isFormDisabled}
            />
          </div>
            <div>
            <button
              type="button"
              className="px-4 py-2 bg-gray-600 text-white rounded-lg"
              onClick={fillAddressFather}
              disabled={isFormDisabled}
            >
              Same Address
            </button>
            <label className="block font-semibold mb-2">Address</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                name="fatherStreet"
                className="w-full p-2 border rounded"
                placeholder="Street Name"
                value={formData.fatherStreet}
                onChange={handleChange}
                required
                disabled={isFormDisabled}
              />
              <input
                type="text"
                name="fatherBarangay"
                className="w-full p-2 border rounded"
                placeholder="Barangay"
                value={formData.fatherBarangay}
                onChange={handleChange}
                required
                disabled={isFormDisabled}
              />
              <input
                type="text"
                name="fatherCity"
                className="w-full p-2 border rounded"
                placeholder="City / Municipality"
                value={formData.fatherCity}
                onChange={handleChange}
                required
                disabled={isFormDisabled}
              />
              <input
                type="text"
                name="fatherProvince"
                className="w-full p-2 border rounded"
                placeholder="Province"
                value={formData.fatherProvince}
                onChange={handleChange}
                required
                disabled={isFormDisabled}
              />
              <input
                type="text"
                name="fatherZip"
                className="w-full p-2 border rounded"
                placeholder="Postal / ZIP Code"
                value={formData.fatherZip}
                onChange={handleChange}
                required
                disabled={isFormDisabled}
              />
            </div>
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
            <div>
            <label className="block font-semibold">Work</label>
            <input
              type="text"
              name="fatherWork"
              className="w-full p-2 border rounded"
              placeholder="Enter Father Work"
              value={formData.fatherWork}
              onChange={handleChange}
              required
              disabled={isFormDisabled}
            />
            </div>
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
          <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                type="text"
                name="guardianFirstName"
                className="w-full p-2 border rounded"
                placeholder="First Name"
                value={formData.guardianFirstName}
                onChange={handleChange}
                required
                disabled={isFormDisabled}
              />
              <input
                type="text"
                name="guardianMiddleName"
                className="w-full p-2 border rounded"
                placeholder="Middle Name"
                value={formData.guardianMiddleName}
                onChange={handleChange}
                required
                disabled={isFormDisabled}
              />
              <input
                type="text"
                name="guardianLastName"
                className="w-full p-2 border rounded"
                placeholder="Last Name"
                value={formData.guardianLastName}
                onChange={handleChange}
                required
                disabled={isFormDisabled}
              />
            </div>

          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
            </div>
          <div className="mb-4">
            <label className="block font-semibold mb-1">Guardian Relationship</label>

            {isCustomRelationship ? (
              <input
                type="text"
                name="guardianRelationship"
                className="w-full p-2 border rounded"
                placeholder="Enter relationship (e.g., Cousin, Neighbor)"
                value={formData.guardianRelationship}
                onChange={handleChange}
                required
                disabled={isFormDisabled}
              />
            ) : (
              <select
                name="guardianRelationship"
                className="w-full p-2 border rounded"
                value={formData.guardianRelationship}
                onChange={handleChange}
                required
                disabled={isFormDisabled}
              >
                <option value="" disabled>Select relationship</option>
                {relationshipOptions.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            )}

            <button
              type="button"
              className="text-blue-500 text-sm mt-1 underline"
              onClick={() => setIsCustomRelationship(!isCustomRelationship)}
            >
              {isCustomRelationship ? "Choose from list" : "Enter custom relationship"}
            </button>
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
          <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                type="text"
                name="emergencyFirstName"
                className="w-full p-2 border rounded"
                placeholder="Emergency First Name"
                value={formData.emergencyFirstName}
                onChange={handleChange}
                required
                disabled={isFormDisabled}
              />
              <input
                type="text"
                name="emergencyMiddleName"
                className="w-full p-2 border rounded"
                placeholder="Emergency Middle Name"
                value={formData.emergencyMiddleName}
                onChange={handleChange}
                required
                disabled={isFormDisabled}
              />
              <input
                type="text"
                name="emergencyLastName"
                className="w-full p-2 border rounded"
                placeholder="Emergency Last Name"
                value={formData.emergencyLastName}
                onChange={handleChange}
                required
                disabled={isFormDisabled}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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