import React, { useState } from 'react';
import { Calendar } from 'lucide-react';
import './ProfileForm.css'; // For custom animations
import Footer from '../Footer/Footer';
import Navbar from '../Navbar/Navbar';
import axios from "axios";
import ChatBot from '../ChatBot/ChatBot';

const ProfileForm = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    intro: '',
    dob: '',
    age: '',
    passingYear: '',
    qualification: '',
    stream: '',
    address: '',
    city: '',
    state: '',
    skills: '',
    designation: '',
    acceptTerms: false
  });

  const initialState = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone: "",
    intro: "",
    dob: "",
    qualification: "",
    stream: "",
    address: "",
    city: "",
    state: "",
    skills: "",
    acceptTerms: false
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

    try {
      const response = await axios.post("http://localhost:5000/api/students/register", formData);

        if (response.status === 201) {
            alert(response.data.message);
            setFormData({ ...initialState }); // Reset form
        }
    } catch (error) {
        console.error("Error submitting form:", error);
        alert("Registration failed: " + error.response?.data?.error || error.message);
    }
};

  return (
    <>
    <Navbar />
    <div className="container py-5 bg-light" style={{marginTop:"70px", backgroundColor: ""}}>

      <div className="card shadow">
        <div className="card-body p-4">
          <h2 className="text-center mb-4">Create Your Profile</h2>
          
          <form onSubmit={handleSubmit}>
            <div className="row g-4">
              {/* Left Column */}
              <div className="col-md-6">
                <div className="form-floating mb-3">
                  <input
                    type="text"
                    className="form-control"
                    id="firstName"
                    name="firstName"
                    placeholder="First Name"
                    required
                    value={formData.firstName}
                    onChange={handleChange}
                  />
                  <label htmlFor="firstName">First Name *</label>
                </div>

                <div className="form-floating mb-3">
                  <input
                    type="text"
                    className="form-control"
                    id="lastName"
                    name="lastName"
                    placeholder="Last Name"
                    required
                    value={formData.lastName}
                    onChange={handleChange}
                  />
                  <label htmlFor="lastName">Last Name *</label>
                </div>

                <div className="form-floating mb-3">
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    name="email"
                    placeholder="Email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                  />
                  <label htmlFor="email">Email *</label>
                </div>

                <div className="form-floating mb-3">
                  <textarea
                    className="form-control"
                    id="intro"
                    name="intro"
                    placeholder="Brief intro about yourself"
                    style={{ height: '100px' }}
                    required
                    value={formData.intro}
                    onChange={handleChange}
                  />
                  <label htmlFor="intro">Brief intro about yourself *</label>
                </div>

                <div className="mb-3">
                  <div className="form-floating">
                    <input
                      type="date"
                      className="form-control"
                      id="dob"
                      name="dob"
                      required
                      value={formData.dob}
                      onChange={handleChange}
                    />
                    <label htmlFor="dob">Date of Birth *</label>
                  </div>
                </div>

                <div className="form-floating mb-3">
                  <input
                    type="text"
                    className="form-control"
                    id="qualification"
                    name="qualification"
                    placeholder="Highest Qualification"
                    value={formData.qualification}
                    onChange={handleChange}
                  />
                  <label htmlFor="qualification">Highest Qualification</label>
                </div>

                <div className="form-floating mb-3">
                  <input
                    type="text"
                    className="form-control"
                    id="stream"
                    name="stream"
                    placeholder="Stream"
                    value={formData.stream}
                    onChange={handleChange}
                  />
                  <label htmlFor="stream">Stream</label>
                </div>
              </div>

              {/* Right Column */}
              <div className="col-md-6">
                <div className="form-floating mb-3">
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    name="password"
                    placeholder="Password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <label htmlFor="password">Password *</label>
                </div>

                <div className="form-floating mb-3">
                  <input
                    type="password"
                    className="form-control"
                    id="confirmPassword"
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                  />
                  <label htmlFor="confirmPassword">Confirm Password *</label>
                </div>

                <div className="form-floating mb-3">
                  <input
                    type="tel"
                    className="form-control"
                    id="phone"
                    name="phone"
                    placeholder="Phone Number"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                  <label htmlFor="phone">Phone Number</label>
                </div>

                <div className="form-floating mb-3">
                  <textarea
                    className="form-control"
                    id="address"
                    name="address"
                    placeholder="Address"
                    style={{ height: '100px' }}
                    value={formData.address}
                    onChange={handleChange}
                  />
                  <label htmlFor="address">Address</label>
                </div>

                <div className="form-floating mb-3">
                  <input
                    type="text"
                    className="form-control"
                    id="city"
                    name="city"
                    placeholder="City"
                    value={formData.city}
                    onChange={handleChange}
                  />
                  <label htmlFor="city">City</label>
                </div>

                <div className="form-floating mb-3">
                  <input
                    type="text"
                    className="form-control"
                    id="state"
                    name="state"
                    placeholder="State"
                    value={formData.state}
                    onChange={handleChange}
                  />
                  <label htmlFor="state">State</label>
                </div>

                <div className="form-floating mb-3">
                  <textarea
                    className="form-control"
                    id="skills"
                    name="skills"
                    placeholder="Enter Skills"
                    style={{ height: '100px' }}
                    value={formData.skills}
                    onChange={handleChange}
                  />
                  <label htmlFor="skills">Enter Skills</label>
                </div>
              </div>
            </div>

            <div className="row mt-4">
              <div className="col-md-6">
                <div className="mb-3">
                  <input
                    type="file"
                    className="form-control"
                    id="file-upload"
                    accept=".pdf"
                  />
                  <div className="form-text text-danger">
                    File Format PDF Only!
                  </div>
                </div>
              </div>
              
              <div className="col-md-6">
                <div className="form-check mb-3">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="terms"
                    name="acceptTerms"
                    required
                    checked={formData.acceptTerms}
                    onChange={handleChange}
                  />
                  <label className="form-check-label" htmlFor="terms">
                    I accept terms & conditions
                  </label>
                </div>
              </div>
            </div>

            <div className="text-center mt-3">
              <button
                type="submit"
                className="btn btn-success btn-submit px-5"
              >
                Register
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
    <ChatBot />
    <Footer/>
    </>
  );
};

export default ProfileForm;