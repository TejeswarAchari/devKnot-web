import axios from "axios";
import BASE_URL from "../utils/constants";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addConnections } from "../utils/connectionSlice";
import { Link } from "react-router-dom";

const Connections = () => {
  const connections = useSelector((state) => state.connections);
  const notifications = useSelector((state) => state.notifications);

  const dispatch = useDispatch();

  const fetchConnections = async () => {
    try {
      const res = await axios.get(BASE_URL + "user/connections", {
        withCredentials: true,
      });

      console.log("Connections API:", res.data);
      dispatch(addConnections(res.data.data)); // { data: [...] }
    } catch (err) {
      console.log("Error fetching connections:", err);
    }
  };

  useEffect(() => {
    fetchConnections();
  }, []);

  if (!connections) return null;

  if (connections.length === 0)
    return (
      <h1 className="text-center text-2xl font-bold my-10">
        No Connections Found
      </h1>
    );

  // helper: always return the real user object from any shape
  const resolveUser = (connection) => {
    if (!connection) return null;

    // case 1: already a plain user from backend mapping
    if (connection.firstName) return connection;

    // case 2: still a ConnectionRequest with populated fromUserId/toUserId
    if (connection.fromUserId && connection.fromUserId.firstName) {
      return connection.fromUserId;
    }
    if (connection.toUserId && connection.toUserId.firstName) {
      return connection.toUserId;
    }

    return null; // unknown shape
  };

  return (
    <div className="text-center my-10 min-h-screen">
      <h1 className="text-bold text-3xl mb-6">Connections</h1>

      <div className="flex flex-col flex-wrap items-center">
        {connections.map((connection, index) => {
          const userObj = resolveUser(connection);
         

          if (!userObj) return null;

          const {
            _id,
            firstName,
            lastName,
            photoUrl,
            age,
            gender,
            about,
          } = userObj;
          const unread = notifications?.[_id] || 0;


          return (
            <div
              key={_id || index}
              className="flex m-4 p-4 rounded-lg bg-base-300 w-full mx-auto md:w-1/2 lg:w-1/3 shadow items-center justify-between"
            >
              {/* Left: Image + details */}
              <div className="flex items-center gap-4">
                <img
                  alt="photo"
                  className="w-20 h-20 rounded-full object-cover"
                  src={photoUrl}
                />
                <div className="text-left">
                  <h2 className="font-bold text-xl">
                    {firstName} {lastName}
                  </h2>

                  {age && gender && (
                    <p className="text-sm opacity-80">
                      {age}, {gender}
                    </p>
                  )}

                  <p className="mt-1">{about}</p>
                </div>
              </div>

              {/* Right: Chat button */}
             <Link to={`/chat/${_id}`}>
  <button className="btn btn-primary relative">
    Chat
    {unread > 0 && (
      <span className="badge badge-secondary badge-sm absolute -top-2 -right-2">
        {unread}
      </span>
    )}
  </button>
</Link>

            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Connections;
