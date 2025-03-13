import React, { useState, useEffect } from "react";
import AdminNavBar from "../AdminNavBar/AdminNavBar";
import ChatBot from "../ChatBot/ChatBot";
import axios from "axios";

const StudentsResumeDatabase = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBranch, setSelectedBranch] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Replace with your actual API endpoint
        const response = await axios.get("/api/get-all-students");
        setStudents(response.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching student data:", err);
        setError("Failed to load student resumes. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Function to convert base64 to blob for PDF display/download
  const base64ToBlob = (base64String, contentType = 'application/pdf') => {
    // Handle base64 strings with or without the data URL prefix
    const base64 = base64String.includes('base64,') 
      ? base64String.split('base64,')[1] 
      : base64String;
    
    const byteCharacters = atob(base64);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
      const slice = byteCharacters.slice(offset, offset + 512);
      const byteNumbers = new Array(slice.length);
      
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    return new Blob(byteArrays, { type: contentType });
  };

  // Function to view PDF in a new tab
  const viewResume = (resumeData, studentName) => {
    try {
      // Ensure the resumeData has the correct format
      const pdfBase64 = resumeData.startsWith('data:application/pdf;base64,') 
        ? resumeData 
        : `data:application/pdf;base64,${resumeData}`;
      
      // Create a blob from the base64 data
      const blob = base64ToBlob(pdfBase64);
      
      // Create a URL for the blob
      const pdfUrl = URL.createObjectURL(blob);
      
      // Open in a new tab
      window.open(pdfUrl, '_blank');
    } catch (error) {
      console.error("Error opening PDF:", error);
      alert("Could not open the PDF. The file might be corrupted.");
    }
  };

  // Function to download PDF
  const downloadResume = (resumeData, studentName) => {
    try {
      // Format the student name for the filename
      const fileName = `${studentName.replace(/\s+/g, '_')}_resume.pdf`;
      
      // Ensure the resumeData has the correct format
      const pdfBase64 = resumeData.startsWith('data:application/pdf;base64,') 
        ? resumeData 
        : `data:application/pdf;base64,${resumeData}`;
      
      // Create a blob from the base64 data
      const blob = base64ToBlob(pdfBase64);
      
      // Create a URL for the blob
      const pdfUrl = URL.createObjectURL(blob);
      
      // Create a temporary link for downloading
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.download = fileName;
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(pdfUrl), 100);
    } catch (error) {
      console.error("Error downloading PDF:", error);
      alert("Could not download the PDF. The file might be corrupted.");
    }
  };

  // Get unique branches/streams for dropdown
  const uniqueBranches = [...new Set(students
    .map(student => student.stream || "Unspecified")
    .filter(Boolean))];

  // Filter students based on search query and selected branch
  const filteredStudents = students.filter(student => {
    const fullName = `${student.firstName} ${student.lastName}`.toLowerCase();
    const matchesSearch = fullName.includes(searchQuery.toLowerCase());
    const matchesBranch = selectedBranch === "" || 
      (student.stream || "Unspecified") === selectedBranch;
    return matchesSearch && matchesBranch;
  });

  if (loading) {
    return (
      <div style={styles.loaderContainer}>
        <div style={styles.loader}></div>
        <p style={styles.loadingText}>Loading resumes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <>
        <AdminNavBar />
        <div style={styles.errorContainer}>
          <div style={styles.errorIcon}>❌</div>
          <h2 style={styles.errorTitle}>Error Loading Data</h2>
          <p style={styles.errorMessage}>{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            style={styles.reloadButton}
          >
            Try Again
          </button>
        </div>
        <ChatBot />
      </>
    );
  }

  return (
    <>
      <AdminNavBar />
      <div style={styles.container}>
        <h1 style={styles.title}>Students Resume Database</h1>

        {/* Filter Section */}
        <div style={styles.filterSection}>
          {/* Search Input */}
          <input
            type="text"
            placeholder="Search by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={styles.input}
          />

          {/* Branch Dropdown */}
          <select 
            value={selectedBranch} 
            onChange={(e) => setSelectedBranch(e.target.value)} 
            style={styles.select}
          >
            <option value="">All Branches</option>
            {uniqueBranches.map((branch, index) => (
              <option key={index} value={branch}>
                {branch}
              </option>
            ))}
          </select>
        </div>

        {/* Students Table */}
        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Name</th>
                <th style={styles.th}>Email</th>
                <th style={styles.th}>Branch</th>
                <th style={styles.th}>Qualification</th>
                <th style={styles.th}>Resume</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student) => (
                  <tr key={student._id || student.id} style={styles.tr}>
                    <td style={styles.td}>{`${student.firstName} ${student.lastName}`}</td>
                    <td style={styles.td}>{student.email}</td>
                    <td style={styles.td}>{student.stream || "Unspecified"}</td>
                    <td style={styles.td}>{student.qualification || "Unspecified"}</td>
                    <td style={styles.td}>
                      {student.resumeUrl ? (
                        <div style={styles.actionButtons}>
                          <button
                            onClick={() => viewResume(student.resumeUrl, `${student.firstName} ${student.lastName}`)}
                            style={styles.viewButton}
                          >
                            👁️ View
                          </button>
                          <button
                            onClick={() => downloadResume(student.resumeUrl, `${student.firstName} ${student.lastName}`)}
                            style={styles.downloadButton}
                          >
                            ⬇️ Download
                          </button>
                        </div>
                      ) : (
                        <span style={styles.noResume}>No resume available</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" style={styles.noData}>No students found matching your criteria.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <ChatBot />
    </>
  );
};

const styles = {
  container: {
    padding: "20px",
    textAlign: "center",
    fontFamily: "Arial, sans-serif",
    maxWidth: "1200px",
    margin: "0 auto",
    marginTop: "70px"
  },
  title: {
    fontSize: "28px",
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: "20px",
    textTransform: "uppercase",
  },
  filterSection: {
    display: "flex",
    justifyContent: "center",
    gap: "15px",
    marginBottom: "25px",
    flexWrap: "wrap"
  },
  input: {
    padding: "10px 15px",
    width: "250px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    transition: "0.3s",
    fontSize: "16px"
  },
  select: {
    padding: "10px 15px",
    minWidth: "200px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    cursor: "pointer",
    fontSize: "16px"
  },
  tableContainer: {
    width: "100%",
    overflowX: "auto",
    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
    borderRadius: "8px"
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    borderRadius: "8px",
    overflow: "hidden",
  },
  th: {
    background: "#3498db",
    color: "#fff",
    padding: "15px",
    textAlign: "left",
    fontSize: "16px",
    fontWeight: "600"
  },
  td: {
    padding: "12px 15px",
    borderBottom: "1px solid #ddd",
    transition: "0.3s",
    fontSize: "15px"
  },
  tr: {
    transition: "0.3s",
    backgroundColor: "white",
    "&:hover": {
      backgroundColor: "#f5f5f5"
    }
  },
  noData: {
    textAlign: "center",
    fontWeight: "bold",
    color: "#e74c3c",
    padding: "20px",
    fontSize: "16px"
  },
  actionButtons: {
    display: "flex",
    gap: "8px",
    justifyContent: "center"
  },
  viewButton: {
    padding: "6px 12px",
    backgroundColor: "#3498db",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "14px",
    transition: "background-color 0.2s",
    "&:hover": {
      backgroundColor: "#2980b9"
    }
  },
  downloadButton: {
    padding: "6px 12px",
    backgroundColor: "#2ecc71",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "14px",
    transition: "background-color 0.2s",
    "&:hover": {
      backgroundColor: "#27ae60"
    }
  },
  noResume: {
    color: "#7f8c8d",
    fontStyle: "italic"
  },
  loaderContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
  },
  loader: {
    width: "50px",
    height: "50px",
    border: "6px solid #f3f3f3",
    borderTop: "6px solid #3498db",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
  loadingText: {
    fontSize: "18px",
    fontWeight: "bold",
    color: "#555",
    marginTop: "15px",
  },
  errorContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "80vh",
    padding: "0 20px",
    textAlign: "center"
  },
  errorIcon: {
    fontSize: "50px",
    marginBottom: "20px"
  },
  errorTitle: {
    fontSize: "24px",
    color: "#e74c3c",
    marginBottom: "15px"
  },
  errorMessage: {
    fontSize: "16px",
    color: "#7f8c8d",
    marginBottom: "25px",
    maxWidth: "500px"
  },
  reloadButton: {
    padding: "10px 20px",
    backgroundColor: "#3498db",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
    transition: "background-color 0.3s",
    "&:hover": {
      backgroundColor: "#2980b9"
    }
  }
};

export default StudentsResumeDatabase;