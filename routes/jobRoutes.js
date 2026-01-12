const express = require("express");
const router = express.Router();
const {
  createJob,
  getAllJobs,
  getJobById,
  updateJob,
  deleteJob,
} = require("../controllers/jobController");

// ✅ POST - Add new job
router.post("/jobs", createJob);

// ✅ GET - All jobs
router.get("/jobs", getAllJobs);

// ✅ GET - Job by ID
router.get("/jobs/:id", getJobById);

// ✅ PUT - Update job by ID
router.put("/jobs/:id", updateJob);

// ✅ DELETE - Delete job by ID
router.delete("/jobs/:id", deleteJob);

module.exports = router;
