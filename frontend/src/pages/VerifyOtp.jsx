import React, { useState } from "react";
import bg from "../assets/authBg.png";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { userDataContext } from "../context/userContext";

function VerifyOtp() {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email;

  const { serverUrl } = useContext(userDataContext);

  const handleVerify = async (e) => {
    e.preventDefault();

    setErr("");
    setLoading(true);

    try {
      const result = await axios.post(
        `${serverUrl}/api/auth/verify-otp`,
        {
          email,
          otp,
        }
      );

      setLoading(false);

      alert(result.data.message);

      navigate("/signin");
    } catch (error) {
      setLoading(false);

      setErr(
        error?.response?.data?.message ||
          "OTP verification failed"
      );
    }
  };

  return (
    <div
      className="w-full h-screen bg-cover flex justify-center items-center"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <form
        onSubmit={handleVerify}
        className="w-[90%] max-w-[500px] h-[450px] bg-[#00000069] backdrop-blur shadow-lg shadow-blue-500 flex flex-col items-center justify-center gap-6 px-6"
      >
        <h1 className="text-white text-3xl font-semibold">
          Verify Your
          <span className="text-blue-400"> Email</span>
        </h1>

        <p className="text-gray-300 text-center">
          OTP sent to
          <br />
          <span className="text-blue-400">
            {email}
          </span>
        </p>

        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          required
          className="w-full h-[60px] outline-none border-2 border-white bg-transparent text-white placeholder-gray-300 px-5 rounded-full text-lg"
        />

        {err && (
          <p className="text-red-500 text-[16px]">
            *{err}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="min-w-[150px] h-[60px] bg-white text-black font-semibold rounded-full text-lg"
        >
          {loading ? "Verifying..." : "Verify OTP"}
        </button>

        <p
          onClick={() => navigate("/signup")}
          className="text-white cursor-pointer"
        >
          Back to Sign Up
        </p>
      </form>
    </div>
  );
}

export default VerifyOtp;