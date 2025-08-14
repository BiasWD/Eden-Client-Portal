import React from "react";
import { Link, useLocation } from "react-router-dom";

function Sidebar({ isAdmin, setActiveClient, activeClient, activeClientName, activeClientPrice, activeClientUid }) {
  const location = useLocation();
  const isActive = (path) => {
    return location.pathname === path
      ? "bg-[#00954C] font-bold"
      : "bg-stone-700 hover:bg-stone-900";
  };
  return (
    <div className="w-full md:w-1/6  md:bg-stone-800 border-b shadow-lg md:shadow-none border-stone-200 text-white md:rounded-br-xl h-auto md:min-h-screen flex flex-row md:flex-col md:absolute gap-2 p-2">
      <Link to={isAdmin ? "admin-dashboard" : "/"} className="w-full"
        onClick={isAdmin ? () => setActiveClient("") : undefined}>
        <p className={`py-4 text-center rounded-xl w-full ${isActive("/")}`}>
          {isAdmin ? "Admin" : "Dashboard"}
        </p>
      </Link>
      {activeClient || !isAdmin ? (
        <>
      <Link to="/payments" className="w-full">
        <p
          className={`py-4 text-center rounded-xl w-full ${isActive(
            "/payments"
          )}`}
        >
          Payments
        </p>
      </Link>
      <Link to="/services" className="w-full">
        <p
          className={`py-4 text-center rounded-xl w-full ${isActive(
            "/services"
          )}`}
        >
          Services
        </p>
      </Link>
      </>
      ) : undefined }
      <hr className="hidden md:block border-t border-stone-500 mx-2" />
      <div>
        {activeClient ? (
          <div className="text-center text-sm">
            <p className="mb-1"><span className="font-bold">Active Client Name:</span> <span className="whitespace-nowrap">{activeClientName}</span></p>
            <p className="mb-1"><span className="font-bold">Price per Mow/Trim:</span> ${activeClientPrice}</p>
            <p className="mb-1"><span className="font-bold">Active Client UID:</span> <span className="break-all">{activeClientUid}</span></p>
          </div>
        ) : (undefined)}
      </div>
    </div>
  );
}

export default Sidebar;
