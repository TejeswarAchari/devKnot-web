import React, { useState } from "react";
import UserCard from "./UserCard";
import { useDispatch } from "react-redux";
import axios from "axios";
import BASEURL from "../utils/constants";
import { addUser } from "../utils/userSlice";
const EditProfile = ({user}) => {
   const [firstName, setFirstName] = useState(user.firstName || "");
  const [lastName, setLastName] = useState(user.lastName || "");
  const [photoUrl, setPhotoUrl] = useState(user.photoUrl || "");
  const [age, setAge] = useState(user.age || "");
  const [gender, setGender] = useState(user.gender || "male");
  const [about, setAbout] = useState(user.about || "");
  const [showToast,setToast] = React.useState(false);
const dispatch = useDispatch();

const saveProfile = async () => {
  try {
    const payload = {
      firstName,
      lastName,
      photoUrl,
      about,
      gender,
    };

    if (age !== "") {
      payload.age = Number(age);
    }

    const res = await axios.patch(
      BASEURL + "profile/update",
      payload,
      { withCredentials: true }
    );

    dispatch(addUser(res.data.data));
  setToast(true); // show toast immediately

setTimeout(() => {
  setToast(false); // hide after 3 seconds
}, 3000);

    
  } catch (err) {
    if (err.response) {
    console.log("Server error:", err.response.data);  // <- this will show "Error: Gender must be male, female or other"
  } else {
    console.log("Axios error:", err.message);
  }
  }
};


  return (
    <div>
    <div className="flex justify-center items-center py-8">    
    <div className="flex justify-center items-center mx-10">
      {/* smaller card, like in the video */}
      <div className="w-full max-w-sm bg-base-200 rounded-2xl px-6 py-5 shadow-xl border border-base-300">
        <h2 className="text-center text-lg font-semibold mb-4">
          Edit Profile
        </h2>

        <div className="space-y-3">
          {/* First Name */}
          <div>
            <label className="label py-0">
              <span className="label-text text-sm">First Name:</span>
            </label>
            <input
              type="text"
              className="input input-bordered input-sm w-full"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>

          {/* Last Name */}
          <div>
            <label className="label py-0">
              <span className="label-text text-sm">Last Name:</span>
            </label>
            <input
              type="text"
              className="input input-bordered input-sm w-full"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>

          {/* Photo URL */}
          <div>
            <label className="label py-0">
              <span className="label-text text-sm">Photo URL :</span>
            </label>
            <input
              type="text"
              className="input input-bordered input-sm w-full"
              value={photoUrl}
              onChange={(e) => setPhotoUrl(e.target.value)}
            />
          </div>

          {/* Age */}
          <div>
            <label className="label py-0">
              <span className="label-text text-sm">Age:</span>
            </label>
            <input
              type="number"
              className="input input-bordered input-sm w-full"
              value={age}
              onChange={(e) => setAge(e.target.value)}
            />
          </div>

          {/* Gender */}
<div>
  <label className="label py-0">
    <span className="label-text text-sm">Gender:</span>
  </label>
  <select
    className="select select-bordered select-sm w-full"
    value={gender}
    onChange={(e) => setGender(e.target.value)}
  >
    <option value="male">male</option>
    <option value="female">female</option>
    <option value="other">other</option>
  </select>
</div>



          {/* About */}
          <div>
            <label className="label py-0">
              <span className="label-text text-sm">About:</span>
            </label>
            <input
              type="text"
              className="input input-bordered input-sm w-full"
              value={about}
              onChange={(e) => setAbout(e.target.value)}
            />
          </div>
        </div>

        {/* Save Button */}
        <button onClick={saveProfile} className="btn btn-primary btn-sm w-full mt-5">
          Save Profile
        </button>
      </div>
    </div>

    <UserCard user={{firstName, lastName, photoUrl, age, gender, about}}/>

    </div>
    <>
 {showToast && (
        <div className="toast toast-top toast-center">
          <div className="alert alert-success">
            <span>Profile updated successfully.</span>
          </div>
        </div>
      )}
    </>
    </div>
  );
  

};

export default EditProfile;
