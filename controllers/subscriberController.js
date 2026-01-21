const Subscriber = require("../modals/subscriber.modal.js");
const sendEmail = require("../utils/sendEmail.js");

/**
 * Subscribe email
 */
const subscribeEmail = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    let subscriber = await Subscriber.findOne({ email });

    // Already subscribed
    if (subscriber && subscriber.isActive) {
      return res.status(409).json({ message: "Email already subscribed" });
    }

    // Reactivate if previously unsubscribed
    if (subscriber && !subscriber.isActive) {
      subscriber.isActive = true;
      await subscriber.save();
    }

    // New subscriber
    if (!subscriber) {
      subscriber = await Subscriber.create({ email });
    }

    const unsubscribeLink = `${process.env.FRONTEND_URL}/unsubscribe/${subscriber.unsubscribeToken}`;

    // Send email
    await sendEmail({
      to: subscriber.email,
      subject: "Welcome to Bigwig Media Digital",
      html: `
        <h2>Thanks for subscribing!</h2>
        <p>You are now subscribed to Bigwig Media Digital.</p>
        <p>If you want to unsubscribe, click below:</p>
        <a href="${unsubscribeLink}">Unsubscribe</a>
      `,
    });

    res.status(201).json({
      message: "Successfully subscribed",
    });
  } catch (error) {
    console.error("Subscribe Error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

/**
 * Unsubscribe email
 */
const unsubscribeEmail = async (req, res) => {
  try {
    const { token } = req.params;

    const subscriber = await Subscriber.findOneAndUpdate(
      { unsubscribeToken: token },
      { isActive: false },
      { new: true },
    );

    if (!subscriber) {
      return res.status(404).json({ error: "Invalid unsubscribe link" });
    }

    res.status(200).json({
      message: "You have been unsubscribed successfully",
    });
  } catch (error) {
    console.error("Unsubscribe Error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

/**
 * Get all subscribers (Admin use)
 */
const getAllSubscribers = async (req, res) => {
  try {
    const subscribers = await Subscriber.find()
      .sort({ createdAt: -1 })
      .select("-__v");

    res.status(200).json({
      count: subscribers.length,
      data: subscribers,
    });
  } catch (error) {
    console.error("Get Subscribers Error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = {
  subscribeEmail,
  unsubscribeEmail,
  getAllSubscribers,
};
