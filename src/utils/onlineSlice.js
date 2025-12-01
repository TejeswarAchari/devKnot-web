import { createSlice } from "@reduxjs/toolkit";

const onlineSlice = createSlice({
  name: "online",
  initialState: {},         // { userId: true/false }
  reducers: {
    updateOnlineStatus: (state, action) => {
      const { userId, isOnline } = action.payload;
      state[userId] = isOnline;
    },
  },
});

export const { updateOnlineStatus } = onlineSlice.actions;
export default onlineSlice.reducer;
