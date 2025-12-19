import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { apiFetch } from "../../../modules/API";

function AdminSplash() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({ organisationID: "", userID: "", category: "" });
  const [loading, setLoading] = useState(true);
  
  const fetchUser = useRef(false)

  //TODO: JOBA integrate API to fetch real user data
  // Fetch user data when component mounts
  useEffect(() => {
    if(!fetchUser.current){
      fetchUser.current = true

      const fetchUserData = async () => {
        const data = await apiFetch({
          url : 'users/profile',
        });

        if(data){
          setUserData({
            organisationID : data.user.institution_unique_id,
            userID : data.user.unique_id,
            // userData.category = data.user.unique_id,
          })
        }

        setLoading(false)
    }

    fetchUserData();
    };
  }, []);

  console.log(userData)

  // Navigate after a short delay when not loading
  const handleNavigation = () => {
    setLoading(true);
    setTimeout(() => {
      navigate("/coop/admin/dashboard");
    }, 3000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center text-gray-800 justify-center min-h-screen bg-gray-100 p-4"
    >
      <div className="flex flex-col text-center flex-1 gap-3">
        <img src="/logo.png" alt="Logo" className="w-36 mx-auto h-auto" />
        <h2 className="text-2xl font-bold">Welcome to PayCollect</h2>

        {loading ? (
          <p>Loading your organisation details...</p>
        ) : (
          <>
            <p>Your organisation has been successfully registered</p>
            <h3 className="text-lg font-semibold">
              Organisation ID: {userData.organisationID}
            </h3>
            <p>Save this ID for your records</p>
          </>
        )}
      </div>

      {!loading && (
        <button
          onClick={handleNavigation}
          className="bg-blue-500 text-white w-full px-4 py-2 rounded"
        >
          Go to Dashboard
        </button>
      )}
    </motion.div>
  );
}

export default AdminSplash;
