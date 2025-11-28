import React from 'react'
import {useState} from 'react'
import axios from "axios";
import {useDispatch} from "react-redux";
import { addUser } from '../utils/userSlice';
import { useNavigate } from 'react-router-dom';
import BASEURL from '../utils/constants';

const Login = () => {


    const [emailId,setEmailId] = useState("tejeswar.achari@example.com");
    const [password,setPassword] = useState("Tejeswar@11");
    const[firstName,setFirstName] = useState("");
    const[lastName,setLastName] = useState("");
    const[isLoginForm,setIsLoginForm] = useState(false);
    const [error,setError] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogin = async ()=>{
        
        try{
            const res = await axios.post(BASEURL+"login",{
                email:emailId,
                password,
            },{withCredentials:true});
            console.log(res.data);
            dispatch(addUser(res.data));
            navigate("/");
        }
        catch(err){
          setError(err?.response?.data)
            
        }
    }

    const handleSignUp = async ()=>{
        try{
            const res = await axios.post(BASEURL+"signup",{
                email:emailId,
                password,
                firstName,
                lastName
            },{withCredentials:true});
           
            dispatch(addUser(res.data.data));
            navigate("/profile");
        }
        catch(err){
          setError(err?.response?.data)
        }
    }


  return (
    <div className="flex justify-center my-10">
      <div className="card bg-base-300 w-96 shadow-xl">
        <div className="card-body">
          <h2 className="card-title justify-center">{isLoginForm ? "Login" : "Sign Up"}</h2>
{ !isLoginForm &&
<>
          <label className="form-control w-full max-w-xs py-4">
            <div className="label">
              <span className="label-text m-1">First Name</span>
            </div>
            <input
              type="text"
              value={firstName}
              className="input input-bordered w-full max-w-xs"
              onChange={(e)=>setFirstName(e.target.value)}
            />
          </label>

          <label className="form-control w-full max-w-xs py-4">
            <div className="label">
              <span className="label-text m-1">Last Name</span>
            </div>
            <input
              type="text"
              value={lastName}
              className="input input-bordered w-full max-w-xs"
              onChange={(e)=>setLastName(e.target.value)}
            />
          </label>
          </>}

          <label className="form-control w-full max-w-xs py-4">
            <div className="label">
              <span className="label-text m-1">Email ID</span>
            </div>
            <input
              type="text"
              value={emailId}
              className="input input-bordered w-full max-w-xs"
              onChange={(e)=>setEmailId(e.target.value)}
            />
          </label>

          <label className="form-control w-full max-w-xs py-4">
            <div className="label">
              <span className="label-text m-1" >Password</span>
            </div>
            <input
              type="password"
              value={password}
              className="input input-bordered w-full max-w-xs"
               onChange={(e)=>setPassword(e.target.value)}
            />
          </label>
<p className='text-red-600'>{error}</p>
          <div className="card-actions justify-center">

            <button className="btn btn-primary" onClick={isLoginForm?handleLogin:handleSignUp}>{isLoginForm?"Login":"Sign Up"}</button>
          </div>
          <p className="m-auto cursor-pointer mt-1" onClick={()=>setIsLoginForm((value)=>!value)}>{isLoginForm?"Don't have an account?": "Existing user? SignIn Here" }</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
