import Logo from "../assets/logowhite.png";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { FaUserCircle } from "react-icons/fa";

function Nav({ userName }) {
  const navigate = useNavigate();

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        console.log("User signed out successfully");
        navigate("/login");
      })
      .catch((error) => {
        console.error("Error signing out: ", error);
      });
  };

  return (
    <nav className="bg-stone-900 border-b text-white shadow-lg border-[#00954C] px-4 py-2 flex justify-between items-center">
      <div className="flex items-center">
        <img src={Logo} alt="Logo" className="h-16 mr-3" />
        <span className="hidden sm:block text-xl font-bold">Client Portal</span>
      </div>
      <div className="text-sm md:text-base">
        {userName ? (
          <>
            <div className="flex flex-row items-center">
            <FaUserCircle className="text-4xl mx-2" />
            <span className="hidden md:block"> {userName} </span>{" "}
            <span
              onClick={handleSignOut}
              className="text-[#7BD650] font-bold cursor-pointer hover:underline md:ml-4"
            >
              Sign out{" "}
            </span>
            </div>
          </>
        ) : (
          <Link to="/login">
            {" "}
            <span className="text-[#7BD650] font-bold hover:underline">Log In </span>
          </Link>
        )}
      </div>
    </nav>
  );
}

export default Nav;
