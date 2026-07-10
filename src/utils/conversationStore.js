const conversations = {};

const getHistory = (userId) => {
  if (!conversations[userId]) {
    conversations[userId] = [];
  }
  return conversations[userId];
};

const addMessage = (userId, role, content) => {
  if (!conversations[userId]) {
    conversations[userId] = [];
  }
  conversations[userId].push({ role, content });
};

const clearHistory = (userId) => {
  delete conversations[userId];
};

module.exports = { getHistory, addMessage, clearHistory };
