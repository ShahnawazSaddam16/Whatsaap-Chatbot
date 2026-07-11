const axios = require("axios");

const whatsappApiUrl = process.env.WHATSAPP_API_URL;
const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;

if (!whatsappApiUrl || !phoneNumberId || !accessToken) {
  throw new Error("Missing WhatsApp env vars: WHATSAPP_API_URL, WHATSAPP_PHONE_NUMBER_ID, WHATSAPP_ACCESS_TOKEN");
}

const whatsappApi = axios.create({
  baseURL: `${whatsappApiUrl}/${phoneNumberId}`,
  headers: {
    Authorization: `Bearer ${accessToken}`,
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
  console.info(`Message sent to ${to}`, response.data);
  return response.data;
};

const markMessageAsRead = async (messageId) => {
  const payload = {
    messaging_product: "whatsapp",
    status: "read",
    message_id: messageId,
  };

  await whatsappApi.post("/messages", payload);
  console.debug(`Message ${messageId} marked as read`);
};

const sendTypingIndicator = async (messageId) => {
  const payload = {
    messaging_product: "whatsapp",
    status: "read",
    message_id: messageId,
    typing_indicator: { type: "text" },
  };

  await whatsappApi.post("/messages", payload);
  console.debug(`Typing indicator sent for ${messageId}`);
};

module.exports = {
  sendTextMessage,
  markMessageAsRead,
  sendTypingIndicator,
};