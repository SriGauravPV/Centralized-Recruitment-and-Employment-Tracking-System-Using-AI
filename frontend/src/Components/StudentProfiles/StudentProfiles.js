import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaSearch, FaUserGraduate, FaEnvelope, FaPhone, FaBook } from "react-icons/fa";

const StudentProfiles = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch students from the backend
    const fetchStudents = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/get-all-students");
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        setStudents(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  const filteredStudents = students.filter(student =>
    student.firstName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <motion.div
      className="container mt-4"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-center mb-4 fw-bold">Student Profiles</h2>
      {/* Search Bar */}
      <div className="input-group mb-4">
        <span className="input-group-text bg-primary text-white"><FaSearch /></span>
        <input
          type="text"
          className="form-control shadow-sm"
          placeholder="Search students by name..."
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      {/* Loading and Error States */}
      {loading && (
        <div className="text-center my-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading students...</p>
        </div>
      )}
      
      {error && (
        <div className="alert alert-danger" role="alert">
          Error loading students: {error}
        </div>
      )}
      
      {/* Student Cards */}
      <div className="row">
        {!loading && !error && filteredStudents.length > 0 ? (
          filteredStudents.map((student) => (
            <motion.div
              key={student._id || student.id}
              className="col-md-6 col-lg-4 mb-4"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <div className="card border-0 shadow-lg overflow-hidden rounded-4">
                <div className="card-body p-4 text-center bg-light">
                  <FaUserGraduate className="display-4 text-primary mb-3" />
                  <h5 className="card-title fw-bold">{student.firstName}</h5>
                  <p className="card-text text-muted">
                    <FaEnvelope className="me-2 text-secondary" /> {student.email}
                  </p>
                  <p className="card-text text-muted">
                    <FaPhone className="me-2 text-secondary" /> {student.phone}
                  </p>
                  <p className="card-text">
                    <FaBook className="me-2 text-success" /> <strong>{student.stream}</strong>
                  </p>
                  <motion.button
                    className="btn btn-primary px-4 rounded-pill"
                    whileHover={{ scale: 1.1 }}
                  >
                    View Profile
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          !loading && !error && <p className="text-center text-muted fw-bold">No students found.</p>
        )}
      </div>
    </motion.div>
  );
};

export default StudentProfiles;