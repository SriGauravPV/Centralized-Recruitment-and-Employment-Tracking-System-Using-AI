import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ChangePass.css';

const ChangePass = () => {
  // Get user type from sessionStorage
  const [userType, setUserType] = useState('');
  
  // Original states from previous code
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [deactivate, setDeactivate] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  
  // Added current password state
  const [currentPassword, setCurrentPassword] = useState('');
  
  // Deactivation states
  const [deactivatePassword, setDeactivatePassword] = useState('');
  const [confirmDeactivation, setConfirmDeactivation] = useState(false);
  
  // Status messages
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Get token from session storage
  const getToken = () => {
    return sessionStorage.getItem('token');
  };

  // Check user type on component mount
  useEffect(() => {
    const role = sessionStorage.getItem('role');
    if (!role) {
      setError('User role not found. Please log in again.');
      setTimeout(() => {
        window.location.href = '/login';
      }, 2000);
      return;
    }
    
    setUserType(role);
  }, []);

  // Handle submit (original form)
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form
    if (!currentPassword || !password || !confirmPassword) {
      setError('All password fields are required');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }
    
    // Proceed with password change
    handlePasswordChange();
  };

  // Handle password change
  const handlePasswordChange = async () => {
    // Reset messages
    setMessage('');
    setError('');
    
    // Validate password length
    if (password.length < 8) {
      setError('New password must be at least 8 characters long');
      return;
    }
    
    setLoading(true);
    
    try {
      const token = getToken();
      
      // Different endpoints based on user type
      const endpoint = userType === 'company' 
        ? '/api/company/change-password'
        : '/api/student/change-password';
      
      const response = await axios.post(
        endpoint,
        {
          currentPassword,
          newPassword: password,
          confirmPassword
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      // Show success message
      setShowSuccessMessage(true);
      
      // Clear form
      setCurrentPassword('');
      setPassword('');
      setConfirmPassword('');
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 3000);
      
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Handle account deactivation
  const handleDeactivateAccount = async () => {
    // Reset messages
    setMessage('');
    setError('');
    
    // Validate form
    if (!deactivatePassword) {
      setError('Password is required to deactivate your account');
      return;
    }
    
    if (!confirmDeactivation) {
      setError('Please confirm that you want to deactivate your account');
      return;
    }
    
    setLoading(true);
    
    try {
      const token = getToken();
      
      // Different endpoints based on user type
      const endpoint = userType === 'company' 
        ? '/api/company/deactivate'
        : '/api/student/deactivate';
      
      const response = await axios.post(
        endpoint,
        {
          password: deactivatePassword
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      setMessage(response.data.message);
      
      // Clear sessionStorage and redirect to login
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('role');
      
      // Redirect after a short delay
      setTimeout(() => {
        window.location.href = '/';
      }, 3000);
      
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ChangePass-container">
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            {/* User Type Indicator */}
            {userType && (
              <div className="alert alert-info mb-4">
                You are logged in as: <strong>{userType === 'company' ? 'Company' : 'Student'}</strong>
              </div>
            )}
            
            {/* Success Message Toast */}
            <div className={`toast-message ${showSuccessMessage ? 'show' : ''}`}>
              Password changed successfully!
            </div>

            {/* Error Message */}
            {error && (
              <div className="alert alert-danger mb-4">
                {error}
              </div>
            )}

            {/* Main Card */}
            <div className="password-card">
              <div className="card-body">
                <h2 className="card-title">
                  Change Password
                </h2>

                <form onSubmit={handleSubmit} className="mt-4">
                  <div className="mb-4">
                    <div className="form-floating password-input-container">
                      <input
                        type="password"
                        className="form-control custom-input"
                        id="currentPassword"
                        placeholder="Current Password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                      />
                      <label htmlFor="currentPassword">Current Password</label>
                      <div className="input-focus-effect"></div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="form-floating password-input-container">
                      <input
                        type="password"
                        className="form-control custom-input"
                        id="newPassword"
                        placeholder="New Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <label htmlFor="newPassword">Type in new password that you want to use</label>
                      <div className="input-focus-effect"></div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="form-floating password-input-container">
                      <input
                        type="password"
                        className="form-control custom-input"
                        id="confirmPassword"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                      <label htmlFor="confirmPassword">Confirm Password</label>
                      <div className="input-focus-effect"></div>
                    </div>
                  </div>

                  <div className="d-flex justify-content-between align-items-center flex-wrap">
                    <button 
                      type="submit" 
                      className="btn btn-success change-password-btn"
                      disabled={loading}
                    >
                      <span className="btn-text">
                        {loading ? 'Processing...' : 'Change Password'}
                      </span>
                      <span className="btn-icon">
                        {/* Icon will be handled by CSS */}
                      </span>
                    </button>

                    <div className="form-check deactivate-check">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id="deactivateCheck"
                        checked={deactivate}
                        onChange={(e) => setDeactivate(e.target.checked)}
                      />
                      <label className="form-check-label" htmlFor="deactivateCheck">
                        I Want To Deactivate My Account
                      </label>
                    </div>
                  </div>

                  {deactivate && (
                    <div className="deactivate-button-container">
                      <div className="mt-4">
                        <div className="form-floating password-input-container">
                          <input
                            type="password"
                            className="form-control custom-input"
                            id="deactivatePassword"
                            placeholder="Enter Your Password"
                            value={deactivatePassword}
                            onChange={(e) => setDeactivatePassword(e.target.value)}
                          />
                          <label htmlFor="deactivatePassword">Enter Your Password to Confirm</label>
                          <div className="input-focus-effect"></div>
                        </div>
                      </div>

                      <div className="form-check mt-3 mb-3">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          id="confirmDeactivation"
                          checked={confirmDeactivation}
                          onChange={(e) => setConfirmDeactivation(e.target.checked)}
                        />
                        <label className="form-check-label" htmlFor="confirmDeactivation">
                          I understand this action and want to deactivate my account
                        </label>
                      </div>

                      <button 
                        type="button" 
                        className="btn btn-danger deactivate-btn"
                        onClick={handleDeactivateAccount}
                        disabled={loading || !deactivatePassword || !confirmDeactivation}
                      >
                        Deactivate My Account
                      </button>
                    </div>
                  )}
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePass;