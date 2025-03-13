const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Student = require("../models/Student");
const router = express.Router();

// Authentication middleware
const authenticateToken = (req, res, next) => {
    console.log("Inside authenticateToken middleware");
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
        return res.status(401).json({ error: "Access denied. No token provided." });
    }
    console.log("Token:", token);
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded token:", decoded);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(400).json({ error: "Invalid token or session expired" });
    }
};

// Get student profile
router.get("/student/profile", authenticateToken, async (req, res) => {
    console.log("Inside /student/profile route");
    console.log("User ID from token:", req.user.id);
    try {
        const student = await Student.findById(req.user.id);
        if (!student) {
            console.log("Student not found");
            return res.status(404).json({ error: "Student not found" });
        }
        console.log("Student found:", student);
        res.json(student);
    } catch (error) {
        console.error("Error fetching student:", error);
        res.status(500).json({ error: "Server error" });
    }
});
router.get("/students/profile", async (req, res) => {
    console.log("Inside /student/profile route");
    try {
        const student = await Student.find();
        if (!student) {
            console.log("Student not found");
            return res.status(404).json({ error: "Student not found" });
        }
        console.log("Student found:", student);
        res.json(student);
        
    } catch (error) {
        console.error("Error fetching student:", error);
        res.status(500).json({ error: "Server error" });
    }
});

// Change password route
router.post("/student/change-password", authenticateToken, async (req, res) => {
    console.log("Inside /student/change-password route");
    
    const { currentPassword, newPassword, confirmPassword } = req.body;
    
    // Validate input
    if (!currentPassword || !newPassword || !confirmPassword) {
        return res.status(400).json({ error: "All fields are required" });
    }
    
    if (newPassword !== confirmPassword) {
        return res.status(400).json({ error: "New password and confirm password do not match" });
    }
    
    if (newPassword.length < 8) {
        return res.status(400).json({ error: "Password must be at least 8 characters long" });
    }
    
    try {
        // Find student
        const student = await Student.findById(req.user.id);
        if (!student) {
            return res.status(404).json({ error: "Student not found" });
        }
        
        // Verify current password
        const isMatch = await bcrypt.compare(currentPassword, student.password);
        if (!isMatch) {
            return res.status(401).json({ error: "Current password is incorrect" });
        }
        
        // Hash new password
        const salt = await bcrypt.genSalt(10);
        student.password = await bcrypt.hash(newPassword, salt);
        
        // Save updated password
        await student.save();
        
        res.json({ message: "Password changed successfully" });
        
    } catch (error) {
        console.error("Error changing password:", error);
        res.status(500).json({ error: "Server error" });
    }
});

// Deactivate account route
router.post("/student/deactivate", authenticateToken, async (req, res) => {
    console.log("Inside /student/deactivate route");
    
    const { password } = req.body;
    
    // Validate input
    if (!password) {
        return res.status(400).json({ error: "Password is required to deactivate account" });
    }
    
    try {
        // Find student
        const student = await Student.findById(req.user.id);
        if (!student) {
            return res.status(404).json({ error: "Student not found" });
        }
        
        // Verify password
        const isMatch = await bcrypt.compare(password, student.password);
        if (!isMatch) {
            return res.status(401).json({ error: "Password is incorrect" });
        }
        
        // Set account status to inactive
        student.isActive = false;
        student.deactivatedAt = new Date();
        
        // Save updated student
        await student.save();
        
        // Invalidate JWT token (optional, depends on your implementation)
        // You could add the token to a blacklist or simply rely on the isActive check
        
        res.json({ message: "Account deactivated successfully" });
        
    } catch (error) {
        console.error("Error deactivating account:", error);
        res.status(500).json({ error: "Server error" });
    }
});

// Reactivate account route (optional - if you want to allow reactivation)
router.post("/student/reactivate", async (req, res) => {
    console.log("Inside /student/reactivate route");
    
    const { email, password } = req.body;
    
    // Validate input
    if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
    }
    
    try {
        // Find student by email
        const student = await Student.findOne({ email });
        if (!student) {
            return res.status(404).json({ error: "Student not found" });
        }
        
        // Verify password
        const isMatch = await bcrypt.compare(password, student.password);
        if (!isMatch) {
            return res.status(401).json({ error: "Password is incorrect" });
        }
        
        // Check if account is actually deactivated
        if (student.isActive) {
            return res.status(400).json({ error: "Account is already active" });
        }
        
        // Reactivate account
        student.isActive = true;
        student.deactivatedAt = null;
        
        // Save updated student
        await student.save();
        
        // Generate new token
        const token = jwt.sign(
            { id: student._id, email: student.email },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );
        
        res.json({
            message: "Account reactivated successfully",
            token
        });
        
    } catch (error) {
        console.error("Error reactivating account:", error);
        res.status(500).json({ error: "Server error" });
    }
});

// Middleware to check if account is active
const checkAccountActive = async (req, res, next) => {
    try {
        const student = await Student.findById(req.user.id);
        if (!student) {
            return res.status(404).json({ error: "Student not found" });
        }
        
        if (!student.isActive) {
            return res.status(403).json({ error: "Account is deactivated" });
        }
        
        next();
    } catch (error) {
        return res.status(500).json({ error: "Server error" });
    }
};

// Update student profile
router.put("/student/profile", authenticateToken, async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      contactNumber,
      highestQualification,
      stream,
      address,
      city,
      state,
      skills,
      aboutMe,
      tenthmarks,
      twelthmarks,
      ugmarks,
      pgmarks,
    } = req.body;

    // Find student
    const student = await Student.findById(req.user.id);
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    // Update fields
    student.firstName = firstName || student.firstName;
    student.lastName = lastName || student.lastName;
    student.phone = contactNumber || student.phone;
    student.qualification = highestQualification || student.qualification;
    student.stream = stream || student.stream;
    student.address = address || student.address;
    student.city = city || student.city;
    student.state = state || student.state;
    student.skills = skills || student.skills;
    student.aboutMe = aboutMe || student.aboutMe;
    student.tenthmarks = tenthmarks || student.tenthmarks;
    student.twelthmarks = twelthmarks || student.twelthmarks;
    student.ugmarks = ugmarks || student.ugmarks;
    student.pgmarks = pgmarks || student.pgmarks;
    student.updatedAt = Date.now();

    // Save updated student
    await student.save();

    res.json({ 
      message: "Profile updated successfully",
      student 
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Upload resume
// router.post(
//   "/student/upload-resume",
//   authenticateToken,
//   upload.single("resume"),
//   async (req, res) => {
//     try {
//       if (!req.file) {
//         return res.status(400).json({ error: "No file uploaded" });
//       }

//       const student = await Student.findById(req.user.id);
//       if (!student) {
//         return res.status(404).json({ error: "Student not found" });
//       }

//       student.resumeUrl = req.file.path;
//       student.updatedAt = Date.now();
//       await student.save();

//       res.json({
//         message: "Resume uploaded successfully",
//         resumeUrl: student.resumeUrl,
//       });
//     } catch (error) {
//       console.error("Error uploading resume:", error);
//       res.status(500).json({ error: "Server error" });
//     }
//   }
// );


// Add the checkAccountActive middleware to routes that should only be accessible to active accounts
router.get("/student/something-restricted", authenticateToken, checkAccountActive, (req, res) => {
    // This route is only accessible to active accounts
    res.json({ message: "This is only visible to active accounts" });
});

router.get('/get-all-students', async (req, res) => {
    try {
        const students = await Student.find();
        res.json(students);
    } catch (error) {
        console.error("Error fetching students:", error);
        res.status(500).json({ error: "Server error" });
    }
});

// // Get students by IDs (GET method)
router.get("/students/by-ids", async (req, res) => {
    console.log("Inside /students/by-ids route");
    console.log("Query params:", req.query.studentIds);

    try {
        let studentIds = req.query.studentIds;
        
        if (!studentIds) {
            return res.status(400).json({ error: "Student IDs are required as query parameter (studentIds=id1,id2,...)" });
        }
        
        // Check if studentIds is an array (axios may send it as an array)
        if (!Array.isArray(studentIds)) {
            studentIds = studentIds.split(",").map(id => id.trim()); // Convert comma-separated string to array
        }

        if (studentIds.length === 0) {
            return res.status(400).json({ error: "At least one valid student ID is required" });
        }

        // Find students with matching IDs
        const students = await Student.find({ _id: { $in: studentIds } });

        if (students.length === 0) {
            console.log("No students found with provided IDs");
            return res.status(404).json({ error: "No students found with provided IDs" });
        }

        console.log(`Found ${students.length} students`);
        res.json(students);
        
    } catch (error) {
        console.error("Error fetching students by IDs:", error);
        res.status(500).json({ error: "Server error" });
    }
});


module.exports = router;