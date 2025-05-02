"use client";

import React from "react";
import StudentSidebar from "@/components/studentsidebar";

const AboutUs: React.FC = () => {
  return (
    <StudentSidebar>
      <div className="flex flex-col items-center bg-blue-900 min-h-screen px-4 py-8">
        <div className="flex flex-col items-center w-full max-w-4xl px-8 py-12 rounded-lg">
          <h1 className="text-3xl font-extrabold text-white mb-8 text-center">
            About Us
          </h1>

          <p className="text-white mb-4 text-lg text-center">
            Welcome to{" "}
            <span className="font-semibold text-blue-300">MPCDAR</span> (Mahabang Parang Child Development Center in Angono Rizal), a nurturing and engaging
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
        </div>

        <div className="text-center mt-10 text-sm text-white opacity-80">
          <p>123 Learning Lane, Angono, Rizal</p>
          <p>Email: info@mpcar.edu.ph</p>
          <p>Contact: (0912) 345-6789</p>
        </div>
      </div>
    </StudentSidebar>
  );
};

export default AboutUs;
