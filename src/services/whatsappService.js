const axios = require("axios");
const config = require("../config/env");
const logger = require("../utils/logger");

const whatsappApi = axios.create({
  baseURL: `${config.whatsapp.apiUrl}/${config.whatsapp.phoneNumberId}`,
  headers: {
    Authorization: `Bearer ${config.whatsapp.accessToken}`,
    "Content-Type": "application/json",
  },
});

const sendTextMessage = async (to, message) => {
  const payload = {
    messaging_product: "whatsapp",
    recipient_type: "individual",
    to,
    type: "text",
    text: {
      preview_url: false,
      body: message,
    },
  };

  const response = await whatsappApi.post("/messages", payload);
  logger.info(`Message sent to ${to}`, response.data);
  return response.data;
};

const markMessageAsRead = async (messageId) => {
  const payload = {
    messaging_product: "whatsapp",
    status: "read",
    message_id: messageId,
  };

  await whatsappApi.post("/messages", payload);
  logger.debug(`Message ${messageId} marked as read`);
};

const sendTypingIndicator = async (to) => {
  const payload = {
    messaging_product: "whatsapp",
    recipient_type: "individual",
    to,
    type: "text",
    text: { body: "..." },
  };

  await whatsappApi.post("/messages", payload);
};

module.exports = { sendTextMessage, markMessageAsRead, sendTypingIndicator };
