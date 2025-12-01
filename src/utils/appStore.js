import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice"; // default import
import feedReducer from "./feedSlice";
import connectionReducer from "./connectionSlice";
import requestreducer from "./requestSlice";
import notificationReducer from "./notificationSlice";
import onlineReducer from "./onlineSlice";

const appStore = configureStore({
  reducer: {
    user: userReducer,
    feed:feedReducer,
    connections:connectionReducer,
    requests:requestreducer,
        notifications: notificationReducer, 
        online: onlineReducer,

  },
});

export default appStore;
