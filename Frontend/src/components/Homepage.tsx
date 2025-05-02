"use client"

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const Homepage = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const toggleModal = () => setIsModalOpen(!isModalOpen);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Logging in with:', { email, password });
    };

    const handleCreateAccount = (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        console.log("Creating account with:", {
            email,
            password,
            confirmPassword,
            otp
        });

        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setOtp('');
        setShowCreateModal(false);
    };

    const handleSendOtp = () => {
        if (!email) {
            alert("Please enter your email first.");
            return;
        }

        // You can replace this alert with an actual API call
        alert(`OTP sent to ${email}`);
    };

    return (
        <div
            className="relative flex justify-center items-center min-h-screen bg-blue-200"
            style={{
                backgroundImage: "url('/mahabangparang.jpg')",
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
        >
            <div className="absolute inset-0 bg-black/40 backdrop-blur-md z-0" />

            <div className="absolute top-4 left-4 z-50 cursor-pointer" onClick={toggleModal}>
                <Image
                    src="/logo.jpg"
                    alt="logo"
                    width={100}
                    height={100}
                    className="rounded-full"
                />
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
                            <button
                                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300"
                                onClick={toggleModal}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showCreateModal && (
                <div className="absolute inset-0 flex justify-center items-center bg-black/50 z-50">
                    <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
                        <h2 className="text-2xl font-bold text-blue-600 mb-4 text-center">Create Account</h2>
                        <form onSubmit={handleCreateAccount} className="space-y-4">
                            <div>
                                <label className="block text-gray-700 mb-1">Email:</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full border p-2 rounded"
                                    required
                                    placeholder="Enter your Email"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 mb-1">Password:</label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full border p-2 rounded"
                                    required
                                    placeholder="Enter your password"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 mb-1">Confirm Password:</label>
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full border p-2 rounded"
                                    required
                                    placeholder="Re-enter your password"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 mb-1">OTP:</label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        className="w-full border p-2 rounded"
                                        required
                                        placeholder="Enter OTP"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleSendOtp}
                                        className="bg-blue-600 text-white px-3 rounded hover:bg-blue-800"
                                    >
                                        Send OTP
                                    </button>
                                </div>
                            </div>

                            <div className="flex justify-between mt-6">
                                <button
                                    type="button"
                                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700"
                                    onClick={() => setShowCreateModal(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-800"
                                >
                                    Submit
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="flex flex-col lg:flex-row items-center w-full max-w-7xl px-6 py-8 gap-8 lg:gap-16 relative z-10">
                <div className="w-full lg:w-1/2 mb-8 lg:mb-0 relative">
                    <Image
                        src="/cd.svg"
                        alt="cd"
                        layout="responsive"
                        width={500}
                        height={300}
                        className="rounded-lg object-cover"
                    />
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
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full border p-2 rounded"
                                required
                                placeholder="Enter your Email"
                            />
                        </div>

                        <div className="relative">
                            <label className="block text-gray-700 mb-1">Password:</label>
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
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
