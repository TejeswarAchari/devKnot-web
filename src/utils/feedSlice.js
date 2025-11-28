import { createSlice } from "@reduxjs/toolkit";

const feedSlice = createSlice({
  name: "feed",
  initialState: null,            // feed initially empty
  reducers: {
    addFeed: (state, action) => action.payload,   // store feed data
    removeUserFromFeed: (state, action) =>{
      const newFeed = state.filter((user) => user._id !== action.payload);
      return newFeed;
    }                     // clear feed
  },
});

// actions
export const { addFeed, removeUserFromFeed } = feedSlice.actions;

// reducer
export default feedSlice.reducer;
