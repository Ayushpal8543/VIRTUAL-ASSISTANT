import React, { useState, useRef, useContext } from "react";
import Card from "../components/Card";
import image1 from "../assets/image1.jpg";
import image2 from "../assets/image2.png";
import image3 from "../assets/image3.png";
import image4 from "../assets/image4.png";
import image5 from "../assets/image5.png";
import image6 from "../assets/image6.jpg";
import { LuImagePlus } from "react-icons/lu";
import { userDataContext } from "../context/userContext";
import { useNavigate } from "react-router-dom";
import { IoMdArrowBack } from "react-icons/io";
import ParticleBackground from "../components/ParticleBackground";

function Customize() {
  const {
    serverUrl,
    userData,
    setUserData,
    backendImage,
    setBackendImage,
    frontendImage,
    setFrontendImage,
    selectedImage,
    setSelectedImage,
  } = useContext(userDataContext);

  const navigate = useNavigate();
  const inputImage = useRef(); // ← closing parenthesis fix

  const handleImage = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBackendImage(file);
    setFrontendImage(URL.createObjectURL(file));
  };

  return (
    <div
      className="w-full min-h-screen bg-gradient-to-t from-black to-[#030353]
      flex flex-col items-center px-4 py-6 relative overflow-hidden"
    >
      <ParticleBackground /> {/* ← closing slash fix */}
      <IoMdArrowBack
        className="absolute top-[30px] left-[30px] text-white cursor-pointer w-[25px] h-[25px] z-10"
        onClick={() => navigate("/")}
      />

      <div className="text-center mb-10 relative z-10">
        <h1 className="text-white text-2xl sm:text-3xl md:text-4xl font-semibold">
          Select your{" "}
          <span className="text-blue-400">Assistant Image</span>
        </h1> 
        <p className="text-gray-300 text-sm sm:text-base mt-2">
          Choose a personality for your AI assistant
        </p>
      </div> 

      <div
        className="w-full max-w-7xl flex flex-wrap
        justify-center gap-5 relative z-10"
      >
        <Card image={image1} />
        <Card image={image2} />
        <Card image={image3} />
        <Card image={image4} />
        <Card image={image5} />
        <Card image={image6} /> 

        <div
          className={`w-[120px] sm:w-[140px] md:w-[150px] aspect-[3/4] bg-[#020220]
            border-2 border-[#1b2cff] rounded-2xl cursor-pointer hover:border-white transition-all duration-300 flex
            items-center justify-center ${
              selectedImage === "input"
                ? "border-4 border-white shadow-2xl shadow-blue-500"
                : null
            }`}
          onClick={() => {
            inputImage.current.click();
            setSelectedImage("input");
          }}
        >
          {!frontendImage && <LuImagePlus className="text-white text-3xl" />}
          {frontendImage && (
            <img src={frontendImage} className="h-full object-cover" />
          )}
        </div>

        <input
          type="file"
          accept="image/*"
          ref={inputImage}
          hidden
          onChange={handleImage}
        />
      </div>

      {selectedImage && (
        <button
          className="mt-10 px-10 py-3 bg-white text-black font-semibold cursor-pointer
          rounded-full hover:scale-105 transition-all duration-300 relative z-10"
          onClick={() => navigate("/customize2")}
        >
          Next
        </button>
      )}
    </div>
  );
}

export default Customize;

