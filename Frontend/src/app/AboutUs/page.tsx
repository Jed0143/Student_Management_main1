"use client";

import React from "react";
import Link from "next/link";

const AboutUs: React.FC = () => {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-blue-900 relative px-4">
      {/* Back button */}
      <a
        href="/"
        className="absolute top-4 right-4 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg shadow-md hover:bg-blue-700 transition duration-300 ease-in-out"
      >
        Back
      </a>

      {/* Content box */}
      <div className="flex flex-col items-center w-full max-w-4xl px-8 py-12 rounded-lg">
        <h1 className="text-3xl font-extrabold text-white mb-8 text-center">
          About Us
        </h1>

        <p className="text-white mb-4 text-lg text-center">
          Welcome to{" "}
          <span className="font-semibold text-blue-300">MPCAR</span> (My
          Precious Child Academy of Rodriguez), a nurturing and engaging
          educational environment for young learners.
        </p>

        <p className="text-white mb-4 text-lg text-center">
          At MPCAR, we are committed to fostering a safe, inclusive, and
          stimulating space where every child can grow academically, socially,
          and emotionally. Our mission is to provide quality education tailored
          to the needs of each learner while promoting values of respect,
          curiosity, and lifelong learning.
        </p>

        <p className="text-white mb-4 text-lg text-center">
          We believe in the power of collaboration between parents, teachers,
          and the community. Together, we aim to help every child unlock their
          full potential.
        </p>

        <div className="mt-6 w-full">
          <h2 className="text-xl font-semibold text-blue-300 mb-2">Our Vision</h2>
          <p className="text-white text-lg">
            To become a leading early education institution known for excellence,
            innovation, and holistic development.
          </p>
        </div>

        <div className="mt-4 w-full">
          <h2 className="text-xl font-semibold text-blue-300 mb-2">Our Mission</h2>
          <p className="text-white text-lg">
            To educate and empower young minds through love, creativity, and
            knowledge.
          </p>
        </div>
      </div>

      {/* Contact Info */}
      <div className="text-center mt-10 text-sm text-white opacity-80">
        <p>123 Learning Lane, Rodriguez, Rizal</p>
        <p>Email: info@mpcar.edu.ph</p>
        <p>Contact: (0912) 345-6789</p>
      </div>
    </div>
  );
};

export default AboutUs;
