// src/components/UserCard.jsx
import React from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { addFeed, removeUserFromFeed } from "../utils/feedSlice";
import BASEURL from "../utils/constants";

const UserCard = ({ user }) => {
  if (!user) return <div className="text-2xl justify-center my-8">No New Users Found</div>;
  const { _id, firstName, lastName, photoUrl, age, gender, about, skills } = user;
  const dispatch = useDispatch();

  const handleSendRequest = async (status, userId) => {
  try {
    const res = await axios.post(
      `${BASEURL}request/send/${status}/${userId}`,
      {},
      {
        withCredentials: true,
      }
    );

    // Remove user from feed after successful request
    dispatch(removeUserFromFeed(userId));

    console.log("Request sent:", res.data);
  } catch (err) {
    console.error("Error sending request:", err);
  }
};


  return (
    <div className="card bg-base-300 w-96 shadow-xl">
      <figure>
        <img src={photoUrl} alt="photo" className="object-cover w-full h-60" />
      </figure>

      <div className="card-body">
        {/* NAME */}
        <h2 className="card-title">
          {firstName} {lastName}
        </h2>

        {/* AGE + GENDER (optional) */}
        {age && gender && (
          <p className="text-sm opacity-70">
            {age} years • {gender}
          </p>
        )}

        {/* ABOUT */}
        <p className="mt-1">{about}</p>

        {/* SKILLS */}
        {skills && skills.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {skills.map((skill, idx) => (
              <span key={idx} className="badge badge-outline">
                {skill}
              </span>
            ))}
          </div>
        )}

        {/* BUTTONS */}
        <div className="card-actions justify-center my-4">
          <button className="btn btn-primary" onClick={()=> handleSendRequest("ignored",_id)}>Ignore</button>
          <button className="btn btn-secondary" onClick={()=> handleSendRequest("interested",_id)}>Interested</button>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
