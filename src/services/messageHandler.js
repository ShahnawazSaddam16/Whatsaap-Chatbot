const {
  sendTextMessage,
  sendTypingIndicator,
} = require("./whatsappService");
const { clearHistory, setUserState, getUserState } = require("../utils/conversationStore");

const COMMANDS = {
  RESET: ["/reset", "/clear", "/start"],
  HELP: ["/help"],
};

const MENU_STATE = {
  MAIN: "main",
  SERVICE_SUBMENU: "service_submenu",
};

const GREETING_KEYWORDS = [
  "hi", "hello", "hey", "greetings", "start", "menu", "services"
];

const SERVICES_MENU = {
  1: {
    name: "Web Development",
    desc: "🌐 Web Development\n\nCustom websites and web applications built with Next.js, React, and Node.js. Fully responsive, scalable, and optimized for performance."
  },
  2: {
    name: "Mobile App Development",
    desc: "📱 Mobile App Development\n\nCross-platform mobile applications using React Native and Expo. Available for iOS and Android with native-like performance."
  },
  3: {
    name: "AI Integration",
    desc: "🤖 AI Integration\n\nLLM-powered features using Groq for intelligent chat, search, and automation. Integrate AI into your existing systems."
  },
  4: {
    name: "Admin Dashboard",
    desc: "📊 Admin Dashboard\n\nCustom analytics and management panels with user authentication, real-time reporting, and data visualization."
  },
  5: {
    name: "Backend APIs",
    desc: "⚙️ Backend APIs\n\nRobust REST and GraphQL APIs built with Node.js and Express. Database design, authentication, and cloud deployment included."
  }
};

const MAIN_MENU = `🚀 *Welcome to Butt Networks*

We offer the following services:

1️⃣ Web Development
2️⃣ Mobile App Development
3️⃣ AI Integration
4️⃣ Admin Dashboard
5️⃣ Backend APIs

Reply with a number (1-5) to learn more about a service, or type your question to chat with our AI assistant.`;

const FALLBACK_RESPONSE = "Thanks for your message! Reply with a number (1-5) to learn about our services, or type /help for available commands.";

const handleCommand = async (from, command) => {
  const lowerCmd = command.toLowerCase().trim();

  if (COMMANDS.RESET.includes(lowerCmd)) {
    clearHistory(from);
    setUserState(from, null);
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

const isGreeting = (text) => {
  const lowerText = text.toLowerCase().trim();
  return GREETING_KEYWORDS.some(keyword => lowerText.includes(keyword));
};

const isServiceSelection = (text) => {
  const num = parseInt(text.trim());
  return !isNaN(num) && num >= 1 && num <= 5;
};

const handleServiceSelection = async (from, text) => {
  const num = parseInt(text.trim());
  const service = SERVICES_MENU[num];
  
  if (service) {
    await sendTextMessage(from, service.desc);
    const followUp = `\nWould you like to know more about ${service.name}? Reply YES to chat with our AI, or select another service (1-5).`;
    await sendTextMessage(from, followUp);
    setUserState(from, MENU_STATE.SERVICE_SUBMENU);
    return true;
  }
  return false;
};

const processIncomingMessage = async (message, contact) => {
  const from = message.from;
  const messageId = message.id;
  const messageType = message.type;

  console.info(`Processing message from ${from}`, { type: messageType });

  await sendTypingIndicator(messageId);

  if (messageType !== "text") {
    await sendTextMessage(from, "Sorry, I can only process text messages at the moment.");
    return;
  }

  const userText = message.text.body;

  const isCommand = await handleCommand(from, userText);
  if (isCommand) return;

  const userState = getUserState(from);
  const lowerText = userText.toLowerCase().trim();

  if (isGreeting(userText) && userState !== MENU_STATE.SERVICE_SUBMENU) {
    await sendTextMessage(from, MAIN_MENU);
    setUserState(from, MENU_STATE.MAIN);
    return;
  }

  if (userState === MENU_STATE.MAIN && isServiceSelection(userText)) {
    const handled = await handleServiceSelection(from, userText);
    if (handled) return;
  }

  if (userState === MENU_STATE.SERVICE_SUBMENU && (lowerText === "yes" || lowerText === "y")) {
    setUserState(from, null);
    await sendTextMessage(from, FALLBACK_RESPONSE);
    return;
  }

  if (isServiceSelection(userText)) {
    const handled = await handleServiceSelection(from, userText);
    if (handled) return;
  }

  await sendTextMessage(from, FALLBACK_RESPONSE);
};

module.exports = { processIncomingMessage };