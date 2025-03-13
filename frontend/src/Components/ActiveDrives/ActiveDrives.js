import React, { useState, useEffect } from 'react';
import { Search, Briefcase } from 'lucide-react';
import StudentNavBar from '../StudentNavBar/StudentNavBar';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ChatBot from '../ChatBot/ChatBot';

const ActiveDrives = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [drives, setDrives] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const role = sessionStorage.getItem('role');

  useEffect(() => {
    // Fetch drives data from the exact API endpoint you provided
    const fetchDrives = async () => {
      try {
        const response = await axios.get('/api/drives');
        setDrives(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching drives:', error);
        setLoading(false);
      }
    };

    fetchDrives();
  }, []);

  // Filter drives based on search term
  const filteredDrives = drives.filter(drive => 
    drive.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    drive.position?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    drive.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearch = (e) => {
    e.preventDefault();
    // The filtering happens automatically via the filteredDrives constant
  };

  const handleCompanyClick = (driveId) => {
    navigate(`/home/CompanyDisc/${driveId}`);
  };

  // Function to render job cards - handles loading state too
  const renderJobs = () => {
    if (loading) {
      return Array.from({ length: 4 }).map((_, index) => (
        <div className="job-card loading" key={`loading-${index}`}>
          <div className="job-logo">👥</div>
          <div className="job-details">
            <h3 className="company-name">Loading...</h3>
            <p className="job-position">Please wait</p>
          </div>
          <div className="job-salary">...</div>
        </div>
      ));
    }

    if (filteredDrives.length === 0) {
      return (
        <div className="no-results">
          <p>No drives match your search criteria.</p>
        </div>
      );
    }

    return filteredDrives.map((drive) => (
      <div className="job-card" key={drive.driveId || drive._id} onClick={() => handleCompanyClick(drive.driveId || drive._id)}>
        <div className="job-logo">{drive.companyLogo || '👥'}</div>
        <div className="job-details">
          <h3 className="company-name">{drive.companyName}</h3>
          <p className="job-position">{drive.position || drive.title || 'Position not specified'}</p>
        </div>
        <div className="job-salary">{drive.package || '₹Not disclosed'}</div>
      </div>
    ));
  };

  return (
    <>
      { role === 'student' && <StudentNavBar />}
      <div className="drives-container">
        <div className="content-wrapper">
          <h6 className="main-title">Active Drives</h6>
          <div className="search-container">
            <form onSubmit={handleSearch} className="search-wrapper">
              <input 
                type="text" 
                placeholder="Search job" 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              <button type="submit" className="search-button">
                Go!
                <div className="button-overlay"></div>
              </button>
            </form>
          </div>
          <div className="jobs-container">
            {renderJobs()}
          </div>
        </div>

        <style>
          {`
          .drives-container {
            min-height: 100vh;
            background: linear-gradient(135deg, #f5f7fa 0%, #e4e8ef 100%);
            padding: 2rem 1rem;
          }

          .content-wrapper {
            max-width: 1200px;
            margin: 0 auto;
          }

          .main-title {
            text-align: center;
            color: #2d3748;
            font-size: 2.5rem;
            margin-bottom: 2rem;
            font-weight: 700;
            animation: fadeInDown 0.6s ease-out;
          }

          .search-container {
            max-width: 800px;
            margin: 0 auto 3rem;
            animation: fadeIn 0.8s ease-out;
          }

          .search-wrapper {
            display: flex;
            background: white;
            border-radius: 12px;
            box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
            overflow: hidden;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
          }

          .search-wrapper:hover {
            transform: translateY(-2px);
            box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
          }

          .search-input {
            flex: 1;
            padding: 1.2rem 1.5rem;
            border: none;
            font-size: 1.1rem;
            outline: none;
            transition: all 0.3s ease;
          }

          .search-input:focus {
            background: #f8fafc;
          }

          .search-button {
            padding: 0 2rem;
            background: #00b4d8;
            color: white;
            border: none;
            font-weight: 600;
            font-size: 1.1rem;
            cursor: pointer;
            position: relative;
            overflow: hidden;
            transition: all 0.3s ease;
          }

          .button-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(255, 255, 255, 0.1);
            transform: translateX(-100%);
            transition: transform 0.3s ease;
          }

          .search-button:hover .button-overlay {
            transform: translateX(0);
          }

          .jobs-container {
            display: flex;
            flex-direction: column;
            gap: 1.5rem;
            animation: fadeInUp 0.8s ease-out;
          }

          .job-card {
            display: flex;
            align-items: center;
            background: white;
            padding: 1.5rem;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            cursor: pointer;
            position: relative;
            overflow: hidden;
          }

          .job-card::before {
            content: '';
            position: absolute;
            left: 0;
            top: 0;
            height: 100%;
            width: 4px;
            background: #00b4d8;
            transform: scaleY(0);
            transition: transform 0.3s ease;
          }

          .job-card:hover {
            transform: translateX(10px);
            box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
          }

          .job-card:hover::before {
            transform: scaleY(1);
          }

          .job-logo {
            width: 50px;
            height: 50px;
            background: #f0f9ff;
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.5rem;
            margin-right: 1.5rem;
            transition: transform 0.3s ease;
          }

          .job-card:hover .job-logo {
            transform: scale(1.1) rotate(5deg);
          }

          .job-details {
            flex: 1;
          }

          .company-name {
            color: #00b4d8;
            font-size: 1.2rem;
            font-weight: 600;
            margin-bottom: 0.5rem;
            transition: color 0.3s ease;
          }

          .job-card:hover .company-name {
            color: #0096c7;
          }

          .job-position {
            color: #64748b;
            font-size: 0.95rem;
          }

          .job-salary {
            font-weight: 600;
            color: #2d3748;
            padding-left: 1.5rem;
            border-left: 2px solid #e2e8f0;
          }

          .no-results {
            background: #f8fafc;
            padding: 2rem;
            border-radius: 12px;
            text-align: center;
            color: #64748b;
            font-size: 1.1rem;
          }

          @keyframes fadeIn {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }

          @keyframes fadeInDown {
            from {
              opacity: 0;
              transform: translateY(-20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .job-card:hover .job-salary {
            color: #00b4d8;
          }

          @media (max-width: 768px) {
            .job-card {
              flex-direction: column;
              align-items: flex-start;
              gap: 1rem;
            }

            .job-salary {
              border-left: none;
              padding-left: 0;
              padding-top: 1rem;
              border-top: 2px solid #e2e8f0;
              width: 100%;
            }

            .search-wrapper {
              flex-direction: column;
            }

            .search-button {
              padding: 1rem;
            }
          }

          .job-card.loading {
            animation: pulse 1.5s infinite;
          }

          @keyframes pulse {
            0% {
              opacity: 1;
            }
            50% {
              opacity: 0.7;
            }
            100% {
              opacity: 1;
            }
          }
          .search-input:focus + .search-button {
            background: #0096c7;
          }
        `}
        </style>
        <ChatBot />
      </div>
    </>
  );
};

export default ActiveDrives;