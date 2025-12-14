import React, { useState } from "react";
import axios from "axios";
import BASE_URL from "../utils/constants";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import UserCard from "./UserCard";

/**
 * EditProfile
 *
 * Uses ONLY backend fields you actually have:
 * - firstName, lastName, age, gender, about, photoUrl
 *
 * Backend contract:
 * - PATCH BASE_URL + "profile/update"
 * - payload: { firstName, lastName, photoUrl, about, gender, age? }
 * - dispatch(addUser(res.data.data))
 * - show toast on success
 */

const EditProfile = ({ user }) => {
  const dispatch = useDispatch();

  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [age, setAge] = useState(
    user?.age === undefined || user?.age === null ? "" : String(user.age)
  );
  const [gender, setGender] = useState(user?.gender || "male");
  const [about, setAbout] = useState(
    user?.about || "I love building cool stuff with other developers."
  );

  const [saving, setSaving] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [error, setError] = useState("");

  //cloudinary image file
const [photoFile, setPhotoFile] = useState(null);
const [photoPreview, setPhotoPreview] = useState(user?.photoUrl || "");

//On photo file change
const handlePhotoChange = (e) => {
  const file = e.target.files[0];
  if (!file) return;

  setPhotoFile(file);

  // create preview
  const previewUrl = URL.createObjectURL(file);
  setPhotoPreview(previewUrl);
};




  const saveProfile = async () => {
    try {
      setSaving(true);
      setError("");

      // const payload = {
      //   firstName,
      //   lastName,
      //   photoUrl,
      //   about,
      //   gender,
      // };

      // if (age !== "") {
      //   payload.age = Number(age);
      // }

      // const res = await axios.patch(BASE_URL + "profile/update", payload, {
      //   withCredentials: true,
      // });

      const formData = new FormData();
formData.append("firstName", firstName);
formData.append("lastName", lastName);
formData.append("about", about);
formData.append("gender", gender);

if (age !== "") formData.append("age", age);
if (photoFile) formData.append("photo", photoFile);

const res = await axios.patch(
  BASE_URL + "profile/update",
  formData,
  {
    withCredentials: true,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  }
);



      // old working shape: res.data.data
      dispatch(addUser(res.data.data));

      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (err) {
      if (err.response) {
        console.log("Server error:", err.response.data);
        setError(
          err.response.data?.message ||
            err.response.data?.error ||
            "Unable to update profile."
        );
      } else {
        console.log("Axios error:", err.message);
        setError("Network error. Please try again.");
      }
    } finally {
      setSaving(false);
    }
  };

  // Build preview user for the UserCard
  const previewUser = {
    ...user,
    firstName,
    lastName,
    photoUrl: photoPreview, // 🔥 this line is key
    about,
    gender,
    age: age !== "" ? Number(age) : undefined,
  };

  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
      {/* FORM SIDE */}
      <div className="w-full lg:w-7/12">
        <div className="rounded-3xl bg-gradient-to-b from-slate-900/95 via-slate-900/98 to-black/95 p-[1.5px] shadow-[0_18px_40px_rgba(0,0,0,0.9)] backdrop-blur-2xl">
          <div className="rounded-[22px] bg-base-200/90 p-5 backdrop-blur-xl ring-1 ring-white/10">
            <h2 className="text-lg font-bold text-base-content">
              Edit your profile
            </h2>
            <p className="mt-1 text-xs text-base-content/70">
              Update your basic info. This is exactly what other devs see before
              they swipe on you.
            </p>

            {error && (
              <div className="mt-3 rounded-2xl border border-error/40 bg-error/10 px-3 py-2 text-xs text-error">
                {error}
              </div>
            )}

            <div className="mt-4 space-y-4 text-sm">
              {/* First + Last name */}
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="form-control">
                  <label className="label py-1">
                    <span className="label-text text-xs font-semibold">
                      First name
                    </span>
                  </label>
                  <input
                    type="text"
                    className="input input-sm w-full rounded-xl border-base-300 bg-base-100/90 text-sm focus:border-amber-400 focus:outline-none"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Ada"
                  />
                </div>

                <div className="form-control">
                  <label className="label py-1">
                    <span className="label-text text-xs font-semibold">
                      Last name
                    </span>
                  </label>
                  <input
                    type="text"
                    className="input input-sm w-full rounded-xl border-base-300 bg-base-100/90 text-sm focus:border-amber-400 focus:outline-none"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Lovelace"
                  />
                </div>
              </div>

              {/* Age + Gender */}
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="form-control">
                  <label className="label py-1">
                    <span className="label-text text-xs font-semibold">
                      Age
                    </span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    className="input input-sm w-full rounded-xl border-base-300 bg-base-100/90 text-sm focus:border-amber-400 focus:outline-none"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    placeholder="22"
                  />
                  <label className="label py-1">
                    <span className="label-text-alt text-[10px] text-base-content/60">
                      Optional, but helps other devs understand your level.
                    </span>
                  </label>
                </div>

                <div className="form-control">
                  <label className="label py-1">
                    <span className="label-text text-xs font-semibold">
                      Gender
                    </span>
                  </label>
                  <select
                    className="select select-sm w-full rounded-xl border-base-300 bg-base-100/90 text-sm focus:border-amber-400 focus:outline-none"
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                  >
                    <option value="male">male</option>
                    <option value="female">female</option>
                    <option value="other">other</option>
                  </select>
                  <label className="label py-1">
                    <span className="label-text-alt text-[10px] text-base-content/60">
                      Must be one of: male, female, other.
                    </span>
                  </label>
                </div>
              </div>

              {/* Photo URL */}
              <div className="form-control">
                <label className="label py-1">
                  <span className="label-text text-xs font-semibold">
                    Profile photo 
                  </span>
                </label>
                {/* <input
                  type="text"
                  className="input input-sm w-full rounded-xl border-base-300 bg-base-100/90 text-sm focus:border-amber-400 focus:outline-none"
                  value={photoUrl}
                  onChange={(e) => setPhotoUrl(e.target.value)}
                  placeholder="https://your-cdn.com/avatar.png"
                /> */}

  <input
  type="file"
  accept="image/*"
  className="file-input file-input-sm w-full"
  onChange={handlePhotoChange}
/>


                <label className="label py-1">
                  <span className="label-text-alt text-[10px] text-base-content/60">
                    If empty, we&apos;ll show your initials with a gradient.
                  </span>
                </label>
              </div>

              {/* About */}
              <div className="form-control">
                <label className="label py-1">
                  <span className="label-text text-xs font-semibold">
                    About you
                  </span>
                </label>
                <textarea
                  rows={4}
                  className="textarea textarea-sm w-full rounded-2xl border-base-300 bg-base-100/90 text-sm focus:border-amber-400 focus:outline-none"
                  value={about}
                  onChange={(e) => setAbout(e.target.value)}
                  placeholder="What do you like building? What kind of dev are you looking to work with?"
                />
                <label className="label py-1">
                  <span className="label-text-alt text-[10px] text-base-content/60">
                    This text appears on your Discover card.
                  </span>
                </label>
              </div>

              {/* Save button */}
              <button
                type="button"
                onClick={saveProfile}
                disabled={saving}
                className="btn mt-2 w-full rounded-2xl border-none bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 text-sm font-semibold text-neutral-900 shadow-lg shadow-amber-500/40 hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {saving ? (
                  <>
                    <span className="loading loading-spinner loading-xs" />
                    <span className="ml-1">Saving your profile...</span>
                  </>
                ) : (
                  "Save profile"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* LIVE PREVIEW SIDE */}
      <div className="w-full lg:w-5/12 mt-4 lg:mt-0">
        <div className="sticky top-20">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-base-content/60">
            Live preview
          </p>
          <p className="mb-3 text-[11px] text-base-content/60">
            This is how your card will appear in the Discover feed.
          </p>
          <div className="h-[460px]">
            <UserCard user={previewUser} />
          </div>
        </div>
      </div>

      {/* Toast */}
      {showToast && (
        <div className="toast toast-top toast-center z-[60] top-16">
          <div className="alert alert-success">
            <span>Profile updated successfully.</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditProfile;
