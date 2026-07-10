const { getChatCompletion } = require("./groqService");
const { sendTextMessage, markMessageAsRead } = require("./whatsappService");
const { clearHistory } = require("../utils/conversationStore");

const COMMANDS = {
  RESET: ["/reset", "/clear", "/start"],
  HELP: ["/help"],
};

const handleCommand = async (from, command) => {
  const lowerCmd = command.toLowerCase().trim();

  if (COMMANDS.RESET.includes(lowerCmd)) {
    clearHistory(from);
    await sendTextMessage(
      from,
      "Conversation reset! How can I help you today?"
    );
    return true;
  }

  if (COMMANDS.HELP.includes(lowerCmd)) {
    const helpText =
      "Available commands:\n\n" +
      "/reset or /clear - Reset conversation history\n" +
      "/start - Start a new conversation\n" +
      "/help - Show this help message\n\n" +
      "Just type any message to chat with the AI assistant!";
    await sendTextMessage(from, helpText);
    return true;
  }

  return false;
};

const processIncomingMessage = async (message, contact) => {
  const from = message.from;
  const messageId = message.id;
  const messageType = message.type;

  console.info(`Processing message from ${from}`, { type: messageType });

  await markMessageAsRead(messageId);

  if (messageType !== "text") {
    await sendTextMessage(
      from,
      "Sorry, I can only process text messages at the moment."
    );
    return;
  }

  const userText = message.text.body;

  const isCommand = await handleCommand(from, userText);
  if (isCommand) return;

  const aiResponse = await getChatCompletion(from, userText);
  await sendTextMessage(from, aiResponse);
};

module.exports = { processIncomingMessage };
