
import React, { useContext, useState } from 'react'
import { userDataContext } from '../context/userContext'
import axios from "axios";
import { IoMdArrowBack } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
import ParticleBackground from '../components/ParticleBackground'

function Customize2() {
    
      const {userData,backendImage,selectedImage,serverUrl,setUserData}=useContext(userDataContext)
      const [assistantName,setAssistantName]=useState(userData?.assistantName || "")
      const navigate=useNavigate()
      const [loading,setLoading]=useState(false)
      const handleUpdateAssistant=async () => {
        setLoading(true)
          try {
              let formData=new FormData()
              formData.append("assistantName",assistantName)
              if(backendImage){
                  formData.append("assistantImage",backendImage)
              }else{
                  formData.append("imageUrl",selectedImage)
              }
              const result=await axios.post(`${serverUrl}/api/user/update`,formData,{withCredentials:true})
              setLoading(false)
              console.log(result.data)
              setUserData(result.data)
              navigate("/")
          } catch (error) {
              setLoading(false)
              console.log(error);

          }
     }
   return (
     <div
   className="w-full min-h-screen bg-gradient-to-t from-black to-[#030353]
   flex flex-col items-center justify-center px-4 relative overflow-hidden"
 >
   <ParticleBackground />

   <IoMdArrowBack className='absolute top-[30px] left-[30px] text-white cursor-pointer w-[25px] h-[25px] z-10' onClick={()=>navigate("/customize")}/>
   <h1 className="text-white text-2xl sm:text-3xl md:text-4xl font-semibold text-center relative z-10">
     Enter Your
     <span className="text-blue-400"> Assistant Name</span>
   </h1>
   <input
     type="text"
     placeholder="eg. Nexora"
     className="
       w-full
       max-w-[600px]
       h-[60px]
       mt-8
       outline-none
       border-2
       border-white
       bg-transparent
       text-white
       placeholder-gray-300
       px-5
       rounded-full
       text-lg
       relative z-10
     "
     value={assistantName}
     onChange={(e) => setAssistantName(e.target.value)}
   />
   {assistantName && (
     <button
       className="
         mt-10
         px-10
         py-3
         bg-white
         text-black
         font-semibold
         rounded-full
         cursor-pointer
         hover:scale-105
         transition-all
         duration-300
         relative z-10
       " disabled={loading} onClick={()=>{
         handleUpdateAssistant();
       }}
     >
       {!loading?"Finally Create Your Assistant":"Loading..."}
     </button>
   )}
 </div>
   );
 

}

export default Customize2
