import React, { useEffect } from 'react'
import NavBar from "./NavBar";
import Footer from "./Footer"
import { Outlet } from 'react-router-dom';
import BASEURL from '../utils/constants';
import { useDispatch } from 'react-redux';
import {addUser} from '../utils/userSlice';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';


const Body = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userData = useSelector((state)=>state.user);
  const fetchUser = async () => {
    if(userData) {
      return;
    }
     try{ const user = await axios.get(BASEURL+"profile/view",{
        withCredentials: true,

      })
      dispatch(addUser(user.data))
    }
      catch(err){
        if(err.status===401){
        navigate("/login")

        }
        console.error(err);
      }
  }

  useEffect(() =>{
   
 fetchUser();
    
   
  },[])

  return (
    <div  className='min-h-screen flex flex-col '>
      <NavBar/>
      <Outlet className="flex-1"/>
      <Footer/>
    </div>
  )
}


export default Body
