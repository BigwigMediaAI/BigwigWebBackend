const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    jd: {
      type: String,
      required: true,
    },
    responsibilities: {
      type: [String],
      required: true,
    },
    requirements: {
      type: [String],
      required: true,
    },
    jobType: {
      type: String,
      enum: ["Full-time", "Part-time", "Contract", "Internship", "Freelance"],
      default: "Full-time",
    },
    workMode: {
      type: String,
      enum: ["Office", "Hybrid", "Remote"],
      default: "Office",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Job", jobSchema);
