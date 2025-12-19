import { Activity, useState } from "react";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUsers, faCoins, faPhone, faEnvelope, faChartLine, faLocationDot } from "@fortawesome/free-solid-svg-icons";

export default function AgentDetails({ agent, members, onLogs }) {
    const tabs = ["Overview", "Members", "Transactions", "Performance"];
    const [activeTab, setActiveTab] = useState(tabs[0]);
    const agentTransactions = members.reduce(
      (sum, member) => sum + (Number(member.balance) || 0),
      0
    );

    return (
    <motion.div
      key="agent-details"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
      className="flex gap-4 flex-col flex-1 py-4 overflow-hidden"
    >
      {/* Agent summary card */}
      <div className="px-4 flex flex-col">
        <div className="flex w-full space-between">
          <div className="flex items-start space-between w-full gap-2">
            <FontAwesomeIcon icon={faUsers} size="xl" className="text-gray-600 border-radius-2 p-1" />
            {/*<img src={agent.avatarUrl} alt="Agent Avatar" className="w-16 h-16 rounded-full object-cover mr-4" />*/}
            <div className="flex flex-col justify-center">
              <p className="text-lg font-bold">{agent.name}</p>
              <p className="text-sm text-gray-600">ID: {agent.id}</p>
            </div>
          </div>
          <div className="flex items-center">
            <span className={`text-xs px-2 py-1 rounded ${
                agent.status === "Active"
                  ? "bg-green-100 text-green-700"
                  : agent.status === "Invited"
                  ? "bg-yellow-100 text-yellow-700"
                  : agent.status === "Inactive"
                    ? "bg-gray-400 text-gray-100"
                  : "bg-red-100 text-red-700"
                }`}>
              {agent.status}
            </span>
          </div>
        </div>
        <div className="flex flex-wrap space-between w-full gap-3">
          <div className="flex items-center text-gray-600">
            <FontAwesomeIcon icon={faPhone} size="1x" className="mr-2" />
            <span>{agent.phone}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <FontAwesomeIcon icon={faEnvelope} size="1x" className="mr-2" />
            <span>{agent.email}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <FontAwesomeIcon icon={faLocationDot} size="1x" className="mr-2" />
            <span>{agent.location}</span>
          </div>
        </div>
      </div>
      {/* Tabs */}
      <div className="flex w-full px-4">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`text-sm px-2 py-2 w-full ${
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
        <div className="flex-1 flex flex-col px-4 overflow-y-auto min-h-0">
          {/* Overview Tab */}
          {activeTab === "Overview" && (
            <div className="flex flex-col h-full w-full flex-1 justify-between gap-4">
              <div className="">
                <div className="flex gap-4">
                  <div className="flex flex-col w-full bg-white p-4 gap-1">
                    <p className="text-gray-700">
                      <span className="text-blue-500 mr-2">
                        <FontAwesomeIcon icon={faUsers} aria-hidden="true"/>
                      </span>
                      Members
                    </p>
                    <p className="font-bold text-2xl">{members.length}</p>
                    <p className="text-gray-600 text-sm">
                      + 12 this month
                    </p>
                  </div>

                  <div className="flex flex-col bg-white p-4 w-full gap-1">
                    <p className="text-gray-700">
                      <span className="text-blue-500 mr-2">
                        <FontAwesomeIcon icon={faCoins} aria-hidden="true"/>
                      </span>
                      Collections
                    </p>
                    <p className="font-bold text-2xl">₦{agentTransactions}</p>
                    <p className="text-gray-600 text-sm">
                      This month
                    </p>
                  </div>
                </div>
              </div>

              <button
               onClick={onLogs}
               className="w-full border-gray-600 border text-gray-700 px-4 py-2 rounded items-center"
              >
                <FontAwesomeIcon icon={faChartLine} className="mr-2" />
                View Activity Log
              </button>
            </div>
          )}
        </div>
    </motion.div>
  );
}