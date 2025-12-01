



// src/components/Body.jsx
import React, { useEffect, useState, createContext } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import NavBar from "./NavBar";
import Footer from "./Footer";
import { useDispatch, useSelector } from "react-redux";
import { getSocket } from "../utils/socket";
import { addNotification, clearNotification } from "../utils/notificationSlice";

// 🔹 Export context so children can consume online + lastSeen
export const OnlineStatusContext = createContext({
  onlineUsers: {}, // { [userId]: true/false }
  lastSeenMap: {}, // { [userId]: ISOString }
});

// small helper to format last seen text
const formatLastSeen = (iso) => {
  if (!iso) return null;
  const date = new Date(iso);
  const diffMs = Date.now() - date.getTime();
  if (Number.isNaN(diffMs) || diffMs < 0) return null;

  const diffMin = Math.floor(diffMs / 60000);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);

  if (diffMin < 1) return "Last seen just now";
  if (diffMin < 60) return `Last seen ${diffMin} min ago`;
  if (diffHr < 24) return `Last seen ${diffHr} hour${diffHr > 1 ? "s" : ""} ago`;
  if (diffDay < 7) return `Last seen ${diffDay} day${diffDay > 1 ? "s" : ""} ago`;
  return "Last seen a while ago";
};

const Body = () => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  // 🌐 global online + lastSeen state for the app
  const [onlineUsers, setOnlineUsers] = useState({});
  const [lastSeenMap, setLastSeenMap] = useState({});

  // 🔐 AUTH GUARD – same behavior
  useEffect(() => {
    if (!user && location.pathname !== "/login") {
      navigate("/login");
    }
  }, [user, location.pathname, navigate]);

  // 📡 Register user with socket when logged in
  useEffect(() => {
    if (!user?._id) return;

    const socket = getSocket();
    socket.emit("registerUser", { userId: user._id });

    // ask server for current snapshot of online users
    socket.emit("getOnlineUsers");

    const onSnapshot = ({ users }) => {
      const initial = {};
      users.forEach((id) => {
        initial[id] = true;
      });
      setOnlineUsers(initial);
    };

    socket.on("onlineUsersSnapshot", onSnapshot);

    return () => {
      socket.off("onlineUsersSnapshot", onSnapshot);
    };
  }, [user?._id]);

  // 🟢 listen to userOnlineStatus → keep onlineUsers + lastSeenMap in sync
  useEffect(() => {
    if (!user?._id) return;

    const socket = getSocket();

    const onUserOnlineStatus = ({ userId, isOnline, lastSeen }) => {
      if (!userId) return;

      setOnlineUsers((prev) => ({
        ...prev,
        [userId]: !!isOnline,
      }));

      if (!isOnline && lastSeen) {
        setLastSeenMap((prev) => ({
          ...prev,
          [userId]: lastSeen,
        }));
      }
    };

    socket.on("userOnlineStatus", onUserOnlineStatus);

    return () => {
      socket.off("userOnlineStatus", onUserOnlineStatus);
    };
  }, [user?._id]);

  // 🔔 messageNotification → addNotification(senderId)
  useEffect(() => {
    if (!user?._id) return;

    const socket = getSocket();

    const onMessageNotification = ({ fromUserId }) => {
      const senderId = fromUserId;
      if (!senderId || senderId === user._id) return;

      const path = location.pathname;
      const inChatWithSender = path === `/chat/${senderId}`;

      if (!inChatWithSender) {
        dispatch(addNotification(senderId));
      }
    };

    socket.on("messageNotification", onMessageNotification);

    return () => {
      socket.off("messageNotification", onMessageNotification);
    };
  }, [user?._id, location.pathname, dispatch]);

  // 🧹 Clear notifications when opening that chat
  useEffect(() => {
    if (!user?._id) return;

    const match = location.pathname.match(/^\/chat\/(.+)$/);
    if (match) {
      const activeTargetId = match[1];
      dispatch(clearNotification(activeTargetId));
    }
  }, [location.pathname, user?._id, dispatch]);
  

   /* ⭐⭐⭐ IMPORTANT FIX ⭐⭐⭐
     Immediately tell server user is leaving when they close the tab.
     This solves the "user stays online forever" bug.
  */
    useEffect(() => {
    if (!user?._id) return;

    const socket = getSocket();
    const handleBeforeUnload = () => socket.emit("manualDisconnect");

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [user?._id]); // <-- nothing else changes

  return (
    <OnlineStatusContext.Provider
      value={{ onlineUsers, lastSeenMap, formatLastSeen }}
    >
      <div className="min-h-screen bg-base-100 text-base-content">
        {/* global soft gradient background */}
        <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(250,204,21,0.12),transparent_60%),radial-gradient(circle_at_bottom,_rgba(15,23,42,0.95),transparent_55%)]" />

        <div className="flex min-h-screen flex-col">
          <NavBar />
          <main className="flex-1">
            {/* offset top for fixed navbar */}
            <div className="mx-auto flex h-full w-full max-w-7xl flex-col px-3 pt-16 pb-4 sm:px-4">
              <Outlet />
            </div>
          </main>
          <Footer />
        </div>
      </div>
    </OnlineStatusContext.Provider>
  );
};

export default Body;
