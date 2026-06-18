const logger = require("../utils/logger");

const validateWebhookPayload = (req, res, next) => {
  if (req.method === "POST") {
    if (!req.body || typeof req.body !== "object") {
      logger.warn("Invalid webhook payload received");
      return res.status(400).json({ error: "Invalid payload" });
    }
  }
  next();
};

module.exports = { validateWebhookPayload };
