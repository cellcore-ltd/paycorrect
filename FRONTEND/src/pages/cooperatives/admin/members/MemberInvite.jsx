import { useState } from "react";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";

export default function MemberInvite({ onBack, addMember }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [ttl, setTtl] = useState("24"); // Default 24 hours
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    setLoading(true);

    // Simulate API call delay
    setTimeout(() => {
      addMember(name, email, ttl);
      setLoading(false);
      setSuccess(true);

      
      // Auto-close confirmation after 2.5s
      setTimeout(() => {
        setSuccess(false);
        onBack();
        // Reset fields after success
        setName("");
        setEmail("");
        setTtl("24");
      }, 2500);
    }, 1000);
  };

  return (
    <motion.div
      key="new-member-form"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
      className="flex flex-col flex-1 gap-4 p-4 relative"
    >
      <h2 className="text-lg font-semibold mb-2">Invite New Member</h2>

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Member Name"
          className="w-full border px-3 py-2 rounded"
        />

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full border px-3 py-2 rounded"
        />

        <div className="flex flex-col">
          <label className="text-sm text-gray-600 mb-1">Magic Link Expiry</label>
          <select
            value={ttl}
            onChange={(e) => setTtl(e.target.value)}
            className="border px-3 py-2 rounded"
          >
            <option value="6">6 hours</option>
            <option value="12">12 hours</option>
            <option value="24">1 day</option>
            <option value="72">3 days</option>
            <option value="168">7 days</option>
          </select>
        </div>

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
            disabled={loading || !name.trim() || !email.trim()}
            className={`px-4 py-2 rounded w-full text-white transition ${
              loading ? "bg-blue-300 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
            }`}
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
            <FontAwesomeIcon icon={faCheckCircle} className="text-green-500 mb-2" size="2x" />
            <p className="font-semibold text-lg mb-1">Invite Sent!</p>
            <p className="text-sm text-gray-700">
              Magic link sent to <span className="font-semibold">{email}</span>
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
