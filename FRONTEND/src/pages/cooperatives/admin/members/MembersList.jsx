import { motion } from "framer-motion";
import { useState } from "react";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function MembersList({ members, agents, onInvite, onSelectMember }) {
  // Search + filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showFilter, setShowFilter] = useState(false);

  // 👉 Filtered members
  const filteredMembers = members.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "All" ? true : m.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <motion.div
      key="members-list"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
      className="flex gap-4 flex-col flex-1 py-4 overflow-hidden"
    >
      {/* Search + Filter */}
      <div className="flex w-full justify-between gap-2 items-center relative px-4">
        <div className="relative w-full">
          <input
            type="search"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          />
          <FontAwesomeIcon
            icon={faSearch}
            size="1x"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          />
        </div>

        <button
          onClick={() => setShowFilter((prev) => !prev)}
          className="border border-gray-600 px-4 py-2 rounded"
        >
          Filter
        </button>

        {showFilter && (
          <div className="absolute right-4 top-12 bg-white border rounded shadow-md w-40 z-10">
            {["All", "Active", "Inactive", "Invited", "Suspended"].map((status) => (
              <button
                key={status}
                onClick={() => {
                  setStatusFilter(status);
                  setShowFilter(false);
                }}
                className={`w-full text-left px-4 py-2 hover:bg-gray-100 ${
                  statusFilter === status ? "bg-blue-50 font-medium" : ""
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Scrollable list with bottom padding so CTA is visible */}
      <div className="flex-1 px-4 overflow-y-auto">
        <div className="flex flex-col gap-3">
          {filteredMembers.length > 0 ? (
            filteredMembers.map((member) => (
              <div
                key={member.id}
                className="rounded p-3 bg-white shadow-sm flex justify-between items-center"
              >
                <div className="flex flex-col gap-1">
                  <p className="font-medium">{member.name}</p>
                  <p className="text-sm text-gray-500">
                    {member.type} ID: {member.id}
                  </p>
                  <span
                    className={`text-xs w-fit px-2 py-1 rounded font-medium ${
                      member.status === "Active"
                        ? "bg-green-100 text-green-800"
                        : member.status === "Inactive"
                        ? "bg-indigo-100 text-indigo-800"
                        : member.status === "Invited"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"

                    }`}
                  >
                    {member.status}
                  </span>
                </div>
                <button
                  onClick={() => {
                    const agent = agents.find(a => a.id === member.assignedAgentId);
                    onSelectMember({ ...member, agent }); 
                  }}
                  className="border border-blue-500 text-blue-500 px-3 py-1 rounded"
                >
                  View
                </button>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center">No members found.</p>
          )}
        </div>
      </div>

      {/* CTA (fixed above navbar, not hidden) */}
      <div className="w-full px-4 bg-white">
        <button
          onClick={onInvite}
          className="border border-blue-500 text-blue-500 px-4 py-2 rounded w-full"
        >
          Add or invite new members
        </button>
      </div>
    </motion.div>
  );
}
