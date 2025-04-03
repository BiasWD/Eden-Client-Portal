import React from "react";

function Dashboard() {
  return (
    <div className="flex max-w-[1080px] mx-auto items-center flex-col">
      <h1 className="text-3xl text-[#00954C] font-bold m-4">Dashboard</h1>
      <p>Hi Name, Welcome to your dashboard!</p>
      <div className="w-full mt-8 flex flex-row gap-8">
        <div className="shadow-xl flex flex-col flex-1">
          <div className="text-xl text-center text-white p-4 bg-[#00954C] font-bold">Payments Due</div>
          <p className=" p-8 ">You have no payments due</p>
        </div>
        <div className="shadow-xl flex flex-col flex-1">
          <div className="text-xl text-center text-white p-4 bg-[#00954C] font-bold">Your Recent Activity</div>
          <ul className=" p-8 list-disc">
            <li>Paid for Mowing/Trimming on 02/04/2025</li>
            <li>Service request submitted on 01/02/2025</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
