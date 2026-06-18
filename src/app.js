require("dotenv").config();

const express = require("express");
const morgan = require("morgan");

const config = require("./config/env");
const logger = require("./utils/logger");
const errorHandler = require("./middlewares/errorHandler");
const { validateWebhookPayload } = require("./middlewares/validator");

const webhookRoutes = require("./routes/webhook");
const healthRoutes = require("./routes/health");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("combined"));

app.use("/webhook", validateWebhookPayload, webhookRoutes);
app.use("/health", healthRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "WhatsApp Chatbot is running",
    version: "1.0.0",
    endpoints: {
      webhook: "/webhook",
      health: "/health",
    },
  });
});

app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

app.use(errorHandler);

const PORT = config.port;

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
  logger.info(`Environment: ${config.nodeEnv}`);
  logger.info(`Webhook URL: http://localhost:${PORT}/webhook`);
});

module.exports = app;
