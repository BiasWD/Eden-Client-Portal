import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { FaCheck } from "react-icons/fa";

function AdminDashboard({
  userName,
  allClients,
  setActiveClient,
  addClient,
  announcements,
  setAnnouncement,
}) {
  let totalDue = 0;

  const clientList = allClients.map((client, index) => {
    let amountDue = 0;
    for (let invoice of client.invoices) {
      if (!invoice.isPaid) {
        amountDue += invoice.amount;
      }
    }

    totalDue += amountDue;

    return (
      <div
        key={index}
        className="p-4 border-b flex flex-row gap-4 border-stone-200"
      >
        <div className="flex flex-1 flex-col text-center justify-center">
          <div className="text-lg font-semibold text-stone-700">
            {client.name}
          </div>
          <div className="text-sm text-stone-500">
            Mow/Trim Price: ${client.priceMowTrim}
          </div>
        </div>
        <div className="flex flex-1 flex-col text-center justify-center">
          <div className="text-sm text-stone-500">Amount Due:</div>
          <div className="text-lg font-semibold text-stone-700">
            <span className={`${amountDue > 0 ? "font-extrabold" : ""}`}>
              ${amountDue}
            </span>
          </div>
        </div>
        <div className="flex flex-1 flex-row flex-wrap gap-2 items-center justify-center">
          <Link to={"/payments"} className="w-full flex flex-1 sm:w-auto">
            <button
              onClick={() => setActiveClient(client.uid)}
              className="bg-[#00954C] cursor-pointer text-white w-full px-4 py-2 rounded-lg"
            >
              Payments
            </button>
          </Link>
          <Link to={"/services"} className="w-full flex flex-1 sm:w-auto">
            <button
              onClick={() => setActiveClient(client.uid)}
              className="bg-[#00954C] cursor-pointer text-white w-full px-4 py-2 rounded-lg"
            >
              Services
            </button>
          </Link>
        </div>
      </div>
    );
  });

  const [addingClient, setAddingClient] = useState(false);
  const [addClientNumber, setAddClientNumber] = useState("");
  const [addClientName, setAddClientName] = useState("");
  const [addClientPrice, setAddClientPrice] = useState("");

  const clientToAdd = {
    clientNumber: addClientNumber ? Number(addClientNumber) : null,
    uid: `temp-uid-${addClientNumber}`,
    name: addClientName || "New Client",
    priceMowTrim: addClientPrice ? Number(addClientPrice) : null,
    invoices: [],
    serviceHistory: [],
  };

  const [announcementInput, setAnnouncementInput] = useState("");
  const [announcementToSet, setAnnouncementToSet] = useState("");
  const [confirmingAnnouncement, setConfirmingAnnouncement] = useState(false);

  return (
    <div className="flex max-w-[1080px] pb-8 mx-auto items-center flex-col">
      <h1 className="text-3xl text-[#00954C] hidden sm:block font-bold mt-0 md:mt-4 mx-4">
        Admin Dashboard
      </h1>
      <div className="rounded-xl shadow-xl border border-t-[1rem] border-[#00954C] bg-stone-200 w-full p-4 sm:p-8 mt-4">
        <div className=" flex w-full flex-col lg:flex-row p-2 bg-white overflow-hidden rounded-lg">
          <div className="text-xl text-center flex text-stone-700 bg-white justify-center p-2 md:p-4 font-bold">
            Announcements
          </div>
          <p className="p-4 md:text-lg text-center bg-white w-full align-center">
            {announcements.length > 0
              ? announcements[0].message
              : "No new announcements"}
          </p>
          <input
            type="text"
            value={announcementInput}
            onChange={(e) => setAnnouncementInput(e.target.value)}
            placeholder="Set announcement"
            className=" p-4 lg:text-lg text-center border rounded-lg bg-white w-11/12 mx-auto"
          ></input>{" "}
          {announcementInput && !confirmingAnnouncement ? (
            <button
              onClick={() => {
                setConfirmingAnnouncement(true);
                setAnnouncementToSet(announcementInput);
              }}
              className="bg-[#00954C] hover:bg-[#007a3c] p-4 rounded-lg cursor-pointer h-1/2 mx-8 lg:mx-4 my-4"
            >
              <FaCheck className="mx-auto text-white" />
            </button>
          ) : null}
        </div>
        <div className="w-full flex flex-col lg:flex-row gap-4 lg:gap-8">
          {confirmingAnnouncement && (
            <div className="bg-green-50 border border-stone-700 rounded-lg p-4 mt-8 w-full">
              <div className="flex items-center gap-4">
                <div className="flex-1 min-w-0">
                  <span className="font-bold">Announcement says: </span>
                  <span className="break-words">{announcementToSet}</span>
                </div>
                <button
                  onClick={() => {
                    setAnnouncement(announcementToSet);
                    setAnnouncementInput("");
                    setAnnouncementToSet("");
                    setConfirmingAnnouncement(false);
                  }}
                  className="bg-[#00954C] text-white px-4 py-2 rounded-lg shrink-0 hover:bg-[#7BD650] transition fade cursor-pointer"
                >
                  Confirm
                </button>
                <button
                  onClick={() => {
                    setConfirmingAnnouncement(false);
                    setAnnouncementToSet("");
                  }}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg shrink-0 hover:bg-red-600 transition fade cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        <div className=" bg-white rounded-lg overflow-hidden mt-4 md:mt-8 flex flex-col justify-between flex-1">
          <div className="text-xl text-center text-stone-700 p-2 md:p-4 font-bold">
            <span className="p-4">Clients</span>|
            <span className="p-4">Total Due: ${totalDue}</span>
          </div>
          {addingClient ? (
            <div className="flex flex-col items-center bg-stone-200 border-1 border-stone-700 rounded-lg py-4 mx-4">
              <div className="flex justify-between items-center w-1/2">
                <p className="flex font-bold">Add Client:</p>
                <button
                  onClick={() => setAddingClient(false)}
                  className="text-stone-700 font-bold flex items-center justify-center border rounded-lg p-1 cursor-pointer"
                >
                  Cancel
                </button>
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 justify-between p-4">
                <input
                  type="number"
                  placeholder="Client Number"
                  value={addClientNumber}
                  onChange={(e) => setAddClientNumber(e.target.value)}
                  className="bg-white p-2 border rounded-lg w-full mb-2 sm:mb-0"
                />
                <input
                  type="text"
                  placeholder="Client Name"
                  value={addClientName}
                  onChange={(e) => setAddClientName(e.target.value)}
                  className="bg-white p-2 border rounded-lg w-full mb-2 sm:mb-0"
                />
                <input
                  type="number"
                  placeholder="Mow/Trim Price"
                  value={addClientPrice}
                  onChange={(e) => setAddClientPrice(e.target.value)}
                  className="bg-white p-2 border rounded-lg w-full sm:mb-0"
                />
              </div>
              <button
                disabled={!addClientNumber || !addClientName || !addClientPrice}
                onClick={() => {
                  addClient(clientToAdd, addClientNumber);
                  setAddingClient(false);
                  setAddClientNumber("");
                  setAddClientName("");
                  setAddClientPrice("");
                }}
                className="disabled:opacity-50 bg-[#00954C] cursor-pointer text-white px-4 py-2 rounded-lg"
              >
                Add Client
              </button>
            </div>
          ) : (
            <button
              onClick={() => setAddingClient(true)}
              className="bg-stone-700 text-white w-fit mx-auto px-4 cursor-pointer py-2 rounded-lg"
            >
              + Add New Client
            </button>
          )}
          {clientList}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
