import React from "react";
import { FaLock, FaArrowLeft } from "react-icons/fa6";
import { Link } from "react-router-dom";

function Services({ serviceData, pricePerMowTrim, userName, hasClientData }) {
  const sortedServices = [...serviceData].sort(
    (a, b) => b.date.toDate() - a.date.toDate()
  );

  const serviceDivs = sortedServices.map((service, index) => (
    <div
      key={index}
      className="py-4 px-8 flex flex-row items-center border-t border-[#7BD650] gap-2 text-sm md:text-base"
    >
      <div className="flex-1 font-bold text-stone-700">{service.type}</div>
      <div className="flex-1">{service.date.toDate().toLocaleDateString()}</div>
    </div>
  ));

  return (
    <div className="flex max-w-[1080px] mx-auto items-center flex-col">
      <h1 className="text-3xl text-[#00954C] font-bold m-4">Services</h1>
      <p>Services will be listed here when completed.</p>
      <p>
        <strong>Note:</strong> The current base price for mowing and trimming
        your lawn{" "}
        {hasClientData ? (
          <span>
            is <strong>${pricePerMowTrim}</strong> per service
          </span>
        ) : (
          "will also be listed here"
        )}
        .
      </p>
      <div className="w-full mt-8 flex flex-col gap-8">
        {userName ? (
          <>
            <div className="shadow-xl flex flex-col flex-1 border-[#00954C] border-1 rounded-lg overflow-hidden">
              <div className="text-xl text-white py-4 px-8 bg-[#00954C] font-bold">
                Service History
              </div>
              <div className="py-4 px-8 flex flex-row items-center gap-2 bg-stone-200 text-stone-900 text-md md:text-lg">
                <div className="flex-1">
                  <span className="font-bold">Service</span>
                </div>
                <div className="flex-1">
                  <span className="font-bold">Date Completed</span>
                </div>
              </div>
              <>{serviceDivs}</>
            </div>
            <div className="w-full flex">
              <Link className="w-fit my-4 mx-auto" to="/">
                <button className="bg-[#00954C]  text-white flex flex-row rounded-md cursor-pointer items-center gap-2 p-2 px-6 hover:bg-[#7BD650] transition duration-300">
                  <span>Dashboard</span>
                  <FaArrowLeft />
                </button>
              </Link>
            </div>
          </>
        ) : (
          <div className="shadow-xl flex flex-col flex-1 border-stone-500 font-bold text-xl text-stone-500 border-1 rounded-lg overflow-hidden bg-white">
            <div className="text-xl text-white py-4 px-8 flex items-center bg-stone-500 font-bold">
              <FaLock />
              <span className="pl-2">Service History</span>
            </div>
            <div className="py-4 px-8">
              {" "}
              Please log in to view your service history.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Services;
