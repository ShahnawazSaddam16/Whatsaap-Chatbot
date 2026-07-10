const { getChatCompletion } = require("./groqService");
const {
  sendTextMessage,
  sendTypingIndicator,
  sendServicesMenu,
  markMessageAsRead,
} = require("./whatsappService");
const { clearHistory } = require("../utils/conversationStore");

const COMMANDS = {
  RESET: ["/reset", "/clear", "/start"],
  HELP: ["/help"],
};

const GREETINGS = ["hi", "hello", "hey", "salam", "assalamualaikum"];
const SERVICE_KEYWORDS = ["service", "services", "what do you offer", "what can you do"];
const WELCOME_NAME = "Shahnawaz Sadam Butt";

const isGreeting = (text) => {
  const cleaned = text.toLowerCase().trim().replace(/[!.?]/g, "");
  return GREETINGS.includes(cleaned);
};

const isServiceQuery = (text) => {
  const cleaned = text.toLowerCase().trim();
  return SERVICE_KEYWORDS.some((keyword) => cleaned.includes(keyword));
};

const handleCommand = async (from, command) => {
  const lowerCmd = command.toLowerCase().trim();

  if (COMMANDS.RESET.includes(lowerCmd)) {
    clearHistory(from);
    await sendTextMessage(from, "Conversation reset! How can I help you today?");
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

const SERVICE_DETAILS = {
  svc_web: "Web Development: custom websites and web apps built with Next.js and Node.js.",
  svc_mobile: "Mobile Apps: cross-platform apps built with React Native and Expo.",
  svc_ai: "AI Integrations: LLM-powered features using Groq for chat, search, and automation.",
  svc_admin: "Admin Dashboards: analytics and management panels with authentication and reporting.",
};

const handleInteractiveReply = async (from, message) => {
  const replyId = message.interactive?.list_reply?.id || message.interactive?.button_reply?.id;
  if (!replyId) return;

  const reply = SERVICE_DETAILS[replyId] || "Thanks for your interest! Let us know if you'd like more details.";
  await sendTextMessage(from, reply);
};

const processIncomingMessage = async (message, contact) => {
  const from = message.from;
  const messageId = message.id;
  const messageType = message.type;

  console.info(`Processing message from ${from}`, { type: messageType });

  await sendTypingIndicator(messageId);

  if (messageType === "interactive") {
    await handleInteractiveReply(from, message);
    return;
  }

  if (messageType !== "text") {
    await sendTextMessage(from, "Sorry, I can only process text messages at the moment.");
    return;
  }

  const userText = message.text.body;

  const isCommand = await handleCommand(from, userText);
  if (isCommand) return;

  if (isGreeting(userText)) {
    await sendTextMessage(from, `Welcome ${WELCOME_NAME}! How can I help you today?`);
    return;
  }

  if (isServiceQuery(userText)) {
    await sendServicesMenu(from);
    return;
  }

  const aiResponse = await getChatCompletion(from, userText);
  await sendTextMessage(from, aiResponse);
};

module.exports = { processIncomingMessage };