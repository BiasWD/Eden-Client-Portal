import React from 'react'
import Logo from '../assets/logowhite.png'
import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { auth } from "../firebase";
import { signOut, onAuthStateChanged } from "firebase/auth";

function Nav() {

  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe(); // Cleanup subscription on unmount
  }, []);

  const handleSignOut = () => {
    signOut(auth).then(() => {
      console.log("User signed out successfully");
      navigate("/login");
    }).catch((error) => {
      console.error("Error signing out: ", error);
    });
  }

  return (
    <nav className="bg-stone-900 border-b text-white shadow-lg border-[#00954C] px-4 py-2 flex justify-between items-center">
    <div className="flex items-center">
      <img src={Logo} alt="Logo" className="h-16 mr-3" />
      <span className="text-xl font-bold">Client Portal</span>
    </div>
    <div>
      { auth.currentUser ? <><span> {auth.currentUser.email} </span> <span onClick={handleSignOut} className="text-[#7BD650] hover:underline ml-4">Sign out </span></> : <Link to= "/login"> <span className="text-[#7BD650] hover:underline">Log In </span></Link> }
    </div>
  </nav>
  )
}

export default Nav