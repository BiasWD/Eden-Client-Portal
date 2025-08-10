import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";

function AdminDashboard({ userName, allClients, setActiveClient, addClient }) {
  const clientList = allClients.map((client, index) => (
    <div key={index} className="p-4 border-b flex flex-row border-stone-200">
      <div>
        <div className="text-lg font-semibold text-stone-700">
          {client.name}
        </div>
        <div className="text-sm text-stone-500">
          Mow/Trim Price: ${client.priceMowTrim}
        </div>
      </div>
      <div className="flex flex-row items-center">
        <Link to={"/payments"}>
          <button
            onClick={() => setActiveClient(client.uid)}
            className="bg-[#00954C] cursor-pointer text-white px-4 py-2 rounded-lg ml-4"
          >
            Payments
          </button>
        </Link>
        <Link to={"/services"}>
          <button
            onClick={() => setActiveClient(client.uid)}
            className="bg-[#00954C] cursor-pointer text-white px-4 py-2 rounded-lg ml-4"
          >
            Services
          </button>
        </Link>
      </div>
    </div>
  ));

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

  return (
    <div className="flex max-w-[1080px] pb-8 mx-auto items-center flex-col">
      <h1 className="text-3xl text-[#00954C] hidden sm:block font-bold mt-0 md:mt-4 mx-4">
        Admin Dashboard
      </h1>
      <div className="rounded-xl shadow-xl border border-t-[1rem] border-[#00954C] bg-stone-200 w-full p-4 sm:p-8 mt-4">
        <div className=" flex w-full flex-col md:flex-row bg-white overflow-hidden rounded-lg">
          <div className="text-xl text-center flex text-stone-700 bg-white justify-center p-2 md:p-4 font-bold">
            Announcements
          </div>
          <p className="p-4 md:text-lg text-center md:text-left bg-white w-full align-center">
            No new announcements
          </p>
          <input
            type="text"
            placeholder="Set announcement"
            className="p-4 md:text-lg text-center md:text-left border rounded-lg bg-white w-full align-center"
          ></input>
        </div>

        <div className=" bg-white rounded-lg overflow-hidden mt-4 md:mt-8 flex flex-col justify-between flex-1">
          <div className="text-xl text-center text-stone-700 p-2 md:p-4 font-bold">
            Clients
          </div>
          {addingClient ? (
            <div className="flex flex-col items-center">
              <div className="flex justify-between items-center w-1/2">
                <p className="flex font-bold">Add Client:</p>
                <button
                  onClick={() => setAddingClient(false)}
                  className="text-stone-700 font-bold flex items-center justify-center border rounded-lg p-1 cursor-pointer"
                >
                  Cancel
                </button>
              </div>
              <div className="flex flex-row items-center gap-4 justify-between p-4">
                <input
                  type="number"
                  placeholder="Client Number"
                  value={addClientNumber}
                  onChange={(e) => setAddClientNumber(e.target.value)}
                  className="p-2 border rounded-lg w-full mb-2"
                />
                <input
                  type="text"
                  placeholder="Client Name"
                  value={addClientName}
                  onChange={(e) => setAddClientName(e.target.value)}
                  className="p-2 border rounded-lg w-full mb-2"
                />
                <input
                  type="number"
                  placeholder="Mow/Trim Price"
                  value={addClientPrice}
                  onChange={(e) => setAddClientPrice(e.target.value)}
                  className="p-2 border rounded-lg w-full mb-2"
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
