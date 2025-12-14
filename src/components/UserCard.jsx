import React, { memo } from "react";

/**
 * UserCard
 * - Pure presentational card for a single user.
 * - When `onSendRequest` is provided, shows Tinder-style
 *   Interested / Ignore circular buttons.
 * - When used in Profile preview, it simply renders the card
 *   without any actions.
 */
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

const UserCard = ({ user, onSendRequest }) => {
  if (!user) return null;

  const { _id, firstName, lastName, photoUrl, age, gender, about, skills } =
    user;

  const skillList = normalizeSkills(skills).slice(0, 8);
  const initials = getInitials(firstName, lastName);

  const handleClick = (status) => {
    if (onSendRequest && _id) {
      onSendRequest(status, _id);
    }
  };

  return (
    <div className="relative flex h-full w-full items-center justify-center">
      {/* Outer subtle glow frame (no harsh black border) */}
      <div className="relative h-full w-full rounded-[32px] bg-[radial-gradient(circle_at_top,_rgba(251,191,36,0.4),transparent_65%),radial-gradient(circle_at_bottom,_rgba(15,23,42,0.9),transparent_60%)] p-[1.5px] shadow-[0_20px_50px_rgba(0,0,0,0.85)]">
        {/* Inner glass card */}
        <div className="flex h-full w-full flex-col overflow-hidden rounded-[30px] border border-white/8 bg-gradient-to-b from-slate-900/95 via-slate-900/98 to-slate-950/98 backdrop-blur-2xl">
          {/* IMAGE / AVATAR SECTION */}
          <div className="relative h-[58%] w-full">
            {photoUrl ? (
              <img
                src={photoUrl}
                alt={`${firstName} ${lastName}`}
                className="h-full w-full object-cover"
                draggable="false"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-b from-slate-800 via-slate-900 to-black">
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-amber-300 via-yellow-400 to-amber-600 text-3xl font-semibold text-slate-900 shadow-lg shadow-black/70">
                  {initials}
                </div>
              </div>
            )}

            {/* soft fade from image into content */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/80 via-black/35 to-transparent" />

            {/* NAME + QUICK INFO */}
            <div className="absolute inset-x-0 bottom-0 px-5 pb-4">
              <div className="flex items-end justify-between gap-2">
                <div>
                  <h2 className="text-2xl font-semibold text-slate-50 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
                    {firstName} {lastName}
                  </h2>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-200/80">
                    {gender && age
                      ? `${gender} • ${age}`
                      : gender || (age ? `${age}` : "Developer")}
                  </p>
                </div>

                {age && (
                  <span className="rounded-full bg-black/75 px-3 py-1 text-[11px] font-semibold text-amber-300 shadow-md shadow-black/70">
                    {age} yrs
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* INFO / SKILLS / ACTIONS */}
          <div className="flex flex-1 flex-col gap-3 px-5 pb-4 pt-3 bg-gradient-to-b from-slate-950/60 via-slate-950/90 to-black/90">
            <p className="line-clamp-3 text-sm leading-relaxed text-slate-200/85">
              {about && about.trim().length > 0
                ? about
                : "This dev hasn't added a bio yet, but might be your next teammate for that side project."}
            </p>

            {skillList.length > 0 && (
              <div className="mt-1 flex flex-wrap gap-2">
                {skillList.map((skill) => (
                  <span
                    key={skill}
                    className="badge badge-sm border border-amber-400/45 bg-slate-900/80 text-[11px] font-medium uppercase tracking-wide text-amber-100/90 backdrop-blur"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            )}

            {/* ACTION BUTTONS – only when used in Feed (swipe mode) */}
            {onSendRequest && (
              <div className="mt-auto flex items-center justify-between gap-6 pt-2">
                {/* Ignore button */}
                <button
                  type="button"
                  onClick={() => handleClick("ignored")}
                  className="btn btn-circle border-none bg-slate-900/90 text-red-400 shadow-lg shadow-red-900/50 transition-transform duration-150 hover:scale-110 hover:bg-red-500 hover:text-base-100 active:scale-95"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>

                {/* Interested button */}
                <button
                  type="button"
                  onClick={() => handleClick("interested")}
                  className="btn btn-circle border-none bg-gradient-to-tr from-amber-300 via-yellow-400 to-amber-500 text-neutral-900 shadow-lg shadow-amber-700/60 transition-transform duration-150 hover:scale-110 active:scale-95"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-7 w-7"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 3 13.1 3 10.5 3 8.015 4.985 6 7.5 6A4.5 4.5 0 0112 8.027 4.5 4.5 0 0116.5 6C19.015 6 21 8.015 21 10.5c0 2.6-1.688 4.86-3.989 6.997a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.218l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(UserCard);
