import React from "react";
import { auth, provider, db } from "../firebase";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { useState } from "react";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { Link, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { MoonLoader } from "react-spinners";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [googleIsLoading, setGoogleIsLoading] = useState(false);

  const signIn = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log("Login successful");
      navigate("/");
    } catch (error) {
      console.error("Error logging in:", error.message);
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    setGoogleIsLoading(true);
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const displayNameParts = user.displayName?.split(" ") || ["", ""];
      const googleFirstName = displayNameParts[0];
      const googleLastName = displayNameParts[1] || "";

      const documentId = user.uid;
      const userRef = doc(db, "users", documentId);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        await setDoc(userRef, {
          firstName: googleFirstName,
          lastName: googleLastName,
          email: user.email,
          createdAt: new Date(),
          uid: user.uid,
        });
        console.log("Google sign-up successful", user);
      } else {
        console.log("Google sign-in successful", user);
      }

      navigate("/");
    } catch (error) {
      if (error.code === "auth/popup-closed-by-user") {
        console.warn("Google popup closed by user.");
      } else {
        console.error("Error signing in with Google:", error.message);
        alert(error.message);
      }
    } finally {
      setGoogleIsLoading(false);
    }
  };

  return (
    <>
      <div className="flex max-w-[1080px] mx-auto items-center flex-col">
        <h1 className="text-3xl text-[#00954C] font-bold m-4">Login</h1>
        <p>Please sign in to continue</p>

        <div
          className={`mt-8 flex flex-col transition-opacity duration-300 ${
            isLoading || googleIsLoading
              ? "opacity-50 pointer-events-none"
              : "opacity-100"
          }`}
        >
          <input
            disabled={isLoading || googleIsLoading}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-[#00954C] rounded-md p-2 mb-4"
            type="email"
            placeholder="Email"
          />

          <input
            disabled={isLoading || googleIsLoading}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-[#00954C] rounded-md p-2 mb-4"
            type="password"
            placeholder="Password"
          />
          {isLoading ? (
            <div className="bg-[#00954C] text-white rounded-md p-2 mb-4 transition duration-300">
              <MoonLoader color="white" size={18} className="mx-auto" />
            </div>
          ) : (
            <button
              disabled={isLoading || googleIsLoading}
              onClick={signIn}
              className="bg-[#00954C] text-white rounded-md p-2 mb-4 cursor-pointer hover:bg-[#7BD650] transition duration-300"
            >
              Sign In
            </button>
          )}
          {googleIsLoading ? (
            <div className=" border-1 text-sm justify-center rounded-md mt-2 p-2 mb-4 transition duration-300 flex items-center gap-2">
              <MoonLoader color="black" size={18} className="mx-auto" />
            </div>
          ) : (
            <button
              disabled={isLoading || googleIsLoading}
              onClick={signInWithGoogle}
              className=" border-1 text-sm justify-center rounded-md mt-2 p-2 mb-4 hover:bg-stone-200 transition duration-300 flex items-center gap-2 cursor-pointer"
            >
              <span>Sign In with Google</span>
              <FcGoogle />
            </button>
          )}
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
