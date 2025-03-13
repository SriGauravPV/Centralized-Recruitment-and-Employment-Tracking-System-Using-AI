import React from 'react'
import Navbar from '../Navbar/Navbar'
import Footer from '../Footer/Footer'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react';
import axios from 'axios';
import ChatBot from '../ChatBot/ChatBot';

const CompanyLogin = () => {
    const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const response = await axios.post("/api/auth/login/company", formData);
        sessionStorage.setItem('token', response.data.token);
        sessionStorage.setItem('role', 'company'); // Store the role in sessionStorage
        navigate('/home/CompanyDashboard');
    } catch (error) {
        alert(error.response?.data?.error || 'Login failed');
    }
};


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  return (
    <div>
      <Navbar />
            <h1>Student Login</h1>
            <div className='student-start ' style={{marginTop:"30px", display: "flex", justifyContent: "center", alignItems: "center", backgroundColor: "white", height: "75vh", width: "100%" }}>
                <div className='wrapper'>
                <span className='bg-animate'></span>
                    <div className='form-box login'>
                        <h2>COMPANY LOGIN</h2>
                        <form>
                            <div className='input-box'>
                                <input type='text' name="email" required onChange={handleChange}value={formData.email}></input>
                                <label>Email</label>
                                <i class='bx bxs-user'></i>
                            </div>
                            <div className='input-box'>
                                <input type='password'name="password" required value={formData.password}onChange={handleChange}></input>
                                <label>Password</label>
                                <i class='bx bxs-lock-alt' ></i>
                            </div>
                            <button type='submit' class='Login-btn'onClick={handleSubmit}>Login</button>
                            <div className='logreg-link'>
                                <p>Don't have an account? <a className='link'onClick={() => (navigate('/register-company'))} style={{cursor:"pointer"}}>Register</a></p>
                            </div>
                        </form>
                    </div>
                    <div className='info-text login'>
                        <h2>welcome back!</h2>
                        <p>This login is only for REVA UNIVERSITY onCampus Companies only</p>
                    </div>
                </div>
            </div>
            <ChatBot />
            <Footer />
    </div>
  )
}

export default CompanyLogin
