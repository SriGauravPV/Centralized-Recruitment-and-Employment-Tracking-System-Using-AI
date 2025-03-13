import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Briefcase, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Eye, 
  ChevronDown,
  Search,
  Filter,
  ArrowUpDown
} from 'lucide-react';
import StudentNavBar from '../StudentNavBar/StudentNavBar';
import axios from 'axios';
import { Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [sortDirection, setSortDirection] = useState('desc');
  const [expandedApp, setExpandedApp] = useState(null);
  const [studentData, setStudentData] = useState(null); 
  const navigate = useNavigate();
  const [error, setError] = useState(null); 

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

    // Fetch student profile data first
    axios
      .get("/api/student/profile", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setStudentData(response.data);
        // Now fetch applications using the student's ID
        fetchApplications(response.data._id);
      })
      .catch((err) => {
        setError("Failed to fetch student data");
        setLoading(false);
      });
  }, [navigate]);

  // Function to fetch all company drives and filter for student's applications
  const fetchApplications = async (studentId) => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.get('/api/drives', {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      // Filter drives where student ID is in studentsId array
      const appliedDrives = response.data.filter(drive => 
        drive.studentsId && drive.studentsId.includes(studentId)
      );
      
      // Process each drive into application format
      const mappedApplications = appliedDrives.map(drive => {
        // Determine status based on whether student is in selectedStudents
        const isSelected = drive.selectedStudents && drive.selectedStudents.includes(studentId);
        const status = isSelected ? 'selected' : 'pending';
        
        // Create stages based on drive process
        const stages = [
          { name: 'Application', status: 'completed', date: drive.driveDate || new Date().toISOString().split('T')[0] }
        ];
        
        // Add process stages if available
        if (drive.process && Array.isArray(drive.process)) {
          drive.process.forEach((stage, index) => {
            const stageDate = new Date();
            stageDate.setDate(new Date(drive.driveDate || Date.now()).getDate() + (index + 1) * 7); // Add weeks for demo
            
            let stageStatus = 'not-started';
            if (isSelected) {
              stageStatus = 'completed';
            } else if (index === 0) {
              stageStatus = 'pending'; // First stage after application is pending
            }
            
            stages.push({
              name: stage,
              status: stageStatus,
              date: stageDate.toISOString().split('T')[0]
            });
          });
        }
        
        // Create the application object
        return {
          _id: drive._id,
          driveId: drive.driveId,
          companyName: drive.companyName,
          position: drive.position,
          package: drive.package || 'Not specified',
          appliedDate: drive.driveDate || new Date().toISOString().split('T')[0],
          status: status,
          stages: stages,
          // Add offer details if selected
          ...(isSelected && {
            offerDetails: {
              role: drive.position,
              salary: drive.package || 'Not specified',
              joiningDate: 'To be announced',
              location: 'To be announced'
            }
          })
        };
      });
      
      setApplications(mappedApplications);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching applications:', error);
      setLoading(false);
      // Use example data for development
      setApplications([
        {
          _id: '1',
          companyName: 'Accenture',
          position: 'Software Engineer',
          package: '₹6,50,000',
          appliedDate: '2024-02-15',
          status: 'pending',
          stages: [
            { name: 'Application', status: 'completed', date: '2024-02-15' },
            { name: 'Aptitude Test', status: 'completed', date: '2024-02-20', score: '85/100' },
            { name: 'Technical Interview', status: 'pending', date: '2024-03-15' },
            { name: 'HR Interview', status: 'not-started' }
          ]
        },
        {
          _id: '2',
          companyName: 'TCS',
          position: 'System Analyst',
          package: '₹5,80,000',
          appliedDate: '2024-02-10',
          status: 'selected',
          stages: [
            { name: 'Application', status: 'completed', date: '2024-02-10' },
            { name: 'Online Test', status: 'completed', date: '2024-02-18', score: '92/100' },
            { name: 'Technical Interview', status: 'completed', date: '2024-02-25' },
            { name: 'HR Interview', status: 'completed', date: '2024-03-05' }
          ],
          offerDetails: {
            role: 'System Analyst',
            salary: '₹5,80,000',
            joiningDate: '2024-07-15',
            location: 'Bangalore'
          }
        },
        {
          _id: '3',
          companyName: 'Infosys',
          position: 'Associate Engineer',
          package: '₹4,50,000',
          appliedDate: '2024-01-25',
          status: 'rejected',
          stages: [
            { name: 'Application', status: 'completed', date: '2024-01-25' },
            { name: 'Coding Test', status: 'completed', date: '2024-02-01', score: '65/100' },
            { name: 'Interview', status: 'rejected', date: '2024-02-10', feedback: 'Need more experience with database systems' }
          ]
        },
        {
          _id: '4',
          companyName: 'Microsoft',
          position: 'Software Development Engineer',
          package: '₹18,50,000',
          appliedDate: '2024-02-05',
          status: 'in-progress',
          stages: [
            { name: 'Application', status: 'completed', date: '2024-02-05' },
            { name: 'Online Assessment', status: 'completed', date: '2024-02-15', score: '95/100' },
            { name: 'Technical Interview 1', status: 'completed', date: '2024-02-28' },
            { name: 'Technical Interview 2', status: 'completed', date: '2024-03-10' },
            { name: 'HR Interview', status: 'pending', date: '2024-03-20' }
          ]
        }
      ]);
    }
  };

  // Filter applications based on search and status
  const filteredApplications = applications.filter(app => {
    const matchesSearch = 
      app.companyName.toLowerCase().includes(searchTerm.toLowerCase()) || 
      app.position.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Sort applications
  const sortedApplications = [...filteredApplications].sort((a, b) => {
    if (sortBy === 'date') {
      const dateA = new Date(a.appliedDate);
      const dateB = new Date(b.appliedDate);
      return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
    } else if (sortBy === 'company') {
      return sortDirection === 'asc' 
        ? a.companyName.localeCompare(b.companyName) 
        : b.companyName.localeCompare(a.companyName);
    } else if (sortBy === 'package') {
      const packageA = parseFloat(a.package.replace(/[₹,]/g, ''));
      const packageB = parseFloat(b.package.replace(/[₹,]/g, ''));
      return sortDirection === 'asc' ? packageA - packageB : packageB - packageA;
    }
    return 0;
  });

  const toggleSort = (field) => {
    if (sortBy === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortDirection('desc');
    }
  };

  const toggleExpand = (id) => {
    setExpandedApp(expandedApp === id ? null : id);
  };

  const getStatusClass = (status) => {
    switch(status) {
      case 'selected': return 'bg-success';
      case 'rejected': return 'bg-danger';
      case 'pending': return 'bg-warning';
      case 'in-progress': return 'bg-info';
      default: return 'bg-secondary';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'selected': return <CheckCircle size={18} />;
      case 'rejected': return <XCircle size={18} />;
      case 'pending': return <Clock size={18} />;
      case 'in-progress': return <AlertCircle size={18} />;
      default: return <AlertCircle size={18} />;
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-IN', options);
  };

  return (
    <>
      {/* <StudentNavBar /> */}
      <div className="my-applications-container">
        <div className="content-wrapper">
          <div className="page-header">
            <h1 className="page-title">My Applications</h1>
            <p className="subtitle">Track all your job applications and their status</p>
          </div>

          <div className="filters-section">
            <div className="search-wrapper">
              <Search size={18} className="search-icon" />
              <input 
                type="text" 
                className="search-input" 
                placeholder="Search by company or position" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="filter-buttons">
              <div className="filter-group">
                <Filter size={16} />
                <select 
                  className="form-select status-filter" 
                  value={statusFilter} 
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="selected">Selected</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              <div className="sort-group" onClick={() => toggleSort('date')}>
                <span>Date</span>
                <ArrowUpDown size={16} className={sortBy === 'date' ? 'active' : ''} />
              </div>

              <div className="sort-group" onClick={() => toggleSort('company')}>
                <span>Company</span>
                <ArrowUpDown size={16} className={sortBy === 'company' ? 'active' : ''} />
              </div>

              <div className="sort-group" onClick={() => toggleSort('package')}>
                <span>Package</span>
                <ArrowUpDown size={16} className={sortBy === 'package' ? 'active' : ''} />
              </div>
            </div>
          </div>

          {loading ? (
            <div className="loading-spinner">
              <Spinner animation="border" role="status" variant="primary">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            </div>
          ) : sortedApplications.length === 0 ? (
            <div className="no-applications">
              <AlertCircle size={48} />
              <h3>No applications found</h3>
              <p>Try adjusting your filters or search criteria</p>
            </div>
          ) : (
            <div className="applications-list">
              {sortedApplications.map((app) => (
                <div className="application-card" key={app._id}>
                  <div className="application-header" onClick={() => toggleExpand(app._id)}>
                    <div className="company-info">
                      <div className="company-logo">
                        {app.companyName.charAt(0)}
                      </div>
                      <div className="main-info">
                        <h3 className="company-name">{app.companyName}</h3>
                        <p className="position">{app.position}</p>
                      </div>
                    </div>
                    <div className="application-meta">
                      <div className="package">{app.package}</div>
                      <div className="applied-date">
                        <Calendar size={14} />
                        {formatDate(app.appliedDate)}
                      </div>
                      <div className={`status-badge ${getStatusClass(app.status)}`}>
                        {getStatusIcon(app.status)}
                        <span>
                          {app.status === 'selected' && 'Selected'}
                          {app.status === 'rejected' && 'Rejected'}
                          {app.status === 'pending' && 'Pending'}
                          {app.status === 'in-progress' && 'In Progress'}
                        </span>
                      </div>
                      <button className={`expand-btn ${expandedApp === app._id ? 'expanded' : ''}`}>
                        <ChevronDown size={20} />
                      </button>
                    </div>
                  </div>

                  {expandedApp === app._id && (
                    <div className="application-details">
                      <div className="stages-timeline">
                        <h4>Application Timeline</h4>
                        <div className="timeline">
                          {app.stages.map((stage, index) => (
                            <div className={`timeline-item ${stage.status}`} key={index}>
                            <div className="timeline-marker">
                              {stage.status === 'completed' && <CheckCircle size={18} />}
                              {stage.status === 'pending' && <Clock size={18} />}
                              {stage.status === 'rejected' && <XCircle size={18} />}
                              {stage.status === 'not-started' && <AlertCircle size={18} />}
                            </div>
                            <div className="timeline-content">
                              <h5 className="stage-name">{stage.name}</h5>
                              {stage.date && <p className="stage-date">{formatDate(stage.date)}</p>}
                              {stage.score && <p className="stage-score">Score: {stage.score}</p>}
                              {stage.feedback && <p className="stage-feedback">Feedback: {stage.feedback}</p>}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {app.status === 'selected' && app.offerDetails && (
                      <div className="offer-details">
                        <h4>Offer Details</h4>
                        <div className="offer-grid">
                          <div className="offer-item">
                            <span className="label">Role:</span>
                            <span className="value">{app.offerDetails.role}</span>
                          </div>
                          <div className="offer-item">
                            <span className="label">Salary:</span>
                            <span className="value">{app.offerDetails.salary}</span>
                          </div>
                          <div className="offer-item">
                            <span className="label">Joining Date:</span>
                            <span className="value">{app.offerDetails.joiningDate}</span>
                          </div>
                          <div className="offer-item">
                            <span className="label">Location:</span>
                            <span className="value">{app.offerDetails.location}</span>
                          </div>
                        </div>
                        <div className="offer-actions">
                          <button className="btn btn-primary">Accept Offer</button>
                          <button className="btn btn-outline-danger">Decline Offer</button>
                        </div>
                      </div>
                    )}

                    <div className="details-actions">
                      <button className="btn btn-outline-primary">
                        <Eye size={16} />
                        View Full Details
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>

      <style jsx>{`
        .my-applications-container {
          background: linear-gradient(135deg, #f5f7fa 0%, #e4e8ef 100%);
          min-height: 100vh;
          padding: 2rem 1rem 4rem;
        }

        .content-wrapper {
          max-width: 1200px;
          margin: 0 auto;
        }

        .page-header {
          text-align: center;
          margin-bottom: 2.5rem;
          animation: fadeInDown 0.6s ease-out;
        }

        .page-title {
          font-size: 2.5rem;
          font-weight: 700;
          color: #2d3748;
          margin-bottom: 0.5rem;
        }

        .subtitle {
          color: #64748b;
          font-size: 1.1rem;
        }

        .filters-section {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
          margin-bottom: 2rem;
          animation: fadeIn 0.8s ease-out;
        }

        .search-wrapper {
          flex: 1;
          min-width: 300px;
          position: relative;
        }

        .search-icon {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: #94a3b8;
        }

        .search-input {
          width: 100%;
          padding: 0.8rem 1rem 0.8rem 2.5rem;
          border-radius: 10px;
          border: 2px solid #e2e8f0;
          font-size: 1rem;
          transition: all 0.3s ease;
          background: white;
        }

        .search-input:focus {
          border-color: #00b4d8;
          box-shadow: 0 0 0 3px rgba(0, 180, 216, 0.1);
          outline: none;
        }

        .filter-buttons {
          display: flex;
          gap: 0.8rem;
          flex-wrap: wrap;
        }

        .filter-group, .sort-group {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 0.8rem;
          background: white;
          border-radius: 8px;
          border: 2px solid #e2e8f0;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .filter-group:hover, .sort-group:hover {
          border-color: #cbd5e1;
          background: #f8fafc;
        }

        .status-filter {
          border: none;
          background: transparent;
          padding: 0;
          font-size: 0.9rem;
          color: #475569;
          cursor: pointer;
        }

        .status-filter:focus {
          box-shadow: none;
          outline: none;
        }

        .sort-group span {
          font-size: 0.9rem;
          color: #475569;
        }

        .sort-group .active {
          color: #00b4d8;
        }

        .applications-list {
          display: flex;
          flex-direction: column;
          gap: 1.2rem;
          animation: fadeInUp 0.8s ease-out;
        }

        .application-card {
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
          overflow: hidden;
          transition: all 0.3s ease;
        }

        .application-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
        }

        .application-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem;
          cursor: pointer;
          transition: background 0.2s ease;
        }

        .application-header:hover {
          background: #f8fafc;
        }

        .company-info {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .company-logo {
          width: 50px;
          height: 50px;
          background: #f0f9ff;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          font-weight: 700;
          color: #00b4d8;
        }

        .main-info {
          display: flex;
          flex-direction: column;
        }

        .company-name {
          font-size: 1.2rem;
          font-weight: 600;
          color: #00b4d8;
          margin-bottom: 0.2rem;
        }

        .position {
          color: #64748b;
          font-size: 0.95rem;
          margin: 0;
        }

        .application-meta {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        .package {
          font-weight: 600;
          color: #2d3748;
          min-width: 100px;
          text-align: right;
        }

        .applied-date {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          color: #64748b;
          font-size: 0.9rem;
        }

        .status-badge {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.4rem 0.8rem;
          border-radius: 20px;
          font-size: 0.85rem;
          font-weight: 600;
          color: white;
        }

        .expand-btn {
          background: none;
          border: none;
          cursor: pointer;
          color: #94a3b8;
          padding: 0.3rem;
          border-radius: 50%;
          transition: all 0.3s ease;
        }

        .expand-btn.expanded {
          transform: rotate(180deg);
          background: #f1f5f9;
        }

        .application-details {
          padding: 0 1.5rem 1.5rem;
          border-top: 1px solid #e2e8f0;
          animation: fadeIn 0.3s ease-out;
        }

        .stages-timeline {
          margin-top: 1rem;
        }

        .stages-timeline h4, .offer-details h4 {
          font-size: 1.1rem;
          color: #334155;
          margin-bottom: 1rem;
          font-weight: 600;
        }

        .timeline {
          display: flex;
          flex-direction: column;
          margin-left: 10px;
        }

        .timeline-item {
          display: flex;
          gap: 1rem;
          position: relative;
          padding-bottom: 1.5rem;
        }

        .timeline-item:not(:last-child)::before {
          content: '';
          position: absolute;
          left: 9px;
          top: 25px;
          bottom: 0;
          width: 2px;
          background: #e2e8f0;
        }

        .timeline-item.completed .timeline-marker {
          color: #10b981;
          background: rgba(16, 185, 129, 0.1);
        }

        .timeline-item.pending .timeline-marker {
          color: #f59e0b;
          background: rgba(245, 158, 11, 0.1);
        }

        .timeline-item.rejected .timeline-marker {
          color: #ef4444;
          background: rgba(239, 68, 68, 0.1);
        }

        .timeline-item.not-started .timeline-marker {
          color: #94a3b8;
          background: rgba(148, 163, 184, 0.1);
        }

        .timeline-marker {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          z-index: 1;
        }

        .timeline-content {
          flex: 1;
        }

        .stage-name {
          font-size: 1rem;
          font-weight: 600;
          color: #334155;
          margin-bottom: 0.3rem;
        }

        .stage-date, .stage-score, .stage-feedback {
          margin: 0;
          font-size: 0.9rem;
          color: #64748b;
        }

        .offer-details {
          margin-top: 2rem;
          padding-top: 1.5rem;
          border-top: 1px dashed #e2e8f0;
        }

        .offer-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .offer-item {
          background: #f8fafc;
          padding: 0.8rem 1rem;
          border-radius: 8px;
          display: flex;
          flex-direction: column;
        }

        .offer-item .label {
          font-size: 0.85rem;
          color: #64748b;
          margin-bottom: 0.3rem;
        }

        .offer-item .value {
          font-weight: 600;
          color: #334155;
        }

        .offer-actions, .details-actions {
          display: flex;
          gap: 1rem;
          margin-top: 1rem;
        }

        .details-actions {
          margin-top: 1.5rem;
          padding-top: 1.5rem;
          border-top: 1px dashed #e2e8f0;
          justify-content: center;
        }

        .loading-spinner {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 200px;
        }

        .no-applications {
          text-align: center;
          padding: 3rem 1rem;
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
          color: #64748b;
        }

        .no-applications h3 {
          margin: 1rem 0 0.5rem;
          color: #334155;
        }

        .no-applications svg {
          color: #94a3b8;
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

        @media (max-width: 768px) {
          .filters-section {
            flex-direction: column;
          }
          
          .application-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
          }
          
          .application-meta {
            width: 100%;
            flex-wrap: wrap;
            gap: 0.8rem;
          }

          .company-info {
            width: 100%;
          }
          
          .offer-grid {
            grid-template-columns: 1fr;
          }
          
          .offer-actions, .details-actions {
            flex-direction: column;
          }
        }

        .bg-success {
          background-color: #10b981;
        }

        .bg-danger {
          background-color: #ef4444;
        }

        .bg-warning {
          background-color: #f59e0b;
        }

        .bg-info {
          background-color: #0ea5e9;
        }

        .bg-secondary {
          background-color: #6b7280;
        }
      `}</style>
    </>
  );
};

export default MyApplications;