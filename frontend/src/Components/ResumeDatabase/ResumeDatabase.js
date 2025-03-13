import React, { useState, useEffect } from 'react';
import { 
  Download, 
  FileText, 
  Search, 
  Filter,
  ChevronDown,
  Mail,
  Phone,
  Building,
  Award
} from 'lucide-react';
import CompanyNavBar from '../CompanyNavBar/CompanyNavBar';
import ChatBot from '../ChatBot/ChatBot';
import axios from 'axios';

const StudentResumeDatabase = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('All');
  const [driveInfo, setDriveInfo] = useState(null);
  const [companyName, setCompanyName] = useState(null);

  useEffect(() => {
    const fetchCompanyProfile = async () => {
      try {
        // Get the token from sessionStorage
        const token = sessionStorage.getItem('token');
        
        if (!token) {
          throw new Error('Authentication token not found');
        }
        
        const response = await axios.get('/api/company/profile', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        if (!response.data) {
          throw new Error('No company data received');
        }
        
        const company = response.data;
        console.log('Company profile:', company);
        
        // Check if company data contains necessary name
        if (!company.companyName) {
          throw new Error('Company profile does not contain company name');
        }
        
        setCompanyName(company.companyName);
        // Now that we have the companyName, fetch the drive details
        await fetchDriveData(company.companyName);
      } catch (err) {
        console.error('Error fetching company profile:', err);
        setError(err.message || 'Failed to load company profile data');
        setLoading(false);
      }
    };
    
    fetchCompanyProfile();
  }, []);
  
  const fetchDriveData = async (name) => {
    if (!name) {
      setError('Invalid company name');
      setLoading(false);
      return;
    }
    console.log('Fetching drive data for company:', name);
    try {
      // Fetch drive information by company name
      const driveResponse = await axios.get(`/api/drives/company/${name}`);
     
      if (!driveResponse.data) {
        throw new Error('No drive data received');
      }
     
      setDriveInfo(driveResponse.data);
      console.log('Drive data:', driveResponse.data);
      
      // Fetch eligible students
      const studentsResponse = await axios.get('/api/students/profile');
     
      if (!studentsResponse.data || !Array.isArray(studentsResponse.data)) {
        throw new Error('Invalid student data received');
      }
      console.log('Students data:', studentsResponse.data);
      
      // Get the studentIds array from the drive data
      const studentsIds = driveResponse.data.studentsId || [];
     
      // Filter to only show students who have applied (their ID is in the studentsId array)
      const appliedStudents = studentsResponse.data.filter(student => 
        student && student._id && studentsIds.includes(student._id)
      ).map(student => ({
        id: student._id,
        name: student.firstName + ' ' + (student.lastName || ''),
        email: student.email || 'N/A',
        phone: student.phoneNumber || 'N/A',
        department: student.stream || 'N/A',
        year: student.year || 'N/A',
        gpa: student.ugmarks || 'N/A',
        skills: student.skills || [],
        resumeData: student.resumeUrl || null, // This should contain the base64 data
        filename: `${student.firstName}_${student.lastName || ''}_Resume.pdf`,
        experience: student.experience || 'Not specified',
        education: `${student.degree || 'Degree'} in ${student.stream || 'Not specified'}`,
        projects: student.projects || ['Not specified']
      }));
      
      console.log('Applied students with resumes:', appliedStudents);
      setStudents(appliedStudents);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching drive data:', err);
      setError('Failed to load drive data. Please try again.');
      setLoading(false);
    }
  };

  const handleDownload = (resumeData, filename, studentName) => {
    try {
      if (!resumeData) {
        setError(`Resume not available for ${studentName}`);
        return;
      }

      // Check if resumeData is already properly formatted with data:application/pdf;base64,
      // If not, add the prefix
      let dataString = resumeData;
      if (!resumeData.startsWith('data:')) {
        dataString = `data:application/pdf;base64,${resumeData}`;
      }
      
      // Create an anchor element and set the href to the data URL
      const downloadLink = document.createElement('a');
      downloadLink.href = dataString;
      downloadLink.download = filename || `${studentName.replace(/\s+/g, '_')}_Resume.pdf`;
      
      // Append to the document body, click it, and then remove it
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      
      console.log(`Downloading resume for ${studentName}`);
    } catch (err) {
      console.error('Error downloading resume:', err);
      setError(`Failed to download resume for ${studentName}`);
    }
  };

  // Get unique departments from students data
  const getDepartments = () => {
    try {
      if (!students || !Array.isArray(students)) return ['All'];
      const departmentsSet = new Set(
        students
          .map(student => student?.department)
          .filter(Boolean)
      );
      return ['All', ...departmentsSet];
    } catch (err) {
      console.error('Error creating departments list:', err);
      return ['All'];
    }
  };

  const departments = getDepartments();

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (student.skills && student.skills.join(' ').toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesDepartment = selectedDepartment === 'All' || student.department === selectedDepartment;
    return matchesSearch && matchesDepartment;
  });

  return (
    <>
    <CompanyNavBar />
    <div style={{ maxWidth: '1200px', margin: '2rem auto', padding: '0 20px' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ 
          fontSize: '2rem', 
          color: '#1a365d', 
          marginBottom: '1rem'
        }}>
          Applied Students Resume Database - {driveInfo?.companyName || companyName || 'Company'} Drive
        </h1>
        
        {error && (
          <div style={{
            margin: '0 0 20px 0',
            padding: '12px 16px',
            background: '#ffebee',
            color: '#d32f2f',
            borderRadius: '8px',
            border: '1px solid #ffcdd2',
          }}>
            {error}
          </div>
        )}
        
        {loading ? (
          <div style={{ 
            padding: '40px', 
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '16px'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              border: '3px solid #f3f3f3',
              borderTop: '3px solid #2196F3',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }} />
            <p style={{ color: '#757575', margin: 0 }}>Loading applied students...</p>
          </div>
        ) : (
          <>
            <div style={{ 
              display: 'flex', 
              gap: '1rem', 
              marginBottom: '2rem',
              flexWrap: 'wrap'
            }}>
              <div style={{ 
                flex: '1',
                minWidth: '200px',
                position: 'relative' 
              }}>
                <Search style={{ 
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#64748b'
                }} size={20} />
                <input
                  type="text"
                  placeholder="Search by name or skills..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 12px 12px 40px',
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0',
                    fontSize: '1rem',
                    transition: 'all 0.3s ease'
                  }}
                />
              </div>
              
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                style={{
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                  fontSize: '1rem',
                  minWidth: '200px',
                  cursor: 'pointer'
                }}
              >
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>

            {filteredStudents.length === 0 ? (
              <div style={{ 
                padding: '40px', 
                textAlign: 'center', 
                color: '#757575',
                background: 'white',
                borderRadius: '12px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              }}>
                <p>No students have applied for this drive or match your search criteria</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {filteredStudents.map(student => (
                  <div
                    key={student.id}
                    style={{
                      background: 'white',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <div
                      style={{
                        padding: '1.5rem',
                        cursor: 'pointer',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        background: expandedId === student.id ? '#f8fafc' : 'white'
                      }}
                      onClick={() => setExpandedId(expandedId === student.id ? null : student.id)}
                    >
                      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <div
                          style={{
                            width: '48px',
                            height: '48px',
                            borderRadius: '50%',
                            background: `hsl(${Math.abs((student.name.charCodeAt(0) || 1) * 60) % 360}, 70%, 65%)`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '1.5rem',
                            color: 'white',
                            fontWeight: 'bold'
                          }}
                        >
                          {student.name.charAt(0)}
                        </div>
                        <div>
                          <h3 style={{ margin: 0, color: '#1a365d' }}>{student.name}</h3>
                          <p style={{ margin: '0.5rem 0 0 0', color: '#64748b' }}>
                            {student.department} • {student.year}
                          </p>
                        </div>
                      </div>
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDownload(student.resumeData, student.filename, student.name);
                        }}
                        style={{
                          padding: '8px 16px',
                          background: student.resumeData ? '#2563eb' : '#94a3b8',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: student.resumeData ? 'pointer' : 'not-allowed',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          transition: 'all 0.3s ease'
                        }}
                        disabled={!student.resumeData}
                      >
                        <Download size={16} />
                        Resume
                      </button>
                    </div>

                    {expandedId === student.id && (
                      <div
                        style={{
                          padding: '1.5rem',
                          borderTop: '1px solid #e2e8f0',
                          background: '#f8fafc'
                        }}
                      >
                        <div style={{ display: 'grid', gap: '1rem' }}>
                          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                            <Mail size={16} />
                            <span>{student.email}</span>
                          </div>
                          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                            <Phone size={16} />
                            <span>{student.phone}</span>
                          </div>
                          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                            <Award size={16} />
                            <span>GPA: {student.gpa}</span>
                          </div>
                          
                          <div>
                            <h4 style={{ margin: '0 0 0.5rem 0', color: '#1a365d' }}>Skills</h4>
                            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                              {student.skills.map(skill => (
                                <span
                                  key={skill}
                                  style={{
                                    padding: '4px 12px',
                                    background: '#e2e8f0',
                                    borderRadius: '16px',
                                    fontSize: '0.875rem'
                                  }}
                                >
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                          
                          <div>
                            <h4 style={{ margin: '0 0 0.5rem 0', color: '#1a365d' }}>Experience</h4>
                            <p style={{ margin: 0 }}>{student.experience}</p>
                          </div>
                          
                          <div>
                            <h4 style={{ margin: '0 0 0.5rem 0', color: '#1a365d' }}>Education</h4>
                            <p style={{ margin: 0 }}>{student.education}</p>
                          </div>
                          
                          <div>
                            <h4 style={{ margin: '0 0 0.5rem 0', color: '#1a365d' }}>Projects</h4>
                            <ul style={{ margin: 0, paddingLeft: '1.5rem' }}>
                              {student.projects.map((project, index) => (
                                <li key={index}>{project}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
    <style>{`
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
      * {
        box-sizing: border-box;
      }
    `}</style>
    <ChatBot />
    </>
  );
};

export default StudentResumeDatabase;