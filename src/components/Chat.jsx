// src/components/Chat.jsx
import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import BASE_URL from "../utils/constants";
import { getSocket, disconnectSocket } from "../utils/socket";
import { useSelector } from "react-redux";

const Chat = () => {
  const { targetUserId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isTargetOnline, setIsTargetOnline] = useState(false);

  const user = useSelector((state) => state.user);
  const userId = user?._id;

  const bottomRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const formatTime = (iso) => {
    if (!iso) return "";
    const d = new Date(iso);
    return d.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // 1) Load history
  useEffect(() => {
    if (!userId || !targetUserId) return;

    const fetchHistory = async () => {
      try {
        const res = await axios.get(
          `${BASE_URL}chat/history/${targetUserId}`,
          { withCredentials: true }
        );

        const history = res.data.data.map((msg) => {
          const senderId = (msg.fromUserId?._id || msg.fromUserId).toString();
          return {
            _id: msg._id,
            text: msg.text,
            from: msg.fromUserId?.firstName || "User",
            senderId,
            self: senderId === userId.toString(),
            createdAt: msg.createdAt,
            status: msg.status || "sent",
            isDeleted: msg.isDeleted || false,
          };
        });

        setMessages(history);
      } catch (err) {
        console.error("Error loading history:", err);
      }
    };

    fetchHistory();
  }, [userId, targetUserId]);

  // 2) Socket join + listeners
  useEffect(() => {
    if (!userId || !targetUserId) return;

    const socket = getSocket();

    // register user (for online/offline)
    socket.emit("registerUser", { userId });

    // join room
    socket.emit("joinChat", {
      firstName: user.firstName,
      userId,
      targetUserId,
    });

    const onMessageReceived = ({
      _id,
      firstName,
      userId: senderId,
      text,
      createdAt,
      status,
    }) => {
      setMessages((prev) => [
        ...prev,
        {
          _id,
          from: firstName,
          senderId,
          text,
          self: senderId === userId,
          createdAt: createdAt || new Date().toISOString(),
          status: status || "sent",
          isDeleted: false,
        },
      ]);

      // receiver side: mark delivered + seen
      if (senderId !== userId) {
        socket.emit("messageDelivered", { messageId: _id });
        setTimeout(() => {
          socket.emit("messageSeen", { messageId: _id });
        }, 700);
      }
    };

    const onTyping = ({ userId: typerId }) => {
      if (typerId !== userId) {
        setIsTyping(true);
      }
    };

    const onStopTyping = ({ userId: typerId }) => {
      if (typerId !== userId) {
        setIsTyping(false);
      }
    };

    const onStatusUpdated = ({ messageId, status }) => {
      setMessages((prev) =>
        prev.map((m) =>
          m._id === messageId ? { ...m, status } : m
        )
      );
    };

    const onMessageDeleted = ({ messageId }) => {
      setMessages((prev) =>
        prev.map((m) =>
          m._id === messageId
            ? { ...m, isDeleted: true, text: "This message was deleted" }
            : m
        )
      );
    };

    const onUserOnlineStatus = ({ userId: uId, isOnline }) => {
      if (uId === targetUserId) {
        setIsTargetOnline(isOnline);
      }
    };

    socket.on("messageReceived", onMessageReceived);
    socket.on("typing", onTyping);
    socket.on("stopTyping", onStopTyping);
    socket.on("messageStatusUpdated", onStatusUpdated);
    socket.on("messageDeleted", onMessageDeleted);
    socket.on("userOnlineStatus", onUserOnlineStatus);

    return () => {
      socket.off("messageReceived", onMessageReceived);
      socket.off("typing", onTyping);
      socket.off("stopTyping", onStopTyping);
      socket.off("messageStatusUpdated", onStatusUpdated);
      socket.off("messageDeleted", onMessageDeleted);
      socket.off("userOnlineStatus", onUserOnlineStatus);
      disconnectSocket();
    };
  }, [userId, targetUserId, user?.firstName]);

  // auto-scroll
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!newMessage.trim()) return;
    if (!userId || !targetUserId) return;

    const socket = getSocket();
    const text = newMessage.trim();

    socket.emit("sendMessage", {
      firstName: user.firstName,
      userId,
      targetUserId,
      text,
    });

    setNewMessage("");
    socket.emit("stopTyping", { userId, targetUserId });
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setNewMessage(value);

    if (!userId || !targetUserId) return;
    const socket = getSocket();

    socket.emit("typing", { userId, targetUserId });

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("stopTyping", { userId, targetUserId });
    }, 800);
  };

  // 🗑️ delete for everyone (only your messages)
  const handleDelete = (messageId) => {
    const socket = getSocket();
    socket.emit("deleteMessage", { messageId });
  };

  // show status only for your LAST message
  const getLastSelfStatus = () => {
    const selfMessages = messages.filter((m) => m.self);
    if (selfMessages.length === 0) return null;
    return selfMessages[selfMessages.length - 1].status || "sent";
  };

  const lastStatus = getLastSelfStatus();

  const renderStatusLabel = (status) => {
    if (!status) return null;
    if (status === "sent") return "Sent";
    if (status === "delivered") return "Delivered";
    if (status === "seen") return "Seen";
    return status;
  };

  return (
    <div className="w-1/2 mx-auto border border-gray-600 m-5 h-[70vh] flex flex-col">
      <div className="p-5 border-b border-gray-600 flex justify-between items-center">
        <h1 className="font-semibold">Chat</h1>
        <span className="text-sm">
          {isTargetOnline ? (
            <span className="text-green-400">● Online</span>
          ) : (
            <span className="text-gray-400">Offline</span>
          )}
        </span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg._id}
            className={`chat ${msg.self ? "chat-end" : "chat-start"}`}
          >
            <div className="chat-header">
              {msg.from}
              <time className="text-xs opacity-60 ml-2">
                {formatTime(msg.createdAt)}
              </time>
            </div>

            <div className="flex items-center gap-2">
              <div
                className={`chat-bubble ${
                  msg.isDeleted ? "opacity-70 italic" : ""
                }`}
              >
                {msg.text}
              </div>

              {/* delete button only for own non-deleted messages */}
              {msg.self && !msg.isDeleted && (
                <button
                  className="btn btn-xs btn-ghost"
                  onClick={() => handleDelete(msg._id)}
                >
                  🗑
                </button>
              )}
            </div>
          </div>
        ))}

        {isTyping && (
          <p className="text-xs text-gray-400 italic mb-2">
            Typing...
          </p>
        )}

        {messages.length === 0 && !isTyping && (
          <p className="text-center text-gray-400">
            Start the conversation 🚀
          </p>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Status of last sent message */}
      {lastStatus && (
        <div className="text-right text-xs text-gray-400 pr-6 -mt-2">
          {renderStatusLabel(lastStatus)}
        </div>
      )}

      {/* Input */}
      <div className="p-5 border-t border-gray-600 flex items-center gap-2">
        <input
          className="flex-1 border border-gray-500 text-white rounded p-2 bg-transparent outline-none"
          placeholder="Type a message…"
          value={newMessage}
          onChange={handleChange}
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
