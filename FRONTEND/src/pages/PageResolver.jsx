import { useParams } from "react-router-dom";

// Cooperative imports
import CoorpAdminDashboard from "./cooperatives/admin/Dashboard";
import CoorpAdminMember from "./cooperatives/admin/members/MemberMain";
import CoorpAdminAgent from "./cooperatives/admin/agents/AgentMain";

const componentMap = {
  coop: {
    admin: {
      dashboard: CoorpAdminDashboard,
      members: CoorpAdminMember,
      agents: CoorpAdminAgent,
    },
  },
};

export default function PageResolver({ page, members, setMembers, setAgents, addMember, agents, addAgent }) {
  console.log("addAgent:", typeof addAgent);
  const { category, userType } = useParams();
  console.log("Resolving page for:", { category, userType, page });
  const Component = componentMap?.[category]?.[userType]?.[page];

  if (!Component) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center text-red-600">
        <h1 className="text-2xl font-bold mb-2">404 - Page Not Found</h1>
        <p className="text-gray-500">No component matched for <b>{category}/{userType}/{page}</b></p>
      </div>
    );
  }

  // ✅ Pass shared props to each page
  return <Component members={members} setMembers={setMembers} addMember={addMember} addAgent={addAgent} agents={agents} setAgents={setAgents} />;
}
