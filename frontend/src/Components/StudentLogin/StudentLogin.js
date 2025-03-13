import React from 'react'
import Navbar from '../Navbar/Navbar'
import './StudentLogin.css'
import Footer from '../Footer/Footer'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react';
import axios from 'axios';
import ChatBot from '../ChatBot/ChatBot'
import img from '../../img/bg.jpg'

const StudentLogin = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [forgotPassword, setForgotPassword] = useState(false);
    const [resetEmail, setResetEmail] = useState('');
    const [resetSuccess, setResetSuccess] = useState(false);
    const [resetError, setResetError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const type = "student";
            const response = await axios.post(`/api/auth/login/${type}`, formData);
            sessionStorage.setItem('token', response.data.token);
            sessionStorage.setItem('role', response.data.type);
            console.log(response.data.type)
            navigate('/home/studentWebPage');
        } catch (error) {
            alert(error.response?.data?.error || 'Login failed');
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleForgotPassword = () => {
        setForgotPassword(true);
    };

    const handleResetEmailChange = (e) => {
        setResetEmail(e.target.value);
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setResetError('');
        
        if (!resetEmail) {
            setResetError('Please enter your email');
            return;
        }

        try {
            // Call API to send password reset link
            await axios.post('/api/auth/forgot-password', { email: resetEmail, type: 'student' });
            setResetSuccess(true);
        } catch (error) {
            setResetError(error.response?.data?.error || 'Failed to send reset link. Please try again.');
        }
    };

    const handleBackToLogin = () => {
        setForgotPassword(false);
        setResetSuccess(false);
        setResetError('');
    };

    return (
        <div className='student-login-container'>
            <img src={img} alt="Test" width="100%" height="100%" style={{position:"absolute",zIndex:"-1"}}/>
            <Navbar />
            <h1>Student Login</h1>
            <div className='student-start ' style={{marginTop:"30px", display: "flex", justifyContent: "center", alignItems: "center", height: "75vh", width: "100%" }}>
                <div className='wrapper'>
                    <span className='bg-animate'></span>
                    {!forgotPassword ? (
                        <div className='form-box login'>
                            <h2>STUDENT LOGIN</h2>
                            <form>
                                <div className='input-box'>
                                    <input type='text' name="email" required onChange={handleChange} value={formData.email}></input>
                                    <label>Email</label>
                                    <i className='bx bxs-user'></i>
                                </div>
                                <div className='input-box'>
                                    <input type='password' name="password" required value={formData.password} onChange={handleChange}></input>
                                    <label>Password</label>
                                    <i className='bx bxs-lock-alt'></i>
                                </div>
                                <div className='forgot-password'>
                                    <p onClick={handleForgotPassword} style={{cursor:"pointer", color: "#3498db", textDecoration: "underline", marginBottom: "10px"}}>Forgot Password?</p>
                                </div>
                                <button type='submit' className='Login-btn' onClick={handleSubmit}>Login</button>
                                <div className='logreg-link'>
                                    <p>Don't have an account? <a className='link' onClick={() => (navigate('/register-student'))} style={{cursor:"pointer"}}>Register</a></p>
                                </div>
                            </form>
                        </div>
                    ) : (
                        <div className='form-box forgot-password'>
                            <h2>RESET PASSWORD</h2>
                            {resetSuccess ? (
                                <div className='reset-success'>
                                    <p>Password reset link sent to your email. Please check your inbox and follow the instructions.</p>
                                    <button className='Login-btn' onClick={handleBackToLogin}>Back to Login</button>
                                </div>
                            ) : (
                                <form>
                                    <p className='reset-instruction mx-5'>Enter your email address to receive a password reset link</p>
                                    <div className='input-box mx-5  '>
                                        <input type='text' name="resetEmail" required onChange={handleResetEmailChange} value={resetEmail}></input>
                                        <label>Email</label>
                                        <i className='bx bxs-envelope'></i>
                                    </div>
                                    {resetError && <p className='error-message' style={{color: "red", marginBottom: "10px"}}>{resetError}</p>}
                                    <button type='submit' className='Login-btn mx-5' onClick={handleResetPassword}>Send Reset Link</button>
                                    <div className='back-to-login mx-5'>
                                        <p onClick={handleBackToLogin} style={{cursor:"pointer", color: "#3498db", textDecoration: "underline", marginTop: "10px"}}>Back to Login</p>
                                    </div>
                                </form>
                            )}
                        </div>
                    )}
                    <div className='info-text login'>
                        <h2>welcome back!</h2>
                        <p>This login is only for REVA UNIVERSITY Final year Student</p>
                    </div>
                </div>
            </div>
            <ChatBot />
            <Footer />
        </div>
    )
}

export default StudentLogin;