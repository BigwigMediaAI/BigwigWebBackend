const mongoose = require("mongoose");

const newsletterSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    subject: {
      type: String,
      required: true,
      trim: true,
    },

    content: {
      type: String, // HTML content
      required: true,
    },

    // How the newsletter was sent
    sendType: {
      type: String,
      enum: ["ALL", "MANUAL"],
      required: true,
    },

    // Emails typed by admin (only for MANUAL)
    manualEmails: [
      {
        type: String,
        lowercase: true,
        trim: true,
      },
    ],

    // Final list of recipients (resolved & sent)
    recipients: [
      {
        type: String,
        lowercase: true,
        trim: true,
      },
    ],

    sentCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Newsletter", newsletterSchema);
