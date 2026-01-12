const { BetaAnalyticsDataClient } = require("@google-analytics/data");
const path = require("path");
require("dotenv").config();

// Auth using service account JSON key
const analyticsDataClient = new BetaAnalyticsDataClient({
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
});

// Replace with your actual GA4 property ID
const PROPERTY_ID = "499321668";

async function getReport() {
  const [response] = await analyticsDataClient.runReport({
    property: `properties/${PROPERTY_ID}`,
    dateRanges: [
      {
        startDate: "7daysAgo",
        endDate: "today",
      },
    ],
    dimensions: [{ name: "city" }],
    metrics: [{ name: "activeUsers" }],
  });

  return response;
}

module.exports = { getReport };
