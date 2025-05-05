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

function App() {
  const [userName, setUserName] = useState("");
  const [serviceData, setServiceData] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [pricePerMowTrim, setPricePerMowTrim] = useState(0);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const uid = user.uid;

        try {
          const clientCollectionRef = collection(db, "clients");
          const q = query(clientCollectionRef, where("uid", "==", uid));
          const querySnapshot = await getDocs(q);

          if (!querySnapshot.empty) {
            const clientData = querySnapshot.docs[0].data();
            setPricePerMowTrim(clientData.priceMowTrim || "undefined");
            setServiceData(clientData.serviceHistory || []);
            setInvoices(clientData.invoices || []);
            setUserName(clientData.name);
            console.log("Client data loaded:", clientData);
          } else {
            console.log("No client data found for this user.");
          }
        } catch (error) {
          console.error("Error fetching client data:", error);
        }
      } else {
        console.log("User logged out – clearing all client data");
        // ✅ Clear all state on logout
        setUserName("");
        setPricePerMowTrim("undefined");
        setServiceData([]);
        setInvoices([]);
      }
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
                  <Dashboard
                    invoices={invoices}
                    serviceData={serviceData}
                    userName={userName}
                  />
                }
              />
              <Route
                path="/payments"
                element={<Payments invoices={invoices} userName={userName} />}
              />
              <Route
                path="/services"
                element={
                  <Services
                    serviceData={serviceData}
                    pricePerMowTrim={pricePerMowTrim}
                    userName={userName}
                  />
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
