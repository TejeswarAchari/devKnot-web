import React from "react";
import { Link, useLocation } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();

  return (
    <div className="flex flex-1 items-center justify-center px-4 py-10">
      <div className="max-w-lg w-full text-center space-y-5">
        {/* Pill */}
        <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-base-200/70 px-4 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-base-content/70 backdrop-blur">
          <span className="inline-block h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
          Page not found • 404
        </div>

        {/* Heading */}
        <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight tracking-tight bg-gradient-to-r from-yellow-300 via-amber-400 to-neutral-900 bg-clip-text text-transparent">
          Oops — this page doesn&apos;t exist ⚠️
        </h1>

        {/* Path info */}
        {location?.pathname && (
          <p className="text-xs sm:text-sm text-base-content/50">
            We couldn&apos;t find{" "}
            <span className="font-mono text-amber-300">
              {location.pathname}
            </span>{" "}
            on DevKnot.
          </p>
        )}

        {/* Description */}
        <p className="text-sm sm:text-base text-base-content/70">
          The link you followed may be broken, or the page might have been
          moved. You&apos;re still all set — continue building your DevKnot below.
        </p>

        {/* Actions */}
        <div className="mt-3 flex flex-col items-center justify-center gap-3 sm:flex-row sm:justify-center">
          <Link
            to="/"
            className="btn rounded-full border-none bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 px-6 text-sm font-semibold text-neutral-900 shadow-lg shadow-amber-500/40 hover:brightness-110"
          >
            ⬅ Back to Discover
          </Link>

          <Link
            to="/profile"
            className="btn btn-ghost rounded-full border border-amber-400/50 px-6 text-sm font-semibold text-amber-200 hover:border-amber-400 hover:bg-amber-400/10"
          >
            Go to my Profile
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
