const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const CompanyDrive = require("../models/CompanyDrive");
const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const drives = await CompanyDrive.find();
        res.status(200).json(drives);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});

router.post("/", async (req, res) => {
    console.log(req.body);
    try {
        const drive = new CompanyDrive(req.body.formData);
        await drive.save();
        res.status(201).json(drive);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});

router.get("/companyuser/:driveId", async (req, res) => {
    try {
        const driveId = req.params.driveId;
        console.log("driveId", driveId);
        
        // First try to find by driveId
        let drive = await CompanyDrive.findOne({ driveId: driveId });
        
        // If not found, try to find by _id
        if (!drive) {
            drive = await CompanyDrive.findById(driveId);
        }
        
        if (!drive) {
            return res.status(404).json({ error: "Drive not found" });
        }
        
        res.status(200).json(drive);
    } catch (error) {
        console.error("Error fetching drive details:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// In your API routes file (e.g., routes/drives.js)
router.post('/drive/:driveId/apply', async (req, res) => {
    try {
      const { driveId } = req.params;
      const { studentId } = req.body;
      console.log("driveId", driveId);
      console.log("studentId", studentId);
      
      // First try to find the document to see what's in the database
      const drive = await CompanyDrive.findOne({ driveId: driveId });
      
      if (!drive) {
        console.log("Drive not found with driveId. Trying with _id...");
        // Try using the driveId as MongoDB _id (if that's how it's stored)
        const driveById = await CompanyDrive.findById(driveId);
        
        if (!driveById) {
          // Log all drive IDs to debug
          const allDrives = await CompanyDrive.find({}, 'driveId _id');
          console.log("Available drives:", allDrives);
          return res.status(404).json({ message: 'Drive not found. Please check the drive ID.' });
        }
        
        // If found by _id, update it
        driveById.studentsId = [...new Set([...driveById.studentsId, studentId])];
        await driveById.save();
        
        return res.status(200).json({
          message: 'Successfully applied for the position',
          drive: driveById
        });
      }
      
      // Regular update if found by driveId
      drive.studentsId = [...new Set([...drive.studentsId, studentId])];
      await drive.save();
      
      res.status(200).json({
        message: 'Successfully applied for the position',
        drive: drive
      });
      
    } catch (error) {
      console.error('Error in drive application:', error);
      res.status(500).json({ message: 'Server error: ' + error.message });
    }
});

// Add this route to your drives.js router file
router.post('/drive/:driveId/select-students', async (req, res) => {
  try {
    const { driveId } = req.params;
    const { selectedStudents } = req.body;
    console.log('Selected students:', selectedStudents);
    
    
    if (!Array.isArray(selectedStudents)) {
      return res.status(400).json({ message: 'selectedStudents must be an array' });
    }
    
    // First try to find by driveId
    let drive = await CompanyDrive.findOne({ driveId: driveId });
    
    // If not found, try to find by _id
    if (!drive) {
      drive = await CompanyDrive.findById(driveId);
      
      if (!drive) {
        return res.status(404).json({ message: 'Drive not found' });
      }
    }
    
    // Update the selectedStudents array
    drive.selectedStudents = selectedStudents;
    await drive.save();
    
    res.status(200).json({
      message: 'Students selection successfully updated',
      drive: drive
    });
    
  } catch (error) {
    console.error('Error updating selected students:', error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
});

router.get("/name/:driveId", async (req, res) => {
  try {
      const driveId = req.params.driveId;
      console.log("driveId", driveId);
      
      // First try to find by driveId
      let drive = await CompanyDrive.findOne({ companyName: driveId });
      
      // If not found, try to find by _id
      if (!drive) {
          drive = await CompanyDrive.findById(driveId);
      }
      
      if (!drive) {
          return res.status(404).json({ error: "Drive not found" });
      }
      
      res.status(200).json(drive);
  } catch (error) {
      console.error("Error fetching drive details:", error);
      res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/company/:name", async (req, res) => {
  try {
    const companyName = req.params.name;
    console.log("Searching for company:", companyName);
    
    // First try to find by companyName
    let drive = await CompanyDrive.findOne({ companyName: companyName });
    
    // Only try to find by _id if it looks like a valid ObjectId
    if (!drive && /^[0-9a-fA-F]{24}$/.test(companyName)) {
      drive = await CompanyDrive.findById(companyName);
    }
    
    if (!drive) {
      return res.status(404).json({ error: "Drive not found" });
    }
    console.log("Found drive:", drive);
    res.status(200).json(drive);
  } catch (error) {
    console.error("Error fetching drive details:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post('/company/:companyName/select-students', async (req, res) => {
  try {
    const { companyName } = req.params;
    const { selectedStudents } = req.body;
    
    console.log('Company Name:', companyName);
    console.log('Selected students to append:', selectedStudents);
    
    if (!Array.isArray(selectedStudents)) {
      return res.status(400).json({ message: 'selectedStudents must be an array' });
    }
    
    // Find drive by company name
    let drive = await CompanyDrive.findOne({ companyName: companyName });
    
    if (!drive) {
      // If not found by company name and it looks like an ObjectId, try that
      if (/^[0-9a-fA-F]{24}$/.test(companyName)) {
        drive = await CompanyDrive.findById(companyName);
      }
      
      if (!drive) {
        return res.status(404).json({ message: 'Drive not found' });
      }
    }
    
    // Initialize selectedStudents array if it doesn't exist
    if (!drive.selectedStudents) {
      drive.selectedStudents = [];
    }
    
    // Append new selected students, ensuring no duplicates
    drive.selectedStudents = [...new Set([...drive.selectedStudents, ...selectedStudents])];
    
    await drive.save();
    
    res.status(200).json({
      message: 'Students selection successfully updated',
      drive: drive
    });
    
  } catch (error) {
    console.error('Error updating selected students:', error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
});

router.get('/selected-students', async (req, res) => {
  try {
    const drives = await CompanyDrive.find({});
    res.status(200).json(drives);
  } catch (error) {
    console.error('Error fetching selected students:', error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
});

module.exports = router;