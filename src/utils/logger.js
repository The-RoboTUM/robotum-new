// src/utils/logger.js
// Single choke point for client-side logging. Silent in production builds,
// so the console stays clean for users while keeping context in development.
const isDev = import.meta.env.DEV;

export const logger = {
  error(...args) {
    if (isDev) console.error(...args);
  },
  warn(...args) {
    if (isDev) console.warn(...args);
  },
  info(...args) {
    if (isDev) console.info(...args);
  },
};

export default logger;
