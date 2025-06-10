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
      <h1 className="text-3xl text-[#00954C] hidden sm:block font-bold mt-0 md:mt-4 mx-4">
        Dashboard
      </h1>
      {userName ? (
        <div>
          <p className="sm:mt-2 text-center font-bold">
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
        </div>
      ) : (
        <p className="sm:mt-2 font-bold">
          Log in or sign up to view your dashboard.
        </p>
      )}
      <div className="rounded-xl shadow-xl border border-[#00954C] w-full p-4 sm:p-8 mt-4">
        <div className=" flex w-full flex-col md:flex-row overflow-hidden rounded-lg">
          <div className="text-xl text-center flex text-white bg-[#00954C] justify-center p-2 md:p-4 font-bold">
            Announcements
          </div>
          <p className="p-4 md:text-lg text-center md:text-left bg-stone-200 w-full align-center">
            No new announcements
          </p>
        </div>

        {userName ? (
          <div className="w-full mt-4 sm:mt-8 flex flex-col sm:flex-row gap-4 sm:gap-8">
            <div className=" bg-stone-200 rounded-lg overflow-hidden flex flex-col flex-1 justify-between">
              <div className="text-xl text-center text-white p-2 md:p-4 bg-[#00954C] font-bold">
                Amount Due
              </div>
              <p className="p-8 text-xl text-center">
                <strong>${totalDue}</strong>
              </p>
              <Link className="w-fit mb-4 mx-auto" to="/payments">
                <button className="bg-stone-700 text-white flex items-center gap-2 cursor-pointer rounded-lg p-2 px-6 hover:bg-[#7BD650] transition duration-300">
                  <FaArrowRight />
                  <span>Payments</span>
                </button>
              </Link>
            </div>
            <div className=" bg-stone-200 rounded-lg overflow-hidden flex flex-col justify-between flex-1">
              <div className="text-xl text-center text-white p-2 md:p-4 bg-[#00954C] font-bold">
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
                <button className="bg-stone-700 text-white flex items-center gap-2 cursor-pointer rounded-lg p-2 px-6 hover:bg-[#7BD650] transition duration-300">
                  <FaArrowRight />
                  <span>Services</span>
                </button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="w-full mt-4 sm:mt-8 flex flex-col sm:flex-row gap-4 sm:gap-8">
            <div className="flex flex-col flex-1  text-xl text-stone-500 rounded-lg overflow-hidden   bg-white">
              <div className="text-xl text-white p-2 md:p-4 justify-center flex items-center bg-stone-500 font-bold">
                <FaLock />
                <span className="pl-2 font-bold">Amount Due</span>
              </div>
              <div className="py-4 px-4 bg-stone-200 sm:px-8 text-base">
                {" "}
                Please <strong>Sign In</strong> to view your amount due.
              </div>
            </div>
            <div className="flex flex-col flex-1 text-xl text-stone-500 rounded-lg overflow-hidden  bg-white">
              <div className="text-xl text-white sm:px-8 p-2 md:p-4 justify-center flex items-center bg-stone-500 font-bold">
                <FaLock />
                <span className="pl-2 font-bold">Recent Services</span>
              </div>
              <div className="py-4 bg-stone-200 px-4 sm:px-8 text-base">
                {" "}
                Please <strong>Sign In</strong> to view your recent services.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
