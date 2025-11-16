import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice"; // default import
import feedStore from "./feedSlice";

const appStore = configureStore({
  reducer: {
    user: userReducer,
    feed:feedStore,
  },
});

export default appStore;
