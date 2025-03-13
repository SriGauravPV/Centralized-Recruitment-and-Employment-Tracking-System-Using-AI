import React from 'react'
import { motion } from "framer-motion";
import { FaUser, FaClipboardList, FaEnvelope, FaCog, FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const CompanySideBar = () => {
    const menuItems = [
      { label: "Edit Profile", icon: <FaUser /> },
      { label: "Post Drive", icon: <FaClipboardList /> },
      { label: "Current Drive", icon: <FaEnvelope /> },
      { label: "MailBox", icon: <FaEnvelope /> },
      { label: "Settings", icon: <FaCog /> },
      { label: "Logout", icon: <FaSignOutAlt />, action: "logout" }, 
    ];
  return (
    <div>
      <motion.div
      className="d-flex flex-column p-3 bg-white shadow sidebar"
      style={{ height: "85vh", width: "150%" }}
      initial={{ x: -200, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mb-3 fw-bold text-dark">
      Welcome {/*  <span className="fw-bold text-dark">{studentData?.firstName || "Student"}</span> */}
      </div>

      <ul className="nav flex-column">
        {menuItems.map((item, index) => (
          <motion.li
            key={index}
            className="nav-item"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: index * 0.1, duration: 0.3 }}
          >
            <button
              className="nav-link text-dark d-flex align-items-center border-0 bg-transparent"
            //   onClick={() => handleItemClick(item.label, item.action)}
            >
              {item.icon} <span className="ms-2">{item.label}</span>
            </button>
          </motion.li>
        ))}
      </ul>
    </motion.div>
    </div>
  )
}

export default CompanySideBar
