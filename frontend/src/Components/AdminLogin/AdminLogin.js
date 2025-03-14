import React from 'react';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import ChatBot from '../ChatBot/ChatBot';

const AdminLogin = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
   
    // Hardcoded admin credentials
    const validCredentials = [
        { email: 'admin@reva.edu', password: 'admin123' },
        { email: 'dean@reva.edu', password: 'dean123' },
        { email: 'hod@reva.edu', password: 'hod123' }
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
       
        // Check if credentials match any valid admin
        const isValidAdmin = validCredentials.some(
            admin => admin.email === formData.email && admin.password === formData.password
        );
        if (isValidAdmin) {
            // Store a simple token in localStorage
            sessionStorage.setItem('role', 'admin');
            sessionStorage.setItem('token', 'admin-token-' + Date.now());
            sessionStorage.setItem('adminemail', formData.email);
            navigate('/home/adminDashboard');
        } else {
            alert('Invalid credentials. Please try again.');
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div>
            <Navbar />
            <h1>Admin Login</h1>
            <div className='student-start' style={{
                marginTop: "30px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "white",
                height: "75vh",
                width: "100%"
            }}>
                <div className='wrapper'>
                    <span className='bg-animate'></span>
                    <div className='form-box login'>
                        <h2>REVA ADMIN LOGIN</h2>
                        <form onSubmit={handleSubmit}>
                            <div className='input-box'>
                                <input
                                    type='text'
                                    name="email"
                                    required
                                    onChange={handleChange}
                                    value={formData.email}
                                />
                                <label>Email</label>
                                <i className='bx bxs-user'></i>
                            </div>
                            <div className='input-box'>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                />
                                <label>Password</label>
                                <i className='bx bxs-lock-alt'></i>
                                <i 
                                    className={`bx ${showPassword ? 'bxs-hide' : 'bxs-show'}`} 
                                    onClick={togglePasswordVisibility}
                                    style={{
                                        position: "absolute",
                                        right: "25px", 
                                        cursor: "pointer",
                                        fontSize: "1.2rem"
                                    }}
                                ></i>
                            </div>
                            <button type='submit' className='Login-btn'>
                                Login
                            </button>
                        </form>
                    </div>
                    <div className='info-text login'>
                        <h2>Welcome Back!</h2>
                        <p>This login is only for REVA UNIVERSITY Admins Only</p>
                    </div>
                </div>
            </div>
            <ChatBot />
            <Footer />
        </div>
    );
};

export default AdminLogin;