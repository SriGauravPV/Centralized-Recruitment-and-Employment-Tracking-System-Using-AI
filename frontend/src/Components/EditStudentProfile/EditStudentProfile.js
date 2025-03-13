import React, { useState, useEffect } from 'react';
import { Save, Upload, AlertCircle } from 'lucide-react';
import axios from 'axios';

const EditProfileForm = ({ studentData }) => {
  const [formData, setFormData] = useState({
    firstName: studentData?.firstName || '',
    lastName: studentData?.lastName || '',
    email: studentData?.email || '',
    contactNumber: studentData?.phone || '',
    highestQualification: studentData?.qualification || '',
    stream: studentData?.stream || '',
    address: studentData?.address || '',
    city: studentData?.city || '',
    state: studentData?.state || '',
    skills: studentData?.skills || '',
    aboutMe: studentData?.aboutMe || '',
    tenthmarks: studentData?.tenthmarks || '',
    twelthmarks: studentData?.twelthmarks || '',
    ugmarks: studentData?.ugmarks || '',
    pgmarks: studentData?.pgmarks || '',
  });

  const [resumeFile, setResumeFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    // Update form data when studentData changes
    if (studentData) {
      setFormData({
        firstName: studentData.firstName || '',
        lastName: studentData.lastName || '',
        email: studentData.email || '',
        contactNumber: studentData.phone || '',
        highestQualification: studentData.qualification || '',
        stream: studentData.stream || '',
        address: studentData.address || '',
        city: studentData.city || '',
        state: studentData.state || '',
        skills: studentData.skills || '',
        aboutMe: studentData.aboutMe || '',
        tenthmarks: studentData.tenthmarks || '',
        twelthmarks: studentData.twelthmarks || '',
        ugmarks: studentData.ugmarks || '',
        pgmarks: studentData.pgmarks || '',
      });
    }
  }, [studentData]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setResumeFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const token = sessionStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token not found');
      }

      // Update profile information
      const response = await axios.put(
        '/api/student/profile',
        formData,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );

      // If there's a resume file, upload it
      if (resumeFile) {
        const formData = new FormData();
        formData.append('resume', resumeFile);
        
        await axios.post(
          '/api/student/upload-resume',
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
              'Authorization': `Bearer ${token}`
            }
          }
        );
      }

      setMessage({ 
        type: 'success', 
        text: 'Profile updated successfully!' 
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.error || 'Failed to update profile. Please try again.' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="edit-profile-container" >
      <div className="form-wrapper">
        <div className="profile-card">
          <div className="profile-header">
            <h2>Edit Profile</h2>
            <div className="important-notice">
              <p>
                All the details provided by you must be absolutely correct and genuine. If found incorrect during further verification, then your
                candidature might get dismissed from the entire placement process.
              </p>
            </div>
          </div>

          {message.text && (
            <div className={`alert ${message.type === 'success' ? 'alert-success' : 'alert-danger'}`} 
                 style={{ 
                   margin: '1rem 2rem 0', 
                   padding: '0.75rem 1rem',
                   borderRadius: '8px',
                   display: 'flex',
                   alignItems: 'center',
                   gap: '0.5rem',
                   backgroundColor: message.type === 'success' ? '#d1e7dd' : '#f8d7da',
                   color: message.type === 'success' ? '#0f5132' : '#842029'
                 }}>
              <AlertCircle size={18} />
              {message.text}
            </div>
          )}

          <form className="profile-form" onSubmit={handleSubmit}>
            <div className="row g-4">
              <div className="col-md-6">
                <div className="form-group">
                  <input
                    type="text"
                    className="form-control custom-input"
                    name="firstName"
                    placeholder="First Name"
                    value={formData.firstName}
                    onChange={handleInputChange}
                  />
                  <span className="focus-border"></span>
                </div>
              </div>

              <div className="col-md-6">
                <div className="form-group">
                  <input
                    type="text"
                    className="form-control custom-input"
                    name="lastName"
                    placeholder="Last Name"
                    value={formData.lastName}
                    onChange={handleInputChange}
                  />
                  <span className="focus-border"></span>
                </div>
              </div>

              <div className="col-md-6">
                <div className="form-group">
                  <input
                    type="email"
                    className="form-control custom-input"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled // Email shouldn't be editable
                  />
                  <span className="focus-border"></span>
                </div>
              </div>

              <div className="col-md-6">
                <div className="form-group">
                  <input
                    type="tel"
                    className="form-control custom-input"
                    name="contactNumber"
                    placeholder="Contact Number"
                    value={formData.contactNumber}
                    onChange={handleInputChange}
                  />
                  <span className="focus-border"></span>
                </div>
              </div>

              <div className="col-12">
                <div className="form-group">
                  <textarea
                    className="form-control custom-input"
                    name="aboutMe"
                    placeholder="About Me"
                    rows="4"
                    value={formData.aboutMe}
                    onChange={handleInputChange}
                  ></textarea>
                  <span className="focus-border"></span>
                </div>
              </div>

              <div className="col-md-6">
                <div className="form-group">
                  <input
                    type="text"
                    className="form-control custom-input"
                    name="skills"
                    placeholder="Skills"
                    value={formData.skills}
                    onChange={handleInputChange}
                  />
                  <span className="focus-border"></span>
                </div>
              </div>

              <div className="col-md-6">
                <div className="form-group">
                  <input
                    type="number"
                    className="form-control custom-input"
                    name="tenthmarks"
                    placeholder="10th Marks"
                    value={formData.tenthmarks}
                    onChange={handleInputChange}
                  />
                  <span className="focus-border"></span>
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <input
                    type="text"
                    className="form-control custom-input"
                    name="twelthmarks"
                    placeholder="12th Marks"
                    value={formData.twelthmarks}
                    onChange={handleInputChange}
                  />
                  <span className="focus-border"></span>
                </div>
              </div>

              <div className="col-md-6">
                <div className="form-group">
                  <input
                    type="number"
                    className="form-control custom-input"
                    name="ugmarks"
                    placeholder="UG Marks"
                    value={formData.ugmarks}
                    onChange={handleInputChange}
                  />
                  <span className="focus-border"></span>
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <input
                    type="text"
                    className="form-control custom-input"
                    name="pgmarks"
                    placeholder="PG Marks"
                    value={formData.pgmarks}
                    onChange={handleInputChange}
                  />
                  <span className="focus-border"></span>
                </div>
              </div>

              <div className="col-12">
                <div className="file-upload-wrapper">
                  <div className="file-upload-area">
                    <input 
                      type="file" 
                      id="file-upload" 
                      className="file-input" 
                      onChange={handleFileChange}
                      accept=".pdf,.doc,.docx"
                    />
                    <label htmlFor="file-upload" className="file-label">
                      <span className="upload-icon">📎</span>
                      <span className="upload-text">
                        {resumeFile ? resumeFile.name : "Drop Resume files here or click to upload Resume"}
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="col-12">
                <button 
                  type="submit" 
                  className="submit-btn"
                  disabled={loading}
                >
                  <Save className="btn-icon" />
                  <span>{loading ? "Updating..." : "Update Profile"}</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      <style>
        {`
          .edit-profile-container {
            min-height: 100vh;
            padding: 2rem;
            background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
          }

          .form-wrapper {
            max-width: 1200px;
            margin: 0 auto;
          }

          .profile-card {
            background: white;
            border-radius: 15px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
            overflow: hidden;
            transform: translateY(0);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            animation: slideIn 0.5s ease-out;
          }

          .profile-card:hover {
            transform: translateY(-10px);
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
          }

          .profile-header {
            background: linear-gradient(135deg, #0061ff 0%, #60efff 100%);
            padding: 2rem;
            color: white;
          }

          .important-notice {
            background: rgba(255, 255, 255, 0.2);
            padding: 1rem;
            border-radius: 10px;
            margin-top: 1rem;
            animation: pulse 2s infinite;
          }

          .profile-form {
            padding: 2rem;
          }

          .form-group {
            position: relative;
            margin-bottom: 1.5rem;
          }

          .custom-input {
            width: 100%;
            padding: 1rem;
            border: 2px solid #e0e0e0;
            border-radius: 8px;
            transition: all 0.3s ease;
            background: transparent;
          }

          .custom-input:focus {
            outline: none;
            border-color: #0061ff;
            box-shadow: 0 0 0 4px rgba(0, 97, 255, 0.1);
          }

          .focus-border {
            position: absolute;
            bottom: 0;
            left: 0;
            width: 0;
            height: 2px;
            background: #0061ff;
            transition: width 0.3s ease;
          }

          .custom-input:focus ~ .focus-border {
            width: 100%;
          }

          .file-upload-wrapper {
            margin: 2rem 0;
          }

          .file-upload-area {
            border: 2px dashed #0061ff;
            border-radius: 10px;
            padding: 2rem;
            text-align: center;
            transition: all 0.3s ease;
            cursor: pointer;
          }

          .file-upload-area:hover {
            background: rgba(0, 97, 255, 0.05);
          }

          .file-input {
            display: none;
          }

          .upload-icon {
            font-size: 2rem;
            margin-bottom: 1rem;
            display: block;
          }

          .upload-text {
            color: #666;
          }

          .submit-btn {
            width: 100%;
            padding: 1rem 2rem;
            background: linear-gradient(135deg, #0061ff 0%, #60efff 100%);
            border: none;
            border-radius: 8px;
            color: white;
            font-weight: bold;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
            cursor: pointer;
            transition: all 0.3s ease;
            transform: translateY(0);
          }

          .submit-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 20px rgba(0, 97, 255, 0.2);
          }

          .submit-btn:disabled {
            opacity: 0.7;
            cursor: not-allowed;
            transform: translateY(0);
            box-shadow: none;
          }

          .btn-icon {
            width: 20px;
            height: 20px;
          }

          @keyframes slideIn {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes pulse {
            0% {
              opacity: 1;
              transform: scale(1);
            }
            50% {
              opacity: 0.8;
              transform: scale(1.02);
            }
            100% {
              opacity: 1;
              transform: scale(1);
            }
          }

          /* Input animation on type */
          .custom-input:not(:placeholder-shown) {
            border-color: #0061ff;
          }

          /* Ripple effect on button click */
          .submit-btn {
            position: relative;
            overflow: hidden;
          }

          .submit-btn:after {
            content: '';
            position: absolute;
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
            pointer-events: none;
            background-image: radial-gradient(circle, #fff 10%, transparent 10.01%);
            background-repeat: no-repeat;
            background-position: 50%;
            transform: scale(10, 10);
            opacity: 0;
            transition: transform .5s, opacity 1s;
          }

          .submit-btn:active:after {
            transform: scale(0, 0);
            opacity: .3;
            transition: 0s;
          }

          /* Hover effects for form groups */
          .form-group:hover .custom-input {
            transform: translateX(5px);
          }
        `}
      </style>
    </div>
  );
};

export default EditProfileForm;