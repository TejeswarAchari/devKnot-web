
import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import BASE_URL from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addConnections } from "../utils/connectionSlice";
import { Link } from "react-router-dom";
import { OnlineStatusContext } from "./Body";

const getInitials = (firstName = "", lastName = "") => {
  const f = (firstName || "").trim();
  const l = (lastName || "").trim();
  if (!f && !l) return "?";
  return `${f.charAt(0)}${l.charAt(0)}`.toUpperCase();
};

// reuse your old resolveUser logic
const resolveUser = (connection) => {
  if (!connection) return null;

  if (connection.firstName) return connection;

  if (connection.fromUserId && connection.fromUserId.firstName) {
    return connection.fromUserId;
  }
  if (connection.toUserId && connection.toUserId.firstName) {
    return connection.toUserId;
  }

  return null;
};

const Connections = () => {
  const dispatch = useDispatch();

  // Redux slices
  const connections = useSelector((store) => store.connections);
  const notifications = useSelector(
    (store) => store.notifications || store.notification
  );

  const [loading, setLoading] = useState(false);

  // 🔗 online + lastSeen from context
  const { onlineUsers, lastSeenMap, formatLastSeen } =
    useContext(OnlineStatusContext) || {};

  const fetchConnections = async () => {
    try {
      setLoading(true);
      const res = await axios.get(BASE_URL + "user/connections", {
        withCredentials: true,
      });

      dispatch(addConnections(res.data.data));
    } catch (err) {
      console.error("Error fetching connections:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConnections();
  }, []);

  


  const getUnreadCount = (userId) => {
    if (!notifications) return 0;
    if (typeof notifications === "object" && !Array.isArray(notifications)) {
      return notifications[userId] || 0;
    }
    if (Array.isArray(notifications)) {
      const entry =
        notifications.find((n) => n.userId === userId) ||
        notifications.find((n) => n.fromUserId === userId);
      return entry?.count || entry?.unread || 0;
    }
    return 0;
  };

  const renderEmptyState = () => (
    <div className="flex flex-1 items-center justify-center px-4 py-10">
      <div className="max-w-md text-center space-y-4">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-yellow-300 via-amber-400 to-neutral-900 bg-clip-text text-transparent">
          No dev connections yet 👀
        </h2>
        <p className="text-sm text-base-content/70">
          Once you and another dev both show interest, they will appear here as
          a connection. Start swiping in Discover and accept some requests to
          build your DevKnot.
        </p>
      </div>
    </div>
  );

  const connectionList = Array.isArray(connections)
    ? connections
    : connections?.data || [];

  // 🦴 shimmer skeleton while loading first time
  const renderShimmer = () => (
    <div className="space-y-3">
      {Array.from({ length: 4 }).map((_, idx) => (
        <div
          key={idx}
          className="flex items-center gap-3 rounded-3xl bg-gradient-to-r from-slate-900/90 via-slate-900/95 to-slate-950/95 p-3"
        >
          <div className="avatar">
            <div className="w-12 rounded-full bg-slate-800 animate-pulse" />
          </div>
          <div className="flex-1 space-y-2">
            <div className="h-3 w-32 rounded-full bg-slate-800 animate-pulse" />
            <div className="h-2 w-48 rounded-full bg-slate-800/80 animate-pulse" />
          </div>
          <div className="h-7 w-20 rounded-full bg-slate-800 animate-pulse" />
        </div>
      ))}
    </div>
  );

  return (
    <div className="relative flex flex-1 flex-col px-4 pt-6 pb-10">
      {/* Yellow + black background */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(250,204,21,0.16),transparent_60%),radial-gradient(circle_at_bottom,_rgba(15,23,42,0.92),transparent_55%)]" />

      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
        <header className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-base-200/70 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-base-content/70 backdrop-blur">
              <span className="inline-block h-2 w-2 rounded-full bg-yellow-400 animate-pulse" />
              Your Connections
            </p>
            <h1 className="mt-2 text-3xl font-extrabold tracking-tight bg-gradient-to-r from-yellow-300 via-amber-400 to-neutral-900 bg-clip-text text-transparent">
              People you&apos;re building with
            </h1>
            <p className="mt-1 text-sm text-base-content/70">
              These are developers you&apos;ve matched with. Jump into a chat,
              share repos, and ship something together.
            </p>
          </div>

          {connectionList.length > 0 && (
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-base-200/80 px-3 py-1 text-xs font-medium text-base-content/70 backdrop-blur">
                {connectionList.length} connection
                {connectionList.length > 1 ? "s" : ""}
              </span>
            </div>
          )}
        </header>

        {loading && renderShimmer()}

        {!loading && connectionList.length === 0 && renderEmptyState()}

        {!loading && connectionList.length > 0 && (
          <div className="space-y-3">
            {connectionList.map((conn) => {
              const profile = resolveUser(conn);
              if (!profile) return null;

              const {
                _id,
                firstName,
                lastName,
                photoUrl,
                about,
                role,
                title,
              } = profile;

              const initials = getInitials(firstName, lastName);
              const targetUserId = _id;
              const unread = getUnreadCount(targetUserId);

              const isOnline = !!onlineUsers?.[targetUserId];
              const lastSeenIso = lastSeenMap?.[targetUserId];
              const lastSeenText =
                !isOnline && lastSeenIso && formatLastSeen
                  ? formatLastSeen(lastSeenIso)
                  : null;

              return (
                <div
                  key={conn._id || targetUserId}
                  className="group flex items-center gap-3 rounded-3xl bg-gradient-to-r from-slate-900/90 via-slate-900/95 to-slate-950/95 p-3 backdrop-blur-xl ring-1 ring-white/10 transition-transform duration-150 hover:-translate-y-[1px] hover:ring-amber-400/60"
                >
                  <div className="avatar relative">
                    <div className="w-12 rounded-full ring ring-offset-2 ring-offset-slate-900 ring-amber-400/80 overflow-hidden">
                      {photoUrl ? (
                        <img src={photoUrl} alt={`${firstName} ${lastName}`} />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-amber-300 via-yellow-400 to-amber-500 text-lg font-semibold text-slate-900">
                          {initials}
                        </div>
                      )}
                    </div>
                    {isOnline && (
                      <span className="absolute -right-0.5 -bottom-0.5 h-3 w-3 rounded-full border border-slate-900 bg-emerald-400 shadow-[0_0_0_3px_rgba(16,185,129,0.45)] animate-pulse" />
                    )}
                  </div>

                  <div className="flex flex-1 flex-col gap-0.5">
                    <div className="flex items-center gap-2">
                      <h2 className="text-sm font-semibold text-base-content">
                        {firstName} {lastName}
                      </h2>
                      {unread > 0 && (
                        <span className="badge badge-xs rounded-full bg-error/90 text-[10px] font-semibold text-error-content shadow-sm">
                          {unread > 9 ? "9+" : unread}
                        </span>
                      )}
                      {isOnline && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-300">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          Online
                        </span>
                      )}
                    </div>
                    <p className="line-clamp-1 text-[11px] text-base-content/60">
                      {role || title || "Dev connection"}
                      {" • "}
                      {isOnline
                        ? "Available to chat"
                        : lastSeenText ||
                          (about && about.trim().length > 0
                            ? about
                            : "Ready to collaborate on something cool.")}
                    </p>
                  </div>

                  <Link
                    to={`/chat/${targetUserId}`}
                    className="btn btn-sm rounded-full border-none bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 text-[11px] font-semibold text-neutral-900 shadow-md shadow-amber-500/40 hover:brightness-110"
                  >
                    Open chat
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Connections;
