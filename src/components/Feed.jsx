import React, { useEffect } from "react";
import axios from "axios";
import  BASE_URL  from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addFeed } from "../utils/feedSlice";
import UserCard from "./UserCard";

const Feed = () => {

  const feed = useSelector((store) => store.feed);     // get feed from Redux
  const dispatch = useDispatch();

  const getFeed = async () => {
    // if feed already loaded -> don't fetch again
    if (feed) return;

    try {
      const res = await axios.get(BASE_URL + "feed", {
        withCredentials: true,
      });

      console.log("Feed API Response:", res.data);

      // store feed in Redux
      dispatch(addFeed(res?.data));
    } catch (err) {
      console.error("Feed API Error:", err);
    }
  };

  useEffect(() => {
    getFeed();
  }, []); // run only once

  if(!feed) return null;

  if(feed.length === 0) return <h1 className="justify-center my-10 text-2xl text-center">No New Users Found</h1>;

return (
  
  feed && (
    <div className="flex justify-center my-10">
      <UserCard user={feed[0]} />
       {/* {feed.map((user) => (
        <UserCard key={user._id} user={user} />
      ))} */}
    </div>
  )
);


};

export default Feed;
