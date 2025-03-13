import React, { useState, useEffect } from "react";
import AdminNavBar from "../AdminNavBar/AdminNavBar";
import axios from "axios";
import * as XLSX from "xlsx";

const PlacedStudentsList = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState("asc");
  const [selectedCompany, setSelectedCompany] = useState("");
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const drivesResponse = await axios.get("/api/drives/selected-students");
      const drivesData = drivesResponse.data;

      const allSelectedStudentIds = [];
      const studentDriveMapping = {};

      drivesData.forEach(drive => {
        if (drive.selectedStudents && drive.selectedStudents.length > 0) {
          drive.selectedStudents.forEach(studentId => {
            allSelectedStudentIds.push(studentId);
            studentDriveMapping[studentId] = {
              company: drive.companyName,
              role: drive.position,
              ctc: `${drive.package} LPA`
            };
          });
        }
      });

      if (allSelectedStudentIds.length > 0) {
        const studentsResponse = await axios.get("/api/students/by-ids", {
          params: { studentIds: allSelectedStudentIds }
        });

        const studentsData = studentsResponse.data;

        const combinedData = studentsData.map(student => ({
          id: student._id,
          firstName: student.firstName || "N/A",
          email: student.email,
          ...studentDriveMapping[student._id]
        }));

        setStudents(combinedData);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching students data:", error);
      setLoading(false);
    }
  };

  const filteredStudents = students.filter(student =>
    student.firstName.toLowerCase().includes(searchQuery.toLowerCase()) &&
    (selectedCompany === "" || student.company === selectedCompany)
  );

  const handleSort = () => {
    const newSortOrder = sortOrder === "asc" ? "desc" : "asc";
    setSortOrder(newSortOrder);
    setStudents([...students].sort((a, b) => newSortOrder === "asc" ? a.firstName.localeCompare(b.firstName) : b.firstName.localeCompare(a.firstName)));
  };

  const handleSelectStudent = (studentId) => {
    if (selectedStudents.includes(studentId)) {
      setSelectedStudents(selectedStudents.filter(id => id !== studentId));
    } else {
      setSelectedStudents([...selectedStudents, studentId]);
    }
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(filteredStudents.map(student => student.id));
    }
    setSelectAll(!selectAll);
  };

  const exportToExcel = () => {
    const selectedStudentsData = students.filter(student => selectedStudents.includes(student.id));
    if (selectedStudentsData.length === 0) {
      alert("Please select at least one student to export.");
      return;
    }

    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(selectedStudentsData.map(({ id, ...rest }) => rest));

    XLSX.utils.book_append_sheet(workbook, worksheet, "Placed Students");
    XLSX.writeFile(workbook, "placed_students.xlsx");
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "20px", fontSize: "18px", fontWeight: "bold" }}>
        Loading students data...
      </div>
    );
  }

  return (
    <>
      <AdminNavBar />
      <div style={{ padding: "20px", textAlign: "center", fontFamily: "Arial, sans-serif" }}>
        <h1 style={{ fontSize: "28px", fontWeight: "bold", color: "#2c3e50", textTransform: "uppercase" }}>Placed Students List</h1>
        <div style={{ display: "flex", justifyContent: "center", gap: "10px", marginBottom: "20px", flexWrap: "wrap" }}>
          <input type="text" placeholder="Search for names..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} style={{ padding: "8px", width: "200px", borderRadius: "5px", border: "1px solid #ccc" }} />
          <select value={selectedCompany} onChange={(e) => setSelectedCompany(e.target.value)} style={{ padding: "8px", borderRadius: "5px", border: "1px solid #ccc" }}>
            <option value="">All Companies</option>
            {[...new Set(students.map((student) => student.company))].map((company, index) => (
              <option key={index} value={company}>{company}</option>
            ))}
          </select>
          <button onClick={handleSort} style={{ padding: "8px 12px", background: "#3498db", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer" }}>
            Sort {sortOrder === "asc" ? "🔼" : "🔽"}
          </button>
          <button onClick={exportToExcel} disabled={selectedStudents.length === 0} style={{ padding: "8px 12px", background: "#3498db", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer" }}>
            Export Selected ({selectedStudents.length})
          </button>
        </div>
        <table style={{ width: "80%", margin: "0 auto", borderCollapse: "collapse", borderRadius: "10px", overflow: "hidden" }}>
          <thead>
            <tr style={{ background: "#2980b9", color: "#fff" }}>
              <th><input type="checkbox" checked={selectAll} onChange={handleSelectAll} /></th>
              <th>Student Name</th>
              <th>Email</th>
              <th>Company</th>
              <th>Role</th>
              <th>CTC</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.length > 0 ? filteredStudents.map(student => (
              <tr key={student.id}>
                <td><input type="checkbox" checked={selectedStudents.includes(student.id)} onChange={() => handleSelectStudent(student.id)} /></td>
                <td>{student.firstName || "N/A"}</td>
                <td>{student.email}</td>
                <td>{student.company}</td>
                <td>{student.role}</td>
                <td>{student.ctc}</td>
              </tr>
            )) : <tr><td colSpan="6">No students found.</td></tr>}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default PlacedStudentsList;
