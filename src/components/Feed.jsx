// import React, { useEffect } from "react";
// import axios from "axios";
// import  BASE_URL  from "../utils/constants";
// import { useDispatch, useSelector } from "react-redux";
// import { addFeed } from "../utils/feedSlice";
// import UserCard from "./UserCard";

// const Feed = () => {

//   const feed = useSelector((store) => store.feed);     // get feed from Redux
//   const dispatch = useDispatch();

//   const getFeed = async () => {
//     // if feed already loaded -> don't fetch again
//     if (feed) return;

//     try {
//       const res = await axios.get(BASE_URL + "feed", {
//         withCredentials: true,
//       });

//       console.log("Feed API Response:", res.data);

//       // store feed in Redux
//       dispatch(addFeed(res?.data));
//     } catch (err) {
//       console.error("Feed API Error:", err);
//     }
//   };

//   useEffect(() => {
//     getFeed();
//   }, []); // run only once

//   if(!feed) return null;

//   if(feed.length === 0) return <h1 className="justify-center my-10 text-2xl text-center">No New Users Found</h1>;

// return (
  
//   feed && (
//     <div className="flex justify-center my-10">
//       <UserCard user={feed[0]} />
//        {/* {feed.map((user) => (
//         <UserCard key={user._id} user={user} />
//       ))} */}
//     </div>
//   )
// );


// };

// export default Feed;


import React, { useEffect } from "react";
import axios from "axios";
import BASE_URL from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addFeed, removeUserFromFeed } from "../utils/feedSlice";
import UserCard from "./UserCard";
import TinderCard from "react-tinder-card";

const Feed = () => {
  const feed = useSelector((store) => store.feed);
  const user = useSelector((store) => store.user); // 👈 current logged-in user
  const dispatch = useDispatch();

  const getFeed = async () => {
    // ❌ DO NOT SKIP BASED ON `feed` ANYMORE
    if (!user) return; // not logged in yet

    try {
      const res = await axios.get(BASE_URL + "feed", {
        withCredentials: true,
      });

      console.log("Feed API Response:", res.data);
      dispatch(addFeed(res.data));
    } catch (err) {
      console.error("Feed API Error:", err);
    }
  };

  // 🔥 whenever user changes (new signup / login), fetch a fresh feed
  useEffect(() => {
    getFeed();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?._id]);

  // common handler for swipe + buttons
  const handleSendRequest = async (status, userId) => {
    try {
      await axios.post(
        `${BASE_URL}request/send/${status}/${userId}`,
        {},
        { withCredentials: true }
      );

      // remove that user from feed -> next card appears
      dispatch(removeUserFromFeed(userId));
    } catch (err) {
      console.error("Error sending request:", err);
    }
  };

  const handleSwipe = (direction, userObj) => {
    if (!userObj) return;

    if (direction === "right") {
      // right swipe = interested
      handleSendRequest("interested", userObj._id);
    } else if (direction === "left") {
      // left swipe = ignored
      handleSendRequest("ignored", userObj._id);
    }
  };

  // while first request is loading
  if (!feed) return null;

  if (feed.length === 0) {
    return (
      <h1 className="justify-center my-10 text-2xl text-center">
        No New Users Found
      </h1>
    );
  }

  return (
    <div className="flex justify-center my-10">
      {/* stack container */}
      <div className="relative w-96 h-[480px] overflow-hidden">
        {feed.map((userObj) => (
          <TinderCard
            key={userObj._id}
            className="absolute w-full h-full"
            onSwipe={(dir) => handleSwipe(dir, userObj)}
            preventSwipe={["up", "down"]}
            // small, nice tilt
            outputRotationRange={["-15deg", "0deg", "15deg"]}
          >
            <UserCard user={userObj} onSendRequest={handleSendRequest} />
          </TinderCard>
        ))}
      </div>
    </div>
  );
};

export default Feed;
