"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const Homepage = () => {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Login states
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Create Account states
  const [createEmail, setCreateEmail] = useState("");
  const [createPassword, setCreatePassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [showPrivacyMessage, setShowPrivacyMessage] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [lastName, setLastName] = useState('');
  const [contactNo, setContactNo] = useState("");
  const [streetName, setStreetName] = useState('');
  const [barangay, setBarangay] = useState('');
  const [city, setCity] = useState('');
  const [province, setProvince] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [birthdate, setBirthdate] = useState('');


  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const toggleConfirmPasswordVisibility = () => {
  setShowConfirmPassword(!showConfirmPassword);
};

  const toggleModal = () => setIsModalOpen(!isModalOpen);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!loginEmail || !loginPassword) {
      alert("Email and password are required.");
      return;
    }

    try {
      const res = await fetch("http://localhost/Student_Management_main1/backend/login.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });

      if (!res.ok) {
        alert(`Login failed. Server responded with status: ${res.status}`);
        return;
      }

      const data = await res.json();
      console.log("Login response:", data);

      if (data.status === "success") {
        const { role, id } = data;
        const userEmail = data.email || loginEmail;

        localStorage.setItem("userId", id);
        localStorage.setItem("userEmail", userEmail);

        if (role === "super_admin") {
          router.push(`/Enrollees?id=${id}`);
        } else if (role === "admin") {
          router.push(`/Students_List?id=${id}`);
        } else if (role === "parent") {
          router.push(`/Pre_Enrollment?id=${id}`);
        } else {
          alert("Unknown role.");
        }
      } else {
        alert(data.message || "Login failed.");
      }
    } catch (error: any) {
      alert("Error: " + error.message);
    }
  };

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();

    const passwordRegex = /^[A-Za-z0-9]{8,}$/;

    if (!passwordRegex.test(createPassword)) {
      alert("Password must be at least 8 characters long and contain only letters and numbers.");
      return;
    }

    if (createPassword !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    if (!agreed) {
      alert("Please agree to the terms and conditions.");
      return;
    }

    try {
      const res = await fetch("http://localhost/Student_Management_main1/backend/create_account.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
        email: createEmail,
        password: createPassword,
        firstName,
        middleName,
        lastName,
        contactNo,
        streetName,
        barangay,
        city,
        province,
        postalCode,
        birthdate
      }),

      });

      if (!res.ok) {
        alert(`Account creation failed. Server responded with status: ${res.status}`);
        return;
      }

      const clone = res.clone();

      let data;
      try {
        data = await res.json();
      } catch (jsonErr) {
        const text = await clone.text();
        console.error("Invalid JSON response:", text);
        alert("Server returned invalid response. Check console for details.");
        return;
      }

      if (data.status === "success") {
        alert("Account created successfully!");
        setCreateEmail("");
        setCreatePassword("");
        setConfirmPassword("");
        setAgreed(false);
        setShowCreateModal(false);
      } else {
        alert(data.message || "Account creation failed.");
      }
    } catch (err) {
      console.error("Network or server error:", err);
      alert("Failed to connect to the server.");
    }
  };

  const closeModal = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setShowCreateModal(false);
    }
  };

  const handlePrivacyPolicyClick = () => {
    setShowPrivacyMessage(true);
  };

  return (
    <div
      className="relative flex justify-center items-center min-h-screen bg-blue-200"
      style={{
        backgroundImage: "url('/mahabangparang.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-md z-0" />

      <div className="absolute top-4 left-4 z-50 cursor-pointer" onClick={toggleModal}>
        <Image src="/logo.jpg" alt="logo" width={100} height={100} className="rounded-full" />
      </div>

      {isModalOpen && (
        <div className="absolute inset-0 flex justify-center items-center bg-black/50 z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full text-center">
            <h2 className="text-2xl font-bold text-blue-600 mb-4">About Us</h2>
            <p className="text-lg text-blue-900 mb-4">
              Welcome to MPCDAR (Mahabang Parang Child Development Center in Angono Rizal), a nurturing and engaging educational environment for young learners.
              <br />
              At MPCAR, we are committed to fostering a safe, inclusive, and stimulating space where every child can grow academically, socially, and emotionally.
            </p>
            <div className="text-blue-900">
              <p>123 Learning Lane, Angono, Rizal</p>
              <p>Email: info@mpcar.edu.ph</p>
              <p>Contact: (0912) 345-6789</p>
            </div>
            <div className="mt-6 flex justify-end">
              <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300" onClick={toggleModal}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

{showCreateModal && (
  <div
    className="fixed inset-0 flex justify-center items-center bg-black/50 z-50 overflow-auto"
    onClick={closeModal}
  >
    <div
      className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl mx-4 my-8 max-h-[90vh] overflow-y-auto"
      onClick={(e) => e.stopPropagation()}
    >
      <h2 className="text-2xl font-bold text-blue-600 mb-4 text-center">Create Account</h2>
      <form onSubmit={handleCreateAccount} className="space-y-4">
        {/* Name Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-gray-700 mb-1">First Name:</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full border p-2 rounded"
              required
              placeholder="Enter your first name"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Middle Name:</label>
            <input
              type="text"
              value={middleName}
              onChange={(e) => setMiddleName(e.target.value)}
              className="w-full border p-2 rounded"
              required
              placeholder="Enter your middle name"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Last Name:</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full border p-2 rounded"
              required
              placeholder="Enter your last name"
            />
          </div>
        </div>

        {/* Birthdate */}
        <div>
          <label className="block text-gray-700 mb-1">Birthdate:</label>
          <input
            type="date"
            value={birthdate}
            onChange={(e) => setBirthdate(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />

        </div>
        {/* Contact */}
        <div>
          <label className="block text-gray-700 mb-1">Contact No.:</label>
          <input
            type="tel"
            value={contactNo}
            onChange={(e) => setContactNo(e.target.value)}
            className="w-full border p-2 rounded"
            required
            placeholder="Enter your contact number"
          />
        </div>

        {/* Address Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 mb-1">Street Name:</label>
            <input
              type="text"
              value={streetName}
              onChange={(e) => setStreetName(e.target.value)}
              className="w-full border p-2 rounded"
              required
              placeholder="Enter your street name"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Barangay:</label>
            <input
              type="text"
              value={barangay}
              onChange={(e) => setBarangay(e.target.value)}
              className="w-full border p-2 rounded"
              required
              placeholder="Enter your barangay"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">City / Municipality:</label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full border p-2 rounded"
              required
              placeholder="Enter your city or municipality"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Province:</label>
            <input
              type="text"
              value={province}
              onChange={(e) => setProvince(e.target.value)}
              className="w-full border p-2 rounded"
              required
              placeholder="Enter your province"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Postal / ZIP Code:</label>
            <input
              type="text"
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
              className="w-full border p-2 rounded"
              required
              placeholder="Enter your ZIP code"
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="block text-gray-700 mb-1">Email:</label>
          <input
            type="email"
            value={createEmail}
            onChange={(e) => setCreateEmail(e.target.value)}
            className="w-full border p-2 rounded"
            required
            placeholder="Enter your Email"
          />
        </div>

        {/* Password */}
        <div className="relative">
          <label className="block text-gray-700 mb-1">Password:</label>
          <div className="relative flex items-center">
            <input
              type={passwordVisible ? 'text' : 'password'}
              value={createPassword}
              onChange={(e) => setCreatePassword(e.target.value)}
              className="w-full border p-2 rounded pr-12"
              required
              placeholder="Enter your password"
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-2 top-2 text-blue-600"
            >
              {passwordVisible ? 'Hide' : 'Show'}
            </button>
          </div>
        </div>

        {/* Confirm Password */}
        <div className="relative">
          <label className="block text-gray-700 mb-1">Confirm Password:</label>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full border p-2 rounded pr-16"
              required
              placeholder="Re-enter your password"
            />
            <button
              type="button"
              onClick={toggleConfirmPasswordVisibility}
              className="absolute right-2 top-2 text-blue-600"
            >
              {showConfirmPassword ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        {/* Divider */}
        <hr className="my-4 border-t-2 border-blue-800" />

        {/* Privacy Policy Agreement */}
        <div className="flex items-start space-x-2">
          <input
            type="checkbox"
            checked={agreed}
            onChange={() => setAgreed(!agreed)}
            className="mt-1"
            disabled={!showPrivacyMessage}
          />
          <label className="text-sm text-gray-700">
            By signing up, you confirm that you have read, understood, and agree to our{" "}
            <button
              type="button"
              className="text-blue-600 underline"
              onClick={handlePrivacyPolicyClick}
            >
              Privacy Policy
            </button>
          </label>
        </div>

        {showPrivacyMessage && (
          <p className="text-sm text-gray-700 mt-2">
            You acknowledge and consent to the collection, use, and processing of your personal data
            in accordance with the Data Protection Act (DPA) and any other applicable data
            protection regulations. Your data will be used solely for purposes related to your
            account.
          </p>
        )}

        {/* Submit Button */}
        <div className="flex justify-between mt-6">
          <div className="ml-auto">
            <button
              type="submit"
              className={`px-4 py-2 rounded text-white ${
                agreed ? "bg-green-600 hover:bg-green-800" : "bg-blue-600"
              }`}
            >
              Submit
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
)}


      <div className="flex flex-col lg:flex-row items-center w-full max-w-7xl px-6 py-8 gap-8 lg:gap-16 relative z-10">
        <div className="w-full lg:w-1/2 mb-8 lg:mb-0 relative">
          <Image src="/cd.svg" alt="cd" layout="responsive" width={500} height={300} className="rounded-lg object-cover" />
        </div>

        <div className="w-full lg:w-1/2 p-6 bg-blue-100/30 backdrop-blur-md rounded-lg shadow-lg flex flex-col items-center">
          <h2 className="text-white text-3xl font-bold text-center mb-5">Welcome to the M.P.C.D.C.A.R. Student Management System</h2>
          <p className="text-white mb-10 text-center">Mahabang Parang Child Development Center Angono, Rizal</p>
          <h1 className="text-white text-3xl font-bold text-center mb-5">Login your Account</h1>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-1">Email:</label>
              <input
                type="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className="w-full border p-2 rounded"
                required
                placeholder="Enter your Email"
              />
            </div>

            <div className="relative">
              <label className="block text-gray-700 mb-1">Password:</label>
              <input
                type={showPassword ? "text" : "password"}
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="w-full border p-2 rounded pr-12"
                required
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-9 text-blue-600 hover:underline"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>

            <button type="submit" className="w-full bg-blue-700 text-white py-2 rounded hover:bg-gray-800">
              LOGIN
            </button>

            <p className="text-blue-900 text-center">or</p>

            <div className="flex justify-between mt-4">
              <button
                type="button"
                onClick={() => setShowCreateModal(true)}
                className="w-full bg-green-700 text-white py-2 rounded hover:bg-gray-800"
              >
                Create Account
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Homepage;
