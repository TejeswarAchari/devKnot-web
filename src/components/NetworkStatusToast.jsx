// src/components/NetworkStatusToast.jsx
import React, { useEffect, useState } from "react";
import { useNetworkStatus } from "../hooks/useNetworkStatus";

export default function NetworkStatusToast() {
  const isOnline = useNetworkStatus();
  const [visible, setVisible] = useState(false);
  const [mode, setMode] = useState("offline"); // "offline" | "back"

  useEffect(() => {
    if (!isOnline) {
      setMode("offline");
      setVisible(true);
    } else {
      // When it comes back online, show "Back online" for a few seconds
      if (visible) {
        setMode("back");
        const timer = setTimeout(() => setVisible(false), 3000);
        return () => clearTimeout(timer);
      }
    }
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