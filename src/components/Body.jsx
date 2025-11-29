// import React, { useEffect } from 'react'
// import NavBar from "./NavBar";
// import Footer from "./Footer"
// import { Outlet } from 'react-router-dom';
// import BASEURL from '../utils/constants';
// import { useDispatch } from 'react-redux';
// import {addUser} from '../utils/userSlice';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import { useSelector } from 'react-redux';


// const Body = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const userData = useSelector((state)=>state.user);
//   const fetchUser = async () => {
//     if(userData) {
//       return;
//     }
//      try{ const user = await axios.get(BASEURL+"profile/view",{
//         withCredentials: true,

//       })
//       dispatch(addUser(user.data))
//     }
//       catch(err){
//         if(err.status===401){
//         navigate("/login")

//         }
//         console.error(err);
//       }
//   }

//   useEffect(() =>{
   
//  fetchUser();
    
   
//   },[])

//   return (
//     <div  className='min-h-screen flex flex-col '>
//       <NavBar/>
//       <Outlet className="flex-1"/>
//       <Footer/>
//     </div>
//   )
// }


// export default Body


// src/components/Body.jsx
import React, { useEffect } from "react";
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

  // 🔐 AUTH GUARD
  useEffect(() => {
    // allow login page without user
    if (!user && location.pathname !== "/login") {
      navigate("/login");
    }
  }, [user, location.pathname, navigate]);

  // 🔔 Notifications: add when message received and not in that chat

  useEffect(() => {
  if (!user?._id) return;

  const socket = getSocket();

  // make sure this socket is associated with the logged-in user
  socket.emit("registerUser", { userId: user._id });
}, [user?._id]);

useEffect(() => {
  if (!user?._id) return;

  const socket = getSocket();

  const onMessageNotification = ({ fromUserId }) => {
    const senderId = fromUserId;

    // ignore if for some reason we are the sender (shouldn't happen here)
    if (senderId === user._id) return;

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


  // 🧹 Clear notification when opening that chat
  useEffect(() => {
    if (!user?._id) return;

    const match = location.pathname.match(/^\/chat\/(.+)$/);
    if (match) {
      const activeTargetId = match[1];
      dispatch(clearNotification(activeTargetId));
    }
  }, [location.pathname, user?._id, dispatch]);

  return (
    <>
      <NavBar />
      <Outlet />
      <Footer />
    </>
  );
};

export default Body;
