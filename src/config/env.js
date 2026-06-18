require("dotenv").config();

const config = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || "development",

  whatsapp: {
    apiUrl: process.env.WHATSAPP_API_URL,
    phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID,
    accessToken: process.env.WHATSAPP_ACCESS_TOKEN,
    verifyToken: process.env.WHATSAPP_VERIFY_TOKEN,
    businessAccountId: process.env.WHATSAPP_BUSINESS_ACCOUNT_ID,
  },

  groq: {
    apiKey: process.env.GROQ_API_KEY,
    model: process.env.GROQ_MODEL || "llama3-70b-8192",
    maxTokens: parseInt(process.env.GROQ_MAX_TOKENS) || 1024,
    temperature: parseFloat(process.env.GROQ_TEMPERATURE) || 0.7,
  },

  systemPrompt:
    process.env.SYSTEM_PROMPT ||
    "You are a helpful WhatsApp assistant. Be concise, friendly, and helpful.",
};

module.exports = config;
