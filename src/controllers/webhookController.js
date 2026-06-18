const config = require("../config/env");
const { processIncomingMessage } = require("../services/messageHandler");
const logger = require("../utils/logger");

const verifyWebhook = (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === config.whatsapp.verifyToken) {
    logger.info("Webhook verified successfully");
    return res.status(200).send(challenge);
  }

  logger.warn("Webhook verification failed");
  return res.status(403).json({ error: "Forbidden" });
};

const handleWebhook = async (req, res) => {
  const body = req.body;

  if (body.object !== "whatsapp_business_account") {
    return res.status(404).json({ error: "Not found" });
  }

  res.status(200).json({ status: "ok" });

  try {
    const entry = body.entry?.[0];
    const changes = entry?.changes?.[0];
    const value = changes?.value;

    if (!value?.messages?.length) {
      return;
    }

    const message = value.messages[0];
    const contact = value.contacts?.[0];

    await processIncomingMessage(message, contact);
  } catch (error) {
    logger.error("Error processing webhook:", error.message);
  }
};

module.exports = { verifyWebhook, handleWebhook };
