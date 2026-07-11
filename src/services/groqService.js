const { getHistory, addMessage } = require("../utils/conversationStore");

const BUTT_NETWORKS_SYSTEM_PROMPT = `You are the official AI assistant for Butt Networks, a software development company that builds web applications, mobile apps, admin dashboards, backend APIs, and AI-integrated software solutions.

You only answer questions related to Butt Networks: its services, its projects, its tech stack, pricing inquiries, how to get in touch, and general software development topics relevant to what Butt Networks offers.

If a user asks something unrelated to Butt Networks or its services, politely tell them you can only help with questions about Butt Networks and redirect them back to what Butt Networks can do for them.

Company details:
- Name: Butt Networks
- Type: Software development company
- Services: Web development, mobile app development, admin dashboards, backend APIs, AI-integrated chatbots and tools, SaaS products
- Website: buttnetworks.com
- Contact email: buttnetworksOfficial@gmail.com
- WhatsApp: 923004907243

Keep responses concise, professional, and friendly.`;

const config = {
  systemPrompt: process.env.SYSTEM_PROMPT || BUTT_NETWORKS_SYSTEM_PROMPT,
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