import React, { useState, useEffect } from 'react';
import ChangePass from '../ChangePass/ChangePass';
import Mailbox from '../MailBox/MailBox';
import CompanySideBar from '../CompanySideBar/CompanySideBar';
import CompanyNavBar from '../CompanyNavBar/CompanyNavBar';
import EditCompanyProfile from '../EditCompanyProfile/EditCompanyProfile';
import PostDrive from '../PostDrive/PostDrive';
import CurrentDrive from '../CurrentDrive/CurrentDrive';
import ChatBot from '../ChatBot/ChatBot';
import axios from 'axios';

const CompanyDashboard = () => {
  const [activeComponent, setActiveComponent] = useState('profile');
  const [companyData, setCompanyData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch company profile data when component mounts
    const fetchCompanyData = async () => {
      const token = sessionStorage.getItem('token');
      try {
        setLoading(true);
        const response = await axios.get('/api/company/profile', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setCompanyData(response.data);
        console.log("heeeeeeeee")
        console.log(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to load company profile data');
        console.error('Error fetching company data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyData();
  }, []);

  const renderComponent = () => {
    switch (activeComponent) {
      case 'profile':
        return <EditCompanyProfile />;
      case 'postDrive':
        return <PostDrive companyData={companyData}/>;
      case 'currentDrives':
        return <CurrentDrive />;
      case 'mailbox':
        return <Mailbox studentData={companyData} />;
      case 'changePassword':
        return <ChangePass />;
      default:
        return <EditCompanyProfile />;
    }
  };

  // Enhanced CompanySideBar with navigation
  const EnhancedSideBar = () => {
    const menuItems = [
      { id: 'profile', label: 'Company Profile', icon: '👔' },
      { id: 'postDrive', label: 'Post Drive', icon: '📝' },
      { id: 'currentDrives', label: 'Current Drives', icon: '📊' },
      { id: 'mailbox', label: 'Mailbox', icon: '📧' },
      { id: 'changePassword', label: 'Change Password', icon: '🔒' }
    ];

    return (
      <div className="sidebar" style={{ minWidth: "250px", height: "85vh" }}>
        <style>
          {`
            .sidebar-item {
              padding: 15px 20px;
              cursor: pointer;
              transition: all 0.3s ease;
              border-left: 4px solid transparent;
              display: flex;
              align-items: center;
              gap: 10px;
            }

            .sidebar-item:hover {
              background-color: rgba(255, 255, 255, 0.1);
              border-left-color: #007bff;
            }

            .sidebar-item.active {
              background-color: rgba(255, 255, 255, 0.1);
              border-left-color: #007bff;
              font-weight: bold;
            }

            .content-wrapper {
              background-color: #f8f9fa;
              border-radius: 10px;
              box-shadow: 0 0 15px rgba(0,0,0,0.1);
              padding: 20px;
              margin: 10px;
              flex-grow: 1;
              animation: fadeIn 0.3s ease-in-out;
            }

            @keyframes fadeIn {
              from { opacity: 0; transform: translateY(10px); }
              to { opacity: 1; transform: translateY(0); }
            }

            .icon {
              font-size: 1.2rem;
              width: 24px;
              text-align: center;
            }
          `}
        </style>
        {menuItems.map(item => (
          <div
            key={item.id}
            className={`sidebar-item ${activeComponent === item.id ? 'active' : ''}`}
            onClick={() => setActiveComponent(item.id)}
          >
            <span className="icon">{item.icon}</span>
            {item.label}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="dashboard-container">
      <CompanyNavBar />
      <div className="d-flex">
        <EnhancedSideBar />
        <div className="content p-4 w-100" style={{ minHeight: "30vh", overflowY: "auto", height: "85vh" }}>
          <div className="content-wrapper">
            {renderComponent()}
          </div>
        </div>
      </div>
      <ChatBot />
    </div>
  );
};

export default CompanyDashboard;