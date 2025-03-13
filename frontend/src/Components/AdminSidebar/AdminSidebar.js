import React from 'react';
import { motion } from "framer-motion";
import { FaUser, FaClipboardList, FaEnvelope, FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const AdminSidebar = ({ selectedItem, setSelectedItem }) => {
  const navigate = useNavigate();
  
  const menuItems = [
    { label: "Dashboard", icon: <FaUser /> },
    { label: "Active Drives", icon: <FaClipboardList /> },
    { label: "Student Profile", icon: <FaEnvelope /> },
    { label: "Company Profile", icon: <FaEnvelope /> },
    { label: "Email", icon: <FaEnvelope /> },
    { label: "Logout", icon: <FaSignOutAlt />, action: "logout" },
  ];

  const handleItemClick = (label, action) => {
    if (action === "logout") {
      sessionStorage.clear();
      navigate("/");
    } else {
      setSelectedItem(label);
    }
  };

  return (
    <motion.div
      className="d-flex flex-column p-3 bg-white shadow"
      style={{ height: "85vh", width: "20%" }}
      initial={{ x: -200, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mb-3 fw-bold text-dark">Welcome</div>
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
              className={`nav-link text-dark d-flex align-items-center border-0 bg-transparent ${
                selectedItem === item.label ? "fw-bold" : ""
              }`}
              onClick={() => handleItemClick(item.label, item.action)}
            >
              {item.icon} <span className="ms-2">{item.label}</span>
            </button>
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
};

export default AdminSidebar;
