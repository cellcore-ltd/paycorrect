import React, { useState } from "react";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { a } from "framer-motion/client";

export default function UserInvite({ onBack, addAgent, addMember, role }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [ttl, setTtl] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const agentCheck = (role === "agent" && (!name.trim() || !phone.trim() || !location.trim() || !ttl))
  const memberCheck = (role === "member" && (!name.trim() || !email.trim() || !ttl))

  const handleSubmit = (e) => {
    e.preventDefault();

    setLoading(true);

    setTimeout(() => {
      if (role === "agent" && typeof addAgent === "function") {
        addAgent(name, phone, location, ttl);
      } else if (role === "member" && typeof addMember === "function") {
        addMember(name, email, ttl);
      }

      setLoading(false);
      setSuccess(true);

      setTimeout(() => {
        setSuccess(false);
        onBack?.();
        setName("");
        setEmail("");
        setPhone("");
        setLocation("");
        setTtl("");
      }, 2500);
    }, 1000);
  };

  return (
    <motion.div
      key="user-invite-form"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
      className="flex flex-col flex-1 gap-4 p-4 relative"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={`${role === "agent" ? "Agent" : "Member"} Name`}
          className="w-full border px-3 py-2 rounded"
        />

        {role === "member" && (
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Member Email"
            className="w-full border px-3 py-2 rounded"
          />
        )}

        {role === "agent" && (
          <>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Location"
              className="w-full border px-3 py-2 rounded"
            />
            <input
              type="number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Phone Number"
              className="w-full border px-3 py-2 rounded"
            />
          </>
        )}

        <select
          value={ttl}
          onChange={(e) => setTtl(e.target.value)}
          className="w-full border px-3 py-2 rounded"
        >
          <option value="">Select Link Expiry Time</option>
          <option value="1">1 Hour</option>
          <option value="6">6 Hours</option>
          <option value="12">12 Hours</option>
          <option value="24">1 Day</option>
          <option value="72">3 Days</option>
          <option value="168">7 Days</option>
        </select>

        <div className="flex gap-2 mt-4">
          <button
            type="button"
            onClick={onBack}
            className="border border-gray-400 text-gray-600 px-4 py-2 rounded w-full"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={
              loading ||
              (role === "agent" ? agentCheck : memberCheck)
            }
            className={`px-4 py-2 rounded w-full text-white transition ${
              loading
                ? "bg-blue-300 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600"
            } ${role === "agent" ? agentCheck : memberCheck ? "opacity-50 cursor-not-allowed" : ""}`}
            
          >
            {loading ? "Sending..." : "Send Invite"}
          </button>
        </div>
      </form>

      {success && (
        <>
          <div className="absolute inset-0 bg-black opacity-50 z-20"></div>
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="absolute top-1/2 left-1/2 z-30 bg-white p-6 rounded shadow-md 
                       -translate-x-1/2 -translate-y-1/2 text-center w-80"
          >
            <FontAwesomeIcon
              icon={faCheckCircle}
              className="text-green-500 mb-2"
              size="2x"
            />
            <p className="font-semibold text-lg mb-1">
              {role === "agent" ? "Agent Invite Sent!" : "Member Invite Sent!"}
            </p>
            <p className="text-sm text-gray-700">
              {role === "agent" ? (
                <>
                  Invitation sent to agent <span className="font-semibold">{name}</span>
                </>
              ) : (
                <>
                  Magic link sent to <span className="font-semibold">{email}</span>
                </>
              )}
            </p>
            <p className="text-sm text-gray-600">
              Expires in <span className="font-semibold">{ttl} hours</span>.
            </p>
          </motion.div>
        </>
      )}
    </motion.div>
  );
}
