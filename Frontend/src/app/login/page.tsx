"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation"; // Import for navigation
import Link from "next/link";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleLogin = async (e: { preventDefault: () => void }) => {
    e.preventDefault(); // Prevent default form submission

    const response = await fetch("http://localhost/Student_Management_main1/backend/login.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        email: email,
        password: password,
      }),
    });

    const data = await response.json();

    if (data.status === "success") {
      if (data.role === "admin") {
        router.push("/Enrollees"); // Redirect to admin dashboard
      } else if (data.role === "parent") {
        router.push("/studentdashboard"); // Redirect to parent dashboard
      }
    } else {
      alert(data.message); // Show error message
    }
  };

  // This will handle Enter key press to trigger login
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleLogin(e as any); // Trigger the login on Enter key press
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-blue-900">
      <a
        href="/"
        className="absolute top-4 right-4 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg shadow-md hover:bg-blue-700 transition duration-300 ease-in-out"
      >
        Back
      </a>

      <div className="flex flex-col items-center w-full max-w-lg px-8 py-12 bg-white rounded-lg shadow-lg">
        <h1 className="text-3xl font-extrabold text-blue-900 mb-8 text-center">
          Login Your Account
        </h1>

        <form onSubmit={handleLogin} className="w-full space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-lg font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-2 p-3 w-full border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
              onKeyDown={handleKeyDown} // Trigger login on Enter press
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-lg font-medium text-gray-700"
            >
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-2 p-3 w-full border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 pr-16"
                placeholder="Enter your password"
                onKeyDown={handleKeyDown} // Trigger login on Enter press
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-2 flex items-center px-3 text-sm text-blue-600 hover:text-blue-800 focus:outline-none"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 px-6 mt-6 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition duration-300 ease-in-out transform hover:scale-105"
          >
            Login
          </button>
        </form>

        {/* Divider */}
        <hr className="w-full my-6 border-t border-gray-300" />

        {/* Register Button */}
        <Link href="/pre_enrollment" passHref>
          <button className="w-full py-3 px-40 mt-6 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition duration-300 ease-in-out transform hover:scale-105">
            Register
          </button>
        </Link>
      </div>
    </div>
  );
};

export default AdminLogin;
