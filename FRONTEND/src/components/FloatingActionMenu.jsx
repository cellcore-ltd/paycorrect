import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAdd } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";

export default function FloatingActionMenu({ onSelect }) {
  const [expand, setExpand] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="fixed right-4 bottom-[72px] w-[142px] h-[80px] flex justify-end items-end z-20"
    >
      <motion.div
        key={expand ? "menu" : "button"}
        initial={
          expand
            ? { scale: 0.8, x: 20, y: 20, borderRadius: "100px" }
            : { scale: 1, x: 0, y: 0, borderRadius: "100px" }
        }
        animate={
          expand
            ? {
                scale: 1,
                x: 0,
                y: 0,
                width: 180,
                height: 80,
                borderRadius: "12px",
                backgroundColor: "#ffffff",
                transition: { duration: 0.35, ease: "easeOut" },
              }
            : {
                scale: 1,
                x: 0,
                y: 0,
                width: 56,
                height: 56,
                borderRadius: "100px",
                backgroundColor: "#3B82F6",
                transition: { duration: 0.3, ease: "easeInOut" },
              }
        }
        className={`flex flex-col justify-center items-center origin-bottom-right overflow-hidden
          ${
            expand
              ? // expanded menu shadow (softer and spread out)
                "shadow-[0_4px_12px_rgba(0,0,0,0.1),_0_6px_20px_rgba(0,0,0,0.08)] backdrop-blur-md"
              : // button shadow (deeper, more colored glow)
                "shadow-[0_4px_10px_rgba(59,130,246,0.4),_0_6px_16px_rgba(59,130,246,0.25)]"
          }
        `}
      >
        {!expand ? (
          <motion.button
            onClick={() => setExpand(true)}
            whileTap={{ scale: 0.9 }}
            className="text-white"
          >
            <FontAwesomeIcon
              icon={faAdd}
              aria-hidden="true"
              className="text-[22px]"
            />
          </motion.button>
        ) : (
          <motion.div
            className="flex flex-col items-center justify-center w-full h-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15, duration: 0.25 }}
          >
            <button
              onClick={() => {
                setExpand(false);
                setTimeout(() => {
                  onSelect("members");
                }, 1500);
              }}
              className="text-gray-700 px-3 py-1 w-full text-center rounded active:scale-[0.97]"
            >
              Invite Members
            </button>
            <button
              onClick={() => {
                setExpand(false);
                setTimeout(() => {
                  onSelect("agents");
                }, 1500);
              }}
              className="text-gray-700 px-3 py-1 w-full text-center rounded active:scale-[0.97]"
            >
              Add Agents
            </button>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}
