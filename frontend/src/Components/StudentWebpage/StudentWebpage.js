import React, { useState, useEffect } from "react";
import StudentNavBar from "../StudentNavBar/StudentNavBar";
import StudentSideBar from "../StudentSideBar/StudentSideBar";
import EditStudentProfile from "../EditStudentProfile/EditStudentProfile";
import Mailbox from "../MailBox/MailBox";
import ChangePass from "../ChangePass/ChangePass";
import axios from "axios"; 
import { useNavigate } from "react-router-dom";
import MyApplications from "../MyApplication/MyApplication";
import ChatBot from "../ChatBot/ChatBot";

const StudentWebpage = () => {
  const navigate = useNavigate();
  const [selectedItem, setSelectedItem] = useState("Edit Profile"); 
  const [studentData, setStudentData] = useState(null); 
  const [loading, setLoading] = useState(true); 
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

    axios
      .get("/api/student/profile", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setStudentData(response.data); 
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to fetch student data");
        setLoading(false);
      });
  }, [navigate]);

  useEffect(() => {
    if (studentData) {
      console.log("Fetched Student Data:", studentData);
    }
  }, [studentData]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div> 
      <StudentNavBar />
      <div className="d-flex">
        <StudentSideBar setSelectedItem={setSelectedItem} studentData={studentData} />
        <div className="content p-4 w-100" style={{ minHeight: "30vh", overflowY: "auto", height: "85vh" }}>
          {selectedItem === "Edit Profile" && <EditStudentProfile studentData={studentData} />}
          {selectedItem === "My Applications" && <MyApplications studentData={studentData} />}
          {selectedItem === "Mailbox" && <Mailbox studentData={studentData} />}
          {selectedItem === "Settings" && <ChangePass />}
        </div>
      </div>
      <ChatBot />
    </div>
  );
};

export default StudentWebpage;
