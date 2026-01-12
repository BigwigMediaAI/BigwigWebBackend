const mongoose = require("mongoose");

const jobApplicationSchema = new mongoose.Schema({
  fullName: String,
  email: String,
  mobileNumber: String,
  experience: String,
  cctc: String,
  ectc: String,
  noticePeriod: String,
  coverLetter: String,
  resumeUrl: String, // This will hold the Cloudinary URL
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("JobApplication", jobApplicationSchema);
