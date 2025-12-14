// src/context/OnlineStatusContext.js
import { createContext } from "react";

// Context for managing online status across the app
export const OnlineStatusContext = createContext({
  onlineUsers: {}, // { [userId]: true/false }
  lastSeenMap: {}, // { [userId]: ISOString }
  formatLastSeen: () => null,
});
