import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaSearch, FaBuilding, FaEnvelope, FaPhone, FaGlobe } from "react-icons/fa";

const CompanyProfiles = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch companies from the backend
    const fetchCompanies = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/getAllCompanies");
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        setCompanies(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  const filteredCompanies = companies.filter(company =>
    company.companyName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <motion.div
      className="container mt-4"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-center mb-4 fw-bold">Company Profiles</h2>
      {/* Search Bar */}
      <div className="input-group mb-4">
        <span className="input-group-text bg-primary text-white"><FaSearch /></span>
        <input
          type="text"
          className="form-control shadow-sm"
          placeholder="Search companies by name..."
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      {/* Loading and Error States */}
      {loading && (
        <div className="text-center my-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading companies...</p>
        </div>
      )}
      
      {error && (
        <div className="alert alert-danger" role="alert">
          Error loading companies: {error}
        </div>
      )}
      
      {/* Company Cards */}
      <div className="row">
        {!loading && !error && filteredCompanies.length > 0 ? (
          filteredCompanies.map((company) => (
            <motion.div
              key={company._id || company.id}
              className="col-md-6 col-lg-4 mb-4"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <div className="card border-0 shadow-lg overflow-hidden rounded-4">
                <div className="card-body p-4 text-center bg-light">
                  <FaBuilding className="display-4 text-primary mb-3" />
                  <h5 className="card-title fw-bold">{company.companyName}</h5>
                  <p className="card-text text-muted">
                    <FaEnvelope className="me-2 text-secondary" /> {company.email}
                  </p>
                  <p className="card-text text-muted">
                    <FaPhone className="me-2 text-secondary" /> {company.phoneNumber}
                  </p>
                  <p className="card-text">
                    <FaGlobe className="me-2 text-success" />
                    <a href={`https://${company.website}`} target="_blank" rel="noopener noreferrer" className="text-decoration-none">
                      {company.website}
                    </a>
                  </p>
                  <motion.button
                    className="btn btn-primary px-4 rounded-pill"
                    whileHover={{ scale: 1.1 }}
                  >
                    View Details
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          !loading && !error && <p className="text-center text-muted fw-bold">No companies found.</p>
        )}
      </div>
    </motion.div>
  );
};

export default CompanyProfiles;