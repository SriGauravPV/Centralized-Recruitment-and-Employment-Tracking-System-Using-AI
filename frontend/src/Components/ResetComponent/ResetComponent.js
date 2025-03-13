import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import './ResetPassword.css'; 
import img from '../../img/bg.jpg';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const { token } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    // Verify token validity
    const checkToken = async () => {
      try {
        const response = await axios.get(`/api/auth/check-reset-token/${token}`);
        setTokenValid(true);
        setLoading(false);
      } catch (error) {
        setError('Invalid or expired reset link');
        setTokenValid(false);
        setLoading(false);
      }
    };

    checkToken();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validate password
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    // Validate password match
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      await axios.post(`/api/auth/reset-password/${token}`, { password });
      setResetSuccess(true);
      setTimeout(() => {
        navigate('/login-student');
      }, 3000);
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to reset password');
    }
  };

  if (loading) {
    return (
      <div className='reset-password-container'>
        <img src={img} alt="Background" width="100%" height="100%" style={{position:"absolute",zIndex:"-1"}}/>
        <Navbar />
        <div className='loading-container'>
          <p>Verifying reset link...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className='reset-password-container'>
      <Navbar />
      <img src={img} alt="Background" width="100%" height="100%" style={{position:"absolute",zIndex:"-1"}}/>
      <div className='reset-password-content' style={{marginTop:"30px", display: "flex", justifyContent: "center", alignItems: "center", height: "80vh", width: "100%" }}>
        <div className='wrapper' style={{marginTop:"60px"}}>
          <span className='bg-animate'></span>
          <div className='form-box reset-password mx-5'>
            <h2>RESET PASSWORD</h2>
            {!tokenValid ? (
              <div className='invalid-token'>
                <p className='error-message'>{error}</p>
                <button className='Login-btn' onClick={() => navigate('/student')}>Back to Login</button>
              </div>
            ) : resetSuccess ? (
              <div className='reset-success'>
                <p>Your password has been successfully reset!</p>
                <p>Redirecting to login page...</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className='input-box'>
                  <input 
                    type='password' 
                    required 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <label>New Password</label>
                  <i className='bx bxs-lock-alt'></i>
                </div>
                <div className='input-box'>
                  <input 
                    type='password' 
                    required 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <label>Confirm Password</label>
                  <i className='bx bxs-lock-alt'></i>
                </div>
                {error && <p className='error-message' style={{color: "red", marginBottom: "10px"}}>{error}</p>}
                <button type='submit' className='Login-btn'>Reset Password</button>
              </form>
            )}
          </div>
          {/* <div className='info-text reset'>
            <h2>Reset Your Password</h2>
            <p>Please create a strong password that includes at least 6 characters.</p>
          </div> */}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ResetPassword;