import { useLocation } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import AdminNavbar from "../../../../components/adminNavbar";
import UserInvite from "../../../../components/UserInvite";

import MembersList from "./MembersList";
import MemberDetails from "./MemberDetails";
import ReassignAgents from "./ReassignAgents";
import ConfirmReassignAgents from "./ConfirmReassign";

export default function CoorpAdminMember({ members, setMembers, addMember, agents }) {
  const { state } = useLocation();
  const [view, setView] = useState(state?.view || "list");
  const [selectedMember, setSelectedMember] = useState(null);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [toggleStatus, setToggleStatus] = useState(false);
  const [status, setStatus] = useState("Active");

  
  // Toggle activation/suspension
  const handleStatusChange = (newStatus) => {
    if (!selectedMember) return;
    setMembers((prev) =>
      prev.map((m) => (m.id === selectedMember.id ? { ...m, status: newStatus } : m))
    );
    setSelectedMember((prev) => (prev ? { ...prev, status: newStatus } : prev));
  };

  // Reassign handler: updates members array AND selectedMember
  const handleReassign = (memberId, newAgentId) => {
    const now = new Date().toISOString();

    setMembers((prev) =>
      prev.map((m) => {
        if (m.id !== memberId) return m;

        if (!newAgentId) {
          return { ...m, assignedAgentId: null, reassigned: "no", reassignedDate: null };
        }

        return {
          ...m,
          assignedAgentId: newAgentId,
          reassigned: "yes",
          reassignedDate: now,
        };
      })
    );

    setSelectedMember((prev) =>
      prev && prev.id === memberId
        ? {
            ...prev,
            assignedAgentId: newAgentId || null,
            reassigned: newAgentId ? "yes" : "no",
            reassignedDate: newAgentId ? now : null,
          }
        : prev
    );
  };

  //Resend handler: updates members array AND selectedMember
  const resendInvite = (memberID, ttlHours) => {
    const getExpiryDate = (ttlHours) => {
      const now = new Date();
      return new Date(now.getTime() + ttlHours * 60 * 60 * 1000); // convert hours → ms
    };
    setMembers ((prev) =>
      prev.map((m) => (m.id === memberID ? { ...m, ttl: ttl, expiresAt: getExpiryDate(ttlHours).toISOString()}: m))
    );

    setSelectedMember((prev) =>
      prev && prev.id === memberID ? { ...prev,  ttl: ttl, expiresAt: getExpiryDate(ttlHours).toISOString()} : prev
    );
  }

  const getAgentById = (id) => agents.find((a) => a.id === id) || null;

  return (
    <div className="flex flex-col  bg-gray-100 flex-1 w-full h-full">
      {/* Header */}
      <div className="w-full flex gap-2 text-white justify-between items-center bg-blue-500 p-4">
        <div className="flex gap-2 items-center">
          {view !== "list" && (
            <button onClick={()=> {
              if (view === "confirmReassign")
                setView("reassign")
              else
                setView("list")
              }
            }
             className="text-white">
              <FontAwesomeIcon icon={faArrowLeft} size="1x" />
            </button>
          )}
          <h1 className="text-xl font-semibold">
            {view === "list" && "Manage Members"}
            {view === "invite" && "Invite Member"}
            {view === "details" && "Manage Profile"}
            {view === "reassign" && "Reassign Agent"}
            {view === "confirmReassign" && "Confirm Reassign"}
          </h1>
        </div>

        {selectedMember && view === "details" && selectedMember.status !== "Invited" && (
          <button
            className={`text-sm bg-white px-3 py-1 rounded ${
              selectedMember.status === "Suspended"
                ? "ring ring-green-600 text-green-600"
                : "ring text-red-600 ring-red-600"
            }`}
            onClick={() => {
              const newStatus = selectedMember.status === "Suspended" ? "Active" : "Suspended";
              setStatus(newStatus);
              setToggleStatus(true);
            }}
          >
            {selectedMember.status === "Suspended" ? "Activate" : "Suspend"}
          </button>
        )}
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
        key={view}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col flex-1 overflow-hidden"
      >
        {view === "list" && (
          <MembersList
            onInvite={() => setView("invite")}
            members={members}
            agents={agents}
            onSelectMember={(member) => {
              setSelectedMember(member);
              setView("details");
            }}
          />
        )}

        {view === "invite" && 
          <UserInvite
            onBack={() => setView("list")}
            addMember={addMember}
            role="member"
          />
        }

        {view === "details" && selectedMember && (
          <MemberDetails
            member={selectedMember}
            agent={getAgentById(selectedMember.assignedAgentId)}
            reasign={() => setView("reassign")}
            resendInvite={resendInvite}
          />
        )}

        {view === "reassign" && selectedMember && (
          <ReassignAgents
            agents={agents}
            members={members}
            member={selectedMember}
            agent={getAgentById(selectedMember.assignedAgentId)}
            onReassign={(newAgent) => {
              setSelectedAgent(newAgent);
              setView("confirmReassign");
            }}
            onBack={() => setView("details")}
          />
        )}

        {view === "confirmReassign" && selectedMember && (
          <ConfirmReassignAgents
            member={selectedMember}
            newAgent={getAgentById(selectedAgent)}
            currentAgent={getAgentById(selectedMember.assignedAgentId)}
            onCancel={() => setView("reassign")}
            onConfirm={handleReassign}
            onBack={() => setView("details")}
          />
        )}
      </motion.div>

      <AdminNavbar page="members" />
    </div>
  );
}