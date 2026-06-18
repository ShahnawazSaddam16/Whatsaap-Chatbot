const conversationStore = new Map();

const MAX_HISTORY = 10;

const getHistory = (userId) => {
  if (!conversationStore.has(userId)) {
    conversationStore.set(userId, []);
  }
  return conversationStore.get(userId);
};

const addMessage = (userId, role, content) => {
  const history = getHistory(userId);
  history.push({ role, content });

  if (history.length > MAX_HISTORY * 2) {
    history.splice(0, 2);
  }

  conversationStore.set(userId, history);
};

const clearHistory = (userId) => {
  conversationStore.delete(userId);
};

module.exports = { getHistory, addMessage, clearHistory };
