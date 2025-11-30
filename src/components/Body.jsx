// // src/components/Body.jsx
// import React, { useEffect } from "react";
// import { Outlet, useLocation, useNavigate } from "react-router-dom";
// import NavBar from "./NavBar";
// import Footer from "./Footer";
// import { useDispatch, useSelector } from "react-redux";
// import { getSocket } from "../utils/socket";
// import { addNotification, clearNotification } from "../utils/notificationSlice";

// const Body = () => {
//   const user = useSelector((state) => state.user);
//   const dispatch = useDispatch();
//   const location = useLocation();
//   const navigate = useNavigate();

//   // 🔐 AUTH GUARD
//   useEffect(() => {
//     if (!user && location.pathname !== "/login") {
//       navigate("/login");
//     }
//   }, [user, location.pathname, navigate]);

//   // 📡 Register user with socket when logged in
//   useEffect(() => {
//     if (!user?._id) return;

//     const socket = getSocket();
//     socket.emit("registerUser", { userId: user._id });
//   }, [user?._id]);

//   // 🔔 messageNotification → addNotification(senderId)
//   useEffect(() => {
//     if (!user?._id) return;

//     const socket = getSocket();

//     const onMessageNotification = ({ fromUserId }) => {
//       const senderId = fromUserId;
//       if (!senderId || senderId === user._id) return;

//       const path = location.pathname;
//       const inChatWithSender = path === `/chat/${senderId}`;

//       if (!inChatWithSender) {
//         dispatch(addNotification(senderId));
//       }
//     };

//     socket.on("messageNotification", onMessageNotification);

//     return () => {
//       socket.off("messageNotification", onMessageNotification);
//     };
//   }, [user?._id, location.pathname, dispatch]);

//   // 🧹 Clear notifications when opening that chat
//   useEffect(() => {
//     if (!user?._id) return;

//     const match = location.pathname.match(/^\/chat\/(.+)$/);
//     if (match) {
//       const activeTargetId = match[1];
//       dispatch(clearNotification(activeTargetId));
//     }
//   }, [location.pathname, user?._id, dispatch]);

//   return (
//     <div className="min-h-screen bg-slate-950 text-slate-100">
//       {/* Global yellow/black background glow */}
//       <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_10%_0,_rgba(250,204,21,0.35),transparent_55%),radial-gradient(circle_at_80%_110%,rgba(15,23,42,0.95),transparent_55%)]" />

//       {/* subtle dark overlay to unify screens */}
//       <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_center,_rgba(15,23,42,0.85),rgba(15,23,42,0.98))]" />

//       <div className="flex min-h-screen flex-col">
//         <NavBar />
//         <main className="flex-1">
//           {/* offset for fixed navbar */}
//           <div className="mx-auto flex h-full w-full max-w-7xl flex-col px-3 pt-16 pb-4 sm:px-4">
//             <Outlet />
//           </div>
//         </main>
//         <Footer />
//       </div>
//     </div>
//   );
// };

// export default Body;


// src/components/Body.jsx

import React, { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import NavBar from "./NavBar";
import Footer from "./Footer";
import { useDispatch, useSelector } from "react-redux";
import { getSocket } from "../utils/socket";
import { addNotification, clearNotification } from "../utils/notificationSlice";

const Body = () => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const [showSplash, setShowSplash] = useState(true);

  // ⏱ splash timer – purely visual
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 1200); // 1.6s – tweak if you want

    return () => clearTimeout(timer);
  }, []);

  // 🔐 AUTH GUARD
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

  // 🎬 Splash screen render (hooks above, return below = safe)
  if (showSplash) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100">
        {/* yellow glow */}
        <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_10%_0,_rgba(250,204,21,0.35),transparent_55%),radial-gradient(circle_at_80%_110%,rgba(15,23,42,0.95),transparent_55%)]" />
        {/* darker overlay */}
        <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_center,_rgba(15,23,42,0.9),rgba(15,23,42,1))]" />

        <div className="flex min-h-screen flex-col items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            {/* glowing logo chip */}
            <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-amber-300 via-yellow-400 to-amber-500 text-2xl shadow-[0_0_45px_rgba(250,204,21,0.9)] animate-bounce">
              🧑‍💻
            </div>
            {/* brand text */}
            <div className="text-center">
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-50">
                DevKnot
              </h1>
              <p className="mt-1 text-xs text-slate-300/80">
                Matching developers. One swipe at a time.
              </p>
            </div>
            {/* loading bar */}
            <div className="mt-3 h-1.5 w-40 overflow-hidden rounded-full bg-slate-800/80">
              <div className="h-full w-1/2 animate-[loadingBar_1.4s_ease-in-out_infinite] bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500" />
            </div>
          </div>
        </div>

        {/* tiny CSS keyframe via Tailwind's arbitrary syntax is not possible,
            but we fake it using animate-[custom] is fine if configured.
            If not using Tailwind plugins, this still looks OK as a simple bar.
        */}
      </div>
    );
  }

  // 🌕 Normal app layout
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Global yellow/black background glow */}
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_10%_0,_rgba(250,204,21,0.35),transparent_55%),radial-gradient(circle_at_80%_110%,rgba(15,23,42,0.95),transparent_55%)]" />

      {/* subtle dark overlay to unify screens */}
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_center,_rgba(15,23,42,0.85),rgba(15,23,42,0.98))]" />

      <div className="flex min-h-screen flex-col">
        <NavBar />
        <main className="flex-1">
          {/* offset for fixed navbar */}
          <div className="mx-auto flex h-full w-full max-w-7xl flex-col px-3 pt-16 pb-4 sm:px-4">
            <Outlet />
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default Body;
