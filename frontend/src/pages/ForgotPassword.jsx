import { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { userDataContext } from "../context/userContext";

function ForgotPassword() {
  const { serverUrl } = useContext(userDataContext);
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // 1: email, 2: otp, 3: new password
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSendOTP = async () => {
    if (!email) return setError("Please enter your email");
    setError("");
    setLoading(true);
    try {
      await axios.post(`${serverUrl}/api/auth/forgot-password`, { email });
      setSuccess("OTP sent to your email!");
      setStep(2);
    } catch (err) {
      setError(err?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };
  const handleVerifyOTP = async () => {
    if (!otp) return setError("Please enter OTP");
    setError("");
    setLoading(true);
    try {
      await axios.post(`${serverUrl}/api/auth/verify-forgot-otp`, { email, otp });
      setSuccess("OTP verified!");
      setStep(3);
    } catch (err) {
      setError(err?.response?.data?.message || "Invalid or expired OTP");
    } finally {
      setLoading(false);
    }
  };

  
  const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword) return setError("Please fill all fields");
    if (newPassword !== confirmPassword) return setError("Passwords do not match");
    if (newPassword.length < 6) return setError("Password must be at least 6 characters");
    setError("");
    setLoading(true);
    try {
      await axios.post(`${serverUrl}/api/auth/reset-password`, { email, newPassword });
      setSuccess("Password reset successfully!");
      setTimeout(() => navigate("/signin"), 2000);
    } catch (err) {
      setError(err?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-t from-black to-[#030353] flex items-center justify-center px-4">
      <div className="bg-[#020220] border border-[#1b2cff] rounded-2xl p-8 w-full max-w-md">

        {/* Header */}
        <h1 className="text-white text-2xl font-semibold text-center mb-2">
          Forgot <span className="text-blue-400">Password</span>
        </h1>

        {/* Step indicator */}
        <div className="flex justify-center gap-2 mb-6">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`w-8 h-1 rounded-full transition-all duration-300 ${
                step >= s ? "bg-blue-500" : "bg-gray-600"
              }`}
            />
          ))}
        </div>

        
        {error && (
          <p className="text-red-400 text-sm text-center mb-4">{error}</p>
        )}
        {success && (
          <p className="text-green-400 text-sm text-center mb-4">{success}</p>
        )}
        {step === 1 && (
          <div className="flex flex-col gap-4">
            <p className="text-gray-300 text-sm text-center">
              Enter your registered email to receive an OTP
            </p>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-[#0a0a3a] border border-[#1b2cff] text-white outline-none focus:border-white transition-all"
            />
            <button
              onClick={handleSendOTP}
              disabled={loading}
              className="w-full py-3 bg-white text-black font-semibold rounded-full hover:scale-105 transition-all duration-300 disabled:opacity-50"
            >
              {loading ? "Sending..." : "Send OTP"}
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-col gap-4">
            <p className="text-gray-300 text-sm text-center">
              OTP sent to <span className="text-blue-400">{email}</span>
            </p>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              maxLength={6}
              className="w-full px-4 py-3 rounded-xl bg-[#0a0a3a] border border-[#1b2cff] text-white outline-none focus:border-white transition-all text-center text-xl tracking-widest"
            />
            <button
              onClick={handleVerifyOTP}
              disabled={loading}
              className="w-full py-3 bg-white text-black font-semibold rounded-full hover:scale-105 transition-all duration-300 disabled:opacity-50"
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
            <button
              onClick={() => { setStep(1); setError(""); setSuccess(""); }}
              className="text-gray-400 text-sm text-center hover:text-white transition-all"
            >
              ← Back
            </button>
          </div>
        )}

        {/* Step 3 — New Password */}
        {step === 3 && (
          <div className="flex flex-col gap-4">
            <p className="text-gray-300 text-sm text-center">
              Set your new password
            </p>
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-[#0a0a3a] border border-[#1b2cff] text-white outline-none focus:border-white transition-all"
            />
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-[#0a0a3a] border border-[#1b2cff] text-white outline-none focus:border-white transition-all"
            />
            <button
              onClick={handleResetPassword}
              disabled={loading}
              className="w-full py-3 bg-white text-black font-semibold rounded-full hover:scale-105 transition-all duration-300 disabled:opacity-50"
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </div>
        )}

        {step === 1 && (
          <p className="text-gray-400 text-sm text-center mt-6">
            Remember your password?{" "}
            <span
              onClick={() => navigate("/signin")}
              className="text-blue-400 cursor-pointer hover:underline"
            >
              Sign In
            </span>
          </p>
        )}
      </div>
    </div>
  );
}

export default ForgotPassword;
