import { useState } from "react";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

export default function ReassignAgents({
  agents,
  agent,
  member,
  members,
  onBack,
  onReassign,
}) {
  const [selectedAgentId, setSelectedAgentId] = useState(agent ? agent.id : "");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredAgents = agents.filter(
    (a) =>
      (a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.id.toLowerCase().includes(searchQuery.toLowerCase())) &&
      a.status.toLowerCase() === "active"
  );

  const isSameAgent = agent && selectedAgentId && agent.id === selectedAgentId;


  return (
    <motion.div
      key="reassign-agents"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col flex-1 py-4 gap-4 overflow-hidden"
    >
      {/* Current Agent */}
      <div className="px-4">
        <h3 className="font-bold text-lg mb-2">Current Agent</h3>
        {agent ? (
          <div className="flex flex-col p-3 shadow-sm gap-1 ring ring-gray-200 rounded">
            <p className="text-sm"><strong>Name:</strong> {agent.name}</p>
            <p className="text-sm"><strong>Phone:</strong> {agent.phone}</p>
            <p className="text-sm"><strong>Location:</strong> {agent.location}</p>
          </div>
        ) : (
          <p className="text-gray-600 text-sm">No agent assigned</p>
        )}
      </div>

      {/* Search */}
      <div className="relative px-4">
        <input
          type="search"
          placeholder="Search agents..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full ring ring-gray-300 px-3 py-2 rounded"
        />
        <FontAwesomeIcon
          icon={faSearch}
          className="absolute right-6 top-1/2 transform -translate-y-1/2 text-gray-400"
        />
      </div>

      {/* Agent List */}
      <div className="flex-1 overflow-y-auto flex flex-col gap-3 py-1 px-4">
        {filteredAgents.length === 0 ? (
          <p className="p-4 text-center text-gray-500">No agents found</p>
        ) : (
          filteredAgents.map((a) => {
            const assignedMembers = members.filter((m) => m.assignedAgentId === a.id);
            return (
              <div
                key={a.id}
                onClick={() => setSelectedAgentId(a.id)}
                className={`flex flex-col gap-1 p-3 shadow-sm rounded ring cursor-pointer transition-all duration-200 ${
                  selectedAgentId === a.id
                    ? "ring-blue-500 bg-blue-50"
                    : "ring-gray-200 hover:ring-blue-300 hover:bg-gray-50"
                }`}
              >
                <p className="font-semibold text-gray-800">{a.name}</p>
                <p className="text-sm text-gray-500">ID: {a.id}</p>
                <p className="text-sm text-gray-500">Phone: {a.phone}</p>
                <p className="text-xs text-gray-500 italic">
                  Members Assigned: {assignedMembers.length}
                </p>
              </div>
            );
          })
        )}
      </div>

      {/* Bottom CTA */}
      <div className="flex justify-between gap-3 px-4 py-2 border-t border-gray-200">
        <button
          onClick={onBack}
          className="w-1/2 bg-gray-100 text-gray-700 py-2 rounded hover:bg-gray-200"
        >
          Cancel
        </button>

        <button
          onClick={() => onReassign(selectedAgentId)}
          disabled={isSameAgent || !selectedAgentId}
          className={`w-1/2 py-2 rounded text-white ${
            isSameAgent || !selectedAgentId
              ? "bg-blue-500 opacity-50 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          {agent ? "Reassign" : "Assign"} Agent
        </button>
      </div>
    </motion.div>
  );
}
