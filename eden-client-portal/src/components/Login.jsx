import React from "react";
import { auth } from "../firebase";
import {
  signInWithEmailAndPassword,
} from "firebase/auth";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const signIn = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log("Login successful");
      navigate("/");
    } catch (error) {
      console.error("Error logging in:", error.message);
      alert(error.message);
    }
  };

  return (
    <>
      <div className="flex max-w-[1080px] mx-auto items-center flex-col">
        <h1 className="text-3xl text-[#00954C] font-bold m-4">Login</h1>
        <p>Please sign in to continue</p>

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
            onClick={signIn}
            className="bg-[#00954C] text-white rounded-md p-2 mt-4 mb-4 hover:bg-[#7BD650] transition duration-300"
          >
            Sign In
          </button>
        </div>
        <div className="text-sm">
        <span className="text-black">Dont have an account?</span>
        <Link to="/signup">
          <span className="text-[#00954C] hover:underline ml-2">Sign Up</span>
        </Link>
      </div>
      </div>
    </>
  );
}

export default Login;
