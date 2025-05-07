import React from "react";
import { auth, provider } from "../firebase";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithPopup,
} from "firebase/auth";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const navigate = useNavigate();

  const signUp = async (e) => {
    e.preventDefault();

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      await updateProfile(user, {
        displayName: `${firstName} ${lastName}`,
      });
      console.log("Sign up successful");
      navigate("/");
    } catch (error) {
      console.error("Error signing up:", error.message);
      alert(error.message);
    }
  };

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log("Google sign-in successful", user);
      navigate("/");
    } catch (error) {
      console.error("Error signing in with Google:", error.message);
      alert(error.message);
    }
  };

  return (
    <div className="flex max-w-[1080px] mx-auto items-center flex-col">
      <h1 className="text-3xl text-[#00954C] font-bold m-4">Sign Up</h1>
      <p>Please Sign up to continue</p>

      <div className="mt-8 flex flex-col">
        <input
          onChange={(e) => setFirstName(e.target.value)}
          className="border border-[#00954C] rounded-md p-2 mb-4"
          type="text"
          placeholder="First Name"
        />
        <input
          onChange={(e) => setLastName(e.target.value)}
          className="border border-[#00954C] rounded-md p-2 mb-4"
          type="text"
          placeholder="Last Name"
        />
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
          className="bg-[#00954C] text-white rounded-md p-2 mb-2 hover:bg-[#7BD650] cursor-pointer transition duration-300"
        >
          Sign Up
        </button>
        <span className="text-center">or</span>
        <button
          onClick={signInWithGoogle}
          className=" border-1 text-sm justify-center rounded-md mt-2 p-2 mb-4 hover:bg-stone-200 transition duration-300 flex items-center gap-2 cursor-pointer"
        >
          <span>Sign up with Google</span>
          <FcGoogle />
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
