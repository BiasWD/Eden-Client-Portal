import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Nav from "./components/Nav";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import Payments from "./components/Payments";
import Services from "./components/Services";
import Login from "./components/Login";
import Signup from "./components/Signup";
import AdminDashboard from "./components/AdminDashboard";
import { auth, db } from "./firebase";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { ClipLoader } from "react-spinners";

function App() {
  const [userName, setUserName] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [serviceData, setServiceData] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [pricePerMowTrim, setPricePerMowTrim] = useState(0);
  const [hasClientData, setHasClientData] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [allClients, setAllClients] = useState([]);
  const [activeClient, setActiveClient] = useState(null);

  const selectedClient = allClients.find(
    (client) => client.uid === activeClient
  );

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setIsLoading(true);

      if (user) {
        console.log("User logged in:", user);
        console.log("Display name:", user.displayName);
        console.log("Photo URL:", user.photoURL);

        setUserName(user.displayName || user.email || "");
        setPhotoURL(user.photoURL || "");

        const uid = user.uid;

        try {
          // Check if the user is an admin
          const userRef = doc(db, "users", uid);
          const userSnap = await getDoc(userRef);

          if (userSnap.exists() && userSnap.data().isAdmin) {
            console.log("User is an admin");
            setIsAdmin(true);

            // Fetch all clients for admin view
            const clientsCollectionRef = collection(db, "clients");
            const clientsSnapshot = await getDocs(clientsCollectionRef);
            const clientData = clientsSnapshot.docs.map((doc) => doc.data());
            setAllClients(clientData);
            console.log("All clients data loaded for admin:", clientData);
            setIsLoading(false);
            return;
          } else {
            setIsAdmin(false);
          }

          const clientCollectionRef = collection(db, "clients");
          const q = query(clientCollectionRef, where("uid", "==", uid));
          const querySnapshot = await getDocs(q);

          if (!querySnapshot.empty) {
            const clientData = querySnapshot.docs[0].data();
            setHasClientData(true);
            setPricePerMowTrim(clientData.priceMowTrim || "undefined");
            setServiceData(clientData.serviceHistory || []);
            setInvoices(clientData.invoices || []);
            console.log("Client data loaded:", clientData);
          } else {
            console.log("No client data found for this user.");
          }
        } catch (error) {
          console.error("Error fetching client data:", error);
        }
      } else {
        console.log("User logged out – clearing all client data");
        // Clear all state on logout
        setHasClientData(false);
        setUserName("");
        setPricePerMowTrim("undefined");
        setServiceData([]);
        setInvoices([]);
        setAllClients([]);
      }

      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const addInvoice = async (invoice) => {
    if (!activeClient) {
      console.error("No active client selected for adding invoice.");
      return;
    }
    try {
      // Add the invoice to the active client's invoices
      const clientCollectionRef = collection(db, "clients");
      const q = query(clientCollectionRef, where("uid", "==", activeClient));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const clientRef = doc(db, "clients", querySnapshot.docs[0].id);
        await updateDoc(clientRef, {
          invoices: arrayUnion(invoice),
        });
        console.log("Invoice added successfully:", invoice);

        // Re-fetch and update the invoices state
        const clientsCollectionRef = collection(db, "clients");
        const clientsSnapshot = await getDocs(clientsCollectionRef);
        const clientData = clientsSnapshot.docs.map((doc) => doc.data());
        setAllClients(clientData); // This triggers a refresh of selectedClient.invoices
      } else {
        console.error("No client found for adding invoice.");
      }
    } catch (error) {
      console.error("Error adding invoice:", error);
    }
  };

  const updateInvoiceStatus = async (invoiceId, isPaid) => {
    if (!activeClient) {
      console.error("No active client selected for updating invoice status.");
      return;
    }
    try {
      const clientCollectionRef = collection(db, "clients");
      const q = query(clientCollectionRef, where("uid", "==", activeClient));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const clientRef = doc(db, "clients", querySnapshot.docs[0].id);
        const clientDoc = await getDoc(clientRef);
        const currentInvoices = clientDoc.data().invoices;

        // Update the isPaid status of the matching invoice
        const updatedInvoices = currentInvoices.map((invoice) => {
          if (invoice.id === invoiceId) {
            return { ...invoice, isPaid };
          } else {
            return invoice;
          }
        });

        await updateDoc(clientRef, { invoices: updatedInvoices });

        // Refresh the clients list
        const newSnapshot = await getDocs(clientCollectionRef);
        setAllClients(newSnapshot.docs.map((doc) => doc.data()));
      }
    } catch (error) {
      console.error("Error updating invoice status:", error);
    }
  };

  const addService = async (service) => {
    if (!activeClient) {
      console.error("No active client selected for adding service.");
      return;
    }
    try {
      // Add the service to the active client's serviceHistory
      const clientCollectionRef = collection(db, "clients");
      const q = query(clientCollectionRef, where("uid", "==", activeClient));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const clientRef = doc(db, "clients", querySnapshot.docs[0].id);
        await updateDoc(clientRef, {
          serviceHistory: arrayUnion(service),
        });
        console.log("Service added successfully:", service);

        // Re-fetch and update the clients state
        const clientsCollectionRef = collection(db, "clients");
        const clientsSnapshot = await getDocs(clientsCollectionRef);
        const clientData = clientsSnapshot.docs.map((doc) => doc.data());
        setAllClients(clientData); // Refresh selectedClient.serviceHistory
      } else {
        console.error("No client found for adding service.");
      }
    } catch (error) {
      console.error("Error adding service:", error);
    }
  };

  const addClient = async (clientData, clientNumber) => {
    try {
      const docId = `client_${String(clientNumber).padStart(4, "0")}`;
      const clientRef = doc(db, "clients", docId);

      // Check if the document already exists
      const existing = await getDoc(clientRef);
      if (existing.exists()) {
        alert(`Client number ${clientNumber} already exists!`);
        return;
      }

      // If not, add the new client
      await setDoc(doc(db, "clients", docId), {
        ...clientData,
      });
      console.log("Client added:", docId, clientData);

      // Refresh clients list
      const clientsCollectionRef = collection(db, "clients");
      const clientsSnapshot = await getDocs(clientsCollectionRef);
      const clientDataList = clientsSnapshot.docs.map((doc) => doc.data());
      setAllClients(clientDataList);
    } catch (error) {
      console.error("Error adding client:", error);
    }
  };

  return (
    <>
      <Router>
        <div className="min-h-screen bg-white">
          <Nav userName={userName} photoURL={photoURL} />
          <Sidebar
            isAdmin={isAdmin}
            setActiveClient={setActiveClient}
            activeClient={activeClient}
            activeClientName={selectedClient?.name}
            activeClientPrice={selectedClient?.priceMowTrim}
            activeClientUid={selectedClient?.uid}
          />
          <div className="min-h-screen w-full md:w-5/6 ml-auto p-4 sm:p-8">
            <Routes>
              <Route
                path="/"
                element={
                  isLoading ? (
                    <div className="flex max-w-[1080px] mx-auto items-center flex-col">
                      <h1 className="text-3xl text-[#00954C] hidden sm:block font-bold mt-0 md:mt-4 mx-4">
                        Dashboard
                      </h1>
                      <ClipLoader
                        color="#00954C"
                        loading={isLoading}
                        size={100}
                      />
                    </div>
                  ) : (
                    <Dashboard
                      hasClientData={hasClientData}
                      invoices={invoices}
                      serviceData={serviceData}
                      userName={userName}
                    />
                  )
                }
              />
              <Route
                path="/payments"
                element={
                  isLoading ? (
                    <div className="flex max-w-[1080px] mx-auto items-center flex-col">
                      <h1 className="text-3xl text-[#00954C] hidden sm:block font-bold mt-0 md:mt-4 mx-4">
                        Payments
                      </h1>
                      <ClipLoader
                        color="#00954C"
                        loading={isLoading}
                        size={100}
                      />
                    </div>
                  ) : (
                    <Payments
                      isAdmin={isAdmin}
                      invoices={
                        isAdmin ? selectedClient?.invoices || [] : invoices
                      }
                      setActiveClient={setActiveClient}
                      addInvoice={addInvoice}
                      updateInvoiceStatus={updateInvoiceStatus}
                      userName={userName}
                    />
                  )
                }
              />
              <Route
                path="/services"
                element={
                  isLoading ? (
                    <div className="flex max-w-[1080px] mx-auto items-center flex-col">
                      <h1 className="text-3xl text-[#00954C] hidden sm:block font-bold mt-0 md:mt-4 mx-4">
                        Services
                      </h1>
                      <ClipLoader
                        color="#00954C"
                        loading={isLoading}
                        size={100}
                      />
                    </div>
                  ) : (
                    <Services
                      serviceData={
                        isAdmin
                          ? selectedClient?.serviceHistory || []
                          : serviceData
                      }
                      isAdmin={isAdmin}
                      addService={addService}
                      pricePerMowTrim={pricePerMowTrim}
                      userName={userName}
                      hasClientData={hasClientData}
                      setActiveClient={setActiveClient}
                    />
                  )
                }
              />
              <Route
                path="/admin-dashboard"
                element={
                  isLoading ? (
                    <div className="flex max-w-[1080px] mx-auto items-center flex-col">
                      <h1 className="text-3xl text-[#00954C] hidden sm:block font-bold mt-0 md:mt-4 mx-4">
                        Admin Dashboard
                      </h1>
                      <ClipLoader
                        color="#00954C"
                        loading={isLoading}
                        size={100}
                      />
                    </div>
                  ) : (
                    <AdminDashboard
                      userName={userName}
                      allClients={allClients}
                      setActiveClient={setActiveClient}
                      addClient={addClient}
                    />
                  )
                }
              />
              <Route path="/signup" element={<Signup />} />
              <Route path="/login" element={<Login />} />
            </Routes>
          </div>
        </div>
      </Router>
    </>
  );
}

export default App;
