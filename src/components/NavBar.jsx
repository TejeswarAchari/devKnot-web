import axios from 'axios';
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom';
import BASEURL from '../utils/constants';
import { removeUser } from '../utils/userSlice';
import { useNavigate } from 'react-router-dom';

const NavBar = () => {

    const user = useSelector((state) => state.user);
    const navigate = useNavigate();
    const dispatch = useDispatch();
  const handleLogout = async () => {
  try {
    await axios.post(
      BASEURL + "logout",
      {},
      {
        withCredentials: true,   // Correct place
      }
    );

    dispatch(removeUser());
    navigate("/login");
  } catch (err) {
    console.log(err);
  }
};


  return (
     <div>
        <div className="navbar bg-base-300 shadow-sm">
  <div className="flex-1">
    <Link to="/" className="btn btn-ghost text-xl">👨‍💻DevKnot</Link>
  </div>
  {user && (
  <div className="flex gap-2">
    <div className='form-control mt-7'> Welcome {user.firstName} {user.lastName} </div>
    <div className="dropdown dropdown-end m-5">
      <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
        <div className="w-10 rounded-full">
          <img
            alt="Tailwind CSS Navbar component"
            src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
        </div>
      </div>
      <ul
        tabIndex="-1"
        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
        <li>
          <Link to="/profile" className="justify-between">
            Profile
            <span className="badge">New</span>
          </Link>
        </li>
        <li><a>Settings</a></li>
        <li><a onClick={handleLogout}>Logout</a></li>
      </ul>
    </div>
  </div>
)}

</div>

   

      </div>
  )
}

export default NavBar
