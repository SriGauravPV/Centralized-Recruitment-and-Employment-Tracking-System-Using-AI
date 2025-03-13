import React, { useState, useEffect } from 'react';
import CompanyNavBar from '../CompanyNavBar/CompanyNavBar';
import axios from 'axios';

const CurrentDrivesView = () => {
  const [drives, setDrives] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBranch, setFilterBranch] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDrives = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/drives');
        setDrives(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch drives. Please try again later.');
        setLoading(false);
        console.error('Error fetching drives:', err);
      }
    };

    fetchDrives();
  }, []);

  // Get unique branches for filter dropdown
  const uniqueBranches = drives.length > 0 
    ? [...new Set(drives.flatMap(drive => drive.eligibleBranches))]
    : [];

  // Format date properly
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  // Calculate drive status based on date
  const getDriveStatus = (driveDate) => {
    if (!driveDate) return 'Unknown';
    const today = new Date();
    const drive = new Date(driveDate);
    
    if (drive < today) return 'Completed';
    return 'Active';
  };

  return (
    <>
    <div className="container py-5">
      <style>
        {`
          .drive-card {
            border-radius: 12px;
            transition: all 0.3s ease;
            border: 2px solid #e0e0e0;
            overflow: hidden;
          }

          .drive-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 20px rgba(0,0,0,0.1);
            border-color: #007bff;
          }

          .search-input {
            position: relative;
            margin-bottom: 25px;
          }

          .search-input input,
          .search-input select {
            width: 100%;
            padding: 15px 20px;
            border: 2px solid #e0e0e0;
            border-radius: 8px;
            transition: all 0.3s ease;
            font-size: 16px;
          }

          .search-input input:focus,
          .search-input select:focus {
            border-color: #007bff;
            box-shadow: 0 0 0 4px rgba(0,123,255,.1);
            outline: none;
          }

          .status-badge {
            padding: 5px 12px;
            border-radius: 20px;
            font-size: 14px;
            font-weight: 500;
          }

          .status-active {
            background-color: #e8f5e9;
            color: #2e7d32;
          }
          
          .status-completed {
            background-color: #ffebee;
            color: #c62828;
          }

          .skill-tag {
            background-color: #e3f2fd;
            color: #1976d2;
            padding: 5px 12px;
            border-radius: 15px;
            font-size: 14px;
            margin: 5px;
            display: inline-block;
            transition: all 0.2s ease;
          }

          .skill-tag:hover {
            background-color: #1976d2;
            color: white;
          }

          .applicant-count {
            position: relative;
            padding-left: 25px;
          }

          .applicant-count::before {
            content: '👥';
            position: absolute;
            left: 0;
            top: 50%;
            transform: translateY(-50%);
          }

          .deadline-badge {
            position: relative;
            padding-left: 25px;
          }

          .deadline-badge::before {
            content: '⏰';
            position: absolute;
            left: 0;
            top: 50%;
            transform: translateY(-50%);
          }

          .view-details-btn {
            transition: all 0.3s ease;
            overflow: hidden;
            position: relative;
          }

          .view-details-btn::after {
            content: '';
            position: absolute;
            width: 100%;
            height: 100%;
            top: 0;
            left: -100%;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
            transition: 0.5s;
          }

          .view-details-btn:hover::after {
            left: 100%;
          }
        `}
      </style>

      <div className="card shadow-lg">
        <div className="card-body p-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="card-title h3">Current Job Drives</h2>
            <span className="badge bg-primary fs-6">
              {drives.filter(drive => getDriveStatus(drive.driveDate) === 'Active').length} Active Drives
            </span>
          </div>

          <div className="row mb-4">
            <div className="col-md-8">
              <div className="search-input">
                <input
                  type="text"
                  placeholder="Search positions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="form-control"
                />
              </div>
            </div>
            <div className="col-md-4">
              <div className="search-input">
                <select
                  className="form-select"
                  value={filterBranch}
                  onChange={(e) => setFilterBranch(e.target.value)}
                >
                  <option value="All">All Branches</option>
                  {uniqueBranches.map((branch, index) => (
                    <option key={index} value={branch}>{branch}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="text-center p-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-3">Loading drives...</p>
            </div>
          ) : error ? (
            <div className="alert alert-danger">{error}</div>
          ) : drives.length === 0 ? (
            <div className="text-center p-5">
              <p>No drives found. Check back later.</p>
            </div>
          ) : (
            <div className="drives-container">
              {drives
                .filter(drive => 
                  (filterBranch === 'All' || drive.eligibleBranches.includes(filterBranch)) &&
                  (drive.position?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                   drive.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                   drive.title?.toLowerCase().includes(searchTerm.toLowerCase()))
                )
                .map(drive => {
                  const status = getDriveStatus(drive.driveDate);
                  return (
                    <div key={drive.driveId} className="drive-card mb-4 p-4">
                      <div className="row align-items-center">
                        <div className="col-md-8">
                          <div className="d-flex align-items-center mb-2">
                            {drive.companyLogo && (
                              <img 
                                src={drive.companyLogo} 
                                alt={`${drive.companyName} logo`} 
                                className="me-3" 
                                style={{ height: '40px', width: 'auto' }}
                              />
                            )}
                            <h3 className="h5 mb-0">{drive.position || drive.title}</h3>
                          </div>
                          <p className="mb-2">{drive.companyName}</p>
                          <div className="mb-3">
                            {drive.package && (
                              <span className="me-4">
                                <i className="bi bi-currency-dollar"></i> {drive.package}
                              </span>
                            )}
                            {drive.openPositions && (
                              <span>
                                <i className="bi bi-briefcase"></i> {drive.openPositions} Openings
                              </span>
                            )}
                          </div>
                          <div className="mb-3">
                            {drive.eligibleBranches && drive.eligibleBranches.map((branch, index) => (
                              <span key={index} className="skill-tag">
                                {branch}
                              </span>
                            ))}
                          </div>
                          <p className="text-muted mb-3">
                            {drive.jobDescription ? 
                              (drive.jobDescription.length > 120 ? 
                                `${drive.jobDescription.substring(0, 120)}...` : 
                                drive.jobDescription) : 
                              'No description available'}
                          </p>
                        </div>
                        <div className="col-md-4 text-md-end">
                          <div className="mb-3">
                            <span className={`status-badge ${status === 'Active' ? 'status-active' : 'status-completed'} me-3`}>
                              {status}
                            </span>
                            <span className="applicant-count">
                              {drive.studentsId ? drive.studentsId.length : 0} Applicants
                            </span>
                          </div>
                          <div className="mb-3">
                            <span className="deadline-badge">
                              Drive Date: {formatDate(drive.driveDate)}
                            </span>
                          </div>
                          <button className="btn btn-primary view-details-btn">
                            View Details
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      </div>
    </div>
    </>
  );
};

export default CurrentDrivesView;