import { useNavigate, useParams } from "react-router-dom";
import {
  faUserGroup,
  faBars,
  faMoneyBillWave,
  faIdBadge,
  faHome,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function AdminNavbar({ page }) {
  const navigate = useNavigate();

  // Grab category from the URL, fallback to "cooperatives"
  const { category } = useParams();
  const { userType } = useParams();
  const type = userType;
  const currentCategory = category;

  const menu = [
    { id: "dashboard", name: "Home", icon: faHome, link: `/${currentCategory}/${type}/dashboard` },
    { id: "agents", name: "Agents", icon: faIdBadge, link: `/${currentCategory}/${type}/agents` },
    { id: "members", name: "Members", icon: faUserGroup, link: `/${currentCategory}/${type}/members` },
    { id: "payment", name: "Payment", icon: faMoneyBillWave, link: `/${currentCategory}/${type}/payment` },
    { id: "more", name: "More", icon: faBars, link: `/${currentCategory}/${type}/settings` },
  ];

  return (
    <nav className="w-full bg-gray-100 text-gray-800 flex justify-around items-center border-t p-2">
      {menu.map((item) => {
        const isActive = page === item.id;
        return (
          <div
            key={item.id}
            onClick={() => !isActive && navigate(item.link)}
            className={`flex flex-col items-center gap-1 ${
              isActive ? "text-blue-500 pointer-events-none cursor-default" : "text-gray-600"
            }`}
          >
            <FontAwesomeIcon icon={item.icon} size="lg" />
            <span className="text-xs">{item.name}</span>
          </div>
        );
      })}
    </nav>
  );
}

export default AdminNavbar;
