import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CompanyProfileEdit = () => {
  const [formData, setFormData] = useState({
    companyName: '',
    email: '',
    phone: '',
    address: '',
    website: '',
    description: '',
    logo: '',
    industry: 'Technology',
    foundedYear: ''
  });

  const [isEditing, setIsEditing] = useState(false);
  const [savedMessage, setSavedMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Fetch company data on component mount
  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        setIsLoading(true);
        const token = sessionStorage.getItem('token'); // Assuming token is stored in sessionStorage
        
        const response = await axios.get('/api/company/profile', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        // Map MongoDB schema fields to form fields
        const company = response.data;
        setFormData({
          companyName: company.companyName || '',
          email: company.email || '',
          phone: company.phoneNumber || '',
          address: company.country || '', // Using country field for address
          website: company.website || '',
          description: company.companyDescription || '',
          logo: company.profilePictureUrl || '',
          industry: 'Technology', // Default since not in schema
          foundedYear: ''
        });
        
        setIsLoading(false);
      } catch (err) {
        setError('Failed to load company profile');
        setIsLoading(false);
        console.error('Error fetching company data:', err);
      }
    };

    fetchCompanyData();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    
    if (name === 'logo' && files && files[0]) {
      // Handle file upload
      setFormData({
        ...formData,
        logo: files[0]
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      
      const token = sessionStorage.getItem('token');
      
      // Create FormData object to handle file upload
      const data = new FormData();
      data.append('companyName', formData.companyName);
      data.append('email', formData.email);
      data.append('phoneNumber', formData.phone);
      data.append('country', formData.address); // Using address for country field
      data.append('website', formData.website);
      data.append('companyDescription', formData.description);
      
      // Only append logo if it's a File object (new upload)
      if (formData.logo instanceof File) {
        data.append('profilePicture', formData.logo);
      }
      
      await axios.put('/api/company/profile', data, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      
      setIsEditing(false);
      setSavedMessage('Changes saved successfully!');
      setTimeout(() => setSavedMessage(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
      console.error('Error updating company profile:', err);
    }
  };

  if (isLoading) {
    return <div className="container py-5 text-center">Loading...</div>;
  }

  return (
    <div className="container py-5">
      <style>
        {`
          .fancy-input {
            position: relative;
            margin-bottom: 35px;
          }

          .fancy-input input,
          .fancy-input textarea,
          .fancy-input select {
            width: 100%;
            padding: 15px;
            border: 2px solid #e0e0e0;
            border-radius: 8px;
            background: white;
            transition: all 0.3s ease;
            font-size: 16px;
            line-height: 1.5;
          }

          .fancy-input input:focus,
          .fancy-input textarea:focus,
          .fancy-input select:focus {
            border-color: #007bff;
            box-shadow: 0 0 0 4px rgba(0,123,255,.1);
            outline: none;
          }

          .fancy-input label {
            position: absolute;
            left: 15px;
            top: 50%;
            transform: translateY(-50%);
            background: white;
            padding: 0 5px;
            color: #6c757d;
            transition: all 0.2s ease;
            pointer-events: none;
          }

          .fancy-input textarea ~ label {
            top: 25px;
          }

          .fancy-input input:focus ~ label,
          .fancy-input input:not(:placeholder-shown) ~ label,
          .fancy-input textarea:focus ~ label,
          .fancy-input textarea:not(:placeholder-shown) ~ label,
          .fancy-input select:focus ~ label,
          .fancy-input select:not(:placeholder-shown) ~ label {
            top: -12px;
            left: 10px;
            font-size: 14px;
            color: #007bff;
            font-weight: 600;
            transform: translateY(0);
          }

          .fancy-input input:disabled,
          .fancy-input textarea:disabled,
          .fancy-input select:disabled {
            background-color: #f8f9fa;
            cursor: not-allowed;
            border-style: dashed;
          }

          .fancy-input .input-icon {
            position: absolute;
            right: 15px;
            top: 50%;
            transform: translateY(-50%);
            color: #6c757d;
          }

          .fancy-input input:focus ~ .input-icon,
          .fancy-input textarea:focus ~ .input-icon {
            color: #007bff;
          }

          .input-counter {
            position: absolute;
            right: 10px;
            bottom: -20px;
            font-size: 12px;
            color: #6c757d;
          }

          .fancy-input.has-error input {
            border-color: #dc3545;
          }

          .fancy-input.has-error label {
            color: #dc3545;
          }

          .error-message {
            font-size: 12px;
            color: #dc3545;
            margin-top: 5px;
            margin-left: 10px;
          }

          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            75% { transform: translateX(5px); }
          }

          .fancy-input.has-error input {
            animation: shake 0.3s ease-in-out;
          }

          /* Custom file input styling */
          .file-input-wrapper {
            position: relative;
            overflow: hidden;
            display: inline-block;
          }

          .file-input-wrapper input[type="file"] {
            position: absolute;
            left: 0;
            top: 0;
            opacity: 0;
            cursor: pointer;
          }

          .file-input-button {
            display: inline-block;
            padding: 10px 20px;
            background: #007bff;
            color: white;
            border-radius: 5px;
            cursor: pointer;
            transition: all 0.3s ease;
          }

          .file-input-button:hover {
            background: #0056b3;
          }
        `}
      </style>

      <div className="card shadow-lg">
        <div className="card-body p-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="card-title h3">Company Profile</h2>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className={`btn ${isEditing ? 'btn-danger' : 'btn-primary'} px-4 py-2`}
            >
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </button>
          </div>

          {error && (
            <div className="alert alert-danger mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-6">
                <div className="fancy-input">
                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    disabled={!isEditing}
                    placeholder=" "
                    required
                  />
                  <label>Company Name</label>
                  <span className="input-icon">🏢</span>
                </div>
              </div>

              <div className="col-md-6">
                <div className="fancy-input">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={!isEditing}
                    placeholder=" "
                    pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                    required
                  />
                  <label>Email</label>
                  <span className="input-icon">✉️</span>
                </div>
              </div>

              <div className="col-md-6">
                <div className="fancy-input">
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    disabled={!isEditing}
                    placeholder=" "
                    pattern="[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}"
                  />
                  <label>Phone</label>
                  <span className="input-icon">📞</span>
                </div>
              </div>

              <div className="col-md-6">
                <div className="fancy-input">
                  <select
                    name="industry"
                    value={formData.industry}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="form-select"
                  >
                    <option value="Technology">Technology</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Finance">Finance</option>
                    <option value="Education">Education</option>
                    <option value="Other">Other</option>
                  </select>
                  <label>Industry</label>
                  <span className="input-icon">🏭</span>
                </div>
              </div>

              <div className="col-md-6">
                <div className="fancy-input">
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    disabled={!isEditing}
                    placeholder=" "
                  />
                  <label>Country</label>
                  <span className="input-icon">📍</span>
                </div>
              </div>

              <div className="col-md-6">
                <div className="fancy-input">
                  <input
                    type="url"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    disabled={!isEditing}
                    placeholder=" "
                    required
                  />
                  <label>Website</label>
                  <span className="input-icon">🌐</span>
                </div>
              </div>

              <div className="col-12">
                <div className="fancy-input">
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    disabled={!isEditing}
                    placeholder=" "
                    rows="4"
                    maxLength="500"
                  />
                  <label>Description</label>
                  <div className="input-counter">
                    {formData.description.length}/500
                  </div>
                </div>
              </div>

              {isEditing && (
                <div className="col-12">
                  <div className="fancy-input">
                    <div className="file-input-wrapper">
                      <button type="button" className="file-input-button">
                        Upload Company Logo
                      </button>
                      <input
                        type="file"
                        name="logo"
                        accept="image/*"
                        onChange={handleChange}
                      />
                    </div>
                    {formData.logo && typeof formData.logo !== 'object' && (
                      <div className="mt-2">
                        <small className="text-muted">Current logo: </small>
                        <span>{formData.logo.split('/').pop()}</span>
                      </div>
                    )}
                    {formData.logo instanceof File && (
                      <div className="mt-2">
                        <small className="text-muted">New logo: </small>
                        <span>{formData.logo.name}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {isEditing && (
              <div className="text-end mt-4">
                <button type="submit" className="btn btn-success px-4 py-2">
                  Save Changes
                </button>
              </div>
            )}
          </form>

          {savedMessage && (
            <div className="alert alert-success mt-3">
              {savedMessage}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompanyProfileEdit;