import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import AuthResolver from "./pages/Auth/AuthResolver";
import PageResolver from "./pages/PageResolver";
import NotFound from "./pages/NotFound";

function App() {
  // Shared state for all cooperative admin data
  const [members, setMembers] = useState([
    {
      id: "MBM-001",
      name: "John Doe",
      email: "johnDoe@gmail.com",
      type: "Member",
      status: "Active",
      balance: 126500,
      lastContribution: "Aug 25, 2025",
      nextDue: { amount: 2000, dueDate: "Dec 15, 2024" },
      assignedAgentId: "AGT-001",
      transactions: [
        { id: "TXN-001", type: "Deposit", amount: 15000, method: "Direct transfer", date: "Sep 5, 2024" },
        { id: "TXN-002", type: "Withdrawal", amount: 15000, method: "Direct transfer", date: "Sep 5, 2024" },
      ],
    },
    {
      id: "MBM-002",
      name: "Jane Doe",
      email: "janeDoe@gmail.com",
      type: "Member",
      status: "Inactive",
      balance: 0,
      lastContribution: null,
      nextDue: null,
      assignedAgentId: null,
      transactions: [],
    },
    {
      id: "MBM-003",
      name: "Mike Smith",
      email: "mikeSmith@gmail.com",
      type: "Member",
      status: "Suspended",
      balance: 50000,
      lastContribution: "Aug 1, 2025",
      nextDue: { amount: 5000, dueDate: "Oct 10, 2025" },
      assignedAgentId: "AGT-003",
      transactions: [
        { id: "TXN-003", type: "Deposit", amount: 5000, method: "Direct transfer", date: "Sep 1, 2024" },
      ],
    },
    {
      id: "MBM-004",
      name: "Sarah Doe",
      email: "sarahDoe@gmail.com",
      type: "Member",
      status: "Active",
      balance: 75000,
      lastContribution: "Aug 15, 2025",
      nextDue: { amount: 3000, dueDate: "Dec 20, 2024" },
      assignedAgentId: "AGT-004",
      transactions: [
        { id: "TXN-004", type: "Deposit", amount: 10000, method: "Direct transfer", date: "Sep 10, 2024" },
      ],
    },
  ]);

  // Helper function to calculate expiration date based on TTL
  const getExpiryDate = (ttlHours) => {
    const now = new Date();
    return new Date(now.getTime() + ttlHours * 60 * 60 * 1000); // convert hours → ms
  };

  // Add member callback to be used from MemberInvite
  const addMember = (name, email, ttlHours) => {
    setMembers((prev) => {
      const nextIndex = prev.length + 1;
      const id = `MBM-${nextIndex.toString().padStart(3, "0")}`;

      const newMember = {
        id,
        name,
        email,
        type: "Member",
        status: "Invited",
        balance: 0,
        lastContribution: null,
        nextDue: null,
        assignedAgentId: null,
        reassigned: "no",
        reassignedDate: null,
        transactions: [],
        createdAt: new Date().toISOString(),
        ttl: ttlHours, // store TTL in hours
        expiresAt: getExpiryDate(ttlHours).toISOString(),
      };

      return [...prev, newMember];
    });
  };


  // Agents placeholder
  const [agents, setAgents] = useState([
    { 
      id: "AGT-001",
      name: "John Doe",
      phone: "+234-123456789",
      email: "john.doe@example.com",
      location: "Lagos",
      status: "Active",
    },
    { 
      id: "AGT-002",
      name: "Jane Smith",
      phone: "+234-987654321",
      email: "jane.smith@example.com",
      location: "Abuja",
      status: "Active",
    },
    { 
      id: "AGT-003",
      name: "Michael Johnson",
      phone: "+234-111222333",
      email: "michael.johnson@example.com",
      location: "Port Harcourt",
      status: "Active",
    },
    { 
      id: "AGT-004",
      name: "Sarah Lee",
      phone: "+234-444555666",
      email: "sarah.lee@example.com",
      location: "Ibadan",
      status: "Inactive",},
  ]);

  const addAgent = (name, phone, location, ttl) => {
    setAgents((prev) => {
      const nextIndex = prev.length + 1;
      const id = `AGT-${nextIndex.toString().padStart(3, "0")}`;

      const newAgent = {
        id,
        name,
        phone,
        email: `${name.replace(/\s+/g, '.').toLowerCase()}@example.com`,
        location,
        status: "Invited",
        ttl: ttl, // store TTL in hours
        expiresAt: getExpiryDate(ttl).toISOString(),
      };

      return [...prev, newAgent];
    });
  }

  return (
    <Routes>
      {/* Auth routes */}
      <Route path="/:userType" element={<AuthResolver page="landing" />} />
      <Route path="/:userType/register" element={<AuthResolver page="register" />} />
      <Route path="/:userType/login" element={<AuthResolver page="login" />} />
      <Route path="/:userType/splash" element={<AuthResolver page="splash" />} />
      <Route path="/:userType/forgot-password" element={<AuthResolver page="forgotPassword" />} />

      {/* Category routes */}
      <Route
        path="/:category/:userType/dashboard"
        element={<PageResolver page="dashboard" members={members} setMembers={setMembers} agents={agents} />}
      />
      <Route
        path="/:category/:userType/members"
        element={<PageResolver page="members" members={members} setMembers={setMembers} addMember={addMember}  agents={agents} />}
      />
      <Route path="/:category/:userType/payments" element={<PageResolver page="payments" />} />

      <Route
        path="/:category/:userType/agents"
        element={<PageResolver page="agents" members={members} setAgents={setAgents} addAgent={addAgent} agents={agents} />}
      />

      {/* Fallback */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
