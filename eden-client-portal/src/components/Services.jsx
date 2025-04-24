import React from "react";

function Services( {serviceData, pricePerMowTrim } ) {

  const sortedServices = [...serviceData].sort(
    (a, b) => b.date.toDate() - a.date.toDate()
  );

  const serviceDivs = sortedServices.map((service, index) => (
    <div
      key={index}
      className="py-4 px-8 flex flex-row items-center border-t border-[#7BD650] gap-2 text-sm md:text-base"
    >
      <div className="flex-1">
        <span className="font-bold">Service:</span> {service.type}
      </div>
      <div className="flex-1">
        <span className="font-bold">Date Completed:</span> {service.date.toDate().toLocaleDateString()}
      </div>
    </div>
  ));

  return (
    <div className="flex max-w-[1080px] mx-auto items-center flex-col">
      <h1 className="text-3xl text-[#00954C] font-bold m-4">Services</h1>
      <p>Services will be listed here when completed.</p>
      <p>
        <strong>Note:</strong> The current base price for mowing and trimming your lawn is <strong>${pricePerMowTrim}</strong> per service.
      </p>
      <div className="w-full mt-8 flex flex-row gap-8">
        <div className="shadow-xl flex flex-col flex-1">
          <div className="text-xl text-white py-4 px-8 bg-[#00954C] font-bold">
            Service History
          </div>

          <>{serviceDivs}</>

        </div>
      </div>
    </div>
  );
}

export default Services;