import React from "react";
import { useEffect, useState } from "react";

function Dashboard({ invoices, serviceData, userName }) {
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

  const sortedRecentServices = [...serviceData].sort(
    (a, b) => b.date.toDate() - a.date.toDate()
  ).slice(0, 3);

  return (
    <div className="flex max-w-[1080px] mx-auto items-center flex-col">
      <h1 className="text-3xl text-[#00954C] font-bold m-4">Dashboard</h1>
      <p>Hi {userName}, Welcome to your dashboard!</p>
      <div className="shadow-xl flex w-full mt-8">
        <div className="text-xl text-center text-white bg-[#00954C] p-4 font-bold">
          Announcements
        </div>
        <p className=" p-4 text-xl align-center">No new announcements</p>
      </div>
      <div className="w-full mt-8 flex flex-row gap-8">
        <div className="shadow-xl flex flex-col flex-1">
          <div className="text-xl text-center text-white p-4 bg-[#00954C] font-bold">
            Amount Due
          </div>
          <p className=" p-8 text-xl text-center">
            <strong>${totalDue}</strong>
          </p>
        </div>
        <div className="shadow-xl flex flex-col flex-1">
          <div className="text-xl text-center text-white p-4 bg-[#00954C] font-bold">
            Recent Services
          </div>

          <ul className="p-8 list-disc">
            {sortedRecentServices.map((service, index) => (
              <li key={index}>
                <strong>{service.type}</strong> on{" "}
                {service.date.toDate().toLocaleDateString()}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
