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

  return (
    <>
      <Router>
        <div className="min-h-screen bg-white">
          <Nav userName={userName} photoURL={photoURL} />
          <Sidebar isAdmin={isAdmin} />
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
                      addInvoice={addInvoice}
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
                      pricePerMowTrim={pricePerMowTrim}
                      userName={userName}
                      hasClientData={hasClientData}
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
