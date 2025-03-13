import React from "react";
import "./Navbar.css"; 
import logo from "../../assets/img/logo.jpeg";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate =useNavigate();
  const click1 =()=>{
    navigate("/contact");
  }
  return (
    <header className="header fixed-top" data-scrollto-offset="0" style={{ backgroundColor: "white" }}>
      <div className="container-fluid d-flex align-items-center justify-content-between">
        <a className="logo d-flex align-items-center scrollto" style={{ marginLeft: "2%" }}>
          <img src={logo} alt="Logo" onClick={() => navigate("/")} style={{ maxHeight: "150px", maxWidth: "150px",cursor:"pointer" }} />
        </a>

        <nav
          id="navbar"
          className={`navbar`}
          style={{ textAlign: "center", flexGrow: 1, marginLeft: "23%", }}
        >
          <ul className={`nav-menu`}>
            <li>
              <a className="nav-link scrollto" onClick={() => navigate("/")} style={{cursor:"pointer"}}>
                Home
              </a>
            </li>
            <li className="dropdown mx-2 my-2">
              <a href="#">
                <span>Login</span> <i className="bi bi-chevron-down dropdown-indicator "></i>
              </a>
              <ul>
                <li>
                  <a onClick={() => navigate("/admin")} style={{marginTop:"15px",cursor:"pointer"}}>Admin Login</a>
                </li>
                <li>
                  <a onClick={() => navigate("/student")} style={{cursor:"pointer"}}>Student Login</a>
                </li>
                <li>
                  <a onClick={() => navigate("/company")} style={{cursor:"pointer"}}>Company Login</a>
                </li>
              </ul>
            </li>
            <li className="dropdown">
              <a href="#">
                <span>Register</span> <i className="bi bi-chevron-down dropdown-indicator"></i>
              </a>
              <ul>
                <li>
                  <a onClick={() => navigate("/register-student")} style={{marginTop:"15px",cursor:"pointer"}}>Students</a>
                </li>
                <li>
                  <a onClick={() => navigate("/register-company")} style={{cursor:"pointer"}}>Company</a>
                </li>
              </ul>
            </li>
            <li>
              <a className="nav-link scrollto" onClick={click1} style={{cursor:"pointer"}}>
                Contact
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
