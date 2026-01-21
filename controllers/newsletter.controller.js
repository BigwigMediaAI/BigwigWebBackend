const Newsletter = require("../modals/newsletter.modal.js");
const Subscriber = require("../modals/subscriber.modal.js");
const sendEmail = require("../utils/sendEmail.js");

/**
 * Create & Send Newsletter
 * sendType: ALL | MANUAL
 */
const sendNewsletter = async (req, res) => {
  try {
    const { title, subject, content, sendType, manualEmails } = req.body;

    // Basic validation
    if (!title || !subject || !content || !sendType) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    let recipients = [];

    // 🔹 Send to ALL active subscribers
    if (sendType === "ALL") {
      const subscribers = await Subscriber.find({ isActive: true }).select(
        "email",
      );

      recipients = subscribers.map((s) => s.email);
    }

    // 🔹 Send to MANUAL emails
    if (sendType === "MANUAL") {
      if (
        !manualEmails ||
        !Array.isArray(manualEmails) ||
        manualEmails.length === 0
      ) {
        return res
          .status(400)
          .json({ error: "Please provide manual email addresses" });
      }

      recipients = manualEmails;
    }

    // Remove duplicate emails
    recipients = [...new Set(recipients.map((e) => e.toLowerCase()))];

    // Send emails one by one (safe for Brevo)
    let sentCount = 0;

    for (const email of recipients) {
      await sendEmail({
        to: email,
        subject,
        html: content,
      });
      sentCount++;
    }

    // Save newsletter history
    const newsletter = await Newsletter.create({
      title,
      subject,
      content,
      sendType,
      manualEmails: sendType === "MANUAL" ? manualEmails : [],
      recipients,
      sentCount,
    });

    res.status(201).json({
      message: "Newsletter sent successfully",
      sentCount,
      newsletterId: newsletter._id,
    });
  } catch (error) {
    console.error("Newsletter Error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

/**
 * Get all newsletters (Admin)
 */
const getAllNewsletters = async (req, res) => {
  try {
    const newsletters = await Newsletter.find()
      .sort({ createdAt: -1 })
      .select("-__v"); // optional cleanup

    res.status(200).json({
      count: newsletters.length,
      data: newsletters,
    });
  } catch (error) {
    console.error("Get Newsletters Error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

/**
 * Delete newsletter (Admin)
 */
const deleteNewsletter = async (req, res) => {
  try {
    const { id } = req.params;

    const newsletter = await Newsletter.findByIdAndDelete(id);

    if (!newsletter) {
      return res.status(404).json({ error: "Newsletter not found" });
    }

    res.status(200).json({
      message: "Newsletter deleted successfully",
    });
  } catch (error) {
    console.error("Delete Newsletter Error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = {
  sendNewsletter,
  getAllNewsletters,
  deleteNewsletter,
};
