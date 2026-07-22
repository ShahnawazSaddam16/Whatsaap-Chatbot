const conversations = {};
const userStates = {};

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

const setUserState = (userId, state) => {
  if (state === null) {
    delete userStates[userId];
  } else {
    userStates[userId] = state;
  }
};

const getUserState = (userId) => {
  return userStates[userId] || null;
};

module.exports = { getHistory, addMessage, clearHistory, setUserState, getUserState };
