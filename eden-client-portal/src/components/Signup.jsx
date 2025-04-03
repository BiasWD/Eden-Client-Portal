import React from "react";
import { auth } from "../firebase";
import {
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const signUp = async (e) => {
    try {
    await createUserWithEmailAndPassword(auth, email, password);
    console.log("Sign up successful");
    navigate("/");
    } catch (error) {
      console.error("Error signing up:", error.message);
      alert(error.message);
    }
  };

  return (
    <div className="flex max-w-[1080px] mx-auto items-center flex-col">
      <h1 className="text-3xl text-[#00954C] font-bold m-4">Sign Up</h1>
      <p>Please Sign up to continue</p>

      <div className="mt-8 flex flex-col">
        <input
          onChange={(e) => setEmail(e.target.value)}
          className="border border-[#00954C] rounded-md p-2 mb-4"
          type="email"
          placeholder="Email"
        />

        <input
          onChange={(e) => setPassword(e.target.value)}
          className="border border-[#00954C] rounded-md p-2 mb-4"
          type="password"
          placeholder="Password"
        />

        <button
          onClick={signUp}
          className="bg-[#00954C] text-white rounded-md p-2 mt-4 mb-4 hover:bg-[#7BD650] transition duration-300"
        >
          Sign Up
        </button>
      </div>
      <div className="text-sm">
        <span className="text-black">Already have an account?</span>
        <Link to="/login">
          <span className="text-[#00954C] hover:underline ml-2">Log In</span>
        </Link>
      </div>
    </div>
  );
}

export default Signup;
