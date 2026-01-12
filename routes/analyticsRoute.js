// route/analyticsRoute.js
const express = require("express");
const router = express.Router();
const {
  getAnalyticsData,
  SummaryData,
} = require("../controllers/analyticsController");

router.get("/analytics-data", getAnalyticsData);
router.get("/Summary-data", SummaryData);

module.exports = router;
