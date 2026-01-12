// controller/analyticsController.js
const { getReport } = require("../utils/googleAnalytics");
const { SeoSummary } = require("../utils/getTrafficSummary");

const getAnalyticsData = async (req, res) => {
  try {
    const data = await getReport();
    res.json(data);
  } catch (error) {
    console.error("Google Analytics API Error:", error.message);
    res.status(500).json({ error: "Failed to fetch analytics data" });
  }
};
const SummaryData = async (req, res) => {
  try {
    const data = await SeoSummary();
    res.json(data);
  } catch (error) {
    console.error("Google Analytics API Error:", error.message);
    res.status(500).json({ error: "Failed to fetch analytics data" });
  }
};

module.exports = { getAnalyticsData, SummaryData };
