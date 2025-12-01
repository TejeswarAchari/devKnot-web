

// src/components/Chat.jsx
import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import BASE_URL from "../utils/constants";
import { getSocket } from "../utils/socket";
import { useSelector } from "react-redux";

const Chat = () => {
  const { targetUserId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isTargetOnline, setIsTargetOnline] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [loadingHistory, setLoadingHistory] = useState(true);

  const user = useSelector((state) => state.user);
  const userId = user?._id;

  const bottomRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const fileInputRef = useRef(null);

  const formatTime = (iso) => {
    if (!iso) return "";
    const d = new Date(iso);
    return d.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const resolveFileUrl = (url) => {
    if (!url) return null;
    if (url.startsWith("http")) return url;
    return `${BASE_URL}${url.replace(/^\//, "")}`;
  };

  // 1) Load history
  useEffect(() => {
    if (!userId || !targetUserId) return;

    const fetchHistory = async () => {
      try {
        setLoadingHistory(true);
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
            messageType: msg.messageType || "text",
            fileUrl: resolveFileUrl(msg.fileUrl),
            fileName: msg.fileName,
            mimeType: msg.mimeType,
            fileSize: msg.fileSize,
            photoUrl: msg.fromUserId?.photoUrl || null,
          };
        });

        setMessages(history);
      } catch (err) {
        console.error("Error loading history:", err);
      } finally {
        setLoadingHistory(false);
      }
    };

    fetchHistory();
  }, [userId, targetUserId]);

  // 2) Socket join + listeners
  useEffect(() => {
    if (!userId || !targetUserId) return;

    const socket = getSocket();

    // registerUser is already emitted globally in Body.jsx

    socket.emit("joinChat", {
      firstName: user.firstName,
      userId,
      targetUserId,
    });

    socket.emit("checkUserOnline", { targetUserId });

    const onMessageReceived = ({
      _id,
      firstName,
      userId: senderId,
      text,
      createdAt,
      status,
      messageType,
      fileUrl,
      fileName,
      mimeType,
      fileSize,
      photoUrl,
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
          messageType: messageType || "text",
          fileUrl: resolveFileUrl(fileUrl),
          fileName,
          mimeType,
          fileSize,
          photoUrl: photoUrl || null,
        },
      ]);

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
        prev.map((m) => (m._id === messageId ? { ...m, status } : m))
      );
    };

    const onMessageDeleted = ({ messageId }) => {
      setMessages((prev) =>
        prev.map((m) =>
          m._id === messageId
            ? {
                ...m,
                isDeleted: true,
                text: "This message was deleted",
                fileUrl: null,
                messageType: "text",
              }
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
      messageType: "text",
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

  const handleDelete = (messageId) => {
    const socket = getSocket();
    socket.emit("deleteMessage", { messageId });
  };

  const openFilePicker = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !userId || !targetUserId) return;

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await axios.post(`${BASE_URL}chat/upload`, formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      const { fileUrl, fileName, mimeType, fileSize } = res.data;

      const socket = getSocket();
      const fullUrl = resolveFileUrl(fileUrl);

      socket.emit("sendMessage", {
        firstName: user.firstName,
        userId,
        targetUserId,
        text: "",
        messageType: mimeType.startsWith("image/") ? "image" : "file",
        fileUrl: fullUrl,
        fileName,
        mimeType,
        fileSize,
      });
    } catch (err) {
      console.error("Error uploading file:", err);
    } finally {
      e.target.value = "";
    }
  };

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

  const partnerMessage = messages.find((m) => !m.self);
  const partnerName = partnerMessage?.from || "Dev Partner";
  const partnerPhotoUrl = partnerMessage?.photoUrl || null;

  return (
    <>
      <div className="relative flex flex-col flex-1 px-2 pt-6 pb-6 sm:px-4">
        {/* Gradient background */}
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(250,204,21,0.18),transparent_60%),radial-gradient(circle_at_bottom,_rgba(15,23,42,0.9),transparent_55%)]" />

        <div className="mx-auto w-full max-w-5xl">
          {/* Chat card */}
          <div className="flex h-[78vh] flex-col overflow-hidden rounded-3xl bg-gradient-to-b from-slate-950/95 via-slate-900/98 to-black/95 shadow-[0_18px_40px_rgba(0,0,0,0.9)] backdrop-blur-xl ring-1 ring-white/10">
            {/* HEADER */}
            <div className="flex items-center gap-3 border-b border-slate-800/80 bg-slate-950/90 px-4 py-3">
              <div className="avatar">
                <div className="w-10 rounded-full ring ring-offset-2 ring-offset-slate-950 ring-amber-400/80 overflow-hidden">
                  {partnerPhotoUrl ? (
                    <img
                      src={partnerPhotoUrl}
                      alt={partnerName}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-slate-800 text-xs text-slate-200">
                      👤
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-1 flex-col">
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-semibold text-slate-50">
                    {partnerName}
                  </h2>
                  {isTargetOnline ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-400">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Online
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full bg-slate-800/70 px-2 py-0.5 text-[10px] font-medium text-slate-300/70">
                      Offline
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-300/70">
                  {isTyping
                    ? "Typing..."
                    : isTargetOnline
                    ? "Say hi and share a repo."
                    : "They’ll see your message when they’re back online."}
                </p>
              </div>
            </div>

            {/* MESSAGES AREA */}
            <div className="relative flex-1 overflow-hidden">
              <div className="absolute inset-0 overflow-y-auto px-3 py-3 sm:px-4 sm:py-4">
                <div className="flex flex-col gap-2">
                  {/* 🦴 Skeleton while history loading */}
                  {loadingHistory && (
                    <>
                      {Array.from({ length: 6 }).map((_, idx) => (
                        <div
                          key={idx}
                          className={`flex w-full ${
                            idx % 2 === 0 ? "justify-start" : "justify-end"
                          }`}
                        >
                          <div
                            className={`${
                              idx % 2 === 0
                                ? "mr-auto bg-slate-800/80"
                                : "ml-auto bg-amber-400/40"
                            } h-8 w-40 max-w-[70%] rounded-2xl animate-pulse`}
                          />
                        </div>
                      ))}
                    </>
                  )}

                  {!loadingHistory &&
                    messages.map((msg) => {
                      const isOwn = msg.self;

                      const bubbleContent = msg.isDeleted ? (
                        <span className="italic opacity-80">{msg.text}</span>
                      ) : msg.messageType === "image" && msg.fileUrl ? (
                        <img
                          src={msg.fileUrl}
                          alt={msg.fileName || "image"}
                          className="max-w-xs max-h-64 rounded cursor-pointer"
                          onClick={() => setPreviewImage(msg.fileUrl)}
                        />
                      ) : msg.messageType === "file" && msg.fileUrl ? (
                        <a
                          href={msg.fileUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="underline text-[11px]"
                        >
                          📎 {msg.fileName || "Download file"}
                        </a>
                      ) : (
                        <span className="break-words">{msg.text}</span>
                      );

                      return (
                        <div
                          key={msg._id}
                          className={`flex w-full ${
                            isOwn ? "justify-end" : "justify-start"
                          }`}
                        >
                          <div className="flex items-center gap-1 sm:gap-2">
                            <div
                              className={
                                isOwn
                                  ? "ml-auto max-w-[80%] rounded-2xl bg-gradient-to-br from-amber-300 via-yellow-400 to-amber-500 px-3 py-2 text-xs text-neutral-900 shadow-lg shadow-amber-400/30"
                                  : "mr-auto max-w-[80%] rounded-2xl bg-slate-900/90 px-3 py-2 text-xs text-slate-100 shadow-md"
                              }
                            >
                              {bubbleContent}
                              <div
                                className={`mt-1 flex items-center gap-1 text-[9px] ${
                                  isOwn
                                    ? "justify-end text-neutral-900/80"
                                    : "justify-between text-slate-300/70"
                                }`}
                              >
                                <span>{formatTime(msg.createdAt)}</span>
                              </div>
                            </div>

                            {isOwn && !msg.isDeleted && (
                              <button
                                className="btn btn-xs btn-ghost text-slate-400 hover:text-red-400"
                                onClick={() => handleDelete(msg._id)}
                              >
                                🗑
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}

                  {!loadingHistory && messages.length === 0 && !isTyping && (
                    <p className="mt-4 text-center text-xs text-slate-300/60">
                      Start the conversation 🚀
                    </p>
                  )}

                  <div ref={bottomRef} />
                </div>
              </div>
            </div>

            {/* Last message status */}
            {lastStatus && (
              <div className="px-4 py-1 text-right text-[10px] text-slate-300/60 border-t border-slate-800/70 bg-slate-950/90">
                Last message: {renderStatusLabel(lastStatus)}
              </div>
            )}

            {/* INPUT BAR */}
            <form
              className="border-t border-slate-800/70 bg-slate-950/95 px-3 py-2 sm:px-4 sm:py-3"
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
            >
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileChange}
              />

              <div className="flex items-end gap-2 sm:gap-3">
                <button
                  type="button"
                  onClick={openFilePicker}
                  className="btn btn-circle btn-ghost btn-xs sm:btn-sm border-none bg-slate-900/80 text-slate-200/80 hover:bg-slate-800/90"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 sm:h-5 sm:w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 12.79V7a4 4 0 00-8 0v9a3 3 0 01-6 0V7"
                    />
                  </svg>
                </button>

                <div className="flex-1">
                  <div className="flex items-center rounded-2xl bg-slate-900/95 px-3 py-2 shadow-inner shadow-slate-800/80">
                    <textarea
                      rows={1}
                      className="textarea textarea-ghost h-8 min-h-0 flex-1 resize-none border-none bg-transparent px-0 py-0 text-xs sm:text-sm text-slate-100 focus:outline-none focus:ring-0"
                      placeholder="Say hi, share a repo, or pitch an idea..."
                      value={newMessage}
                      onChange={handleChange}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSend();
                        }
                      }}
                    />
                  </div>
                  <p className="mt-1 text-[10px] text-slate-400/70">
                    {isTyping && "Dev partner is typing..."}
                  </p>
                </div>

                <button
                  type="submit"
                  className="btn btn-circle border-none bg-gradient-to-tr from-amber-300 via-yellow-400 to-amber-500 text-neutral-900 shadow-lg shadow-amber-400/40 hover:brightness-110"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 sm:h-5 sm:w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 12l14-7-4 14-3-5-5-2z"
                    />
                  </svg>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {previewImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
          onClick={() => setPreviewImage(null)}
        >
          <img
            src={previewImage}
            alt="Preview"
            className="max-w-[90vw] max-h-[90vh] rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
};

export default Chat;
