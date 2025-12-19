import { useLocation } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import AdminNavbar from "../../../../components/adminNavbar";
import UserInvite from "../../../../components/UserInvite";
import AgentsList from "./AgentsList";
import AgentDetails from "./AgentDetails";
import AgentLog from "./AgentLog";

export default function CoorpAdminAgent ({ members, addAgent, agents, setAgents }) {
  const { state } = useLocation();
  const [view, setView] = useState(state?.view || "list");
  const [selectedAgent, setSelectedAgent] = useState(null);
  const agentMembers = members.filter((m) => m.assignedAgentId === (selectedAgent ? selectedAgent.id : null));
  const [toggleStatus, setToggleStatus] = useState(false);
  const [status, setStatus] = useState("Active");
  // Toggle activation/suspension
  const handleStatusChange = (newStatus) => {
    if (!selectedAgent) return;
    setAgents((prev) =>
      prev.map((a) => (a.id === selectedAgent.id ? { ...a, status: newStatus } : a))
    );
    setSelectedAgent((prev) => (prev ? { ...prev, status: newStatus } : prev));
  };


  return (
    <div className="min-h-screen bg-gray-100 justify-between flex flex-col">
      {/* Header */}
      <div className="w-full flex gap-2 text-white justify-between items-center bg-blue-500 p-4">
        <div className="flex gap-2 items-center">
          {view !== "list" && (
            <button onClick={()=> {
              if (view === "confirmReassign")
                setView("reassign")
              if (view === "log")
                setView("details")
              else
                setView("list")
              }
            }
            className="text-white">
              <FontAwesomeIcon icon={faArrowLeft} size="1x" />
            </button>
          )}
          <h1 className="text-xl font-semibold">
            {view === "list" && "Manage Agents"}
            {view === "invite" && "Add Agents"}
            {view === "details" && "Manage Profile"}
            {view === "log" && "Activity Log"}
          </h1>
        </div>
        <div>
          {selectedAgent && view === "details" && selectedAgent.status !== "Invited" && (
          <button
            className={`text-sm bg-white px-3 py-1 rounded ${
              selectedAgent.status === "Suspended"
                ? "ring ring-green-600 text-green-600"
                : "ring text-red-600 ring-red-600"
            }`}
            onClick={() => {
              const newStatus = selectedAgent.status === "Suspended" ? "Active" : "Suspended";
              setStatus(newStatus);
              setToggleStatus(true);
            }}
          >
            {selectedAgent.status === "Suspended" ? "Activate" : "Suspend"}
          </button>
        )}
        </div>
      </div>

      {/* Confirmation Overlay */}
      {toggleStatus && (
        <>
          <div className="absolute inset-0 bg-black opacity-50 z-20"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
              z-30 p-4 shadow-md rounded bg-white flex flex-col gap-2 w-80">
            <p>
              Are you sure you want to {status === "Active" ? "activate" : "suspend"} this member?
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  handleStatusChange(status);
                  setToggleStatus(false);
                }}
                className="bg-blue-500 w-full text-white px-4 py-2 rounded"
              >
                Yes
              </button>
              <button
                onClick={() => setToggleStatus(false)}
                className="bg-gray-200 w-full text-gray-900 px-4 py-2 rounded"
              >
                No
              </button>
            </div>
          </div>
        </>
      )}
      
      {/* Body */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col flex-1"
      >
        {view === "list" && (
          <AgentsList
            agents={agents}
            members={members}
            onInvite={() => setView("invite")}
            onSelectAgent={(agent) => {
              setSelectedAgent(agent);
              setView("details");
            }}
          />
        )}

        {view === "invite" && (
          <UserInvite
            onBack={() => setView("list")}
            addAgent={addAgent}
            role="agent"
          />
        )}

        {view === "details" && selectedAgent && (
          <AgentDetails
            agent={selectedAgent}
            members={agentMembers}
            onLogs={() => {
              setView("log");
              console.log("Viewing logs");
            }}
          />
        )}

        {view === "log" && selectedAgent && (
          <AgentLog
            agent={selectedAgent}
            members={agentMembers}
          />
        )}
      </motion.div>
      <AdminNavbar page="agents" />
    </div>
  );
}