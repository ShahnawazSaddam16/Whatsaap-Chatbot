const config = require("../config/env");

const healthCheck = (req, res) => {
  res.status(200).json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    environment: config.nodeEnv,
    service: "WhatsApp Chatbot",
  });
};

module.exports = { healthCheck };
