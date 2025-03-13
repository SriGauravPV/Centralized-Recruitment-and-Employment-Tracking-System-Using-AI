import { react, useState, useEffect } from "react";
import AdminSidebar from "../AdminSidebar/AdminSidebar";
import { useNavigate } from "react-router-dom";
import AdminNavBar from "../AdminNavBar/AdminNavBar";
import ActiveDrives from "../ActiveDrives/ActiveDrives";
import AdminMainBoard from "../AdminMainBoard/AdminMainBoard";
import StudentProfiles from "../StudentProfiles/StudentProfiles";
import CompanyProfiles from "../CompanyProfiles/CompanyProfiles";
import ChatBot from "../ChatBot/ChatBot";
import Mailbox from "../MailBox/MailBox";

const AdminDashboard = () => {
    const [selectedItem, setSelectedItem] = useState('dashboard');
    const navigate = useNavigate();

    useEffect(() => {
        const token = sessionStorage.getItem('token');
        if (!token) {
            navigate('/admin-login');
        }
    }, [navigate]);

    const renderContent = () => {
        switch (selectedItem) {
            case 'dashboard':
                return <AdminMainBoard />;
            case 'Active Drives':
                return <ActiveDrives />;
            case 'Student Profile':
                return <StudentProfiles />;
            case 'Company Profile':
                return <CompanyProfiles />;
            case 'Email':
                return <Mailbox />;
            default:
                return <AdminMainBoard />;
        }
    };

    return (
        <div>
            <AdminNavBar />
            <div className="d-flex">
            <AdminSidebar selectedItem={selectedItem} setSelectedItem={setSelectedItem} />
                <div className="content p-4" style={{ minHeight: "30vh", overflowY: "auto", height: "85vh", backgroundColor: "#f5f5f5",width:"85%" }}>
                    {renderContent()}
                </div>
            </div>
            <ChatBot />
        </div>
    );
};

export default AdminDashboard;