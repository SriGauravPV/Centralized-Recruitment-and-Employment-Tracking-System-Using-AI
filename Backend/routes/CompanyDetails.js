const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Company = require("../models/Company");
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

// Get company profile
router.get("/company/profile", authenticateToken, async (req, res) => {
    console.log("Inside /company/profile route");
    console.log("User ID from token:", req.user.id);
    try {
        const company = await Company.findById(req.user.id);
        if (!company) {
            console.log("Company not found");
            return res.status(404).json({ error: "Company not found" });
        }
        console.log("Company found:", company);
        res.json(company);
    } catch (error) {
        console.error("Error fetching company:", error);
        res.status(500).json({ error: "Server error" });
    }
});

// Change password route
router.post("/company/change-password", authenticateToken, async (req, res) => {
    console.log("Inside /company/change-password route");
    
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
        // Find company
        const company = await Company.findById(req.user.id);
        if (!company) {
            return res.status(404).json({ error: "Company not found" });
        }
        
        // Verify current password
        const isMatch = await bcrypt.compare(currentPassword, company.password);
        if (!isMatch) {
            return res.status(401).json({ error: "Current password is incorrect" });
        }
        
        // Hash new password
        const salt = await bcrypt.genSalt(10);
        company.password = await bcrypt.hash(newPassword, salt);
        
        // Save updated password
        await company.save();
        
        res.json({ message: "Password changed successfully" });
        
    } catch (error) {
        console.error("Error changing password:", error);
        res.status(500).json({ error: "Server error" });
    }
});

// Update company profile
router.put("/company/profile", authenticateToken, async (req, res) => {
    try {
        const {
            companyName,
            website,
            companyDescription,
            phoneNumber,
            country,
            profilePictureUrl
        } = req.body;

        // Find company
        const company = await Company.findById(req.user.id);
        if (!company) {
            return res.status(404).json({ error: "Company not found" });
        }

        // Update fields (only if provided)
        if (companyName) company.companyName = companyName;
        if (website) company.website = website;
        if (companyDescription) company.companyDescription = companyDescription;
        if (phoneNumber) company.phoneNumber = phoneNumber;
        if (country) company.country = country;
        if (profilePictureUrl) company.profilePictureUrl = profilePictureUrl;

        // Save updated company
        await company.save();

        res.json({ 
            message: "Profile updated successfully",
            company 
        });
    } catch (error) {
        console.error("Error updating profile:", error);
        res.status(500).json({ error: "Server error" });
    }
});

// Deactivate account route (we'll add isActive field for this functionality)
router.post("/company/deactivate", authenticateToken, async (req, res) => {
    console.log("Inside /company/deactivate route");
    
    const { password } = req.body;
    
    // Validate input
    if (!password) {
        return res.status(400).json({ error: "Password is required to deactivate account" });
    }
    
    try {
        // Find company
        const company = await Company.findById(req.user.id);
        if (!company) {
            return res.status(404).json({ error: "Company not found" });
        }
        
        // Verify password
        const isMatch = await bcrypt.compare(password, company.password);
        if (!isMatch) {
            return res.status(401).json({ error: "Password is incorrect" });
        }
        
        // Set account status to inactive (we'll add this field if not in schema)
        // Note: You'll need to add this field to your schema
        company.isActive = false;
        company.deactivatedAt = new Date();
        
        // Save updated company
        await company.save();
        
        res.json({ message: "Account deactivated successfully" });
        
    } catch (error) {
        console.error("Error deactivating account:", error);
        res.status(500).json({ error: "Server error" });
    }
});

// Reactivate account route
router.post("/company/reactivate", async (req, res) => {
    console.log("Inside /company/reactivate route");
    
    const { email, password } = req.body;
    
    // Validate input
    if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
    }
    
    try {
        // Find company by email
        const company = await Company.findOne({ email });
        if (!company) {
            return res.status(404).json({ error: "Company not found" });
        }
        
        // Verify password
        const isMatch = await bcrypt.compare(password, company.password);
        if (!isMatch) {
            return res.status(401).json({ error: "Password is incorrect" });
        }
        
        // Check if account is actually deactivated
        if (company.isActive) {
            return res.status(400).json({ error: "Account is already active" });
        }
        
        // Reactivate account
        company.isActive = true;
        company.deactivatedAt = null;
        
        // Save updated company
        await company.save();
        
        // Generate new token
        const token = jwt.sign(
            { id: company._id, email: company.email },
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
        const company = await Company.findById(req.user.id);
        if (!company) {
            return res.status(404).json({ error: "Company not found" });
        }
        
        if (!company.isActive) {
            return res.status(403).json({ error: "Account is deactivated" });
        }
        
        next();
    } catch (error) {
        return res.status(500).json({ error: "Server error" });
    }
};

// Upload profile picture route (assuming you have an upload middleware)
// Example:
// router.post(
//   "/company/upload-profile-picture",
//   authenticateToken,
//   upload.single("profilePicture"),
//   async (req, res) => {
//     try {
//       if (!req.file) {
//         return res.status(400).json({ error: "No file uploaded" });
//       }
// 
//       const company = await Company.findById(req.user.id);
//       if (!company) {
//         return res.status(404).json({ error: "Company not found" });
//       }
// 
//       company.profilePictureUrl = req.file.path;
//       await company.save();
// 
//       res.json({
//         message: "Profile picture uploaded successfully",
//         profilePictureUrl: company.profilePictureUrl,
//       });
//     } catch (error) {
//       console.error("Error uploading profile picture:", error);
//       res.status(500).json({ error: "Server error" });
//     }
//   }
// );

// Email update route
router.post("/company/update-email", authenticateToken, async (req, res) => {
    console.log("Inside /company/update-email route");
    
    const { newEmail, password } = req.body;
    
    // Validate input
    if (!newEmail || !password) {
        return res.status(400).json({ error: "New email and password are required" });
    }
    
    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newEmail)) {
        return res.status(400).json({ error: "Invalid email format" });
    }
    
    try {
        // Find company
        const company = await Company.findById(req.user.id);
        if (!company) {
            return res.status(404).json({ error: "Company not found" });
        }
        
        // Check if email already exists
        const emailExists = await Company.findOne({ email: newEmail });
        if (emailExists) {
            return res.status(400).json({ error: "Email is already in use" });
        }
        
        // Verify password
        const isMatch = await bcrypt.compare(password, company.password);
        if (!isMatch) {
            return res.status(401).json({ error: "Password is incorrect" });
        }
        
        // Update email
        company.email = newEmail;
        await company.save();
        
        // Generate new token with updated email
        const token = jwt.sign(
            { id: company._id, email: company.email },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );
        
        res.json({
            message: "Email updated successfully",
            token
        });
        
    } catch (error) {
        console.error("Error updating email:", error);
        res.status(500).json({ error: "Server error" });
    }
});

// Company registration route
router.post("/company/register", async (req, res) => {
    console.log("Inside /company/register route");
    
    const { companyName, website, email, password, confirmPassword } = req.body;
    
    // Validate required fields
    if (!companyName || !website || !email || !password || !confirmPassword) {
        return res.status(400).json({ error: "All required fields must be provided" });
    }
    
    // Validate password match
    if (password !== confirmPassword) {
        return res.status(400).json({ error: "Passwords do not match" });
    }
    
    // Validate password length
    if (password.length < 8) {
        return res.status(400).json({ error: "Password must be at least 8 characters long" });
    }
    
    try {
        // Check if email already exists
        const existingCompany = await Company.findOne({ email });
        if (existingCompany) {
            return res.status(400).json({ error: "Email is already registered" });
        }
        
        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        // Create new company
        const newCompany = new Company({
            companyName,
            website,
            email,
            password: hashedPassword,
            isActive: true // Default to active
        });
        
        // Save company
        await newCompany.save();
        
        // Generate JWT token
        const token = jwt.sign(
            { id: newCompany._id, email: newCompany.email },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );
        
        res.status(201).json({
            message: "Company registered successfully",
            token
        });
        
    } catch (error) {
        console.error("Error registering company:", error);
        res.status(500).json({ error: "Server error" });
    }
});

// Company login route
router.post("/company/login", async (req, res) => {
    console.log("Inside /company/login route");
    
    const { email, password } = req.body;
    
    // Validate input
    if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
    }
    
    try {
        // Find company by email
        const company = await Company.findOne({ email });
        if (!company) {
            return res.status(404).json({ error: "Invalid email or password" });
        }
        
        // Check if account is active
        if (company.isActive === false) {
            return res.status(403).json({ 
                error: "This account has been deactivated",
                deactivated: true
            });
        }
        
        // Verify password
        const isMatch = await bcrypt.compare(password, company.password);
        if (!isMatch) {
            return res.status(401).json({ error: "Invalid email or password" });
        }
        
        // Generate JWT token
        const token = jwt.sign(
            { id: company._id, email: company.email },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );
        
        res.json({
            message: "Login successful",
            token,
            company: {
                id: company._id,
                companyName: company.companyName,
                email: company.email,
                profilePictureUrl: company.profilePictureUrl
            }
        });
        
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ error: "Server error" });
    }
});

// Delete company account route
router.delete("/company/delete-account", authenticateToken, async (req, res) => {
    console.log("Inside /company/delete-account route");
    
    const { password } = req.body;
    
    // Validate input
    if (!password) {
        return res.status(400).json({ error: "Password is required to delete account" });
    }
    
    try {
        // Find company
        const company = await Company.findById(req.user.id);
        if (!company) {
            return res.status(404).json({ error: "Company not found" });
        }
        
        // Verify password
        const isMatch = await bcrypt.compare(password, company.password);
        if (!isMatch) {
            return res.status(401).json({ error: "Password is incorrect" });
        }
        
        // Delete company
        await Company.findByIdAndDelete(req.user.id);
        
        res.json({ message: "Account deleted successfully" });
        
    } catch (error) {
        console.error("Error deleting account:", error);
        res.status(500).json({ error: "Server error" });
    }
});

router.get("/getAllCompanies", async (req, res) => {
    try {
        const companies = await Company.find();
        res.status(200).json(companies);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});



module.exports = router;