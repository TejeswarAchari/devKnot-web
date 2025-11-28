// Chat.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { createSocketConnection } from "../utils/socket";
import { useSelector } from "react-redux";

const Chat = () => {
  const { targetUserId } = useParams();
  const [messages, setMessages] = useState([{ text: "Hello World" }]);
  const [newMessage, setNewMessage] = useState("");
  const user = useSelector((state) => state.user);
  const userId = user?._id;

  useEffect(() =>{
    if(!userId) return;
     const socket = createSocketConnection();
     socket.emit("joinChat",{firstName: user.firstName,userId,targetUserId})
     return ()=>{
        socket.disconnect();    
     }
  },[userId,targetUserId])

  const handleSend = () => {
   const socket = createSocketConnection();

socket.emit("sendMessage", {
  firstName: user.firstName,
  userId,
  targetUserId,
  text: newMessage,
});

  };

  return (
    <div className="w-1/2 mx-auto border border-gray-600 m-5 h-[70vh] flex flex-col">
      <h1 className="p-5 border-b border-gray-600">Chat</h1>

      <div className="flex-1 overflow-scroll p-5">
        {messages.map((msg, index) => (
          <div key={index} className="chat chat-start">
            <div className="chat-header">
              Tejeswar Achari
              <time className="text-xs opacity-50 ml-2">2 hours ago</time>
            </div>
            <div className="chat-bubble">{msg.text || "You were the Chosen One!"}</div>
            <div className="chat-footer opacity-50">Seen</div>
          </div>
        ))}
      </div>

      <div className="p-5 border-t border-gray-600 flex items-center gap-2">
        <input
          className="flex-1 border border-gray-500 text-white rounded p-2 bg-transparent outline-none"
          placeholder="Type a message…"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button className="btn btn-secondary" onClick={handleSend}>
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
