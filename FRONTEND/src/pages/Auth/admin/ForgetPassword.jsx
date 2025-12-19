import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { apiFetch } from "../../../modules/API";

export default function ADMINForgotPassword() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    // TODO: JOBA add hook API here
    apiFetch({
      url: "forgot-password",
      method: "POST",
      body: { email : email},
      isAuth: false
    })
    console.log("Password reset request:", email);
  };

  return (
    <div className="flex flex-col h-dvh max-h-dvh p-4 gap-4">
      {/* Logo/Header */}
      <img
        src="/logo.png"
        alt="PayCollect logo"
        className="mx-auto w-36 h-auto"
      />

      {/* Form section */}
      <div className="flex-1 gap-2 flex-col flex">
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="flex flex-1 flex-col gap-2"
        >
          <div className="flex flex-col gap-2 flex-1">
            <p className="text-gray-600">
                Enter your email address and we’ll send you a link to reset your password.
            </p>
            <label htmlFor="email" className="block text-sm font-medium text-gray-600">
                Email Address
            </label>
            <input
             id="email"
             type="email"
             name="email"
             value={email}
             onChange={(e) => setEmail(e.target.value)}
             required
             className="border p-2 rounded w-full"
             placeholder="Enter your admin email"
            />
          </div>

          <button
            type="submit"
            disabled={!email}
            className={`w-full rounded bg-blue-500 p-2 font-semibold text-white
                ${!email ? "opacity-50" : ""}`}
          >
            Send Reset Link
          </button>
          <button
            onClick={() => navigate("/admin/login")}
            className="px-4 py-2 w-full bg-gray-200 text-gray-900 rounded"
        >
            Back to Login
        </button>
        </motion.form>
        
      </div>
    </div>
  );
}
