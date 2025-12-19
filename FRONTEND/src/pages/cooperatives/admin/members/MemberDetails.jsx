import { useState } from "react";
import { motion } from "framer-motion";

export default function MemberDetails({ agent, member, reasign, resendInvite }) {
  const tabs = ["Overview", "Transactions"];
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const Transactions = member.transactions || [];
  const [resend, setResend] = useState(false);

  const now = new Date();
  const expired = member.expiresAt && new Date(member.expiresAt) < now;


  const resendLink = (member) => {
    resendInvite(member, "24");
    setResend(true);

    setTimeout (() => {
      setResend (false);
    }, 4000);
  }

  return (
    <motion.div
      key="member-details"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
      className="flex gap-4 flex-col flex-1 py-4 overflow-hidden"
    >
      {/* Member summary card */}
      <div className="rounded px-4 flex">
        <div className="rounded ring bg-linear-60 from-blue-100 to-gray-100 ring-blue-300 w-full p-4 flex items-center justify-between gap-2">
          <div className="flex flex-col gap-1">
            <p>
              <span className="font-semibold">Name: </span>{member.name}
            </p>
            <p>
              <span className="font-semibold">ID: </span>{member.id}
            </p>
          </div>
          <p>
            <span
              className={`text-xs px-2 py-1 rounded ${
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
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex w-full px-4">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 w-full rounded-t ${
              activeTab === tab
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="flex-1 px-4 overflow-y-auto">
        {/* Overview Tab */}
        {activeTab === "Overview" && (
          <div className="flex flex-col gap-3">
            {/* Balance Summary */}
            <h3 className="font-semibold text-lg">Balance Summary</h3>
            <div className="flex flex-col p-4 rounded shadow-md ring ring-gray-300 gap-2">
              <p className="text-lg font-semibold">Current Balance</p>
              <p className="text-xl font-bold text-blue-600">
                ₦{member.balance.toLocaleString()}
              </p>
              <p className="text-sm text-gray-500">
                Last contribution date: {member.lastContribution || "N/A"}
              </p>
            </div>

            {/* Next Due */}
            {member.nextDue &&
              (() => {
                const dueDate = new Date(member.nextDue.dueDate);
                const diffDays = Math.ceil(
                  (dueDate - new Date()) / (1000 * 60 * 60 * 24)
                );
                const isOverdue = diffDays < 0;
                const isUpcoming = diffDays >= 0 && diffDays <= 7;
                const bgClass = isOverdue
                  ? "bg-red-50 ring-red-400 text-red-600"
                  : isUpcoming
                  ? "bg-amber-50 ring-amber-400 text-amber-600"
                  : "bg-green-50 ring-green-400 text-green-600";

                return (
                  <div
                    className={`flex flex-col p-4 rounded shadow-md ring gap-2 ${bgClass}`}
                  >
                    <p className="text-sm font-semibold">Next Due</p>
                    <p className="text-sm font-bold">
                      Amount: ₦{member.nextDue.amount.toLocaleString()}
                    </p>
                    <p className="text-sm">
                      Due Date: {dueDate.toDateString()}
                    </p>
                    <p className="text-xs italic">
                      {isOverdue
                        ? `Overdue by ${Math.abs(diffDays)} day(s)`
                        : `Due in ${diffDays} day(s)`}
                    </p>
                  </div>
                );
              })()}

            {/* Agent & Invite Section */}
            <div className="flex flex-col p-4 rounded shadow-md ring ring-gray-300 gap-3">
              <h3 className="font-semibold text-lg">
                { member.status === "Active" ? "Assigned Agent": "Member Status"}
              </h3>

              {member.status === "Invited" && (
                <>
                  <p className="text-sm text-gray-600">
                    {expired
                      ? "This member's invite link has expired."
                      : "This member has been invited but hasn’t accepted yet."
                    }
                  </p>

                  <button
                    onClick={() => resendLink(member)}
                    disabled={!expired || resend}
                    className={`w-full px-3 py-1 rounded transition ${
                      resend || !expired
                        ? "bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed"
                        : "border border-blue-500 text-blue-500 hover:bg-blue-50"
                    }`}
                  >
                    {resend ? "Invite Link Sent!" : expired ? "Resend Invite Link" : "Invite Still Active"}
                  </button>
                </>
              )}


              {member.status === "Active" ? (
                <>
                  {agent ? (
                    <div className="flex flex-col gap-1">
                      <p className="font-medium">{agent.name}</p>
                      <p className="text-sm text-gray-500">ID: {agent.id}</p>
                      <p className="text-sm text-gray-500">
                        Phone: {agent.phone}
                      </p>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">
                      No agent assigned yet.
                    </p>
                  )}
                  <button
                    onClick={() => reasign()}
                    className="w-full border border-blue-500 text-blue-500 px-3 py-1 rounded hover:bg-blue-50 transition"
                  >
                    {agent ? "Change Agent" : "Assign Agent"}
                  </button>
                </>
              ) : (
                <p className="text-sm italic text-gray-500">
                  Agent assignment will be available once the member 
                  {member.status === "Invited" ? " accepts the invite." : " becomes active."}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Transactions Tab */}
        {activeTab === "Transactions" && (
          <div className="flex flex-col gap-3">
            {Transactions.length > 0 ? (
              Transactions.map((trans) => (
                <div
                  key={trans.id}
                  className={`rounded p-3 pr-4 border-l-4 ${
                    trans.type === "Deposit"
                      ? "border-l-green-500"
                      : "border-l-red-500"
                  } bg-white shadow-sm flex flex-col`}
                >
                  <p className="text-xl font-semibold">{trans.type}</p>
                  <p className="text-base">
                    ₦{trans.amount} {trans.method}
                  </p>
                  <p className="text-sm text-gray-500">{trans.date}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center">
                Member is yet to make any transactions.
              </p>
            )}
          </div>
        )}
      </div>

      {/* Overlay */}
      {resend && (
        <>
          <div className="inset-0 bg-black opacity-50  absolute z-20"></div>
          <div className="z-50 w-80 rounded p-4 bg-white flex flex-col gap-3">
            <p className="text-xl font-bold">Resent Invite</p>
            <p>Magic link has been resent to {member.email} </p>
          </div>
        </>
      )}
    </motion.div>
  );
}
