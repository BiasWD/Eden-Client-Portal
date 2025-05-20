import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Nav from "./components/Nav";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import Payments from "./components/Payments";
import Services from "./components/Services";
import Login from "./components/Login";
import Signup from "./components/Signup";
import { auth, db } from "./firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import {
  ClipLoader,
  PuffLoader,
  FadeLoader,
  RingLoader,
  GridLoader,
  BeatLoader,
  HashLoader,
  MoonLoader,
  PropagateLoader,
  PulseLoader,
  BarLoader,
  DotLoader,
  CircleLoader,
  BounceLoader,
  SyncLoader,
  ScaleLoader,
  ClimbingBoxLoader,
} from "react-spinners";

function App() {
  const [userName, setUserName] = useState("");
  const [serviceData, setServiceData] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [pricePerMowTrim, setPricePerMowTrim] = useState(0);
  const [hasClientData, setHasClientData] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setIsLoading(true);

      if (user) {
        setUserName(user.displayName || user.email || "");

        const uid = user.uid;

        try {
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
  return (
    <>
      <Router>
        <div className="h-screen bg-white">
          <Nav userName={userName} />
          <Sidebar />
          <div className="h-full w-5/6 ml-auto p-8">
            <Routes>
              <Route
                path="/"
                element={
                  isLoading ? (
                    <div className="flex max-w-[1080px] mx-auto items-center flex-col">
                      <h1 className="text-3xl text-[#00954C] font-bold m-4">Dashboard</h1>
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
                      <h1 className="text-3xl text-[#00954C] font-bold m-4">Payments</h1>
                      <ClipLoader
                        color="#00954C"
                        loading={isLoading}
                        size={100}
                        />
                    </div>
                  ) : (
                    <Payments invoices={invoices} userName={userName} />
                  )
                }
              />
              <Route
                path="/services"
                element={
                  isLoading ? (
                    <div className="flex max-w-[1080px] mx-auto items-center flex-col">
                      <h1 className="text-3xl text-[#00954C] font-bold m-4">Services</h1>
                      <ClipLoader
                        color="#00954C"
                        loading={isLoading}
                        size={100}
                        />
                    </div>
                  ) : (
                    <Services
                      serviceData={serviceData}
                      pricePerMowTrim={pricePerMowTrim}
                      userName={userName}
                      hasClientData={hasClientData}
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
