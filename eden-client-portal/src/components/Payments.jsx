import React from "react";

function Payments( { invoices } ) {

  const invoiceDivs = invoices.map((invoice, index) => 
    <div key={index} className="py-4 px-8 flex flex-row items-center border-t border-[#7BD650] gap-2 text-sm md:text-base">
      <div className="flex-1">
        <span className="font-bold">Amount:</span> ${invoice.amount}
      </div>
      <div className="flex-1">
        <span className="font-bold">Status:</span>{" "}
        <span className={invoice.isPaid === true ? "text-[#00954C]" : "text-red-500"}>{invoice.isPaid === true ? "PAID" : "UNPAID"}</span>
      </div>
      <div className="flex-1">
        <span className="font-bold">Due:</span> dueDate
      </div>
    </div>
  
  )

  return (
    <div className="flex max-w-[1080px] mx-auto items-center flex-col">
      <h1 className="text-3xl text-[#00954C] font-bold m-4">Payments</h1>
      <p>Welcome to the Payment Page! Your bills will show up here.</p>
      <p>
        <strong>Note:</strong> Please allow time for payment status to update. We will change it manually once received.
      </p>

      <div className="w-full mt-8 flex flex-row gap-8">
        <div className="shadow-xl flex flex-col flex-1">
          <div className="text-xl text-white py-4 px-8 bg-[#00954C] font-bold">
            Billing History
          </div>
    
          <>
          {invoiceDivs}
          </>

          <div className="py-4 px-8 flex flex-row items-center border-t border-[#7BD650] gap-2 text-sm md:text-base">
            <div className="flex-1">
              <span className="font-bold">Service:</span> Mowing/Trimming
            </div>
            <div className="flex-1">
              <span className="font-bold">Amount:</span> $40
            </div>
            <div className="flex-1">
              <span className="font-bold">Status:</span>{" "}
              <span className="text-[#00954C]">PAID</span>
            </div>
            <div className="flex-1">
              <span className="font-bold">Due:</span> 1-4-25
            </div>
          </div>

          <div className="py-4 px-8 flex flex-row items-center border-t border-[#7BD650] gap-2 text-sm md:text-base">
            <div className="flex-1">
              <span className="font-bold">Service:</span> Mowing/Trimming
            </div>
            <div className="flex-1">
              <span className="font-bold">Amount:</span> $40
            </div>
            <div className="flex-1">
              <span className="font-bold">Status:</span>{" "}
              <span className="text-[#00954C]">PAID</span>
            </div>
            <div className="flex-1">
              <span className="font-bold">Due:</span> 1-4-25
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Payments;