// import React from "react";
// import { useSelector } from "react-redux";
// import EditProfile from "./EditProfile";

// /**
//  * Profile.jsx
//  *
//  * Wrapper that:
//  * - Reads the logged-in user from Redux.
//  * - Shows a premium layout header.
//  * - Passes `user` down to <EditProfile user={user} />.
//  */

// const Profile = () => {
//   const user = useSelector((store) => store.user);

//   if (!user) {
//     return (
//       <div className="flex flex-1 items-center justify-center">
//         <span className="loading loading-dots loading-lg text-secondary" />
//       </div>
//     );
//   }

//   return (
//     <div className="relative flex flex-1 flex-col px-4 pt-6 pb-10">
//       {/* Yellow + black background glow */}
//       <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(250,204,21,0.16),transparent_60%),radial-gradient(circle_at_bottom,_rgba(15,23,42,0.92),transparent_55%)]" />

//       <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
//         <header className="space-y-2">
//           <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-base-200/70 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-base-content/70 backdrop-blur">
//             <span className="inline-block h-2 w-2 rounded-full bg-yellow-400 animate-pulse" />
//             Your DevKnot profile
//           </div>
//           <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-yellow-300 via-amber-400 to-neutral-900 bg-clip-text text-transparent">
//             Tell other devs who you are.
//           </h1>
//           <p className="max-w-xl text-sm text-base-content/70">
//             This is what other developers see before swiping on you. Add a clean
//             photo, a short about, and basic details so the right builders can
//             find you.
//           </p>
//         </header>

//         {/* EditProfile handles the actual form + API call */}
//         <EditProfile user={user} />
//       </div>
//     </div>
//   );
// };

// export default Profile;



// src/components/Profile.jsx
import React, { useState } from "react";
import { useSelector } from "react-redux";
import EditProfile from "./EditProfile";
// ⭐ NEW: imports for change-password API
import axios from "axios";
import BASE_URL from "../utils/constants";

/**
 * Profile.jsx
 *
 * Wrapper that:
 * - Reads the logged-in user from Redux.
 * - Shows a premium layout header.
 * - Passes `user` down to <EditProfile user={user} />.
 * - ⭐ Also shows a "Change Password" card (while logged in).
 */

const Profile = () => {
  const user = useSelector((store) => store.user);

  // ⭐ NEW: local state for change password form
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [pwLoading, setPwLoading] = useState(false);
  const [pwError, setPwError] = useState("");
  const [pwSuccess, setPwSuccess] = useState("");

  // ⭐ NEW: handler for password change
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPwError("");
    setPwSuccess("");

    if (!oldPassword || !newPassword) {
      setPwError("Please enter both old and new password.");
      return;
    }

    setPwLoading(true);
    try {
      await axios.patch(
        BASE_URL + "profile/password",
        { oldPassword, newPassword },
        { withCredentials: true }
      );

      setPwSuccess("Password updated successfully.");
      setOldPassword("");
      setNewPassword("");
    } catch (err) {
      const msg =
        err?.response?.data ||
        err?.response?.data?.message ||
        err?.message ||
        "Error updating password.";
      setPwError(typeof msg === "string" ? msg : "Error updating password.");
    } finally {
      setPwLoading(false);
    }
  };

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

        {/* ⭐ NEW: Change Password card */}
        <section className="mt-4">
          <div className="rounded-3xl bg-base-200/80 p-[1px] shadow-[0_16px_35px_rgba(15,23,42,0.9)] backdrop-blur-xl">
            <div className="rounded-3xl bg-base-200/95 px-5 py-4 sm:px-6 sm:py-5 flex flex-col gap-3">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <h2 className="text-sm font-semibold text-base-content">
                    Security &amp; Password
                  </h2>
                  <p className="text-[11px] text-base-content/70">
                    Update your password securely. You&apos;ll need your current
                    password to make changes.
                  </p>
                </div>
              </div>

              {/* Alerts */}
              {pwError && (
                <div className="rounded-2xl border border-error/40 bg-error/10 px-3 py-2 text-xs text-error">
                  {pwError}
                </div>
              )}
              {pwSuccess && (
                <div className="rounded-2xl border border-success/40 bg-success/10 px-3 py-2 text-xs text-success">
                  {pwSuccess}
                </div>
              )}

              <form
                onSubmit={handlePasswordChange}
                className="mt-1 grid gap-3 sm:grid-cols-3"
              >
                <div className="form-control sm:col-span-1">
                  <label className="label py-1">
                    <span className="label-text text-xs font-semibold">
                      Current password
                    </span>
                  </label>
                  <input
                    type="password"
                    className="input input-sm w-full rounded-xl border-base-300 bg-base-100/90 text-sm focus:border-secondary focus:outline-none"
                    placeholder="••••••••"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                  />
                </div>

                <div className="form-control sm:col-span-1">
                  <label className="label py-1">
                    <span className="label-text text-xs font-semibold">
                      New password
                    </span>
                  </label>
                  <input
                    type="password"
                    className="input input-sm w-full rounded-xl border-base-300 bg-base-100/90 text-sm focus:border-secondary focus:outline-none"
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                  <label className="label py-1">
                    <span className="label-text-alt text-[11px] text-base-content/60">
                      Use at least 8 characters. Strong passwords are recommended.
                    </span>
                  </label>
                </div>

                <div className="form-control sm:col-span-1 flex items-end">
                  <button
                    type="submit"
                    disabled={pwLoading}
                    className="btn btn-sm w-full rounded-xl border-none bg-gradient-to-r from-yellow-400 via-amber-500 to-neutral-900 text-xs font-semibold text-base-100 shadow-md shadow-amber-500/40 hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {pwLoading ? (
                      <>
                        <span className="loading loading-spinner loading-xs" />
                        <span className="ml-1">Updating...</span>
                      </>
                    ) : (
                      "Update password"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>
        {/* ⭐ END Change Password card */}
      </div>
    </div>
  );
};

export default Profile;
