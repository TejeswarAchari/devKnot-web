// src/components/UserCard.jsx
import React from "react";

const UserCard = ({ user }) => {
  const { firstName, lastName, photoUrl, age, gender, about, skills } = user;

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
          <button className="btn btn-primary">Ignore</button>
          <button className="btn btn-secondary">Interested</button>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
