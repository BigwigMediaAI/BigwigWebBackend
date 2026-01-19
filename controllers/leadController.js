const Lead = require("../modals/Leads.model");
const sendEmail = require("../utils/sendEmail");
const moment = require("moment");

const otpMap = new Map(); // In-memory OTP store

// Send OTP
exports.sendOTP = async (req, res) => {
  const { name, email, phone, message, services } = req.body;

  try {
    // Check if email already exists
    const existingLead = await Lead.findOne({ email });
    if (existingLead) {
      return res.status(400).json({
        message: "Email already exists. Please use another email ID.",
      });
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000);

    // Store data + services
    otpMap.set(email, {
      otp,
      data: { name, email, phone, message, services },
      time: Date.now(),
    });

    // Send OTP email
    await sendEmail({
      to: email,
      subject: "Your One-Time Password (OTP) – Bigwig Media",
      html: `
    <div style="font-family: Arial, Helvetica, sans-serif; background-color: #f5f7fb; padding: 30px;">
      <div style="max-width: 520px; margin: auto; background: #ffffff; border-radius: 10px; padding: 30px; box-shadow: 0 10px 30px rgba(0,0,0,0.08);">

        <h2 style="color: #111827; margin-bottom: 10px;">Hello ${name},</h2>

        <p style="color: #374151; font-size: 15px; line-height: 1.6;">
          We received a request to verify your email address.  
          Please use the One-Time Password (OTP) below to continue.
        </p>

        <div style="margin: 25px 0; text-align: center;">
          <span style="
            display: inline-block;
            background: #111827;
            color: #ffffff;
            font-size: 28px;
            letter-spacing: 6px;
            padding: 14px 26px;
            border-radius: 8px;
            font-weight: bold;
          ">
            ${otp}
          </span>
        </div>

        <p style="color: #374151; font-size: 14px;">
          This OTP is valid for <strong>10 minutes</strong>.  
          Please do not share it with anyone for security reasons.
        </p>

        <p style="color: #6b7280; font-size: 13px; margin-top: 20px;">
          If you did not request this OTP, you can safely ignore this email.
        </p>

        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 25px 0;" />

        <p style="font-size: 13px; color: #9ca3af; text-align: center;">
          © ${new Date().getFullYear()} Bigwig Media. All rights reserved.
        </p>

      </div>
    </div>
  `,
    });

    res.status(200).json({ message: "OTP sent to email." });
  } catch (err) {
    console.error("Error sending OTP:", err);
    res.status(500).json({ message: "Server error while sending OTP." });
  }
};

// Verify OTP and save lead
exports.verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  const record = otpMap.get(email);
  if (!record)
    return res.status(400).json({ message: "OTP expired or not found." });

  const { otp: storedOtp, data } = record;

  if (parseInt(otp) !== storedOtp)
    return res.status(400).json({ message: "Invalid OTP." });

  // Save lead with services
  const newLead = new Lead({ ...data, verified: true });
  await newLead.save();

  otpMap.delete(email);

  // Confirmation email to user
  await sendEmail({
    to: email,
    subject: "We’ve Received Your Query – Bigwig Media Digital",
    html: `
    <div style="font-family: Arial, Helvetica, sans-serif; background-color: #f5f7fb; padding: 30px;">
      <div style="max-width: 560px; margin: auto; background: #ffffff; border-radius: 10px; padding: 30px; box-shadow: 0 10px 30px rgba(0,0,0,0.08);">

        <h2 style="color: #111827; margin-bottom: 12px;">
          Hello ${data.name},
        </h2>

        <p style="color: #374151; font-size: 15px; line-height: 1.6;">
          Thank you for reaching out to <strong>Bigwig Media Digital</strong>.
          We’ve successfully received your query and appreciate your interest in our services.
        </p>

        <p style="color: #374151; font-size: 15px; line-height: 1.6;">
          Our team is currently reviewing your request and one of our representatives
          will get in touch with you within <strong>24–48 hours</strong>.
        </p>

        <p style="color: #374151; font-size: 15px; line-height: 1.6;">
          If you have any additional information to share in the meantime, feel free to reply
          to this email.
        </p>

        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />

        <p style="font-size: 13px; color: #6b7280;">
          Best regards,<br />
          <strong>Bigwig Media Digital Team</strong>
        </p>

        <p style="font-size: 12px; color: #9ca3af; text-align: center; margin-top: 20px;">
          © ${new Date().getFullYear()} Bigwig Media Digital. All rights reserved.
        </p>

      </div>
    </div>
  `,
  });

  // HR internal notification
  await sendEmail({
    to: "chandan@bigwigmedia.in",
    subject: "New Lead Captured - Bigwig Media",
    html: `
      <h3>New Lead Details</h3>
      <p><strong>Name:</strong> ${data.name}</p>
      <p><strong>Email:</strong> ${data.email}</p>
      <p><strong>Phone:</strong> ${data.phone}</p>
      <p><strong>Selected Services:</strong> ${data.services.join(", ")}</p>
      <p><strong>Message:</strong><br /> ${data.message}</p>
    `,
  });

  res.status(200).json({
    message: "Lead captured, confirmation sent, HR notified.",
  });
};

// Get all leads
exports.getAllLeads = async (req, res) => {
  try {
    const leads = await Lead.find().sort({ createdAt: -1 }); // Sort latest first
    res.status(200).json(leads);
  } catch (err) {
    console.error("Error fetching leads:", err);
    res.status(500).json({ message: "Server error while fetching leads." });
  }
};

exports.getLeadsLast10Days = async (req, res) => {
  try {
    const startDate = moment().subtract(9, "days").startOf("day").toDate();

    const leadsByDay = await Lead.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // 🧩 Fill missing dates with count 0
    const last10Days = Array.from({ length: 10 }, (_, i) =>
      moment()
        .subtract(9 - i, "days")
        .format("YYYY-MM-DD"),
    );

    const result = last10Days.map((date) => {
      const entry = leadsByDay.find((d) => d._id === date);
      return { date, count: entry ? entry.count : 0 };
    });

    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching 10-day leads:", error);
    res.status(500).json({ message: "Server error fetching lead data." });
  }
};
