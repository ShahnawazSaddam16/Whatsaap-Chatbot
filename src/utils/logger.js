const config = require("../config/env");

const logger = {
  info: (message, data = "") => {
    if (config.nodeEnv !== "test") console.log(`[INFO] ${new Date().toISOString()} - ${message}`, data);
  },
  error: (message, error = "") => {
    if (config.nodeEnv !== "test") console.error(`[ERROR] ${new Date().toISOString()} - ${message}`, error);
  },
  debug: (message, data = "") => {
    if (config.nodeEnv === "development") {
      console.log(`[DEBUG] ${new Date().toISOString()} - ${message}`, data);
    }
  },
  warn: (message, data = "") => {
    if (config.nodeEnv !== "test") console.warn(`[WARN] ${new Date().toISOString()} - ${message}`, data);
  },
};

module.exports = logger;
