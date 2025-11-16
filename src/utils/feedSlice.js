import { createSlice } from "@reduxjs/toolkit";

const feedSlice = createSlice({
  name: "feed",
  initialState: null,            // feed initially empty
  reducers: {
    addFeed: (state, action) => action.payload,   // store feed data
    removeFeed: () => null,                      // clear feed
  },
});

// actions
export const { addFeed, removeFeed } = feedSlice.actions;

// reducer
export default feedSlice.reducer;
