import React, { useState, useEffect } from "react";
import AdminNavBar from "../AdminNavBar/AdminNavBar";
import ChatBot from "../ChatBot/ChatBot";

const StudentsResumeDatabase = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBranch, setSelectedBranch] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const data = [
        { id: 1, name: "Rahul Sharma", email: "rahul@example.com", branch: "Computer Science", resume: "rahul_resume.pdf" },
        { id: 2, name: "Sneha Patel", email: "sneha@example.com", branch: "Information Technology", resume: "sneha_resume.pdf" },
        { id: 3, name: "Arun Verma", email: "arun@example.com", branch: "Mechanical Engineering", resume: "arun_resume.pdf" },
        { id: 4, name: "Priya Singh", email: "priya@example.com", branch: "Electrical Engineering", resume: "priya_resume.pdf" },
      ];
      setTimeout(() => {
        setStudents(data);
        setLoading(false);
      }, 1000);
    };

    fetchData();
  }, []);

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
    (selectedBranch === "" || student.branch === selectedBranch)
  );

  if (loading) {
    return (
      <div style={styles.loaderContainer}>
        <div style={styles.loader}></div>
        <p style={styles.loadingText}>Loading resumes...</p>
      </div>
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
          <select value={selectedBranch} onChange={(e) => setSelectedBranch(e.target.value)} style={styles.select}>
            <option value="">All Branches</option>
            {[...new Set(students.map((student) => student.branch))].map((branch, index) => (
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
                <th style={styles.th}>Resume</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student) => (
                  <tr key={student.id} style={styles.tr}>
                    <td style={styles.td}>{student.name}</td>
                    <td style={styles.td}>{student.email}</td>
                    <td style={styles.td}>{student.branch}</td>
                    <td style={styles.td}>
                      <a href={`/${student.resume}`} target="_blank" rel="noopener noreferrer" style={styles.downloadLink}>
                        📄 Download
                      </a>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" style={styles.noData}>No students found.</td>
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
    gap: "10px",
    marginBottom: "20px",
  },
  input: {
    padding: "8px",
    width: "200px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    transition: "0.3s",
  },
  select: {
    padding: "8px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    cursor: "pointer",
  },
  tableContainer: {
    width: "100%",
    overflowX: "auto",
  },
  table: {
    width: "80%",
    margin: "0 auto",
    borderCollapse: "collapse",
    borderRadius: "10px",
    overflow: "hidden",
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
  },
  th: {
    background: "#2980b9",
    color: "#fff",
    padding: "12px",
    textAlign: "left",
    fontSize: "16px",
  },
  td: {
    padding: "10px",
    borderBottom: "1px solid #ddd",
    transition: "0.3s",
  },
  tr: {
    transition: "0.3s",
  },
  trHover: {
    background: "#f5f5f5",
  },
  noData: {
    textAlign: "center",
    fontWeight: "bold",
    color: "#e74c3c",
    padding: "10px",
  },
  downloadLink: {
    textDecoration: "none",
    color: "#3498db",
    fontWeight: "bold",
    transition: "0.3s",
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
    border: "6px solid #ccc",
    borderTop: "6px solid #3498db",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
  loadingText: {
    fontSize: "18px",
    fontWeight: "bold",
    color: "#555",
    marginTop: "10px",
  },
};

export default StudentsResumeDatabase;
