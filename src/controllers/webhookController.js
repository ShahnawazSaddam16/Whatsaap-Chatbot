const { processIncomingMessage } = require("../services/messageHandler");

const verifyWebhook = (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];
  
  if (mode === "subscribe" && token === process.env.WHATSAPP_VERIFY_TOKEN) {
    return res.status(200).send(challenge);
  }

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
    console.error("Error processing webhook:", error.response?.data || error.message);
  }
};

module.exports = { verifyWebhook, handleWebhook };