"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image"; // 🖼 Import Image from next/image

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Email and password are required.");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost/Student_Management_main1/backend/db_connection.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();

      if (data.status === "success") {
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("userId", data.user.id.toString());

        if (data.role === "admin") {
          router.push("/ADashboard");
        } else if (data.role === "superadmin") {
          router.push("/Enrollees");
        } else if (data.role === "parent") {
          router.push("/My_Profile");
        }
      } else {
        alert(data.message || "Login failed. Please check your credentials.");
      }
    } catch (error: any) {
      if (error instanceof TypeError) {
        alert("Network error: Unable to reach server. Is it running?");
      } else {
        alert("An unexpected error occurred: " + error.message);
      }
    }
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
      {/* Fog Layer */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-md z-0" />

      {/* Logo at Top-Left */}
      <div className="absolute top-4 left-4 z-50">
        <Image
          src="/logo.jpg"
          alt="logo"
          width={100}
          height={100}
          className="rounded-full"
        />
      </div>

      {/* Back Button at Top-Right */}
      <a
        href="/"
        className="absolute top-4 right-4 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg shadow-md hover:bg-blue-700 transition duration-300 z-50"
      >
        Back
      </a>

      {/* Login Form */}
      <div className="flex flex-col items-center w-full max-w-lg px-8 py-12 bg-white/30 backdrop-blur-md rounded-lg shadow-lg relative z-10">
        <h1 className="text-3xl font-extrabold text-white mb-8 text-center">
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-2 p-3 w-full border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-2 p-3 w-full border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 pr-16"
                placeholder="Enter your password"
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
            className="w-full py-3 px-6 mt-6 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition duration-300 transform hover:scale-105"
          >
            Login
          </button>
        </form>

        <hr className="w-full my-6 border-t border-gray-300" />

        <Link href="/Pre_Enrollment" passHref>
          <button className="w-full py-3 px-6 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition duration-300 transform hover:scale-105">
            Register
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Login;
