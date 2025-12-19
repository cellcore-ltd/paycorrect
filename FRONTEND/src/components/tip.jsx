import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSun } from "@fortawesome/free-solid-svg-icons";

function Tip({ 
  message = "You can change this preference anytime from your profile", 
  icon = faSun, 
  textColor = "text-blue-800", 
}) {
  return (
    <div className={`w-full flex gap-3 items-start rounded-md p-3 border bg-blue-50 border-blue-200`}>
      <FontAwesomeIcon icon={icon} className="text-xl text-amber-400 mt-1" aria-hidden="true" />
      <p className={`text-sm ${textColor}`}>{message}</p>
    </div>
  );
}

export default Tip;
