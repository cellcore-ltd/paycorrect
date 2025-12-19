import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { faRocket } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import AdminNavbar from "../../../components/adminNavbar";
import FloatingActionMenu from "../../../components/FloatingActionMenu";
import { apiFetch } from "../../../modules/API";

function CoorpAdminDashboard({ members, agents }) {
  const { userType, category } = useParams();
  const navigate = useNavigate();
  const type = userType;
  const currentCategory = category;

  const [userData, setUserData] = useState({
    organisationID: "",
    userID: "",
    organisationName: "Demo Organisation",
    activeMembers: 0,
    agents: 0,
    pendingInvites: 0,
    totalCollections: 0,
  });

  const effRan = useRef(false);

  useEffect( () => {
    if(!effRan.current){
      const data = async() => {
        const response = await apiFetch({
        url : "users/profile",
        isAuth:true,
      })
    }

    data();

    effRan.current = true;
    }
  }, []);

  const activeMembers = members.filter((m) => m.status === "Active").length;
  const pendingInvites = members.filter((m) => m.status === "Invited").length;

  const handleNavigation = (link) => {
    navigate(`/${currentCategory}/${type}/${link}`, { state: { view: "invite" } });
  };

  const dashboadData = [
    { label: "Active Members", value: activeMembers },
    { label: "Agents", value: agents.length },
    { label: "Pending Invites", value: pendingInvites },
    {
      label: "Total Collections",
      value: members.reduce((sum, m) => sum + (m.balance || 0), 0),
    },
  ];

  return (
    <div className="flex flex-col gap-4 items-center justify-center min-h-screen bg-gray-50 pt-4">
      <img src="/logo.png" alt="PayCollect logo" className="w-44 h-auto" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col w-full text-gray-800 flex-1 gap-4 px-4"
      >
        <div className="bg-blue-500 p-4 w-full flex flex-col gap-1 text-white">
          <h1 className="text-xl font-semibold">Good Morning</h1>
          <p>{userData.organisationName}</p>
        </div>

        <div className="grid px-4 z-10 -mt-7 grid-cols-2 gap-3">
          {dashboadData.map((item) => (
            <div
              key={item.label}
              className="bg-white p-4 rounded shadow flex flex-col items-center"
            >
              <h2 className="text-2xl text-blue-500 font-bold">
                {item.label === "Total Collections" ? "₦" : ""}
                {item.value}
              </h2>
              <p className="text-sm text-gray-600">{item.label}</p>
            </div>
          ))}
        </div>

        <div className="w-full flex flex-col gap-2 rounded-md p-3 border bg-blue-50 border-blue-200 text-blue-800">
          <div className="flex gap-2 items-center">
            <FontAwesomeIcon icon={faRocket} aria-hidden="true" />
            <h3 className="font-semibold">Getting Started</h3>
          </div>
          <p>Complete these steps to set up your organization</p>
          <ol className="list-decimal list-inside">
            <li>Add agents to help manage members</li>
            <li>Invite members to join your organisation</li>
            <li>Set up contribution schedules</li>
          </ol>
        </div>
      </motion.div>

      {/* Floating action menu */}
      <FloatingActionMenu onSelect={handleNavigation} />

      <AdminNavbar page="dashboard" />
    </div>
  );
}

export default CoorpAdminDashboard;
