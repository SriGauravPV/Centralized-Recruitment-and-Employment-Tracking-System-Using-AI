const Student = require('../models/Student');
const Company = require('../models/Company');
const companyDrive = require('../models/CompanyDrive');
const express = require('express');
const router = express.Router();    

router.get('/dashboard-stats', async (req, res) => {
    try {
        const studentCount = await Student.countDocuments();
        const companyCount = await Company.countDocuments();
        const placedStudentCount = await companyDrive.countDocuments({ selectedStudents: { $ne: [] } });
        const otherCount = await companyDrive.countDocuments({ selectedStudents: [] });
    
        res.json({ studentCount, companyCount, placedStudentCount, otherCount });
    } catch (err) {
        console.error("Error fetching dashboard stats:", err);
        res.status(500).json({ message: "Failed to fetch dashboard statistics" });
    }
    });

module.exports = router;