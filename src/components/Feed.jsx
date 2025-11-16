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

return (
  
  feed && (
    <div className="flex justify-center my-10">
      <UserCard user={feed[1]} />
    </div>
  )
);


};

export default Feed;
