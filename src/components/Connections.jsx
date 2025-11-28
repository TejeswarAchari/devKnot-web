import axios from "axios";
import  BASE_URL  from "../utils/constants";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { addConnections, removeConnections } from "../utils/connectionSlice";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const Connections = () => {
  const connections = useSelector((state) => state.connections);
  const dispatch = useDispatch();
  const fetchConnections = async () => {
    try {
      const res = await axios.get(BASE_URL + "user/connections", {
        withCredentials: true,
      });

      console.log(res);
      dispatch(addConnections(res.data.data));
    } catch (err) {
      console.log("Error fetching connections:", err);
    }
  };

  useEffect(() => {
    fetchConnections();
  }, []);

  if(!connections) return ;

  if(connections.length === 0) return <h1 className="text-center text-2xl font-bold">No Connections Found</h1>;


  return (
   <div className="text-center my-10">
  <h1 className="text-bold  text-3xl">Connections</h1>

  <div className="flex flex-col flex-wrap">
    {connections.map((connection, idx) => {
      const {_id, firstName, lastName, photoUrl, age, gender, about } = connection;

      return (
        <div
          key={idx}
          className="flex m-4 p-4 rounded-lg bg-base-300 w-full mx-auto md:w-1/2 lg:w-1/3 shadow"
        >
          {/* Image */}
          <div className="flex justify-end">
          <div>
            <img
              alt="photo"
              className="w-20 h-20 rounded-full object-cover"
              src={photoUrl}
            />
          </div>

          {/* Details */}
          <div className="text-left mx-4">
            <h2 className="font-bold text-xl">
              {firstName + " " + lastName}
            </h2>

            {age && gender && (
              <p className="text-sm opacity-80">
                {age}, {gender}
              </p>
            )}

            <p className="mt-1">{about}</p>
            </div>
            <div>
           <Link to={`/chat/${_id}`}> <button className="btn btn-primary">Chat</button></Link>
            </div>
          </div>
        </div>
      );
    })}
  </div>
</div>

  );
};

export default Connections;
