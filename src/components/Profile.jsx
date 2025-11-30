import React from "react";
import { useSelector } from "react-redux";
import EditProfile from "./EditProfile";

/**
 * Profile.jsx
 *
 * Wrapper that:
 * - Reads the logged-in user from Redux.
 * - Shows a premium layout header.
 * - Passes `user` down to <EditProfile user={user} />.
 */

const Profile = () => {
  const user = useSelector((store) => store.user);

  if (!user) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <span className="loading loading-dots loading-lg text-secondary" />
      </div>
    );
  }

  return (
    <div className="relative flex flex-1 flex-col px-4 pt-6 pb-10">
      {/* Yellow + black background glow */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(250,204,21,0.16),transparent_60%),radial-gradient(circle_at_bottom,_rgba(15,23,42,0.92),transparent_55%)]" />

      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <header className="space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-base-200/70 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-base-content/70 backdrop-blur">
            <span className="inline-block h-2 w-2 rounded-full bg-yellow-400 animate-pulse" />
            Your DevKnot profile
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-yellow-300 via-amber-400 to-neutral-900 bg-clip-text text-transparent">
            Tell other devs who you are.
          </h1>
          <p className="max-w-xl text-sm text-base-content/70">
            This is what other developers see before swiping on you. Add a clean
            photo, a short about, and basic details so the right builders can
            find you.
          </p>
        </header>

        {/* EditProfile handles the actual form + API call */}
        <EditProfile user={user} />
      </div>
    </div>
  );
};

export default Profile;
