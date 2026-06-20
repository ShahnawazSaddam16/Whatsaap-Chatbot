const express = require("express");
const router = express.Router();
const { verifyWebhook, handleWebhook } = require("../controllers/webhookController");
const limiter = require("../middlewares/limiter");

router.get("/", limiter, verifyWebhook);
router.post("/", limiter, handleWebhook);

module.exports = router;
