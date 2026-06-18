const groqClient = require("../config/groq");
const config = require("../config/env");
const { getHistory, addMessage } = require("../utils/conversationStore");
const logger = require("../utils/logger");

const getChatCompletion = async (userId, userMessage) => {
  addMessage(userId, "user", userMessage);
  const history = getHistory(userId);

  const messages = [
    { role: "system", content: config.systemPrompt },
    ...history,
  ];

  const completion = await groqClient.chat.completions.create({
    messages,
    model: config.groq.model,
    max_tokens: config.groq.maxTokens,
    temperature: config.groq.temperature,
  });

  const assistantMessage = completion.choices[0]?.message?.content;

  if (!assistantMessage) {
    throw new Error("No response from Groq");
  }

  addMessage(userId, "assistant", assistantMessage);
  logger.debug(`Groq response for user ${userId}:`, assistantMessage);

  return assistantMessage;
};

module.exports = { getChatCompletion };
