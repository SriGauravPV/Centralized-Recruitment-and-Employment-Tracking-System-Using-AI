import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CompanyNavBar from '../CompanyNavBar/CompanyNavBar';
import axios from 'axios';
import ChatBot from '../ChatBot/ChatBot';

const StudentSelectionTable = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStudents, setSelectedStudents] = useState(new Set());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('All');
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'ascending' });
  const [submitSuccess, setSubmitSuccess] = useState(false);
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
      const selectedStudentsArr = driveResponse.data.selectedStudents || [];
     
      // Mark students who are already applied or selected
      const studentsWithStatus = studentsResponse.data.map(student => {
        if (!student || !student._id) {
          return {
            name: 'Unknown',
            rollNo: 'N/A',
            grade: 'N/A',
            department: 'N/A',
            isApplied: false,
            isSelected: false
          };
        }
       
        return {
          ...student,
          isApplied: studentsIds.includes(student._id),
          isSelected: selectedStudentsArr.includes(student._id)
        };
      });
     
      // Filter to only show students who have applied (their ID is in the studentsId array)
      const appliedStudents = studentsWithStatus.filter(student => student.isApplied);
      console.log('Applied students:', appliedStudents);
      setStudents(appliedStudents); // Only set the students who have applied
     
      // Pre-select students that were previously selected - use IDs not names
      if (selectedStudentsArr.length > 0) {
        setSelectedStudents(new Set(selectedStudentsArr));
      }
     
      setLoading(false);
    } catch (err) {
      console.error('Error fetching drive data:', err);
      setError('Failed to load drive data. Please try again.');
      setLoading(false);
    }
  };
  
  const toggleStudent = (studentId) => {
    if (!studentId) return;
    
    const newSelected = new Set(selectedStudents);
    if (newSelected.has(studentId)) {
      newSelected.delete(studentId);
    } else {
      newSelected.add(studentId);
    }
    setSelectedStudents(newSelected);
  };

  const toggleAll = () => {
    if (filteredStudents.length === 0) return;
    
    if (selectedStudents.size === filteredStudents.length) {
      setSelectedStudents(new Set());
    } else {
      const studentIds = filteredStudents.map(s => s._id).filter(Boolean);
      setSelectedStudents(new Set(studentIds));
    }
  };

  const handleSubmit = async () => {
    if (!companyName) {
      setError('No company name found. Cannot submit selection.');
      return;
    }
    
    if (selectedStudents.size === 0) {
      setError('Please select at least one student');
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Convert Set to Array for API
      const selectedStudentsArray = Array.from(selectedStudents);
      
      // Send the updated selectedStudents array to the backend
      const response = await axios.post(`/api/drives/company/${companyName}/select-students`, {
        selectedStudents: selectedStudentsArray
      }); 
      
      if (!response.data) {
        throw new Error('No response from server');
      }
      
      console.log('Selection submission successful:', response.data);
      
      // Update local state to reflect changes
      if (driveInfo) {
        setDriveInfo({
          ...driveInfo,
          selectedStudents: selectedStudentsArray
        });
      }
      
      // Update the students array to reflect the new selection status
      setStudents(prevStudents => 
        prevStudents.map(student => ({
          ...student,
          isSelected: selectedStudents.has(student._id)
        }))
      );
      
      setSubmitSuccess(true);
      setTimeout(() => setSubmitSuccess(false), 3000);
    } catch (err) {
      console.error('Submission error:', err);
      setError(err.message || 'Failed to submit selection. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };
  
  // Safely get departments array
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
  
  // Filter and sort students - show only applied students
  const getFilteredStudents = () => {
    try {
      if (!students || !Array.isArray(students)) return [];
      
      return students
        .filter(student => {
          if (!student) return false;
          
          // Only show students who have applied (in the studentsName array)
          const hasApplied = student.isApplied === true;
          
          const studentName = (student.firstName || '').toLowerCase();
          const studentRoll = (student.email || '').toLowerCase();
          const searchTermLower = searchTerm.toLowerCase();
          
          const matchesSearch = 
            studentName.includes(searchTermLower) || 
            studentRoll.includes(searchTermLower);
            
          const matchesDepartment = 
            filterDepartment === 'All' || 
            student.stream === filterDepartment;
            
          return hasApplied && matchesSearch && matchesDepartment;
        })
        .sort((a, b) => {
          const keyA = a?.[sortConfig.key];
          const keyB = b?.[sortConfig.key];
          
          if (!keyA && !keyB) return 0;
          if (!keyA) return 1;
          if (!keyB) return -1;
          
          if (keyA < keyB) {
            return sortConfig.direction === 'ascending' ? -1 : 1;
          }
          if (keyA > keyB) {
            return sortConfig.direction === 'ascending' ? 1 : -1;
          }
          return 0;
        });
    } catch (err) {
      console.error('Error filtering students:', err);
      return [];
    }
  };
  
  const filteredStudents = getFilteredStudents();
  
  const getIcon = (key) => {
    if (sortConfig.key !== key) return '↕️';
    return sortConfig.direction === 'ascending' ? '↑' : '↓';
  };

  return (
    <>
      <CompanyNavBar />
      <div style={{
        maxWidth: '1200px',
        margin: '2rem auto',
        padding: '0 20px',
        fontFamily: 'system-ui, -apple-system, sans-serif'
      }}>
        <AnimatePresence>
          {submitSuccess && (
            <motion.div 
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              style={{
                position: 'fixed',
                top: '20px',
                left: '50%',
                transform: 'translateX(-50%)',
                background: 'linear-gradient(45deg, #4CAF50, #2E7D32)',
                color: 'white',
                padding: '16px 24px',
                borderRadius: '8px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                zIndex: 1000,
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}
            >
              Selected students successfully submitted!
            </motion.div>
          )}
        </AnimatePresence>
        
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              margin: '0 0 20px 0',
              padding: '12px 16px',
              background: '#ffebee',
              color: '#d32f2f',
              borderRadius: '8px',
              border: '1px solid #ffcdd2',
            }}
          >
            {error}
          </motion.div>
        )}
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            background: 'white',
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
          }}
        >
          <div style={{
            padding: '24px',
            borderBottom: '1px solid #f0f0f0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px'
          }}>
            <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 600, color: '#1976D2' }}>
              Student Selection - {driveInfo?.companyName || companyName || 'Company'} Drive
            </h2>
            
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <div style={{ position: 'relative', minWidth: '240px' }}>
                <input
                  type="text"
                  placeholder="Search by name or roll no..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    padding: '12px 16px 12px 40px',
                    borderRadius: '8px',
                    border: '1px solid #e0e0e0',
                    width: '100%',
                    fontSize: '14px',
                    transition: 'all 0.2s ease',
                    outline: 'none'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#2196F3'}
                  onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
                />
              </div>
              
              <select
                value={filterDepartment}
                onChange={(e) => setFilterDepartment(e.target.value)}
                style={{
                  padding: '12px 16px',
                  borderRadius: '8px',
                  border: '1px solid #e0e0e0',
                  backgroundColor: 'white',
                  fontSize: '14px',
                  minWidth: '160px',
                  cursor: 'pointer',
                  outline: 'none'
                }}
              >
                {departments.map((dept, index) => (
                  <option key={`${dept}-${index}`} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
          </div>
          
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
          ) : filteredStudents.length === 0 ? (
            <div style={{ 
              padding: '40px', 
              textAlign: 'center', 
              color: '#757575' 
            }}>
              <p>No students have applied for this drive or match your search criteria</p>
            </div>
          ) : (
            <>
              <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0 }}>
                  <thead>
                    <tr style={{
                      background: 'linear-gradient(45deg, #2196F3, #1976D2)',
                    }}>
                      <th style={{
                        padding: '16px 20px',
                        color: 'white',
                        fontWeight: 500,
                        textAlign: 'left',
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <input
                            type="checkbox"
                            checked={selectedStudents.size === filteredStudents.length && filteredStudents.length > 0}
                            onChange={toggleAll}
                            style={{
                              width: '18px',
                              height: '18px',
                              cursor: 'pointer',
                              accentColor: '#ffffff'
                            }}
                          />
                          <span>Select All</span>
                        </div>
                      </th>
                      <th 
                        style={{ 
                          padding: '16px 20px', 
                          color: 'white', 
                          fontWeight: 500, 
                          textAlign: 'left',
                          cursor: 'pointer'
                        }}
                        onClick={() => handleSort('firstName')}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span>Name</span>
                          <span style={{ opacity: 0.8, fontSize: '12px' }}>{getIcon('firstName')}</span>
                        </div>
                      </th>
                      <th 
                        style={{ 
                          padding: '16px 20px', 
                          color: 'white', 
                          fontWeight: 500, 
                          textAlign: 'left',
                          cursor: 'pointer'
                        }}
                        onClick={() => handleSort('email')}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span>Email</span>
                          <span style={{ opacity: 0.8, fontSize: '12px' }}>{getIcon('email')}</span>
                        </div>
                      </th>
                      <th 
                        style={{ 
                          padding: '16px 20px', 
                          color: 'white', 
                          fontWeight: 500, 
                          textAlign: 'left',
                          cursor: 'pointer'
                        }}
                        onClick={() => handleSort('ugmarks')}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span>Grade</span>
                          <span style={{ opacity: 0.8, fontSize: '12px' }}>{getIcon('ugmarks')}</span>
                        </div>
                      </th>
                      <th 
                        style={{ 
                          padding: '16px 20px', 
                          color: 'white', 
                          fontWeight: 500, 
                          textAlign: 'left',
                          cursor: 'pointer'
                        }}
                        onClick={() => handleSort('stream')}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span>Department</span>
                          <span style={{ opacity: 0.8, fontSize: '12px' }}>{getIcon('stream')}</span>
                        </div>
                      </th>
                      <th style={{ padding: '16px 20px', color: 'white', fontWeight: 500, textAlign: 'center' }}>
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStudents.map((student, index) => (
                      <motion.tr
                        key={student._id || index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: Math.min(index * 0.05, 1) }}
                        style={{
                          backgroundColor: selectedStudents.has(student._id) ? '#f0f7ff' : 'white',
                          transition: 'all 0.3s ease'
                        }}
                      >
                        <td style={{ padding: '16px 20px', borderBottom: '1px solid #f0f0f0' }}>
                          <input
                            type="checkbox"
                            checked={selectedStudents.has(student._id)}
                            onChange={() => toggleStudent(student._id)}
                            style={{
                              width: '18px',
                              height: '18px',
                              cursor: 'pointer',
                              accentColor: '#2196F3'
                            }}
                          />
                        </td>
                        <td style={{ padding: '16px 20px', borderBottom: '1px solid #f0f0f0' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ 
                              width: '36px', 
                              height: '36px', 
                              borderRadius: '50%', 
                              background: `hsl(${Math.abs((student.firstName?.charCodeAt(0) || index) * 60) % 360}, 70%, 65%)`,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: 'white',
                              fontWeight: 'bold'
                            }}>
                              {(student.firstName || 'U')?.charAt(0)}
                            </div>
                            <div>
                              <div style={{ fontWeight: 500 }}>{student.firstName || 'Unknown'}</div>
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: '16px 20px', borderBottom: '1px solid #f0f0f0' }}>
                          {student.email || 'N/A'}
                        </td>
                        <td style={{ padding: '16px 20px', borderBottom: '1px solid #f0f0f0' }}>
                          <span style={{ 
                            padding: '4px 10px', 
                            borderRadius: '12px', 
                            fontSize: '14px',
                          }}>
                            {student.ugmarks || 'N/A'}
                          </span>
                        </td>
                        <td style={{ padding: '16px 20px', borderBottom: '1px solid #f0f0f0' }}>
                          {student.stream || 'N/A'}
                        </td>
                        <td style={{ padding: '16px 20px', borderBottom: '1px solid #f0f0f0', textAlign: 'center' }}>
                          <span style={{ 
                            padding: '6px 12px', 
                            borderRadius: '12px', 
                            fontSize: '14px',
                            background: student.isSelected ? '#e8f5e9' : '#f5f5f5',
                            color: student.isSelected ? '#2e7d32' : '#616161'
                          }}>
                            {student.isSelected ? 'Selected' : 'Applied'}
                          </span>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div style={{ 
                padding: '20px', 
                borderTop: '1px solid #f0f0f0', 
                display: 'flex', 
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '16px'
              }}>
                <div>
                  <span style={{ color: '#757575' }}>
                    {selectedStudents.size} of {filteredStudents.length} students selected
                  </span>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  style={{
                    padding: '14px 32px',
                    background: selectedStudents.size === 0 
                      ? '#e0e0e0' 
                      : 'linear-gradient(45deg, #2196F3, #1976D2)',
                    border: 'none',
                    borderRadius: '8px',
                    color: selectedStudents.size === 0 ? '#9e9e9e' : 'white',
                    fontWeight: 500,
                    cursor: selectedStudents.size === 0 ? 'not-allowed' : 'pointer',
                    boxShadow: selectedStudents.size === 0 
                      ? 'none' 
                      : '0 4px 15px rgba(33, 150, 243, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    transition: 'all 0.3s ease'
                  }}
                  disabled={selectedStudents.size === 0 || isSubmitting}
                  onClick={handleSubmit}
                >
                  {isSubmitting ? (
                    <>
                      <div style={{
                        width: '20px',
                        height: '20px',
                        border: '2px solid white',
                        borderTopColor: 'transparent',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite'
                      }} />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <span>Submit Selection ({selectedStudents.size})</span>
                    </>
                  )}
                </motion.button>
              </div>
            </>
          )}
        </motion.div>
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

export default StudentSelectionTable;