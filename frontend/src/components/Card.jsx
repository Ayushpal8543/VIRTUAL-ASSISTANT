 import React from "react";
 import { useContext } from "react";
 import { userDataContext } from "../context/userContext";
 function Card({ image }) {
   const {
     serverUrl,
     userData,
    setUserData,backendImage,setBackendImage,
    frontendImage,setFrontendImage,
     selectedImage,
     setSelectedImage,
   } = useContext(userDataContext);
   return (
     <div
  className={`
    w-[140px]
    h-[220px]
    bg-[#020220]
    rounded-2xl
    overflow-hidden
    cursor-pointer
    transition-all
    duration-300
    border

    ${
      selectedImage === image
        ? "border-4 border-white shadow-2xl shadow-blue-500"
        : "border-[#1b2cff] hover:border-white hover:shadow-2xl hover:shadow-blue-500"
    }
  `}
  onClick={() => {setSelectedImage(image);
    setBackendImage(null);
    setFrontendImage(null);
  }}
>
  <img
    src={image}
    alt="card"
    className="w-full h-full object-cover"
  />
</div>
   );
 }
 export default Card