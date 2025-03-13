import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Components/Home/Home';
import Contact from './Components/Contact/Contact';
import StudentLogin from './Components/StudentLogin/StudentLogin';
import AdminLogin from './Components/AdminLogin/AdminLogin';
import CompanyLogin from './Components/CompanyLogin/CompanyLogin';
import StudentRegister from './Components/StudentRegister/StudentRegister';
import CompanyRegister from './Components/CompanyRegister/CompanyRegister';
import StudentWebpage from './Components/StudentWebpage/StudentWebpage';
import ActiveDrives from './Components/ActiveDrives/ActiveDrives';
import CompanyDisc from './Components/CompanyDisc/CompanyDisc';
import PlacedStudentsList from './Components/PlacedStudentList/PlacedStudentList';
import SelectedStudent from './Components/SelectedStudent/SelectedStudent';
import ChatBot from './Components/ChatBot/ChatBot';
import FinalSelects from './Components/FinalSelects/FinalSelects';
import PostDrive from './Components/PostDrive/PostDrive';

import { Navigate, Outlet } from 'react-router-dom';
import CompanyDashboard from './Components/CompanyDashboard/CompanyDashboard';
import StudentResumeDatabase from './Components/ResumeDatabase/ResumeDatabase';
import AdminDashboard from './Components/AdminDashboard/AdminDashboard';
import MyApplication from './Components/MyApplication/MyApplication';
import ResetPassword from './Components/ResetComponent/ResetComponent';
import AppliedStudents from './Components/AppliedStudents/AppliedStudents';

const ProtectedRoute = ({ allowedRoles }) => {
    const role = sessionStorage.getItem('role');
    return allowedRoles.includes(role) ? <Outlet /> : <Navigate to="/" />;
};

const App = () => {
  return (
    <Router>
      <div>
        
      <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/student" element={<StudentLogin />} />
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/company" element={<CompanyLogin />} />
            <Route path="/register-student" element={<StudentRegister />} />
            <Route path="/register-company" element={<CompanyRegister />} />
            <Route path="/chatBot" element={<ChatBot />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />


            {/* Protected Routes */}
            <Route element={<ProtectedRoute allowedRoles={['student']} />}>
                <Route path="/home/studentWebPage" element={<StudentWebpage />} />
                <Route path="/home/active-drives" element={<ActiveDrives />} />
                <Route path="/home/CompanyDisc/:driveId" element={<CompanyDisc />} />
                <Route path="/home/Myapplication" element={<MyApplication />} />
            </Route>

            <Route element={<ProtectedRoute allowedRoles={['company']} />}>
                <Route path='/home/CompanyDashboard' element={<CompanyDashboard />} />
                <Route path="/home/FinalSelect" element={<FinalSelects />} />
                <Route path='/home/studentDatabase' element={<StudentResumeDatabase />} />
                <Route path='/home/postDrive' element={<PostDrive />} />
            </Route>

            <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                <Route path='/home/adminDashboard' element={<AdminDashboard />} />
                <Route path="/home/PlacedStudents" element={<PlacedStudentsList />} />
                <Route path="/home/students-database" element={<SelectedStudent />} />
                <Route path="/home/applied-students-database" element={<AppliedStudents />} />
            </Route>
        </Routes>
      </div>
    </Router>
  );
};

export default App;
