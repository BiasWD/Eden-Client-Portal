import { useEffect, useState } from "react";
import { FaLock, FaArrowLeft } from "react-icons/fa6";
import { Link } from "react-router-dom";
function Payments({ invoices, userName }) {
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
      className="py-4 px-4 sm:px-8 flex flex-row items-center border-t border-[#7BD650] gap-2 text-sm md:text-base"
    >
      <div className="flex-1">
        <span className="font-bold text-stone-700">{invoice.description}</span>
      </div>
      <div className="flex-1">${invoice.amount}</div>
      <div className="flex-1">
        <span
          className={
            invoice.dueDate.toDate() < today
              ? invoice.isPaid === true
                ? "text-[#00954C]"
                : "text-red-500 font-bold"
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
        {invoice.dueDate.toDate().toLocaleDateString()}
      </div>
    </div>
  ));

  return (
    <div className="flex max-w-[1080px] pb-8 mx-auto items-center flex-col">
      <h1 className="text-3xl text-[#00954C] hidden sm:block font-bold mt-0 md:mt-4 mx-4">
        Payments
      </h1>
      <p className="text-center font-bold sm:mt-2">
        Your bills will show up here.
      </p>
      <p className="text-center text-sm mt-2">
        <strong>Note:</strong> Please allow time for payment status to update.
        We will change it manually once received.
      </p>

      <div className="w-full mt-8 flex flex-col text-center md:text-left gap-8">
        {userName ? (
          <>
            <div className="shadow-xl flex flex-col flex-1 border-[#00954C] border-1 rounded-lg overflow-hidden bg-white">
              <div className="text-xl text-white py-2 md:py-4 px-4 sm:px-8 bg-[#00954C] font-bold">
                Billing Records
              </div>
              <div className="text-xl font-bold py-2 md:py-4 px-4 sm:px-8 bg-stone-700 text-stone-200">
                Total Due:{" "}
                <span className="text-black px-4 py-1 inline-flex mx-1 bg-white rounded-xl">
                  ${totalDue}
                </span>
              </div>
              <div className="py-4 px-4 sm:px-8 flex flex-row items-center gap-2 bg-stone-200 text-stone-900 text-sm md:text-base">
                <div className="flex-1">
                  <span className="font-bold">Title</span>
                </div>
                <div className="flex-1">
                  <span className="font-bold">Amount</span>
                </div>
                <div className="flex-1">
                  <span className="font-bold">Status</span>
                </div>
                <div className="flex-1">
                  <span className="font-bold">Due Date</span>
                </div>
              </div>
              <>{invoiceDivs}</>
            </div>
            <div className="w-full flex">
              <Link className="w-fit sm:my-4 mx-auto" to="/">
                <button className="bg-[#00954C]  text-white flex flex-row rounded-lg cursor-pointer items-center gap-2 p-2 px-6 hover:bg-[#7BD650] transition duration-300">
                  <span>Dashboard</span>
                  <FaArrowLeft />
                </button>
              </Link>
            </div>
          </>
        ) : (
          <div className="shadow-xl flex flex-col flex-1 border-stone-500 text-xl text-stone-500 border-1 rounded-lg overflow-hidden bg-white">
            <div className="text-xl text-white p-2 md:p-4 justify-center sm:px-8 flex items-center bg-stone-500 font-bold">
              <FaLock />
              <span className="pl-2 font-bold">Billing Records</span>
            </div>
            <div className="py-4 px-4 sm:px-8 text-base">
              {" "}
              Please <strong>Sign In</strong> to view your payment history.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Payments;
