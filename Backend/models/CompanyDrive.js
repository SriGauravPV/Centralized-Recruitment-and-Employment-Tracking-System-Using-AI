const mongoose = require("mongoose");

const companyDriveSchema = new mongoose.Schema({
  driveId: String,
  companyName: String,
  companyLogo: String,
  companyWebsite: String,
  companyProfile: String,
  position: String,
  package: String,
  jobDescription: String,
  openPositions: String,
  eligibleBranches: [String],
  minCgpa: String,
  backlog: String,
  batch: String,
  process: [String],
  title: String,
  driveDate: String,
  studentsId: [String],
  selectedStudents: [String]
});

module.exports = mongoose.model("CompanyDriveInfo", companyDriveSchema);