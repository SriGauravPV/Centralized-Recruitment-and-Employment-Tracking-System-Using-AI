// import React, { useState } from 'react';
// import { 
//   Building,
//   Calendar,
//   Briefcase,
//   GraduationCap,
//   Users,
//   Clock,
//   MapPin,
//   DollarSign,
//   CheckCircle,
//   AlertCircle
// } from 'lucide-react';

// const PlacementDriveDatabase = () => {
//   const [drives, setDrives] = useState([
//     {
//       id: 1,
//       companyName: 'Tech Solutions Inc.',
//       logo: '/company1.png',
//       position: 'Software Engineer',
//       package: '12-15 LPA',
//       deadline: '2025-03-15',
//       driveDate: '2025-03-20',
//       location: 'Bangalore, India',
//       mode: 'Hybrid',
//       eligibility: {
//         branches: ['Computer Science', 'IT', 'Electronics'],
//         cgpa: '7.5',
//         backlog: 'No active backlogs',
//         batch: '2025'
//       },
//       jobDescription: `We are looking for passionate Software Engineers to join our team.
//         - Strong knowledge of Data Structures and Algorithms
//         - Proficiency in any programming language
//         - Good problem-solving skills`,
//       process: [
//         'Online Assessment',
//         'Technical Interview',
//         'HR Interview'
//       ],
//       openPositions: 50,
//       status: 'active',
//       appliedCount: 145
//     },
//     {
//       id: 2,
//       companyName: 'Global Systems Ltd',
//       logo: '/company2.png',
//       position: 'Systems Analyst',
//       package: '10-12 LPA',
//       deadline: '2025-03-25',
//       driveDate: '2025-03-30',
//       location: 'Mumbai, India',
//       mode: 'On-site',
//       eligibility: {
//         branches: ['Computer Science', 'IT', 'Electronics', 'Mechanical'],
//         cgpa: '7.0',
//         backlog: 'Maximum 1 backlog allowed',
//         batch: '2025'
//       },
//       jobDescription: `Looking for Systems Analysts to join our growing team.
//         - Experience with system analysis and design
//         - Knowledge of SQL and databases
//         - Strong analytical skills`,
//       process: [
//         'Aptitude Test',
//         'Technical Round',
//         'HR Round'
//       ],
//       openPositions: 25,
//       status: 'active',
//       appliedCount: 89
//     }
//   ]);

//   const [searchTerm, setSearchTerm] = useState('');
//   const [expandedId, setExpandedId] = useState(null);
//   const [filterBranch, setFilterBranch] = useState('All');

//   const branches = ['All', 'Computer Science', 'IT', 'Electronics', 'Mechanical'];

//   const filteredDrives = drives.filter(drive => {
//     const matchesSearch = drive.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                          drive.position.toLowerCase().includes(searchTerm.toLowerCase());
//     const matchesBranch = filterBranch === 'All' || drive.eligibility.branches.includes(filterBranch);
//     return matchesSearch && matchesBranch;
//   });

//   const handleApply = (driveId) => {
//     // In a real application, this would handle the application process
//     console.log(`Applying for drive ${driveId}`);
//   };

//   return (
//     <div style={{ maxWidth: '1200px', margin: '2rem auto', padding: '0 20px' }}>
//       <div style={{ marginBottom: '2rem' }}>
//         <h1 style={{ 
//           fontSize: '2rem', 
//           color: '#1a365d', 
//           marginBottom: '1rem'
//         }}>
//           Campus Placement Drives
//         </h1>
        
//         <div style={{ 
//           display: 'flex', 
//           gap: '1rem', 
//           marginBottom: '2rem',
//           flexWrap: 'wrap'
//         }}>
//           <div style={{ 
//             flex: '1',
//             minWidth: '250px',
//             position: 'relative' 
//           }}>
//             <input
//               type="text"
//               placeholder="Search by company or position..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               style={{
//                 width: '100%',
//                 padding: '12px',
//                 borderRadius: '8px',
//                 border: '1px solid #e2e8f0',
//                 fontSize: '1rem',
//                 transition: 'all 0.3s ease'
//               }}
//             />
//           </div>
          
//           <select
//             value={filterBranch}
//             onChange={(e) => setFilterBranch(e.target.value)}
//             style={{
//               padding: '12px',
//               borderRadius: '8px',
//               border: '1px solid #e2e8f0',
//               fontSize: '1rem',
//               minWidth: '200px',
//               cursor: 'pointer'
//             }}
//           >
//             {branches.map(branch => (
//               <option key={branch} value={branch}>{branch}</option>
//             ))}
//           </select>
//         </div>
//       </div>

//       <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
//         {filteredDrives.map(drive => (
//           <div
//             key={drive.id}
//             style={{
//               background: 'white',
//               borderRadius: '12px',
//               overflow: 'hidden',
//               boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
//               transition: 'all 0.3s ease'
//             }}
//           >
//             <div
//               style={{
//                 padding: '1.5rem',
//                 cursor: 'pointer',
//                 borderBottom: '1px solid #e2e8f0'
//               }}
//               onClick={() => setExpandedId(expandedId === drive.id ? null : drive.id)}
//             >
//               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
//                 <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
//                   <div
//                     style={{
//                       width: '64px',
//                       height: '64px',
//                       borderRadius: '8px',
//                       background: '#f8fafc',
//                       display: 'flex',
//                       alignItems: 'center',
//                       justifyContent: 'center'
//                     }}
//                   >
//                     <Building size={32} color="#64748b" />
//                   </div>
//                   <div>
//                     <h3 style={{ margin: 0, color: '#1a365d', fontSize: '1.25rem' }}>
//                       {drive.companyName}
//                     </h3>
//                     <p style={{ margin: '0.25rem 0 0 0', color: '#64748b', fontSize: '1rem' }}>
//                       {drive.position}
//                     </p>
//                     <div style={{ 
//                       display: 'flex', 
//                       gap: '1rem', 
//                       marginTop: '0.5rem',
//                       fontSize: '0.875rem',
//                       color: '#64748b'
//                     }}>
//                       <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
//                         <DollarSign size={16} />
//                         {drive.package}
//                       </span>
//                       <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
//                         <MapPin size={16} />
//                         {drive.location}
//                       </span>
//                     </div>
//                   </div>
//                 </div>
                
//                 <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
//                   <span style={{ 
//                     padding: '4px 12px', 
//                     borderRadius: '16px', 
//                     fontSize: '0.875rem',
//                     background: '#e2e8f0'
//                   }}>
//                     {drive.mode}
//                   </span>
//                   <span style={{ color: '#64748b', fontSize: '0.875rem' }}>
//                     {drive.appliedCount} applications
//                   </span>
//                 </div>
//               </div>
//             </div>

//             {expandedId === drive.id && (
//               <div style={{ padding: '1.5rem', background: '#f8fafc' }}>
//                 <div style={{ display: 'grid', gap: '1.5rem' }}>
//                   <div>
//                     <h4 style={{ margin: '0 0 0.75rem 0', color: '#1a365d' }}>Important Dates</h4>
//                     <div style={{ display: 'flex', gap: '2rem' }}>
//                       <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
//                         <Clock size={16} color="#64748b" />
//                         <div>
//                           <p style={{ margin: 0, fontSize: '0.875rem', color: '#64748b' }}>Application Deadline</p>
//                           <p style={{ margin: '0.25rem 0 0 0', color: '#1a365d' }}>
//                             {new Date(drive.deadline).toLocaleDateString()}
//                           </p>
//                         </div>
//                       </div>
//                       <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
//                         <Calendar size={16} color="#64748b" />
//                         <div>
//                           <p style={{ margin: 0, fontSize: '0.875rem', color: '#64748b' }}>Drive Date</p>
//                           <p style={{ margin: '0.25rem 0 0 0', color: '#1a365d' }}>
//                             {new Date(drive.driveDate).toLocaleDateString()}
//                           </p>
//                         </div>
//                       </div>
//                     </div>
//                   </div>

//                   <div>
//                     <h4 style={{ margin: '0 0 0.75rem 0', color: '#1a365d' }}>Eligibility Criteria</h4>
//                     <div style={{ display: 'grid', gap: '0.75rem' }}>
//                       <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
//                         <GraduationCap size={16} color="#64748b" />
//                         <span>Branches: {drive.eligibility.branches.join(', ')}</span>
//                       </div>
//                       <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
//                         <CheckCircle size={16} color="#64748b" />
//                         <span>Minimum CGPA: {drive.eligibility.cgpa}</span>
//                       </div>
//                       <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
//                         <AlertCircle size={16} color="#64748b" />
//                         <span>{drive.eligibility.backlog}</span>
//                       </div>
//                     </div>
//                   </div>

//                   <div>
//                     <h4 style={{ margin: '0 0 0.75rem 0', color: '#1a365d' }}>Job Description</h4>
//                     <p style={{ margin: 0, whiteSpace: 'pre-line' }}>{drive.jobDescription}</p>
//                   </div>

//                   <div>
//                     <h4 style={{ margin: '0 0 0.75rem 0', color: '#1a365d' }}>Selection Process</h4>
//                     <ol style={{ margin: 0, paddingLeft: '1.25rem' }}>
//                       {drive.process.map((step, index) => (
//                         <li key={index} style={{ marginBottom: '0.5rem' }}>{step}</li>
//                       ))}
//                     </ol>
//                   </div>

//                   <button
//                     onClick={() => handleApply(drive.id)}
//                     style={{
//                       padding: '12px 24px',
//                       background: '#2563eb',
//                       color: 'white',
//                       border: 'none',
//                       borderRadius: '8px',
//                       fontSize: '1rem',
//                       fontWeight: '500',
//                       cursor: 'pointer',
//                       transition: 'all 0.3s ease',
//                       display: 'flex',
//                       alignItems: 'center',
//                       justifyContent: 'center',
//                       gap: '0.5rem'
//                     }}
//                   >
//                     <Briefcase size={18} />
//                     Apply Now
//                   </button>
//                 </div>
//               </div>
//             )}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default PlacementDriveDatabase;
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { 
  Upload,
  Plus,
  Minus
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const PostDriveForm = ({companyData}) => {
  const [formData, setFormData] = useState({
    companyName: companyData.companyName,
    companyWebsite: companyData.website,
    companyLogo: null,
    companyProfile: companyData.companyDescription,
    position: '',
    package: '',
    jobDescription: '',
    openPositions: '',
    eligibleBranches: [],
    minCgpa: '',
    backlog: 'No active backlogs',
    batch: '',
    process: [''],
    title: '',
    driveDate: '',
    studentsId: [],
    selectedStudents: []
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const branches = [
    'Computer Science',
    'Information Technology',
    'Electronics',
    'Mechanical',
    'Civil',
    'Electrical'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        companyLogo: file
      }));
    }
  };

  const handleBranchChange = (branch) => {
    setFormData(prev => ({
      ...prev,
      eligibleBranches: prev.eligibleBranches.includes(branch)
        ? prev.eligibleBranches.filter(b => b !== branch)
        : [...prev.eligibleBranches, branch]
    }));
  };

  const addProcessStep = () => {
    setFormData(prev => ({
      ...prev,
      process: [...prev.process, '']
    }));
  };

  const removeProcessStep = (index) => {
    setFormData(prev => ({
      ...prev,
      process: prev.process.filter((_, i) => i !== index)
    }));
  };

  const updateProcessStep = (index, value) => {
    setFormData(prev => ({
      ...prev,
      process: prev.process.map((step, i) => 
        i === index ? value : step
      )
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.companyName) newErrors.companyName = 'Company name is required';
    if (!formData.position) newErrors.position = 'Position is required';
    if (!formData.package) newErrors.package = 'Package is required';
    if (!formData.driveDate) newErrors.driveDate = 'Drive date is required';
    if (formData.eligibleBranches.length === 0) newErrors.eligibleBranches = 'Select at least one branch';
    if (!formData.minCgpa) newErrors.minCgpa = 'Minimum CGPA is required';
    if (!formData.batch) newErrors.batch = 'Batch year is required';
    if (!formData.jobDescription) newErrors.jobDescription = 'Job description is required';
    if (!formData.openPositions) newErrors.openPositions = 'Number of positions is required';
    if (!formData.title) newErrors.title = 'Drive title is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setLoading(true);
      
      try {
        // Create form data for file upload
        const formDataToSend = new FormData();
        console.log(formData);
        
        // Add all text fields
        // for (const key in formData) {
        //   if (key === 'companyLogo') {
        //     continue; // We'll add the file separately
        //   } else if (key === 'eligibleBranches' || key === 'process') {
        //     // For arrays, add each item separately
        //     if (Array.isArray(formData[key])) {
        //       formData[key].forEach(item => {
        //         formDataToSend.append(key, item);
        //       });
        //     }
        //   } else {
        //     formDataToSend.append(key, formData[key]);
        //   }
        // }
        
        // // Add the file if it exists
        // if (formData.companyLogo) {
        //   formDataToSend.append('companyLogo', formData.companyLogo);
        // }
        
        // // Get the auth token from sessionStorage
        // const token = sessionStorage.getItem('token');
        
        // Make the API request
        const response = await axios.post(
          '/api/drives',
          {formData},
          // {
          //   headers: {
          //     Authorization: `Bearer ${token}`,
          //     'Content-Type': 'multipart/form-data'
          //   }
          // }
        );
        
        toast.success('Drive posted successfully!');
      } catch (error) {
        const errorMsg = error.response?.data?.error || 'Failed to post drive';
        toast.error(errorMsg);
        console.error('Error posting drive:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const formStyles = {
    label: {
      display: 'block',
      marginBottom: '0.5rem',
      color: '#1a365d',
      fontWeight: '500'
    },
    input: {
      width: '100%',
      padding: '0.75rem',
      borderRadius: '0.5rem',
      border: '1px solid #e2e8f0',
      fontSize: '1rem',
      transition: 'all 0.3s ease'
    },
    error: {
      color: '#dc2626',
      fontSize: '0.875rem',
      marginTop: '0.25rem'
    },
    section: {
      marginBottom: '1.5rem'
    },
    submitButton: {
      padding: '0.75rem 1.5rem',
      backgroundColor: '#2563eb',
      color: 'white',
      borderRadius: '0.5rem',
      border: 'none',
      fontSize: '1rem',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.3s ease'
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '2rem auto', padding: '0 20px' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', color: '#1a365d', marginBottom: '1rem' }}>
          Post New Placement Drive
        </h1>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Company Details Section */}
        <div style={{ 
          background: 'white',
          padding: '2rem',
          borderRadius: '12px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          marginBottom: '2rem'
        }}>
          <h2 style={{ fontSize: '1.5rem', color: '#1a365d', marginBottom: '1.5rem' }}>
            Company Details
          </h2>

          <div style={formStyles.section}>
            <label style={formStyles.label}>Company Logo</label>
            <div style={{
              border: '2px dashed #e2e8f0',
              borderRadius: '0.5rem',
              padding: '2rem',
              textAlign: 'center',
              cursor: 'pointer'
            }}>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                style={{ display: 'none' }}
                id="logo-upload"
              />
              <label htmlFor="logo-upload" style={{ cursor: 'pointer' }}>
                <Upload size={24} style={{ marginBottom: '0.5rem' }} />
                <div>Click to upload company logo</div>
              </label>
            </div>
          </div>

          <div style={formStyles.section}>
            <label style={formStyles.label}>Company Name *</label>
            <input
              type="text"
              name="companyName"
              value={formData.companyName}
              onChange={handleInputChange}
              style={formStyles.input}
              placeholder="Enter company name"
            />
            {errors.companyName && <div style={formStyles.error}>{errors.companyName}</div>}
          </div>

          <div style={formStyles.section}>
            <label style={formStyles.label}>Company Website</label>
            <input
              type="url"
              name="companyWebsite"
              value={formData.companyWebsite}
              onChange={handleInputChange}
              style={formStyles.input}
              placeholder="https://example.com"
            />
          </div>

          <div style={formStyles.section}>
            <label style={formStyles.label}>Company Profile</label>
            <textarea
              name="companyProfile"
              value={formData.companyProfile}
              onChange={handleInputChange}
              style={{ ...formStyles.input, minHeight: '100px', resize: 'vertical' }}
              placeholder="Brief description about the company"
            />
          </div>
        </div>

        {/* Job Details Section */}
        <div style={{ 
          background: 'white',
          padding: '2rem',
          borderRadius: '12px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          marginBottom: '2rem'
        }}>
          <h2 style={{ fontSize: '1.5rem', color: '#1a365d', marginBottom: '1.5rem' }}>
            Job Details
          </h2>

          <div style={formStyles.section}>
            <label style={formStyles.label}>Position *</label>
            <input
              type="text"
              name="position"
              value={formData.position}
              onChange={handleInputChange}
              style={formStyles.input}
              placeholder="Job position/title"
            />
            {errors.position && <div style={formStyles.error}>{errors.position}</div>}
          </div>

          <div style={formStyles.section}>
            <label style={formStyles.label}>Package (LPA) *</label>
            <input
              type="text"
              name="package"
              value={formData.package}
              onChange={handleInputChange}
              style={formStyles.input}
              placeholder="e.g., 10-12 LPA"
            />
            {errors.package && <div style={formStyles.error}>{errors.package}</div>}
          </div>

          <div style={formStyles.section}>
            <label style={formStyles.label}>Job Description *</label>
            <textarea
              name="jobDescription"
              value={formData.jobDescription}
              onChange={handleInputChange}
              style={{ ...formStyles.input, minHeight: '150px', resize: 'vertical' }}
              placeholder="Detailed job description, responsibilities, and requirements"
            />
            {errors.jobDescription && <div style={formStyles.error}>{errors.jobDescription}</div>}
          </div>

          <div style={formStyles.section}>
            <label style={formStyles.label}>Number of Positions *</label>
            <input
              type="number"
              name="openPositions"
              value={formData.openPositions}
              onChange={handleInputChange}
              style={formStyles.input}
              min="1"
            />
            {errors.openPositions && <div style={formStyles.error}>{errors.openPositions}</div>}
          </div>
        </div>

        {/* Eligibility Criteria Section */}
        <div style={{ 
          background: 'white',
          padding: '2rem',
          borderRadius: '12px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          marginBottom: '2rem'
        }}>
          <h2 style={{ fontSize: '1.5rem', color: '#1a365d', marginBottom: '1.5rem' }}>
            Eligibility Criteria
          </h2>

          <div style={formStyles.section}>
            <label style={formStyles.label}>Eligible Branches *</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
              {branches.map(branch => (
                <label key={branch} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input
                    type="checkbox"
                    checked={formData.eligibleBranches.includes(branch)}
                    onChange={() => handleBranchChange(branch)}
                  />
                  {branch}
                </label>
              ))}
            </div>
            {errors.eligibleBranches && <div style={formStyles.error}>{errors.eligibleBranches}</div>}
          </div>

          <div style={formStyles.section}>
            <label style={formStyles.label}>Minimum CGPA *</label>
            <input
              type="number"
              name="minCgpa"
              value={formData.minCgpa}
              onChange={handleInputChange}
              style={formStyles.input}
              step="0.1"
              min="0"
              max="10"
              placeholder="e.g., 7.5"
            />
            {errors.minCgpa && <div style={formStyles.error}>{errors.minCgpa}</div>}
          </div>

          <div style={formStyles.section}>
            <label style={formStyles.label}>Backlogs</label>
            <select
              name="backlog"
              value={formData.backlog}
              onChange={handleInputChange}
              style={formStyles.input}
            >
              <option value="No active backlogs">No active backlogs</option>
              <option value="Maximum 1 backlog">Maximum 1 backlog</option>
              <option value="Maximum 2 backlogs">Maximum 2 backlogs</option>
              <option value="Backlogs allowed">Backlogs allowed</option>
            </select>
          </div>

          <div style={formStyles.section}>
            <label style={formStyles.label}>Batch *</label>
            <input
              type="text"
              name="batch"
              value={formData.batch}
              onChange={handleInputChange}
              style={formStyles.input}
              placeholder="e.g., 2025"
            />
            {errors.batch && <div style={formStyles.error}>{errors.batch}</div>}
          </div>
        </div>

        {/* Selection Process Section */}
        <div style={{ 
          background: 'white',
          padding: '2rem',
          borderRadius: '12px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          marginBottom: '2rem'
        }}>
          <h2 style={{ fontSize: '1.5rem', color: '#1a365d', marginBottom: '1.5rem' }}>
            Selection Process
          </h2>

          {formData.process.map((step, index) => (
            <div key={index} style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
              <input
                type="text"
                value={step}
                onChange={(e) => updateProcessStep(index, e.target.value)}
                placeholder={`Selection Step ${index + 1}`}
                style={formStyles.input}
              />
              {index > 0 && (
                <button
                  type="button"
                  onClick={() => removeProcessStep(index)}
                  style={{
                    padding: '0.5rem',
                    background: '#fee2e2',
                    border: 'none',
                    borderRadius: '0.5rem',
                    cursor: 'pointer'
                  }}
                >
                  <Minus size={20} color="#dc2626" />
                </button>
              )}
            </div>
          ))}

          <button
            type="button"
            onClick={addProcessStep}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.5rem 1rem',
              background: '#f0f9ff',
              border: 'none',
              borderRadius: '0.5rem',
              color: '#0369a1',
              cursor: 'pointer'
            }}
          >
            <Plus size={20} />
            Add Selection Step
          </button>
        </div>

        {/* Drive Details Section */}
        <div style={{ 
          background: 'white',
          padding: '2rem',
          borderRadius: '12px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          marginBottom: '2rem'
        }}>
          <h2 style={{ fontSize: '1.5rem', color: '#1a365d', marginBottom: '1.5rem' }}>
            Drive Details
          </h2>

          <div style={formStyles.section}>
            <label style={formStyles.label}>Drive Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              style={formStyles.input}
              placeholder="e.g., Placement Drive 2023"
            />
            {errors.title && <div style={formStyles.error}>{errors.title}</div>}
          </div>

          <div style={formStyles.section}>  
            <label style={formStyles.label}>Drive Date *</label>
            <input
              type="date"
              name="driveDate"
              value={formData.driveDate}
              onChange={handleInputChange}
              style={formStyles.input}
            />
            {errors.driveDate && <div style={formStyles.error}>{errors.driveDate}</div>}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button 
            type="submit" 
            style={formStyles.submitButton}
            disabled={loading}
          >                
            {loading ? 'Posting...' : 'Post Drive'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PostDriveForm;