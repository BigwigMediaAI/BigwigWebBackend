const express = require("express");
const {
  sendNewsletter,
  getAllNewsletters,
  deleteNewsletter,
} = require("../controllers/newsletter.controller");

const router = express.Router();

/**
 * @route   POST /newsletter/send
 * @desc    Create & send newsletter (ALL or MANUAL)
 * @access  Admin (add auth middleware later)
 */
router.post("/send", sendNewsletter);
router.get("/", getAllNewsletters);
router.delete("/:id", deleteNewsletter);

module.exports = router;
