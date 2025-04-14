import React from "react";
import { useEffect, useState } from "react";

function Payments({ invoices }) {
  const today = new Date();

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

  const sortedInvoices = [...invoices].sort(
    (a, b) => b.dueDate.toDate() - a.dueDate.toDate()
  );

  const invoiceDivs = sortedInvoices.map((invoice, index) => (
    <div
      key={index}
      className="py-4 px-8 flex flex-row items-center border-t border-[#7BD650] gap-2 text-sm md:text-base"
    >
      <div className="flex-1">
        <span className="font-bold">{invoice.description}</span>
      </div>
      <div className="flex-1">
        <span className="font-bold">Amount:</span> ${invoice.amount}
      </div>
      <div className="flex-1">
        <span className="font-bold">Status:</span>{" "}
        <span
          className={
            invoice.dueDate.toDate() < today
              ? invoice.isPaid === true
                ? "text-[#00954C]"
                : "text-red-500"
              : invoice.isPaid === true
              ? "text-[#00954C]"
              : "text-yellow-500"
          }
        >
          {invoice.dueDate.toDate() < today
            ? invoice.isPaid === true
              ? "Paid"
              : "OVERDUE"
            : invoice.isPaid === true
            ? "Paid"
            : "Unpaid"}
        </span>
      </div>
      <div className="flex-1">
        <span className="font-bold">Due:</span>{" "}
        {invoice.dueDate.toDate().toLocaleDateString()}
      </div>
    </div>
  ));

  return (
    <div className="flex max-w-[1080px] mx-auto items-center flex-col">
      <h1 className="text-3xl text-[#00954C] font-bold m-4">Payments</h1>
      <p>Welcome to the Payment Page! Your bills will show up here.</p>
      <p>
        <strong>Note:</strong> Please allow time for payment status to update.
        We will change it manually once received.
      </p>

      <div className="w-full mt-8 flex flex-row gap-8">
        <div className="shadow-xl flex flex-col flex-1">
          <div className="text-xl text-white py-4 px-8 bg-[#00954C] font-bold">
            Billing History
          </div>

          <>{invoiceDivs}</>
          <div>Total Due: {totalDue} </div>
        </div>
      </div>
    </div>
  );
}

export default Payments;
