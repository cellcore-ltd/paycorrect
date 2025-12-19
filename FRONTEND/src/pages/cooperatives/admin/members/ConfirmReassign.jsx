import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";

export default function ConfirmReassignAgents({ member, newAgent, currentAgent, onCancel, onConfirm, onBack }) {
    const [reason, setReason] = useState("");
    const [notifyMember, setNotifyMember] = useState(false);
    const [notifyAgent, setNotifyAgent] = useState(false);
    const disable = !reason && currentAgent;
    const [popUp, showPopUp] = useState(false);
    const [noAgent, setNoAgent] = useState(!currentAgent)
    const today = new Date();
    const formatted = today.toLocaleDateString("en-US", {
        weekday: "long", // “Monday”
        year: "numeric",
        month: "long",  // “October”
        day: "numeric", // “5”
    });

    const [prevAgent, setPrevAgent] = useState(currentAgent);

    useEffect(() => {
        // Only set once when the component first mounts
        if (currentAgent && !prevAgent) {
            setPrevAgent(currentAgent);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleReassign = () => {
        setNoAgent(!currentAgent);
        onConfirm(member.id, newAgent.id);
        setTimeout(() => {
            showPopUp(true)
        }, 400);
    }


    return (
        <motion.div
            key="confirm-reassign"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col flex-1 gap-4 p-4"
        >
            <div>
                <p className="text-2xl text-center font-semibold">{member.name}</p>
                <p className="text-center text-sm">{member.id}</p>
            </div>
            
            <div className="flex-col p-3 bg-blue-100 ring ring-blue-400 rounded gap-2">
                <p className="flex justify-between gap-3">
                    <span>From:</span>
                    {!noAgent ? prevAgent.name : "No Agent"}
                </p>
                <p className="flex justify-between gap-3">
                    <span> To: </span>
                    {newAgent.name}
                </p>
            </div>
            {!noAgent && (<textarea
                type="text"
                rows={3}
                placeholder="Reason for reassignment (optional)"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full ring ring-gray-300 px-3 py-2 rounded"
            />)}
            <label className="flex gap-1 text-base items-center">  
                <input
                    type="checkbox"
                    checked={notifyMember}
                    onChange={() => setNotifyMember(!notifyMember)}
                    className="w-5 h-5"
                />
            Notify Member</label>
            <label className="flex items-center text-base gap-1">
                <input
                    type="checkbox"
                    checked={notifyAgent}
                    onChange={() => setNotifyAgent(!notifyAgent)}
                    className="w-5 h-5"
                />
                Notify {noAgent ? "Agent" : "both Agents"}
            </label>

            <div className="flex gap-2">
                <button
                    onClick={handleReassign}
                    disabled={disable}
                    className= {`bg-blue-500 w-full text-white px-4 py-2 rounded ${
                        disable ? "opacity-50": ""
                    }`}
                >
                    Yes
                </button>
                <button
                    onClick={onCancel}
                    className="bg-gray-200 w-full text-gray-900 px-4 py-2 rounded"
                >
                    No
                </button>
            </div>

            {popUp && 
                <>
                    <div className="absolute inset-0 bg-black opacity-80 z-20"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
                        z-30 p-4 shadow-md rounded bg-white items-center flex flex-col gap-2 w-80"
                    >
                        <FontAwesomeIcon 
                         icon={faCheckCircle}
                         className="text-green-500"
                         size="2x"
                        />
                        <p className="text-xl font-semibold">
                            Agent successfully {noAgent ? "assigned" : "reassigned" }
                        </p>
                        <p className="text-sm">
                            {member.name} has been {noAgent ? "assigned" : "reassigned"} {newAgent.name}
                        </p>
                        <p className="text-sm flex gap-2">
                            <span className="font-semibold">
                                Timestamp:
                            </span>
                            {formatted}
                        </p>
                        <p className="text-sm flex gap-2">
                            <span className="font-semibold">
                                Notified:
                            </span>
                            {notifyMember && "member" }
                            {notifyAgent && notifyMember && " and "}
                            {notifyAgent && (noAgent ? "agent": "agents")}
                            {!notifyAgent && !notifyMember && "N/A" }
                        </p>
                        <button
                            className="bg-blue-500 text-white px-4 py-2 rounded w-full"
                            onClick={onBack}
                        >
                            Done
                        </button>
                    </div>
            
                </>
            }
        </motion.div>
    );
}