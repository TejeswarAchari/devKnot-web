import { createSlice } from "@reduxjs/toolkit";

const notificationSlice = createSlice({
  name: "notifications",
  initialState: {}, // { [userId]: count }
  reducers: {
    addNotification: (state, action) => {
      const userId = action.payload;
      state[userId] = (state[userId] || 0) + 1;
    },
    clearNotification: (state, action) => {
      const userId = action.payload;
      if (state[userId]) {
        delete state[userId];
      }
    },
    clearAllNotifications: () => {
      return {};
    },
  },
});

export const {
  addNotification,
  clearNotification,
  clearAllNotifications,
} = notificationSlice.actions;

export default notificationSlice.reducer;
