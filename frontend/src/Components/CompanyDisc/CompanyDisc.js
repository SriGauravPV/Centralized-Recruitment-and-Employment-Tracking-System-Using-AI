import React, { useState, useEffect } from 'react';
import { ArrowLeft, Briefcase, Calendar, DollarSign, CheckCircle, AlertCircle } from 'lucide-react';
import StudentNavBar from '../StudentNavBar/StudentNavBar';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ChatBot from '../ChatBot/ChatBot';

const CompanyDetails = () => {
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [driveDetails, setDriveDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const { driveId } = useParams();
  const navigate = useNavigate();
    const [studentData, setStudentData] = useState(null); 
    const [error, setError] = useState(null); 

  useEffect(() => {
    const fetchDriveDetails = async () => {
      try {
        const response = await axios.get(`/api/drives/companyuser/${driveId}`);
        setDriveDetails(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching drive details:', error);
        setLoading(false);
      }
    };

    fetchDriveDetails();
  }, [driveId]);

  useEffect(() => {
    const role = sessionStorage.getItem("role");
    if (role !== "student") {
      navigate("/"); 
      return;
    }

    const token = sessionStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }

    axios
      .get("/api/student/profile", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setStudentData(response.data); 
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to fetch student data");
        setLoading(false);
      });
  }, [navigate]);

  const handleApply = async (e) => {
    e.preventDefault();
    
    try {
      const token = sessionStorage.getItem("token");
      
      if (!token || !studentData || !studentData._id) {
        alert("User authentication required. Please log in again.");
        navigate("/");
        return;
      }
      
      // Update the company drive document to add the student's ID to selectedStudents array
      const response = await axios.post(`/api/drives/drive/${driveId}/apply`, 
        { studentId: studentData._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (response.status === 200) {
        setShowSuccessMessage(true);
        setTimeout(() => setShowSuccessMessage(false), 3000);
      }
    } catch (error) {
      console.error('Error applying for drive:', error);
      alert("Failed to apply for this position. Please try again later.");
    }
  };

  const handleEligibilityCheck = () => {
    // Add your eligibility check logic here
    alert("Checking eligibility...");
  };

  const handleBack = () => {
    navigate('/home/active-drives');
  };

  if (loading) {
    return (
      <>
        <StudentNavBar />
        <div className="company-container">
          <div className="company-card loading">
            <div className="loading-text">Loading company details...</div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <StudentNavBar />
      <div className="company-container">
        <div className="content-wrapper">
          <div className="company-card">
            <div className="company-header">
              <h2 className="company-name">{driveDetails?.companyName || 'Company Name'}</h2>
              <button onClick={handleBack} className="back-button">
                <ArrowLeft size={18} />
                Back
              </button>
            </div>

            <div className="company-details-grid">
              <div className="detail-item">
                <Briefcase className="detail-icon" />
                <span className="detail-label">Position:</span>
                <span className="detail-value">{driveDetails?.position || 'Software Engineer'}</span>
              </div>
              
              <div className="detail-item">
                <DollarSign className="detail-icon" />
                <span className="detail-label">Package:</span>
                <span className="detail-value">{driveDetails?.package || 'Rs 6,50,000'}</span>
              </div>

              <div className="detail-item">
                <Calendar className="detail-icon" />
                <span className="detail-label">Date:</span>
                <span className="detail-value">{driveDetails?.driveDate || '05-May-2024'}</span>
              </div>

              <div className="detail-item">
                <CheckCircle className="detail-icon" />
                <span className="detail-label">Eligibility:</span>
                <span className="detail-value">{driveDetails?.minCgpa || '65%'}</span>
              </div>
            </div>

            <div className="company-description">
              {driveDetails?.jobDescription || 
                'Accenture plc is an Ireland-based multinational professional services company that specializes in information technology (IT) services and consulting. A Fortune Global 500 company, it reported revenues of $50.53 billion in 2021. Accentures current clients include 91 of the Fortune Global 100 and more than three-quarters of the Fortune Global 500. Julie Sweet has served as CEO of Accenture since 1 September 2019. It has been incorporated in Dublin, Ireland, since 2009.'}
            </div>

            <div className="action-buttons">
              <button onClick={handleApply} className="apply-button">Apply</button>
              <button onClick={handleEligibilityCheck} className="eligibility-button">Check Eligibility</button>
            </div>
          </div>
        </div>

        {showSuccessMessage && (
          <div className="success-message">
            <CheckCircle size={20} />
            Action completed successfully!
          </div>
        )}
      </div>

      <style>
        {`
          .company-container {
            min-height: 100vh;
            background: linear-gradient(135deg, #f5f7fa 0%, #e4e8ef 100%);
            padding: 2rem 1rem;
          }

          .content-wrapper {
            max-width: 900px;
            margin: 0 auto;
          }

          .company-card {
            background: white;
            border-radius: 16px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
            padding: 2rem;
            animation: fadeIn 0.6s ease-out;
          }

          .company-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 2rem;
            padding-bottom: 1rem;
            border-bottom: 2px solid #f1f5f9;
          }

          .company-name {
            color: #00b4d8;
            font-size: 1.8rem;
            font-weight: 700;
          }

          .back-button {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            background: #f1f5f9;
            color: #475569;
            border: none;
            padding: 0.6rem 1rem;
            border-radius: 8px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
          }

          .back-button:hover {
            background: #e2e8f0;
            transform: translateX(-5px);
          }

          .company-details-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 1.5rem;
            margin-bottom: 2rem;
          }

          .detail-item {
            display: flex;
            align-items: center;
            background: #f8fafc;
            padding: 1rem;
            border-radius: 10px;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
          }

          .detail-item:hover {
            transform: translateY(-3px);
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
          }

          .detail-icon {
            color: #00b4d8;
            margin-right: 1rem;
          }

          .detail-label {
            font-weight: 600;
            color: #64748b;
            margin-right: 0.5rem;
          }

          .detail-value {
            font-weight: 600;
            color: #334155;
          }

          .company-description {
            background: #f8fafc;
            padding: 1.5rem;
            border-radius: 10px;
            color: #475569;
            line-height: 1.6;
            margin-bottom: 2rem;
          }

          .action-buttons {
            display: flex;
            gap: 1rem;
          }

          .apply-button, .eligibility-button {
            padding: 1rem 2rem;
            border: none;
            border-radius: 10px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
          }

          .apply-button {
            background: #00b4d8;
            color: white;
            flex: 1;
          }

          .apply-button:hover {
            background: #0096c7;
            transform: translateY(-3px);
            box-shadow: 0 10px 20px rgba(0, 180, 216, 0.2);
          }

          .eligibility-button {
            background: #f1f5f9;
            color: #475569;
            flex: 1;
          }

          .eligibility-button:hover {
            background: #e2e8f0;
            transform: translateY(-3px);
            box-shadow: 0 10px 20px rgba(0, 0, 0, 0.05);
          }

          .success-message {
            position: fixed;
            bottom: 2rem;
            right: 2rem;
            background: #10b981;
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 10px;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            box-shadow: 0 10px 20px rgba(16, 185, 129, 0.2);
            animation: slideIn 0.3s ease-out;
          }

          .loading {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 300px;
          }

          .loading-text {
            color: #64748b;
            font-size: 1.2rem;
            font-weight: 500;
          }

          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes slideIn {
            from {
              opacity: 0;
              transform: translateX(50px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }

          @media (max-width: 768px) {
            .company-details-grid {
              grid-template-columns: 1fr;
            }

            .action-buttons {
              flex-direction: column;
            }
          }
        `}
      </style>
      <ChatBot />
    </>
  );
};

export default CompanyDetails;