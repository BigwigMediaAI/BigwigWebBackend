const express = require("express");
const { sendNewsletter } = require("../controllers/newsletter.controller");

const router = express.Router();

/**
 * @route   POST /newsletter/send
 * @desc    Create & send newsletter (ALL or MANUAL)
 * @access  Admin (add auth middleware later)
 */
router.post("/send", sendNewsletter);

module.exports = router;
