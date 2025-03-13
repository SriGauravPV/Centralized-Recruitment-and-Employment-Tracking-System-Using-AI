import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import './CompanyStudentsTable.css'; 
import AdminNavBar from '../AdminNavBar/AdminNavBar';

const CompanyStudentsTable = () => {
  const [students, setStudents] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Fetch companies on component mount
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await axios.get('/api/drives');
        setCompanies(response.data);
      } catch (err) {
        setError('Failed to fetch companies');
        console.error(err);
      }
    };
    fetchCompanies();
  }, []);

  // Fetch students when a company is selected
  const fetchStudents = async () => {
    if (!selectedCompany) return;
    
    setLoading(true);
    setError('');
    
    try {
      const response = await axios.get(`/api/students/by-company/${selectedCompany}`);
      setStudents(response.data);
    } catch (err) {
      setError('Failed to fetch students');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedCompany) {
      fetchStudents();
    }
  }, [selectedCompany]);

  // Handle company selection
  const handleCompanyChange = (event) => {
    setSelectedCompany(event.target.value);
  };

  // Handle search
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // Handle status filter
  const handleStatusFilterChange = (event) => {
    setStatusFilter(event.target.value);
  };

  const exportExcel = () => {
    if (!students.length) return;

    const filteredStudents = filterStudents();
    const worksheetData = [
      ['Name', 'Email', 'Registration No', 'Phone', 'Status'],
      ...filteredStudents.map(student => [
        student.name || '',
        student.email || '',
        student.regNo || '',
        student.phone || '',
        student.status || ''
      ])
    ];

    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Students');
    XLSX.writeFile(workbook, `${selectedCompany}-students.xlsx`);
  };

  // Export data as CSV
  const exportCSV = () => {
    if (!students.length) return;
    
    // Filter students based on current filters
    const filteredStudents = filterStudents();
    
    // Define CSV headers
    const headers = ['Name', 'Email', 'Stream', 'Phone', 'Status'];
    
    // Map students to CSV rows
    const csvContent = [
      headers.join(','),
      ...filteredStudents.map(student => [
        student.firstName || '',
        student.email || '',
        student.stream || '',
        student.phone || '',
        student.status || ''
      ].join(','))
    ].join('\n');
    
    // Create and download the file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${selectedCompany}-students.csv`);
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export as Excel (XLSX format)
//   const exportExcel = () => {
//     window.location.href = `/api/students/by-company/${selectedCompany}?format=excel`;
//   };

  // Filter students based on search term and status
  const filterStudents = () => {
    return students.filter(student => {
      const matchesSearch = 
        (student.name && student.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (student.email && student.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (student.regNo && student.regNo.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesStatus = 
        statusFilter === 'all' || 
        student.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  };

  const filteredStudents = filterStudents();

  return (
    <div>
        <AdminNavBar/>
    <div className="container company-students-container" style={{marginTop: '60px'}}>
      <div className="card main-card">
        <div className="card-header bg-primary text-white">
          <h5 className="card-title mb-0">Student Details by Company</h5>
        </div>
        
        <div className="card-body">
          {/* Company selection and export buttons */}
          <div className="row mb-4">
            <div className="col-md-4">
              <div className="form-group">
                <label htmlFor="company-select">Select Company</label>
                <select 
                  className="form-control custom-select" 
                  id="company-select"
                  value={selectedCompany}
                  onChange={handleCompanyChange}
                >
                  <option value="">Select a company</option>
                  {companies.map((company) => (
                    <option key={company._id} value={company.companyName}>
                      {company.companyName}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            {selectedCompany && (
              <div className="col-md-8 d-flex align-items-end">
                {/* <button 
                  className="btn btn-success me-2" 
                  onClick={exportCSV}
                  disabled={!students.length}
                >
                  <i className="fas fa-file-csv me-2"></i>
                  Export CSV
                </button> */}
                <button 
                  className="btn btn-outline-success" 
                  onClick={exportExcel}
                  disabled={!students.length}
                >
                  <i className="fas fa-file-excel me-2"></i>
                  Export Excel
                </button>
              </div>
            )}
          </div>
          
          {selectedCompany && (
            <>
              {/* Filters */}
              <div className="row mb-4">
                <div className="col-md-6">
                  <div className="form-group">
                    <label htmlFor="search-input">Search Students</label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <i className="fas fa-search"></i>
                      </span>
                      <input 
                        type="text" 
                        className="form-control" 
                        id="search-input"
                        placeholder="Search by name, email, or reg no..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                      />
                    </div>
                  </div>
                </div>
                
                {/* <div className="col-md-3">
                  <div className="form-group">
                    <label htmlFor="status-filter">Status Filter</label>
                    <select 
                      className="form-control" 
                      id="status-filter"
                      value={statusFilter}
                      onChange={handleStatusFilterChange}
                    >
                      <option value="all">All</option>
                      <option value="Selected">Selected</option>
                      <option value="Applied">Applied</option>
                    </select>
                  </div>
                </div> */}
              </div>
              
              {/* Loading indicator */}
              {loading && (
                <div className="text-center my-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              )}
              
              {/* Error message */}
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}
              
              {/* Students table */}
              {!loading && students.length > 0 && (
                <>
                  <div className="student-count mb-2">
                    <span className="badge bg-info">{filteredStudents.length} student(s) found</span>
                  </div>
                  
                  <div className="table-responsive">
                    <table className="table table-striped table-hover">
                      <thead className="table-dark">
                        <tr>
                          <th>Name</th>
                          <th>Email</th>
                          <th>Stream</th>
                          <th>Phone</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredStudents.map((student) => (
                          <tr key={student._id}>
                            <td>{student.firstName}</td>
                            <td>{student.email}</td>
                            <td>{student.stream}</td>
                            <td>{student.phone}</td>
                            <td>
                              <span className={`badge ${student.status === 'Selected' ? 'bg-success' : 'bg-primary'}`}>
                                {student.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
              
              {!loading && students.length === 0 && (
                <div className="alert alert-info text-center" role="alert">
                  No students found for this company
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
    </div>
  );
};

export default CompanyStudentsTable;

// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const CompanyStudentsTable = () => {
//   const [students, setStudents] = useState([]);
//   const [companies, setCompanies] = useState([]);
//   const [selectedCompany, setSelectedCompany] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [searchTerm, setSearchTerm] = useState('');
//   const [statusFilter, setStatusFilter] = useState('all');

//   useEffect(() => {
//     const fetchCompanies = async () => {
//       try {
//         const response = await axios.get('/api/drives');
//         setCompanies(response.data);
//       } catch (err) {
//         setError('Failed to fetch companies');
//         console.error(err);
//       }
//     };
//     fetchCompanies();
//   }, []);

//   const fetchStudents = async () => {
//     if (!selectedCompany) return;
    
//     setLoading(true);
//     setError('');
    
//     try {
//       const response = await axios.get(`/api/students/by-company/${selectedCompany}`);
//       setStudents(response.data);
//     } catch (err) {
//       setError('Failed to fetch students');
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (selectedCompany) {
//       fetchStudents();
//     }
//   }, [selectedCompany]);

//   const filterStudents = () => {
//     return students.filter(student => {
//       const matchesSearch = 
//         (student.name && student.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
//         (student.email && student.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
//         (student.regNo && student.regNo.toLowerCase().includes(searchTerm.toLowerCase()));
      
//       const matchesStatus = 
//         statusFilter === 'all' || 
//         student.status === statusFilter;
      
//       return matchesSearch && matchesStatus;
//     });
//   };

//   const filteredStudents = filterStudents();

//   return (
//     <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
//       <div style={{ 
//         backgroundColor: '#4167B8', 
//         color: 'white', 
//         padding: '15px', 
//         borderRadius: '5px',
//         textAlign: 'center',
//         marginBottom: '20px'
//       }}>
//         <h3>Student Details by Company</h3>
//       </div>
      
//       {/* Company Selection */}
//       <div style={{ display: 'flex', marginBottom: '20px', gap: '15px' }}>
//         <select 
//           style={{
//             flex: '1', 
//             padding: '10px', 
//             borderRadius: '5px', 
//             border: '1px solid #ccc'
//           }}
//           value={selectedCompany}
//           onChange={(e) => setSelectedCompany(e.target.value)}
//         >
//           <option value="">Select a company</option>
//           {companies.map((company) => (
//             <option key={company._id} value={company.companyName}>
//               {company.companyName}
//             </option>
//           ))}
//         </select>
        
//         <input 
//           type="text" 
//           placeholder="Search by name, email, or reg no..."
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           style={{
//             flex: '1', 
//             padding: '10px', 
//             borderRadius: '5px', 
//             border: '1px solid #ccc'
//           }}
//         />

//         <select 
//           style={{
//             flex: '0.5', 
//             padding: '10px', 
//             borderRadius: '5px', 
//             border: '1px solid #ccc'
//           }}
//           value={statusFilter}
//           onChange={(e) => setStatusFilter(e.target.value)}
//         >
//           <option value="all">All</option>
//           <option value="Selected">Selected</option>
//           <option value="Applied">Applied</option>
//         </select>
//       </div>

//       {/* Loading Indicator */}
//       {loading && (
//         <div style={{ textAlign: 'center', marginTop: '20px' }}>
//           <div style={{
//             width: '30px', 
//             height: '30px', 
//             border: '4px solid #ccc', 
//             borderTop: '4px solid #4167B8', 
//             borderRadius: '50%',
//             animation: 'spin 1s linear infinite'
//           }} />
//         </div>
//       )}

//       {/* Error Message */}
//       {error && (
//         <div style={{ color: 'red', textAlign: 'center', marginTop: '20px' }}>
//           {error}
//         </div>
//       )}

//       {/* Students Table */}
//       {!loading && students.length > 0 && (
//         <div style={{ overflowX: 'auto' }}>
//           <table style={{ 
//             width: '100%', 
//             borderCollapse: 'collapse', 
//             boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', 
//             borderRadius: '8px'
//           }}>
//             <thead>
//               <tr style={{ 
//                 backgroundColor: '#4167B8', 
//                 color: 'white', 
//                 textAlign: 'left'
//               }}>
//                 <th style={{ padding: '12px' }}>Name</th>
//                 <th style={{ padding: '12px' }}>Email</th>
//                 <th style={{ padding: '12px' }}>Registration No</th>
//                 <th style={{ padding: '12px' }}>Phone</th>
//                 <th style={{ padding: '12px' }}>Status</th>
//               </tr>
//             </thead>
//             <tbody>
//               {filteredStudents.map((student, index) => (
//                 <tr key={student._id} style={{
//                   backgroundColor: index % 2 === 0 ? '#f9f9f9' : '#ffffff',
//                   transition: 'background-color 0.3s ease-in-out',
//                   cursor: 'pointer'
//                 }}
//                 onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#dfe7fd'}
//                 onMouseLeave={(e) => e.currentTarget.style.backgroundColor = index % 2 === 0 ? '#f9f9f9' : '#ffffff'}
//                 >
//                   <td style={{ padding: '12px' }}>{student.name}</td>
//                   <td style={{ padding: '12px' }}>{student.email}</td>
//                   <td style={{ padding: '12px' }}>{student.regNo}</td>
//                   <td style={{ padding: '12px' }}>{student.phone}</td>
//                   <td style={{ padding: '12px' }}>
//                     <span style={{
//                       padding: '5px 10px', 
//                       borderRadius: '5px', 
//                       color: 'white', 
//                       backgroundColor: student.status === 'Selected' ? '#28a745' : '#007bff'
//                     }}>
//                       {student.status}
//                     </span>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}

//       {/* No Students Found */}
//       {!loading && students.length === 0 && (
//         <div style={{ textAlign: 'center', color: '#555', marginTop: '20px' }}>
//           No students found for this company.
//         </div>
//       )}
//     </div>
//   );
// };

// export default CompanyStudentsTable;
