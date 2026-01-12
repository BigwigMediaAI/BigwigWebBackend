const Job = require("../modals/job.model");

// ✅ Add a new job
exports.createJob = async (req, res) => {
  try {
    const {
      title,
      location,
      jd,
      responsibilities,
      requirements,
      jobType,
      workMode,
    } = req.body;

    const job = new Job({
      title,
      location,
      jd,
      responsibilities,
      requirements,
      jobType,
      workMode,
    });

    await job.save();
    res.status(201).json({ message: "Job created", job });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Get all jobs
exports.getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });
    res.status(200).json(jobs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Get job by ID
exports.getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });

    res.status(200).json(job);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Update a job
exports.updateJob = async (req, res) => {
  try {
    const updatedData = req.body;
    const job = await Job.findByIdAndUpdate(req.params.id, updatedData, {
      new: true,
    });

    if (!job) return res.status(404).json({ message: "Job not found" });

    res.status(200).json({ message: "Job updated", job });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Delete a job
exports.deleteJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });

    res.status(200).json({ message: "Job deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
