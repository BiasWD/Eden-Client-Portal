import React from "react";
import { useEffect, useState } from "react";
import { FaLock, FaArrowRight } from "react-icons/fa6";
import { Link } from "react-router-dom";

function Dashboard({ invoices, serviceData, userName, hasClientData }) {
  const [totalDue, setTotalDue] = useState(0);

  useEffect(() => {
    const calculateTotalDue = () => {
      const total = invoices.reduce((total, invoice) => {
        if (!invoice.isPaid) {
          return total + invoice.amount;
        }
        return total;
      }, 0);

      setTotalDue(total);
    };

    calculateTotalDue();
  }, [invoices]);

  const sortedRecentServices = [...serviceData]
    .sort((a, b) => b.date.toDate() - a.date.toDate())
    .slice(0, 3);

  return (
    <div className="flex max-w-[1080px] pb-8 mx-auto items-center flex-col">
      <h1 className="text-3xl text-[#00954C] font-bold mt-0 md:mt-4 mx-4">
        Dashboard
      </h1>
      {userName ? (
        <>
          <p className="mt-2 font-bold">
            Hi <span className="text-[#00954C]">{userName}</span>, Welcome to
            your dashboard!
          </p>
          {!hasClientData ? (
            <p className="text-sm text-center mt-2">
              <strong>Note:</strong> It looks like we don't have any client data
              for you yet. Please allow time for us to add you to the database
              or{" "}
              <a
                className="font-bold text-[#00954C] underline hover:text-[#7BD650] transition-colors"
                href="https://edenrootslawncare.com/contact.html"
                target="_blank"
                rel="noopener noreferrer"
              >
                Contact Us
              </a>
              .
            </p>
          ) : (
            ""
          )}
        </>
      ) : (
        <p className="mt-2 font-bold">
          Log in or sign up to view your dashboard.
        </p>
      )}
      <div className="shadow-xl flex w-full flex-col md:flex-row border-[#7BD650] border-1 overflow-hidden rounded-lg mt-8">
        <div className="text-xl text-center flex text-white bg-[#7BD650] p-4 font-bold">
          Announcements
        </div>
        <p className=" p-4 md:text-lg align-center">No new announcements</p>
      </div>

      {userName ? (
        <div className="w-full mt-4 sm:mt-8 flex flex-col sm:flex-row gap-4 sm:gap-8">
          <div className="shadow-xl border-[#00954C] border-1 rounded-lg overflow-hidden flex flex-col flex-1 justify-between">
            <div className="text-xl text-center text-white p-4 bg-[#00954C] font-bold">
              Amount Due
            </div>
            <p className=" p-8 text-xl text-center">
              <strong>${totalDue}</strong>
            </p>
            <Link className="w-fit mb-4 mx-auto" to="/payments">
              <button className="bg-[#00954C] text-white flex items-center gap-2 cursor-pointer rounded-lg p-2 px-6 hover:bg-[#7BD650] transition duration-300">
                <FaArrowRight />
                <span>Payments</span>
              </button>
            </Link>
          </div>
          <div className="shadow-xl border-[#00954C] border-1 rounded-lg overflow-hidden flex flex-col justify-between flex-1">
            <div className="text-xl text-center text-white p-4 bg-[#00954C] font-bold">
              Recent Services
            </div>

            <ul className="p-8 list-disc mx-auto text-sm md:text-base">
              {sortedRecentServices.map((service, index) => (
                <li key={index}>
                  <strong>{service.type}</strong> on{" "}
                  {service.date.toDate().toLocaleDateString()}
                </li>
              ))}
            </ul>
            <Link className="w-fit mb-4 mx-auto" to="/services">
              <button className="bg-[#00954C] text-white flex items-center gap-2 cursor-pointer rounded-lg p-2 px-6 hover:bg-[#7BD650] transition duration-300">
                <FaArrowRight />
                <span>Services</span>
              </button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="w-full mt-4 sm:mt-8 flex flex-col sm:flex-row gap-4 sm:gap-8">
          <div className="shadow-xl flex flex-col flex-1 border-stone-500 font-bold text-xl text-stone-500 rounded-lg overflow-hidden border-1  bg-white">
            <div className="text-xl text-white py-4 px-4 sm:px-8 flex items-center bg-stone-500 font-bold">
              <FaLock />
              <span className="pl-2">Amount Due</span>
            </div>
            <div className="py-4 px-8">
              {" "}
              Please log in to view your amount due.
            </div>
          </div>
          <div className="shadow-xl flex flex-col flex-1 border-stone-500 font-bold text-xl text-stone-500 rounded-lg overflow-hidden border-1  bg-white">
            <div className="text-xl text-white py-4 px-4 sm:px-8 flex items-center bg-stone-500 font-bold">
              <FaLock />
              <span className="pl-2">Recent Services</span>
            </div>
            <div className="py-4 px-8">
              {" "}
              Please log in to view your recent services.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
