import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice"; // default import
import feedReducer from "./feedSlice";
import connectionReducer from "./connectionSlice";
import requestreducer from "./requestSlice";
import notificationReducer from "./notificationSlice";

const appStore = configureStore({
  reducer: {
    user: userReducer,
    feed:feedReducer,
    connections:connectionReducer,
    requests:requestreducer,
        notifications: notificationReducer, 
  },
});

export default appStore;
