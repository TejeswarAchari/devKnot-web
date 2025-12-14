// src/components/NetworkStatusToast.jsx
import React, { useEffect, useState, useRef } from "react";
import { useNetworkStatus } from "../hooks/useNetworkStatus";

export default function NetworkStatusToast() {
  const isOnline = useNetworkStatus();
  const [visible, setVisible] = useState(false);
  const [mode, setMode] = useState("offline"); // "offline" | "back"
  const prevOnlineRef = useRef(isOnline);
  const timerRef = useRef(null);

  // Responding to external system changes (network status)
  // setState here is correct pattern for synchronizing with external state
  useEffect(() => {
    const wasOffline = !prevOnlineRef.current;
    prevOnlineRef.current = isOnline;

    // Clear any existing timer
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    if (!isOnline) {
      // User went offline - show immediately
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setMode("offline");
       
      setVisible(true);
    } else if (wasOffline) {
      // User came back online - show "back online" message
       
      setMode("back");
       
      setVisible(true);
      // Hide after 3 seconds
      timerRef.current = setTimeout(() => {
        setVisible(false);
      }, 3000);
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [isOnline]);

  if (!visible) return null;

  const isBack = mode === "back";

  return (
    <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50">
      <div
        className={`px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 
        ${isBack ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}
      >
        <span className="text-xl">⚡</span>
        <div className="flex flex-col">
          <span className="font-semibold text-sm">
            {isBack ? "Back online" : "You’re offline"}
          </span>
          <span className="text-xs opacity-90">
            {isBack
              ? "We’re re-syncing your actions."
              : "We’ll keep your actions safe and sync when you’re back."}
          </span>
        </div>
      </div>
    </div>
  );
}