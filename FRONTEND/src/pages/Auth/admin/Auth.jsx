import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

function AdminLanding() {
  const navigate = useNavigate();

  const handleSignUp = (type) => {
    if (type === "signin") {
      navigate("/admin/login");
    } else if (type === "signup") {
      navigate("/admin/register");
    }
  };

  return (
    <div className="p-4 h-dvh flex flex-col bg-white gap-2">
      <img 
        src="/logo.png" 
        alt="PayCollect logo" 
        className="mx-auto w-44 h-auto"
      />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col flex-1 gap-2"
      >
          <div className="flex-col justify-start gap-2 flex flex-1 text-center">
        
        <h2 className="text-2xl font-bold text-gray-800">Welcome to PayCollect</h2>
        <p className="text-gray-800">
          Join thousands of members in building financial security together
          through cooperatives, thrifts, and associations.
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <button
          onClick={() => handleSignUp("signup")}
          className="bg-blue-500 text-white w-full p-2 rounded"
        >
          Register Organisation
        </button>
        <button
          onClick={() => handleSignUp("signin")}
          className="bg-gray-200 text-gray-900 w-full p-2 rounded"
        >
          Sign In
        </button>
        </div>
        </motion.div>
      
    </div>
  );
}

export default AdminLanding;