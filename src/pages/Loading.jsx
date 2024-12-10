import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Loading = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/login");
    }, 5000); // 5 seconds

    return () => clearTimeout(timer); // Cleanup timer
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-600 to-blue-500">
      <div className="text-center animate-fade-in">
        {/* Logo Section */}
        <div className="flex items-center justify-center mb-6">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg">
            <span className="text-2xl font-bold text-purple-600">AW</span>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-4xl font-extrabold text-white mb-4">
          Arcane Web
        </h1>

        {/* Loading Text */}
        <p className="text-white text-lg mb-6">
          Loading your chat experience...
        </p>

        {/* Subtle Animation */}
        <div className="relative w-16 h-16 mx-auto">
          <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin absolute"></div>
          <div className="w-10 h-10 border-4 border-blue-200 border-t-transparent rounded-full animate-spin-slower absolute"></div>
        </div>
      </div>
    </div>
  );
};

export default Loading;
