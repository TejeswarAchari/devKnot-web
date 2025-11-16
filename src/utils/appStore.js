import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice"; // default import
import feedReducer from "./feedSlice";
import connectionReducer from "./connectionSlice";
import requestreducer from "./requestSlice";

const appStore = configureStore({
  reducer: {
    user: userReducer,
    feed:feedReducer,
    connections:connectionReducer,
    requests:requestreducer,
  },
});

export default appStore;
