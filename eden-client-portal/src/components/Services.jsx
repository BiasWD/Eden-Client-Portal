import React from "react";

function Services() {
  return (
    <div className="flex max-w-[1080px] mx-auto items-center flex-col">
      <h1 className="text-3xl text-[#00954C] font-bold m-4">Services</h1>
      <p>These are the services we offer and their rates.</p>
      <p>
        <strong>Note:</strong> Prices may vary depending on yard size or added
        requests. These are base prices.
      </p>

      <div className="w-full mt-8 flex flex-row gap-8">
        <div className="shadow-xl flex flex-col flex-1">
          <div className="text-xl text-white py-4 px-8 bg-[#00954C] font-bold">
            Service History
          </div>

          <div className="py-4 px-8 flex flex-row items-center border-t border-[#7BD650] gap-2 text-sm md:text-base">
            <div className="flex-1">
              <span className="font-bold">Service:</span> Mowing/Trimming
            </div>
            <div className="flex-1">
              <span className="font-bold">Price:</span> $40
            </div>
            <div className="flex-1">
              <span className="font-bold">Completed:</span> 1-2-25
            </div>
          </div>

          <div className="py-4 px-8 flex flex-row items-center border-t border-[#7BD650] gap-2 text-sm md:text-base">
            <div className="flex-1">
              <span className="font-bold">Service:</span> Edging
            </div>
            <div className="flex-1">
              <span className="font-bold">Price:</span> $10
            </div>
            <div className="flex-1">
              <span className="font-bold">Completed:</span> 2-22-25
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Services;