import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleUser, faCoins, faPlus } from "@fortawesome/free-solid-svg-icons";

function formatCurrency(amount) {
  const n = Number(amount) || 0;
  return n.toLocaleString(undefined, { minimumFractionDigits: 0 });
}

export default function AgentLog({ agent, members = [] }) {
  const assigned = members.filter((m) => m.assignedAgentId === agent?.id);

  const contributions = assigned
    .map((m) => ({
      id: m.id,
      name: m.name || "Unnamed",
      balance: Number(m.balance) || 0,
      assignedAt: m.assignedAt || m.createdAt || null,
    }))
    .sort((a, b) => b.balance - a.balance);

  // Treat 'new' as assigned/reassigned within last 14 days. prefer `reassignedDate` when present
  const now = Date.now();
  const NEW_WINDOW = 14 * 24 * 60 * 60 * 1000;
  const newlyAssigned = assigned.filter((m) => {
    const ts = m.reassignedDate
      ? Date.parse(m.reassignedDate)
      : m.assignedAt
      ? Date.parse(m.assignedAt)
      : m.createdAt
      ? Date.parse(m.createdAt)
      : null;
    return ts ? now - ts <= NEW_WINDOW : false;
  });

  return (
    <motion.div
      key="agent-log"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.25 }}
      className="flex flex-col gap-4 flex-1 p-4 overflow-y-auto min-h-0"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FontAwesomeIcon icon={faCircleUser} size="2x" className="text-gray-600" />
          <div>
            <p className="font-bold">{agent?.name}</p>
            <p className="text-sm text-gray-500">ID: {agent?.id}</p>
          </div>
        </div>
        <div className="text-sm text-gray-600">Members: {assigned.length}</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded shadow-sm">
          <h4 className="font-semibold mb-2 flex items-center gap-2"><FontAwesomeIcon icon={faCoins} /> Contributions</h4>
          {contributions.length === 0 ? (
            <p className="text-gray-500">No contributions from assigned members yet.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {contributions.map((c) => (
                <div key={c.id} className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{c.name}</p>
                    <p className="text-xs text-gray-500">ID: {c.id}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">₦{formatCurrency(c.balance)}</p>
                    {c.assignedAt && (
                      <p className="text-xs text-gray-400">Assigned: {new Date(c.assignedAt).toLocaleDateString()}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white p-4 rounded shadow-sm flex flex-col">
          <h4 className="font-semibold mb-2 flex items-center gap-2"><FontAwesomeIcon icon={faPlus} /> New Assignments</h4>
          {newlyAssigned.length === 0 ? (
            <p className="text-gray-500">No newly assigned members in the last 14 days.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {newlyAssigned.map((m) => (
                <div key={m.id} className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{m.name || "Unnamed"}</p>
                    <p className="text-xs text-gray-500">ID: {m.id}</p>
                  </div>
                  <div className="text-xs text-gray-400">{m.assignedAt ? new Date(m.assignedAt).toLocaleDateString() : m.createdAt ? new Date(m.createdAt).toLocaleDateString() : ""}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="bg-white p-4 rounded shadow-sm">
        <h4 className="font-semibold mb-2">All Assigned Members</h4>
        {assigned.length === 0 ? (
          <p className="text-gray-500">No members assigned to this agent.</p>
        ) : (
          <div className="flex flex-col gap-2">
            {assigned.map((m) => (
              <div key={m.id} className="flex justify-between items-center border-b last:border-b-0 pb-2">
                <div>
                  <p className="font-medium">{m.name || "Unnamed"}</p>
                  <p className="text-xs text-gray-500">ID: {m.id}</p>
                </div>
                <div className="text-sm text-gray-600">Balance: ₦{formatCurrency(m.balance)}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
