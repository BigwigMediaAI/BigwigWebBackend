const express = require("express");
const {
  subscribeEmail,
  unsubscribeEmail,
  getAllSubscribers,
} = require("../controllers/subscriberController");

const router = express.Router();

router.post("/subscribe", subscribeEmail);
router.get("/unsubscribe/:token", unsubscribeEmail);
router.get("/", getAllSubscribers);

module.exports = router;
