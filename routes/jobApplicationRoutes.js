const express = require("express");
const router = express.Router();
const upload = require("../config/resumeStorage");

const {
  submitApplication,
  getAllApplications,
} = require("../controllers/jobApplicationController");

router.post("/submit-job", upload.single("resume"), submitApplication);
router.get("/all", getAllApplications);

module.exports = router;
