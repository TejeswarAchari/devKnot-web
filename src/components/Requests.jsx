

import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import BASE_URL from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addRequests, removeRequests } from "../utils/requestSlice";
import { OnlineStatusContext } from "../context/OnlineStatusContext";

const getInitials = (firstName = "", lastName = "") => {
  const f = (firstName || "").trim();
  const l = (lastName || "").trim();
  if (!f && !l) return "?";
  return `${f.charAt(0)}${l.charAt(0)}`.toUpperCase();
};

const normalizeSkills = (skills) => {
  if (!skills) return [];
  if (Array.isArray(skills)) return skills.filter(Boolean);
  return String(skills)
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
};

// helper to resolve the actual user object from the request
const resolveUserFromRequest = (req) => {
  if (!req) return null;

  if (req.fromUserId && req.fromUserId.firstName) return req.fromUserId;
  if (req.fromUser && req.fromUser.firstName) return req.fromUser;
  if (req.sender && req.sender.firstName) return req.sender;
  if (req.user && req.user.firstName) return req.user;
  if (req.creator && req.creator.firstName) return req.creator;
  if (req.firstName) return req;

  return null;
};

const Requests = () => {
  const dispatch = useDispatch();

  const requests = useSelector((store) => store.requests);
  const [loading, setLoading] = useState(false);

  // 🔗 online + lastSeen from context
  const { onlineUsers, lastSeenMap, formatLastSeen } =
    useContext(OnlineStatusContext) || {};

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BASE_URL}user/requests/received`, {
        withCredentials: true,
      });

      const list = res?.data?.data || [];
      dispatch(addRequests(list));
    } catch (err) {
      console.error("Error fetching requests:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleReview = async (status, requestId) => {
    try {
      await axios.post(
        `${BASE_URL}request/review/${status}/${requestId}`,
        {},
        { withCredentials: true }
      );
      dispatch(removeRequests(requestId));
    } catch (err) {
      console.error("Error reviewing request:", err);
    }
  };

  useEffect(() => {
    fetchRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderEmptyState = () => (
    <div className="flex flex-1 items-center justify-center px-4 py-10">
      <div className="max-w-md text-center space-y-4">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-yellow-300 via-amber-400 to-neutral-900 bg-clip-text text-transparent">
          No pending requests 💌
        </h2>
        <p className="text-sm text-base-content/70">
          You don&apos;t have any new dev connection requests right now. Once
          someone is interested in pairing up with you, their request will show
          up here.
        </p>
      </div>
    </div>
  );

  const requestList = Array.isArray(requests) ? requests : requests || [];

  // shimmer for loading
  const renderShimmer = () => (
    <div className="grid gap-4 md:grid-cols-2">
      {Array.from({ length: 4 }).map((_, idx) => (
        <div
          key={idx}
          className="relative overflow-hidden rounded-3xl bg-[radial-gradient(circle_at_top,_rgba(250,204,21,0.35),transparent_60%),radial-gradient(circle_at_bottom,_rgba(15,23,42,0.95),transparent_55%)] p-[1.5px]"
        >
          <div className="flex h-full flex-col gap-3 rounded-3xl bg-gradient-to-b from-slate-900/95 via-slate-900/98 to-black/95 p-4">
            <div className="flex items-center gap-3">
              <div className="avatar">
                <div className="w-12 rounded-full bg-slate-800 animate-pulse" />
              </div>
              <div className="flex-1 space-y-2">
                <div className="h-3 w-24 rounded-full bg-slate-800 animate-pulse" />
                <div className="h-2 w-40 rounded-full bg-slate-800/80 animate-pulse" />
              </div>
            </div>
            <div className="h-2 w-full rounded-full bg-slate-800/70 animate-pulse" />
            <div className="flex gap-2 mt-2">
              <div className="h-7 flex-1 rounded-full bg-slate-800 animate-pulse" />
              <div className="h-7 flex-1 rounded-full bg-slate-800 animate-pulse" />
            </div>
          </div>
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
              Incoming Requests
            </p>
            <h1 className="mt-2 text-3xl font-extrabold tracking-tight bg-gradient-to-r from-yellow-300 via-amber-400 to-neutral-900 bg-clip-text text-transparent">
              Devs who want to connect
            </h1>
            <p className="mt-1 text-sm text-base-content/70">
              Review requests from developers who find your profile interesting.
              Accept to add them to your connections, or skip for now.
            </p>
          </div>

          {requestList.length > 0 && (
            <div className="mt-2 self-start rounded-full bg-base-200/80 px-3 py-1 text-xs font-medium text-base-content/70 backdrop-blur">
              {requestList.length} pending request
              {requestList.length > 1 ? "s" : ""}
            </div>
          )}
        </header>

        {loading && renderShimmer()}

        {!loading && requestList.length === 0 && renderEmptyState()}

        {!loading && requestList.length > 0 && (
          <div className="grid gap-4 md:grid-cols-2">
            {requestList.map((req) => {
              const profile = resolveUserFromRequest(req);
              if (!profile) return null;

              const {
                _id,
                firstName,
                lastName,
                photoUrl,
                about,
                skills,
                gender,
              } = profile;

              const initials = getInitials(firstName, lastName);
              const skillList = normalizeSkills(skills).slice(0, 6);

              const isOnline = !!onlineUsers?.[_id];
              const lastSeenIso = lastSeenMap?.[_id];
              const lastSeenText =
                !isOnline && lastSeenIso && formatLastSeen
                  ? formatLastSeen(lastSeenIso)
                  : null;

              return (
                <div
                  key={req._id || _id}
                  className="group relative overflow-hidden rounded-3xl bg-[radial-gradient(circle_at_top,_rgba(250,204,21,0.35),transparent_60%),radial-gradient(circle_at_bottom,_rgba(15,23,42,0.95),transparent_55%)] p-[1.5px] shadow-[0_18px_40px_rgba(0,0,0,0.9)]"
                >
                  <div className="flex h-full flex-col gap-3 rounded-3xl bg-gradient-to-b from-slate-900/95 via-slate-900/98 to-black/95 p-4 backdrop-blur-2xl transition-transform duration-200 group-hover:-translate-y-[2px]">
                    <div className="flex items-center gap-3">
                      <div className="avatar relative">
                        <div className="w-12 rounded-full ring ring-offset-2 ring-offset-slate-900 ring-amber-400/80 overflow-hidden">
                          {photoUrl ? (
                            <img
                              src={photoUrl}
                              alt={`${firstName} ${lastName}`}
                            />
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
                      <div className="flex-1">
                        <h2 className="text-base font-semibold text-base-content">
                          {firstName} {lastName}
                        </h2>
                        <p className="text-xs text-base-content/60 flex items-center gap-1">
                          {gender || "Developer"}
                          <span>•</span>
                          {isOnline ? (
                            <span className="inline-flex items-center gap-1 text-emerald-300">
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                              Online now
                            </span>
                          ) : lastSeenText ? (
                            <span className="text-[11px] text-slate-300">
                              {lastSeenText}
                            </span>
                          ) : (
                            "wants to collaborate"
                          )}
                        </p>
                      </div>
                    </div>

                    <p className="line-clamp-3 text-xs text-slate-200/85">
                      {about && about.trim().length > 0
                        ? about
                        : "No intro added yet, but this dev is interested in collaborating with you."}
                    </p>

                    {skillList.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {skillList.map((skill) => (
                          <span
                            key={skill}
                            className="badge badge-xs border border-amber-400/45 bg-slate-900/80 text-[10px] font-medium uppercase tracking-wide text-amber-100/90 backdrop-blur"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="mt-2 flex items-center justify-between gap-3">
                      <button
                        type="button"
                        onClick={() =>
                          handleReview("rejected", req._id || req.requestId)
                        }
                        className="btn btn-ghost btn-sm flex-1 rounded-full border border-slate-700/80 text-xs font-semibold text-red-400 hover:border-red-500/70 hover:bg-red-500/10"
                      >
                        Reject
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          handleReview("accepted", req._id || req.requestId)
                        }
                        className="btn btn-sm flex-1 rounded-full border-none bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 text-xs font-semibold text-neutral-900 shadow-lg shadow-amber-500/40 hover:brightness-110"
                      >
                        Accept &amp; Connect
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Requests;
