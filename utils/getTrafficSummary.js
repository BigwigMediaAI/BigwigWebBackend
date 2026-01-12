const { BetaAnalyticsDataClient } = require("@google-analytics/data");
require("dotenv").config();
const path = require("path");

// Initialize the GA4 client using environment variable
const analyticsDataClient = new BetaAnalyticsDataClient({
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
});

// GA4 Property ID
const PROPERTY_ID = "499321668";

async function SeoSummary() {
  const [response] = await analyticsDataClient.runReport({
    property: `properties/${PROPERTY_ID}`,
    dateRanges: [{ startDate: "7daysAgo", endDate: "today" }],
    dimensions: [{ name: "sessionDefaultChannelGroup" }],
    metrics: [
      { name: "totalUsers" },
      { name: "sessions" },
      { name: "activeUsers" },
    ],
  });

  return response;
}

module.exports = { SeoSummary };
