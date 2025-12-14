

// src/components/Feed.jsx
import React, { useEffect, useState, useMemo, useCallback } from "react";
import axios from "axios";
import BASE_URL from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addFeed, removeUserFromFeed } from "../utils/feedSlice";
import UserCard from "./UserCard";
import TinderCard from "react-tinder-card";

/**
 * Feed = "Discover" screen
 */
const Feed = () => {
  const feed = useSelector((store) => store.feed);
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);

  const getFeed = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const res = await axios.get(BASE_URL + "feed", {
        withCredentials: true,
      });

      dispatch(addFeed(res.data));
    } catch (err) {
      console.error("Feed API Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getFeed();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?._id]);

  const handleSendRequest = useCallback(
    async (status, userId) => {
      try {
        await axios.post(
          `${BASE_URL}request/send/${status}/${userId}`,
          {},
          { withCredentials: true }
        );

        dispatch(removeUserFromFeed(userId));
      } catch (err) {
        console.error("Error sending request:", err);
      }
    },
    [dispatch]
  );

  const handleSwipe = useCallback(
    (direction, userObj) => {
      if (!userObj || !userObj._id) return;

      if (direction === "right") {
        handleSendRequest("interested", userObj._id);
      } else if (direction === "left") {
        handleSendRequest("ignored", userObj._id);
      }
    },
    [handleSendRequest]
  );

  // Memoize the visible feed stack to avoid unnecessary recalculations
  const visibleFeedStack = useMemo(() => {
    if (!feed || feed.length === 0) return [];
    // cap visible stack for performance + visual
    return feed.slice(0, 4).reverse();
  }, [feed]);

  // 🦴 Skeleton when loading initial feed
  if (loading && (!feed || feed.length === 0)) {
    return (
      <div className="relative flex flex-1 items-center justify-center px-4 pt-6 pb-10">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(250,204,21,0.2),transparent_60%),radial-gradient(circle_at_bottom,_rgba(15,23,42,0.9),transparent_55%)]" />

        <div className="flex w-full max-w-6xl flex-col items-center gap-10 lg:flex-row lg:items-stretch">
          {/* Text skeleton */}
          <div className="max-w-md w-full space-y-4">
            <div className="h-4 w-40 rounded-full bg-slate-800/70 animate-pulse" />
            <div className="h-8 w-3/4 rounded-full bg-slate-800/70 animate-pulse" />
            <div className="h-3 w-full rounded-full bg-slate-800/70 animate-pulse" />
            <div className="h-3 w-2/3 rounded-full bg-slate-800/70 animate-pulse" />
            <div className="mt-4 flex gap-2">
              <div className="h-5 w-24 rounded-full bg-slate-800/70 animate-pulse" />
              <div className="h-5 w-28 rounded-full bg-slate-800/70 animate-pulse" />
            </div>
          </div>

          {/* Card skeleton */}
          <div className="relative mt-4 h-[520px] w-full max-w-md lg:mt-0">
            <div className="absolute inset-0 rounded-[32px] bg-gradient-to-br from-amber-300/20 via-yellow-500/10 to-amber-300/25 p-[2px]">
              <div className="flex h-full w-full flex-col overflow-hidden rounded-[30px] bg-slate-900/90 backdrop-blur-xl">
                <div className="h-[58%] w-full bg-slate-800/80 animate-pulse" />
                <div className="flex flex-1 flex-col gap-3 px-5 pb-4 pt-4">
                  <div className="h-4 w-1/2 rounded-full bg-slate-800/80 animate-pulse" />
                  <div className="h-3 w-3/4 rounded-full bg-slate-800/80 animate-pulse" />
                  <div className="h-3 w-full rounded-full bg-slate-800/80 animate-pulse" />
                  <div className="mt-2 flex flex-wrap gap-2">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div
                        key={i}
                        className="h-5 w-16 rounded-full bg-slate-800/80 animate-pulse"
                      />
                    ))}
                  </div>
                  <div className="mt-auto flex items-center justify-between gap-6 pt-4">
                    <div className="h-12 w-12 rounded-full bg-slate-800/80 animate-pulse" />
                    <div className="h-14 w-14 rounded-full bg-slate-800/80 animate-pulse" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Empty state
  if (!loading && feed && feed.length === 0) {
    return (
      <div className="relative flex flex-1 items-center justify-center px-4 py-10">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(250,204,21,0.18),transparent_60%),radial-gradient(circle_at_bottom,_rgba(15,23,42,0.9),transparent_55%)]" />
        <div className="max-w-md w-full text-center space-y-4">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 bg-clip-text text-transparent">
            You&apos;re all caught up ✨
          </h1>
          <p className="text-sm text-slate-300/80">
            There are no new devs to connect with right now. Check back in a bit
            or invite your teammates to join DevKnot.
          </p>
        </div>
      </div>
    );
  }

  // Normal feed
  return (
    <div className="relative flex flex-1 items-center justify-center px-4 pt-6 pb-10">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(250,204,21,0.18),transparent_60%),radial-gradient(circle_at_bottom,_rgba(15,23,42,0.9),transparent_55%)]" />

      <div className="flex w-full max-w-6xl flex-col items-center gap-10 lg:flex-row lg:items-stretch">
        {/* Left copy */}
        <div className="max-w-md text-center lg:text-left space-y-3 lg:space-y-4">
          <p className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-slate-900/80 px-3 py-1 text-xs font-medium uppercase tracking-wide text-amber-300/90 backdrop-blur">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            Live Dev Suggestions
          </p>
          <h1 className="text-3xl sm:text-4xl font-extrabold leading-tight bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 bg-clip-text text-transparent">
            Swipe to meet your next
            <span className="block">favorite collaborator.</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-200/80">
            Discover developers who match your vibe, stack and energy. Swipe
            right to show interest, left to skip. Once you both connect, jump
            straight into chat and start building.
          </p>

          <div className="mt-3 flex flex-wrap items-center justify-center gap-2 lg:justify-start">
            <div className="badge badge-outline border-amber-400/60 bg-slate-900/70 text-[11px] text-amber-300">
              Swipe right = Interested 💛
            </div>
            <div className="badge badge-ghost border border-slate-700/80 bg-slate-900/70 text-[11px] text-slate-200/80">
              Swipe left = Skip 🚀
            </div>
          </div>
        </div>

        {/* Swipe stack */}
        <div className="relative mt-4 h-[520px] w-full max-w-md lg:mt-0">
          {visibleFeedStack.map((userObj, index) => (
            <TinderCard
              key={userObj._id}
              className="absolute inset-0 select-none touch-none"
              onSwipe={(dir) => handleSwipe(dir, userObj)}
              preventSwipe={["up", "down"]}
            >
              <div
                className="h-full w-full transition-transform duration-300"
                style={{
                  transform: `scale(${1 - index * 0.03}) translateY(${
                    index * 6
                  }px)`,
                }}
              >
                <UserCard user={userObj} onSendRequest={handleSendRequest} />
              </div>
            </TinderCard>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Feed;
