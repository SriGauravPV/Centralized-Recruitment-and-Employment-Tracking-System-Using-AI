import React, { useState } from 'react';
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

const StudentResumeDatabase = () => {
  const [students, setStudents] = useState([
    {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '+1 234-567-8900',
      department: 'Computer Science',
      year: '4th Year',
      gpa: '3.8',
      skills: ['React', 'Node.js', 'Python'],
      resumeUrl: '/sample.pdf',
      experience: 'Software Engineer Intern at Tech Corp',
      education: 'B.Tech in Computer Science',
      projects: ['E-commerce Platform', 'Machine Learning Model']
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      phone: '+1 234-567-8901',
      department: 'Electronics',
      year: '3rd Year',
      gpa: '3.9',
      skills: ['VLSI', 'Arduino', 'C++'],
      resumeUrl: '/sample.pdf',
      experience: 'Research Assistant at Electronics Lab',
      education: 'B.Tech in Electronics',
      projects: ['Smart Home System', 'Robotics Project']
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [expandedId, setExpandedId] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState('All');

  const handleDownload = (resumeUrl, studentName) => {
    // In a real application, this would trigger the resume download
    console.log(`Downloading resume for ${studentName}`);
  };

  const departments = ['All', 'Computer Science', 'Electronics', 'Mechanical', 'Civil'];

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.skills.join(' ').toLowerCase().includes(searchTerm.toLowerCase());
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
          Student Resume Database
        </h1>
        
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
      </div>

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
                    background: '#e2e8f0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.5rem',
                    color: '#64748b'
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
                  handleDownload(student.resumeUrl, student.name);
                }}
                style={{
                  padding: '8px 16px',
                  background: '#2563eb',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  transition: 'all 0.3s ease'
                }}
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
                    <h4 style={{ margin: '0 0 0.5rem 0', color: '#1a365d' }}>Projects</h4>
                    <ul style={{ margin: 0, paddingLeft: '1.5rem' }}>
                      {student.projects.map(project => (
                        <li key={project}>{project}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
    <ChatBot />
    </>
  );
};

export default StudentResumeDatabase;