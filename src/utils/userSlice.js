import { createSlice } from "@reduxjs/toolkit";

// read user from localStorage on app start
const storedUser = (() => {
  try {
    const raw = localStorage.getItem("devknot_user");
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    console.error("Error parsing stored user", e);
    return null;
  }
})();

const userSlice = createSlice({
  name: "user",
  initialState: storedUser,   // 👈 use stored user if present
  reducers: {
    addUser: (state, action) => {
      const user = action.payload;
      // save to localStorage so refresh keeps you logged in
      try {
        localStorage.setItem("devknot_user", JSON.stringify(user));
      } catch (e) {
        console.error("Error saving user to storage", e);
      }
      return user;
    },
    removeUser: () => {
      // clear from localStorage on logout
      try {
        localStorage.removeItem("devknot_user");
      } catch (e) {
        console.error("Error removing user from storage", e);
      }
      return null;
    },
  },
});

export const { addUser, removeUser } = userSlice.actions;
export default userSlice.reducer;
