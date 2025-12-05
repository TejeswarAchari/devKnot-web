import React, { useState } from "react";
import axios from "axios";
import BASE_URL from "../utils/constants";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useNavigate } from "react-router-dom";

/**
 * Login.jsx
 *
 * Combined Login / Signup screen with a premium,
 * yellow + black gradient + glassmorphism UI.
 */

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [mode, setMode] = useState("login"); // "login" | "signup"
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 🔐 extra states for password UI + validation
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [firstNameError, setFirstNameError] = useState("");

  const isLogin = mode === "login";

  const validatePassword = (value) => {
    // Only validate on signup
    if (isLogin) {
      setPasswordError("");
      return true;
    }

    const issues = [];
    if (value.length < 8) issues.push("at least 8 characters");
    if (!/[A-Z]/.test(value)) issues.push("one uppercase letter");
    if (!/\d/.test(value)) issues.push("one number");
    if (!/[!@#$%^&*()[\]{};:'\"\\|,.<>/?_\-+~=]/.test(value))
      issues.push("one special character");

    if (issues.length > 0) {
      setPasswordError(`Password must contain ${issues.join(", ")}.`);
      return false;
    }

    setPasswordError("");
    return true;
  };

  const validateFirstName = (value) => {
    // Only validate on signup
    if (isLogin) {
      setFirstNameError("");
      return true;
    }

    if (!value || value.trim().length < 4) {
      setFirstNameError("First name must be at least 4 characters.");
      return false;
    }

    setFirstNameError("");
    return true;
  };

  const handleChange = (e) => {
    setError("");
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "password") {
      validatePassword(value);
    }

    if (name === "firstName") {
      validateFirstName(value);
    }
  };

  const fetchAndStoreUser = async () => {
    try {
      const res = await axios.get(BASE_URL + "profile/view", {
        withCredentials: true,
      });

      // your backend earlier used res.data for user in Body.jsx
      const userData = res.data?.user || res.data?.data || res.data;
      dispatch(addUser(userData));
    } catch (err) {
      console.error("Error fetching profile after auth:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // 🚫 Extra guard: if signup and fields invalid, block submit
    if (!isLogin) {
      const isFirstNameValid = validateFirstName(formData.firstName);
      const isPasswordValid = validatePassword(formData.password);

      if (!isFirstNameValid || !isPasswordValid) {
        setLoading(false);
        return;
      }
    }

    try {
      const endpoint = isLogin ? "login" : "signup";

      const payload = isLogin
        ? {
            email: formData.email,
            password: formData.password,
          }
        : {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            password: formData.password,
          };

      // 1️⃣ Hit login / signup as usual
      await axios.post(BASE_URL + endpoint, payload, {
        withCredentials: true,
      });

      // 2️⃣ Immediately fetch the full, canonical profile
      await fetchAndStoreUser();

      // 3️⃣ Go to home (or profile if you prefer)
      navigate("/");
    } catch (err) {
      console.error("Auth error:", err?.response || err);

      const data = err?.response?.data;
      let rawMsg = "";

      // Support many possible backend formats
      if (typeof data === "string") {
        rawMsg = data;
      } else if (typeof data === "object" && data !== null) {
        rawMsg = data.message || data.error || data.msg || "";
      }

      let finalMsg = rawMsg || "Something went wrong. Please try again.";

      // 📨 Friendlier message for existing email on signup
      if (!isLogin) {
        const haystack =
          (rawMsg || "") + " " + (typeof data === "object" ? JSON.stringify(data) : "");
        const lower = haystack.toLowerCase();

        if (
          lower.includes("already") &&
          (lower.includes("email") ||
            lower.includes("user") ||
            lower.includes("exists") ||
            lower.includes("registered"))
        ) {
          finalMsg =
            "This email is already registered. Please log in instead.";
        }
      }

      setError(finalMsg);
    } finally {
      setLoading(false);
    }
  };

  const switchMode = (nextMode) => {
    if (mode === nextMode) return;
    setMode(nextMode);
    setError("");
    setPasswordError("");
    setFirstNameError("");
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-base-100">
      {/* 🔳 Background gradients: yellow + black vibes */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(250,204,21,0.45),transparent_60%),radial-gradient(circle_at_bottom,_rgba(15,23,42,0.9),transparent_55%)]" />

      {/* floating shapes – yellow glows instead of pink/blue */}
      <div className="pointer-events-none absolute -left-10 -top-10 h-40 w-40 rounded-full bg-yellow-400/35 blur-3xl" />
      <div className="pointer-events-none absolute -right-10 bottom-0 h-52 w-52 rounded-full bg-amber-500/30 blur-3xl" />

      <div className="z-10 flex w-full max-w-6xl flex-col gap-6 px-4 py-8 md:flex-row md:items-center md:justify-between">
        {/* LEFT: Brand / marketing copy */}
        <div className="mx-auto max-w-md text-center md:mx-0 md:text-left">
          <div className="inline-flex items-center gap-2 rounded-full bg-base-200/80 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-base-content/70 backdrop-blur">
            <span className="inline-block h-2 w-2 rounded-full bg-yellow-400 animate-pulse" />
            Welcome to DevKnot
          </div>
          <h1 className="mt-3 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
            <span className="bg-gradient-to-r from-yellow-300 via-amber-400 to-stone-900 bg-clip-text text-transparent">
              Match with devs,
            </span>
            <span className="block text-base-content">not just ideas.</span>
          </h1>
          <p className="mt-3 text-sm text-base-content/80 sm:text-base">
            DevKnot helps you discover developers who match your stack, style,
            and energy. Swipe, connect, and start building your next big thing
            together.
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-base-content/70">
            <div className="badge badge-secondary badge-outline">
              Real-time chat
            </div>
            <div className="badge badge-ghost">Tinder-like connections</div>
            <div className="badge badge-ghost">Built for dev collabs</div>
          </div>
        </div>

        {/* RIGHT: Auth card */}
        <div className="mx-auto mt-6 w-full max-w-md md:mt-0">
          <div className="relative rounded-3xl bg-base-200/80 p-[1px] shadow-[0_18px_45px_rgba(15,23,42,0.95)] backdrop-blur-xl">
            <div className="rounded-3xl bg-base-200/90 px-5 py-6 sm:px-7 sm:py-7">
              {/* Tabs: Login / Signup */}
              <div className="mb-5 flex items-center justify-between">
                <div className="flex gap-2 rounded-full bg-base-300/70 p-1">
                  <button
                    type="button"
                    onClick={() => switchMode("login")}
                    className={`flex-1 rounded-full px-4 py-1.5 text-xs font-semibold transition ${
                      isLogin
                        ? "bg-base-100 text-base-content shadow-sm"
                        : "text-base-content/60 hover:text-base-content"
                    }`}
                  >
                    Login
                  </button>
                  <button
                    type="button"
                    onClick={() => switchMode("signup")}
                    className={`flex-1 rounded-full px-4 py-1.5 text-xs font-semibold transition ${
                      !isLogin
                        ? "bg-base-100 text-base-content shadow-sm"
                        : "text-base-content/60 hover:text-base-content"
                    }`}
                  >
                    SignUp
                  </button>
                </div>
                <span className="text-[11px] text-base-content/60">
                  {isLogin ? "New here? Sign up →" : "Already a member? Log in →"}
                </span>
              </div>

              <h2 className="text-xl font-bold text-base-content">
                {isLogin ? "Welcome back 👋" : "Create your DevKnot account 🚀"}
              </h2>
              <p className="mt-1 text-xs text-base-content/70">
                {isLogin
                  ? "Log in to continue swiping, chatting and collaborating."
                  : "Sign up to discover devs who want to build with you."}
              </p>

              {/* Error alert */}
              {error && (
                <div className="mt-3 rounded-2xl border border-error/30 bg-error/10 px-3 py-2 text-xs text-error">
                  {error}
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="mt-4 space-y-3">
                {!isLogin && (
                  <div className="flex gap-3">
                    <div className="form-control w-1/2">
                      <label className="label py-1">
                        <span className="label-text text-xs font-semibold">
                          First name
                        </span>
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        className="input input-sm w-full rounded-xl border-base-300 bg-base-100/90 text-sm focus:border-secondary focus:outline-none"
                        placeholder="Elon"
                        autoComplete="given-name"
                      />
                      {/* First name validation message */}
                      {firstNameError && (
                        <p className="mt-1 text-[11px] text-error">
                          {firstNameError}
                        </p>
                      )}
                    </div>
                    <div className="form-control w-1/2">
                      <label className="label py-1">
                        <span className="label-text text-xs font-semibold">
                          Last name
                        </span>
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        className="input input-sm w-full rounded-xl border-base-300 bg-base-100/90 text-sm focus:border-secondary focus:outline-none"
                        placeholder="Musk"
                        autoComplete="family-name"
                      />
                    </div>
                  </div>
                )}

                <div className="form-control">
                  <label className="label py-1">
                    <span className="label-text text-xs font-semibold">
                      Email
                    </span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="input input-sm w-full rounded-xl border-base-300 bg-base-100/90 text-sm focus:border-secondary focus:outline-none"
                    placeholder="contact@yourmail.com"
                    autoComplete="email"
                    required
                  />
                </div>

                <div className="form-control">
                  <label className="label py-1">
                    <span className="label-text text-xs font-semibold">
                      Password
                    </span>
                  </label>

                  {/* Wrapper to place eye icon inside input */}
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="input input-sm w-full rounded-xl border-base-300 bg-base-100/90 text-sm pr-10 focus:border-secondary focus:outline-none"
                      placeholder="••••••••"
                      autoComplete={isLogin ? "current-password" : "new-password"}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="btn btn-ghost btn-xs absolute right-2 top-1/2 -translate-y-1/2 px-2"
                      tabIndex={-1}
                    >
                      {showPassword ? "🙈" : "👁️"}
                    </button>
                  </div>

                  <label className="label py-1">
                    <span className="label-text-alt text-[11px] text-base-content/60">
                      Use at least 8 characters. You can set your stack & bio in
                      your profile after signup.
                    </span>
                  </label>

                  {/* Password validation message for signup */}
                  {!isLogin && passwordError && (
                    <p className="mt-1 text-[11px] text-error">
                      {passwordError}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn mt-1 w-full rounded-2xl border-none bg-gradient-to-r from-yellow-400 via-amber-500 to-neutral-900 text-sm font-semibold text-base-100 shadow-lg shadow-amber-500/40 hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {loading ? (
                    <>
                      <span className="loading loading-spinner loading-xs" />
                      <span className="ml-1">
                        {isLogin ? "Logging you in..." : "Creating your account..."}
                      </span>
                    </>
                  ) : isLogin ? (
                    "Log in to DevKnot"
                  ) : (
                    "Sign up & start matching"
                  )}
                </button>
              </form>

              <p className="mt-4 text-[10px] leading-snug text-base-content/50">
                By continuing, you agree to DevKnot&apos;s terms and confirm that
                you&apos;ll use this platform to collaborate on projects, not for
                spam or harassment.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
