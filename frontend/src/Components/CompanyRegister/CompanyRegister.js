import React, { useState } from 'react';
import Footer from '../Footer/Footer';
import Navbar from '../Navbar/Navbar';
import axios from "axios";
import ChatBot from '../ChatBot/ChatBot';

const PlacementProfileForm = () => {
  const [formData, setFormData] = useState({
    companyName: '',
    website: '',
    email: '',
    companyDescription: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    country: '',
    acceptTerms: false
  });

  const [profilePicture, setProfilePicture] = useState(null);

const handleFileChange = (e) => {
  setProfilePicture(e.target.files[0]);
};

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    const formDataWithFile = new FormData();
  Object.keys(formData).forEach(key => formDataWithFile.append(key, formData[key]));
  if (profilePicture) {
    formDataWithFile.append('profilePicture', profilePicture);
  }
    try {
      const response = await axios.post("http://localhost:5000/api/companies/register", formDataWithFile, {
        headers: {'Content-Type': 'multipart/form-data'}
      });
      alert(response.data.message);
      setFormData({
        companyName: "",
        website: "",
        email: "",
        companyDescription: "",
        password: "",
        confirmPassword: "",
        phoneNumber: "",
        country: "",
        acceptTerms: false
      });
    } catch (error) {
      console.error("Registration Error:", error.response?.data?.message || error.message);
      alert(error.response?.data?.message || "Registration failed!");
    }
  };

  return (
    <>
    <Navbar />
    <div className="container-fluid bg-light min-vh-100 py-5" style={{ marginTop:"70px"}}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12">
            <div className="card shadow-lg border-0">
              <div className="card-body p-4 p-md-5">
                <h2 className="text-center mb-4">Company Profile</h2>
                
                <form onSubmit={handleSubmit} className="needs-validation">
                  <div className="row">
                    {/* Left Column */}
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label htmlFor="companyName" className="form-label">Company Name</label>
                        <input
                          type="text"
                          className="form-control"
                          id="companyName"
                          name="companyName"
                          value={formData.companyName}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div className="mb-3">
                        <label htmlFor="website" className="form-label">Website</label>
                        <input
                          type="url"
                          className="form-control"
                          id="website"
                          name="website"
                          value={formData.website}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div className="mb-3">
                        <label htmlFor="email" className="form-label">Email</label>
                        <input
                          type="email"
                          className="form-control"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div className="mb-3">
                        <label htmlFor="companyDescription" className="form-label">Company Description</label>
                        <textarea
                          className="form-control"
                          id="companyDescription"
                          name="companyDescription"
                          value={formData.companyDescription}
                          onChange={handleChange}
                          rows="4"
                          required
                        />
                      </div>
                    </div>

                    {/* Right Column */}
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label htmlFor="password" className="form-label">Password</label>
                        <input
                          type="password"
                          className="form-control"
                          id="password"
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div className="mb-3">
                        <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                        <input
                          type="password"
                          className="form-control"
                          id="confirmPassword"
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div className="mb-3">
                        <label htmlFor="phoneNumber" className="form-label">Phone Number</label>
                        <input
                          type="tel"
                          className="form-control"
                          id="phoneNumber"
                          name="phoneNumber"
                          value={formData.phoneNumber}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div className="mb-3">
                        <label htmlFor="country" className="form-label">Select Country</label>
                        <select
                          className="form-select"
                          id="country"
                          name="country"
                          value={formData.country}
                          onChange={handleChange}
                          required
                        >
                          <option value="">Choose...</option>
                          <option value="us">United States</option>
                          <option value="uk">United Kingdom</option>
                          <option value="ca">Canada</option>
                          <option value="au">Australia</option>
                        </select>
                      </div>

                      <div className="mb-3">
                        <label htmlFor="profilePicture" className="form-label">Upload Profile Picture</label>
                        <input
                          type="file"
                          className="form-control"
                          id="profilePicture"
                          onChange={handleFileChange}
                          accept="image/*"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mb-3 form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="acceptTerms"
                      name="acceptTerms"
                      checked={formData.acceptTerms}
                      onChange={handleChange}
                      required
                    />
                    <label className="form-check-label" htmlFor="acceptTerms">
                      I accept terms & conditions
                    </label>
                  </div>

                  <div className="d-grid text-center">
                    <button type="submit" className="btn btn-success text-center" style={{width:"150px",textAlign:"center",borderRadius:"20px"}}>
                      Register
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <ChatBot />
    <Footer />
    </>
  );
};

export default PlacementProfileForm;