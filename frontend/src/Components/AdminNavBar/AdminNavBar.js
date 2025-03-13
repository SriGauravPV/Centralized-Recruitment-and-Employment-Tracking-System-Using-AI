import React from 'react';
import { Nav, Navbar, Button } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import logo from "../../assets/img/logo.jpeg";

const AdminNavBar = () => {
  const navigate = useNavigate(); 

  const navItems = [
    { label: 'Dashboard', path: '/home/adminDashboard' },
    { label: 'Database', path: '/home/students-database' },
    { label: 'Applications', path: '/home/applied-students-database' },
    { label: 'Placed Students', path: '/home/PlacedStudents' }
  ];

  return (
    <Navbar expand="lg" className="px-2 py-3 bg-white" style={{ height: "90px" }}>
      <div className="container-fluid">
        <motion.div
          className="navbar-brand"
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <a className="logo d-flex align-items-center scrollto" style={{ marginLeft: "2%" }}>
            <img src={logo} onClick={() => navigate('/')} alt="Logo" style={{ maxHeight: "150px", maxWidth: "150px",cursor:"pointer" }} />
          </a>
        </motion.div>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mx-auto">
            {navItems.map((item, index) => (
              <motion.div
                key={index}
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 * index, duration: 0.4 }}
              >
                <Nav.Link onClick={() => navigate(item.path)} className="text-black mx-3">
                  {item.label}
                </Nav.Link>
              </motion.div>
            ))}
          </Nav>

          <motion.div
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <Button variant="outline-dark" onClick={() => {navigate('/');sessionStorage.clear();}}>Logout</Button>
          </motion.div>
        </Navbar.Collapse>
      </div>
    </Navbar>
  );
};

export default AdminNavBar;
