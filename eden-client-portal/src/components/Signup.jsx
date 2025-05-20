import React from "react";
import { auth, provider, db } from "../firebase";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithPopup,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { MoonLoader } from "react-spinners";

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [googleIsLoading, setGoogleIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateSignup = ({
    firstName,
    lastName,
    email,
    password,
    confirmPassword,
  }) => {
    const errors = {};

    if (!firstName.trim()) {
      errors.firstName = "First name is required";
    }
    if (!lastName.trim()) {
      errors.lastName = "Last name is required";
    }
    if (!email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email.trim())) {
      errors.email = "Email is invalid";
    }
    if (!password) {
      errors.password = "Password is required";
    } else if (password.length < 6) {
      errors.password = "Password must be at least 6 characters long";
    }
    if (password !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }
    return errors;
  };

  const signUp = async (e) => {
    e.preventDefault();

    const validationErrors = validateSignup({
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
    });
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    } else {
      setErrors({});
    }

    setIsLoading(true);

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

      const documentId = user.uid;

      await setDoc(doc(db, "users", documentId), {
        firstName: firstName,
        lastName: lastName,
        email: email,
        createdAt: new Date(),
        uid: user.uid,
      });

      console.log("Sign up successful");
      navigate("/");
    } catch (error) {
      console.error("Error signing up:", error.message);
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
    <div className="flex max-w-[1080px] mx-auto items-center flex-col">
      <h1 className="text-3xl text-[#00954C] font-bold m-4">Sign Up</h1>
      <p>Please Sign up to continue</p>

      <div
        className={`mt-8 flex flex-col transition-opacity duration-300 ${
          isLoading || googleIsLoading
            ? "opacity-50 pointer-events-none"
            : "opacity-100"
        }`}
      >
        <div className="flex flex-row gap-4">
          <div className="relative mb-6">
            <input
            value={firstName}
              disabled={isLoading || googleIsLoading}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full border border-[#00954C] rounded-md p-2"
              type="text"
              placeholder="First Name"
            />
            {errors.firstName && (
              <span className="absolute left-0 top-full text-red-500 text-sm">
                {errors.firstName}
              </span>
            )}
          </div>
          <div className="relative mb-6">
            <input
              value={lastName}
              disabled={isLoading || googleIsLoading}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full border border-[#00954C] rounded-md p-2"
              type="text"
              placeholder="Last Name"
            />
            {errors.lastName && (
              <span className="absolute left-0 top-full text-red-500 text-sm">
                {errors.lastName}
              </span>
            )}
          </div>
        </div>
        <div className="relative mb-6">
          <input
            value={email}
            disabled={isLoading || googleIsLoading}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-[#00954C] rounded-md p-2"
            type="email"
            placeholder="Email"
          />
          {errors.email && (
            <span className="absolute left-0 top-full text-red-500 text-sm">
              {errors.email}
            </span>
          )}
        </div>
          <div className="relative mb-6">
        <input
          value={password}
          disabled={isLoading || googleIsLoading}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-[#00954C] rounded-md p-2"
          type="password"
          placeholder="Password"
        />
        {errors.password && (
          <span className="absolute left-0 top-full text-red-500 text-sm">
            {errors.password}
          </span>
        )}
        </div>
        <div className="relative mb-6">
        <input
          value={confirmPassword}
          disabled={isLoading || googleIsLoading}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full border border-[#00954C] rounded-md p-2"
          type="password"
          placeholder="Confirm Password"
        />
        {errors.confirmPassword && (
          <span className="absolute left-0 top-full text-red-500 text-sm">
            {errors.confirmPassword}
          </span>
        )}
        </div>
        {isLoading ? (
          <div className="bg-[#00954C] text-white rounded-md p-2 mb-2 transition duration-300">
            <MoonLoader color="white" size={18} className="mx-auto" />
          </div>
        ) : (
          <button
            disabled={isLoading || googleIsLoading}
            onClick={signUp}
            className="bg-[#00954C] text-white rounded-md p-2 mb-2 hover:bg-[#7BD650] cursor-pointer transition duration-300"
          >
            Sign Up
          </button>
        )}
        <span className="text-center">or</span>
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
            <span>Sign up with Google</span>
            <FcGoogle />
          </button>
        )}
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
