// src/components/NavBar.jsx
import axios from "axios";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, NavLink, useNavigate } from "react-router-dom";
import BASEURL from "../utils/constants";
import { removeUser } from "../utils/userSlice";
import { disconnectSocket } from "../utils/socket";

const getInitials = (firstName = "", lastName = "") => {
  const f = (firstName || "").trim();
  const l = (lastName || "").trim();
  if (!f && !l) return "?";
  return `${f.charAt(0)}${l.charAt(0)}`.toUpperCase();
};

const NavBar = () => {
  const user = useSelector((state) => state.user);
  const notifications = useSelector((state) => state.notification);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      await axios.post(
        BASEURL + "logout",
        {},
        {
          withCredentials: true,
        }
      );
    } catch (err) {
      console.log(err);
    } finally {
      dispatch(removeUser());
      disconnectSocket();
      navigate("/login");
    }
  };

  // total unread count
  const unreadTotal = (() => {
    if (!notifications) return 0;
    if (typeof notifications === "number") return notifications;
    if (Array.isArray(notifications)) {
      return notifications.reduce((sum, idOrObj) => {
        if (typeof idOrObj === "number" || typeof idOrObj === "string") {
          return sum + 1;
        }
        const c = idOrObj.count || idOrObj.unread || 0;
        return sum + (typeof c === "number" ? c : 0);
      }, 0);
    }
    if (typeof notifications === "object") {
      return Object.values(notifications).reduce((sum, v) => {
        if (typeof v === "number") return sum + v;
        const c =
          typeof v?.count === "number"
            ? v.count
            : typeof v?.unread === "number"
            ? v.unread
            : 0;
        return sum + c;
      }, 0);
    }
    return 0;
  })();

  const initials = getInitials(user?.firstName, user?.lastName);

  return (
    <nav className="fixed inset-x-0 top-0 z-30 border-b border-slate-800/80 bg-gradient-to-r from-slate-950/95 via-slate-900/98 to-slate-950/95 backdrop-blur-xl shadow-[0_6px_18px_rgba(0,0,0,0.65)]">
      <div className="mx-auto flex h-14 w-full max-w-7xl items-center justify-between px-3 sm:px-4">
        {/* Brand */}
        <div className="flex items-center gap-2">
          <Link
            to="/"
            className="flex items-center gap-2 rounded-xl px-2 py-1 hover:bg-slate-800/60 transition-colors"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-300 via-yellow-400 to-amber-500 text-xs font-bold text-neutral-900 shadow-[0_0_18px_rgba(250,204,21,0.65)]">
              <span><img src="logo.png"/></span>
            </div>
            <div className="hidden flex-col leading-tight sm:flex">
              <span className="text-sm font-semibold tracking-tight text-slate-50">
                DevKnot
              </span>
              <span className="text-[10px] text-slate-300/80">
                Match, connect &amp; build.
              </span>
            </div>
          </Link>
        </div>

        {/* Center nav links (desktop) */}
        {user && (
          <div className="hidden items-center gap-1 rounded-full bg-slate-800/70 px-2 py-1 text-xs font-medium backdrop-blur sm:flex shadow-[0_0_22px_rgba(15,23,42,0.85)]">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `px-3 py-1 rounded-full transition ${
                  isActive
                    ? "bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 text-neutral-900 shadow-[0_0_18px_rgba(250,204,21,0.7)]"
                    : "text-slate-200/80 hover:text-slate-50 hover:bg-slate-700/70"
                }`
              }
            >
              Discover
            </NavLink>
            <NavLink
              to="/connections"
              className={({ isActive }) =>
                `px-3 py-1 rounded-full transition ${
                  isActive
                    ? "bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 text-neutral-900 shadow-[0_0_18px_rgba(250,204,21,0.7)]"
                    : "text-slate-200/80 hover:text-slate-50 hover:bg-slate-700/70"
                }`
              }
            >
              Connections
            </NavLink>
            <NavLink
              to="/requests"
              className={({ isActive }) =>
                `relative px-3 py-1 rounded-full transition ${
                  isActive
                    ? "bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 text-neutral-900 shadow-[0_0_18px_rgba(250,204,21,0.7)]"
                    : "text-slate-200/80 hover:text-slate-50 hover:bg-slate-700/70"
                }`
              }
            >
              Requests
              {unreadTotal > 0 && (
                <span className="absolute -right-1 -top-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-semibold text-red-50 shadow-[0_0_10px_rgba(248,113,113,0.9)]">
                  {unreadTotal > 9 ? "9+" : unreadTotal}
                </span>
              )}
            </NavLink>
            <NavLink
              to="/profile"
              className={({ isActive }) =>
                `px-3 py-1 rounded-full transition ${
                  isActive
                    ? "bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 text-neutral-900 shadow-[0_0_18px_rgba(250,204,21,0.7)]"
                    : "text-slate-200/80 hover:text-slate-50 hover:bg-slate-700/70"
                }`.replace("_del", "")
              }
            >
              Profile
            </NavLink>
          </div>
        )}

        {/* Right side: user / login */}
        <div className="flex items-center gap-2">
          {!user && (
            <button
              onClick={() => navigate("/login")}
              className="btn btn-xs rounded-full border-none bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 text-[11px] font-semibold text-neutral-900 shadow-[0_0_18px_rgba(250,204,21,0.7)] hover:brightness-110"
            >
              Log in
            </button>
          )}

          {user && (
            <>
              <div className="hidden flex-col text-right leading-tight sm:flex">
                <span className="text-xs font-semibold text-slate-50">
                  {user.firstName} {user.lastName}
                </span>
                <span className="text-[10px] text-slate-300/80">
                  {user.role || "Developer"}
                </span>
              </div>

              <div className="dropdown dropdown-end">
                <label
                  tabIndex={0}
                  className="btn btn-ghost btn-circle avatar"
                  aria-label="Profile menu"
                >
                  <div className="w-9 rounded-full ring ring-offset-2 ring-offset-slate-900 ring-amber-400/80 overflow-hidden shadow-[0_0_18px_rgba(250,204,21,0.85)]">
                    {user.photoUrl ? (
                      <img src={user.photoUrl} alt="Profile" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-700 via-slate-500 to-slate-400 text-[11px] font-semibold text-slate-50">
                        {initials}
                      </div>
                    )}
                  </div>
                </label>
                <ul
                  tabIndex={0}
                  className="menu menu-sm dropdown-content z-40 mt-2 w-52 rounded-2xl bg-slate-900/95 p-2 text-xs text-slate-100 shadow-[0_18px_40px_rgba(0,0,0,0.85)] backdrop-blur-xl"
                >
                  <li className="mb-1">
                    <span className="flex flex-col text-[11px] leading-tight text-slate-300/90">
                      Signed in as
                      <span className="font-semibold text-slate-50">
                        {user.email || "dev@devknot.app"}
                      </span>
                    </span>
                  </li>
                  <li>
                    <Link to="/profile" className="justify-between">
                      Profile
                      <span className="badge badge-xs bg-amber-400/80 border-none text-[9px] text-neutral-900">
                        Edit
                      </span>
                    </Link>
                  </li>
                  <li>
                    <Link to="/connections">Connections</Link>
                  </li>
                  <li>
                    <Link to="/requests">Requests</Link>
                  </li>
                  <li>
                    <button
                      onClick={handleLogout}
                      className="text-red-400 hover:text-red-300"
                    >
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
