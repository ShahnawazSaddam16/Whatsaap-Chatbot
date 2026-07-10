const { getHistory, addMessage } = require("../utils/conversationStore");

const config = {
  systemPrompt: process.env.SYSTEM_PROMPT || "You are a helpful assistant.",
  groq: {
    apiKey: process.env.GROQ_API_KEY,
    model: process.env.GROQ_MODEL || "llama-3.3-70b-versatile",
    maxTokens: Number(process.env.GROQ_MAX_TOKENS) || 1024,
    temperature: Number(process.env.GROQ_TEMPERATURE) || 0.7,
  },
};

const getChatCompletion = async (userId, userMessage) => {
  addMessage(userId, "user", userMessage);
  const history = getHistory(userId);

  const messages = [
    { role: "system", content: config.systemPrompt },
    ...history,
  ];

  if (!config.groq.apiKey) {
    throw new Error("GROQ_API_KEY must be set in environment");
  }

  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.groq.apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messages,
      model: config.groq.model,
      max_tokens: config.groq.maxTokens,
      temperature: config.groq.temperature,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Groq API error: ${res.status} ${text}`);
  }

  const completion = await res.json();
  const assistantMessage = completion.choices?.[0]?.message?.content;

  if (!assistantMessage) {
    throw new Error("No response from Groq");
  }

  addMessage(userId, "assistant", assistantMessage);
  console.debug(`Groq response for user ${userId}:`, assistantMessage);

  return assistantMessage;
};

module.exports = { getChatCompletion };
