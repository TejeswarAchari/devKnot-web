import React, { useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import BASEURL from "../utils/constants";
import { addRequests, removeRequests } from "../utils/requestSlice";

const Requests = () => {
  const dispatch = useDispatch();
  const requests = useSelector((store) => store.requests);

  const reviewRequest = async (status, _id) => {
  try {
    const res = await axios.post(
      `${BASEURL}request/review/${status}/${_id}`,
      {},
      { withCredentials: true }
    );
    dispatch(removeRequests(_id));

    return res.data; // optional, but useful
  } catch (err) {
    console.error("Error reviewing request:", err);
    return null;
  }
};


  const fetchRequests = async () => {
    try {
      const res = await axios.get(`${BASEURL}user/requests/received`, {
        withCredentials: true,
      });
      // assuming res.data.data is the array of requests
      dispatch(addRequests(res?.data?.data));
    } catch (err) {
      console.error("Error fetching requests:", err);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  if (!requests) return null;

  if (requests.length === 0)
    return (
      <h1 className="text-center text-white text-2xl my-10">
        No Requests Found
      </h1>
    );

  return (
    <div className="text-center my-10">
      <h1 className="text-bold text-white text-3xl">Connection Requests</h1>

      {requests.map((request) => {
        // each request has fromUserId with user details
        const { firstName, lastName, photoUrl, age, gender, about } =
          request.fromUserId;

        return (
          <div
            key={request._id}
            className="flex m-4 p-4 rounded-lg bg-base-300 w-1/2 mx-auto"
          >
            <div>
              <img
                alt="photo"
                className="w-20 h-20 rounded-full"
                src={photoUrl}
              />
            </div>

            <div className="text-left mx-4">
              <h2 className="font-bold text-xl">
                {firstName} {lastName}
              </h2>

              {age && gender && (
                <p>
                  {age}, {gender}
                </p>
              )}

              <p>{about}</p>

              {/* action buttons if you need them */}
              <div className="mt-4 flex gap-4">
                <button className="btn btn-sm btn-primary" onClick={()=>reviewRequest("accepted",request._id)}>Accept</button>
                <button className="btn btn-sm btn-outline" onClick={()=>reviewRequest("rejected",request._id)}>Reject</button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Requests;
