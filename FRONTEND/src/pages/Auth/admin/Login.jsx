import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { apiFetch } from "../../../modules/API";

export default function AdminLogin() {
  const [form, setForm] = useState({ email: "", password: "" });
  const { userType } = useParams();
  const type = userType || "admin";
  const navigate = useNavigate();
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Login attempt:", form);

    //API Integration for login
    const data = await apiFetch({
      url : "login",
      method : "POST",
      body : {
        email : form.email,
        password : form.password,
      },
      isAuth : false
    });

    if(data){
      localStorage.setItem("token", data.accessToken);
      navigate(`/coop/${type}/dashboard`);
    }
  
    // setTimeout(() =>{
    //     navigate(`/coop/${type}/dashboard`);
    // }, 2500);
  };

  const loginDisabled = !form.email || !form.password;

  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex flex-col h-dvh max-h-dvh p-4 gap-4">
      {/* Logo/Header */}
      <img
        src="/logo.png"
        alt="PayCollect logo"
        className="mx-auto w-36 h-auto"
      />

      {/* Form section */}
      <div className="flex-1 flex">
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col flex-1 gap-4 text-gray-600"
        >
          <div className="flex flex-col flex-1 gap-2">
            <label htmlFor="organisation">
              Email
            </label>
            <input
              id="email"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="border p-2 rounded w-full"
              placeholder="Enter email address"
            />
            <label htmlFor="password" className="text-gray-600">
              Password
            </label>
            <div className="relative">
                <input
                id="password"
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                className="border p-2 rounded w-full"
                placeholder="Enter password"
            />
                <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                aria-label={showPassword ? "Hide password" : "Show password"}
                >
                    <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                </button>
            </div>
            <Link
             to = {`/${type}/forgot-password`}
             className="hover:text-blue-600"
             >
              Forgot password?
            </Link>
          </div>
          
          <button
            type="submit"
            disabled={loginDisabled}
            className={`px-4 py-2 w-full bg-blue-500 text-white rounded
                ${loginDisabled ? "opacity-50" : ""}`}
          >
            Login
          </button>

          <div className="flex justify-between text-sm text-gray-500">
            
            <button
             onClick= {()=> navigate(`/${type}/register`)}
             className="px-4 py-2 w-full bg-gray-200 text-gray-900 rounded"
            >
              Create account
            </button>
          </div>
        </motion.form>
      </div>
    </div>
  );
}
