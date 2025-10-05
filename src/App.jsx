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
  addDoc,
  arrayUnion,
  serverTimestamp,
  writeBatch,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { ClipLoader } from "react-spinners";

function App() {
  // === USER AUTHENTICATION STATE ===
  const [userName, setUserName] = useState(""); // Stores the logged-in user's display name
  const [photoURL, setPhotoURL] = useState(""); // Stores the user's profile photo URL
  const [isAdmin, setIsAdmin] = useState(false); // Tracks if current user has admin privileges

  // === CLIENT DATA STATE ===
  const [serviceData, setServiceData] = useState([]); // Individual client's service history
  const [invoices, setInvoices] = useState([]); // Individual client's invoices
  const [pricePerMowTrim, setPricePerMowTrim] = useState(0); // Client's base service price
  const [hasClientData, setHasClientData] = useState(false); // Whether client data exists

  // === ADMIN AND CLIENT MANAGEMENT STATE ===
  const [allClients, setAllClients] = useState([]); // List of all clients (admin only)
  const [activeClient, setActiveClient] = useState(null); // Currently selected client (admin view)

  // === UI STATE ===
  const [isLoading, setIsLoading] = useState(false); // Loading state for data fetching
  const [sideBarOpen, setSideBarOpen] = useState(true); // State to manage sidebar visibility on small screens
  const [announcements, setAnnouncements] = useState([]); // Store active announcements

  // Find the currently selected client from allClients array based on activeClient ID
  const selectedClient = allClients.find(
    (client) => client.uid === activeClient
  );

  // Toggle the sidebar visibility on small screens
  const toggleSidebar = () => {
    setSideBarOpen(!sideBarOpen);
  };

  // === AUTHENTICATION AND DATA FETCHING EFFECT ===
  // This effect runs when the component mounts and handles user authentication state changes
  useEffect(() => {
    // Subscribe to Firebase auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setIsLoading(true); // Start loading state while we fetch data

      if (user) {
        console.log("User logged in:", user);
        console.log("Display name:", user.displayName);
        console.log("Photo URL:", user.photoURL);

        setUserName(user.displayName || user.email || "");
        setPhotoURL(user.photoURL || "");

        const uid = user.uid;

        // === ANNOUNCEMENT MANAGEMENT ===
        /**
         * Fetches the currently active announcement from Firestore
         * Only one announcement should be active at a time
         * When adding new announcements, make sure to set previous ones to inactive
         */
        const getAnnouncements = async () => {
          try {
            // Query Firestore for the active announcement
            const q = query(
              collection(db, "announcements"),
              where("isActive", "==", true) // Only get announcements marked as active
            );

            // Get the documents and transform them to a usable format
            const snapshot = await getDocs(q);
            const announcements = snapshot.docs.map((doc) => ({
              id: doc.id, // Keep the document ID for reference
              ...doc.data(), // Spread in all the announcement data
            }));

            setAnnouncements(announcements);
            console.log("Active announcement loaded:", announcements);
          } catch (error) {
            console.error("Error fetching announcement:", error);
          }
        };

        // Fetch announcements for all authenticated users
        await getAnnouncements();

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

  // === INVOICE MANAGEMENT FUNCTIONS ===
  /**
   * Adds a new invoice to the selected client's records
   * @param {Object} invoice - The invoice object to add
   * @param {string} invoice.id - Unique identifier for the invoice
   * @param {string} invoice.description - Description of the service
   * @param {number} invoice.amount - Amount due
   * @param {boolean} invoice.isPaid - Payment status
   * @param {Date} invoice.dueDate - Due date for the invoice
   */
  const addInvoice = async (invoice) => {
    // Safety check: ensure we have an active client selected
    if (!activeClient) {
      console.error("No active client selected for adding invoice.");
      return;
    }
    try {
      // Query Firestore to find the active client's document
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

  /**
   * Updates the payment status of a specific invoice
   * @param {string} invoiceId - The ID of the invoice to update
   * @param {boolean} isPaid - The new payment status
   */
  const updateInvoiceStatus = async (invoiceId, isPaid) => {
    // Safety check: ensure we have an active client selected
    if (!activeClient) {
      console.error("No active client selected for updating invoice status.");
      return;
    }
    try {
      // Query Firestore to find the client's document
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

  // === SERVICE MANAGEMENT FUNCTIONS ===
  /**
   * Adds a new service record to the selected client's history
   * @param {Object} service - The service record to add
   * @param {Date} service.date - Date the service was performed
   * @param {string} service.type - Type of service performed
   */
  const addService = async (service) => {
    // Safety check: ensure we have an active client selected
    if (!activeClient) {
      console.error("No active client selected for adding service.");
      return;
    }
    try {
      // Query Firestore to find the client and add service to their history
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

  // === CLIENT MANAGEMENT FUNCTIONS ===
  /**
   * Creates a new client in the database with a formatted client number
   * @param {Object} clientData - The client's information
   * @param {string} clientNumber - Unique client identifier number
   */
  const addClient = async (clientData, clientNumber) => {
    try {
      // Create a formatted document ID (e.g., client_0001)
      const docId = `client_${String(clientNumber).padStart(4, "0")}`;
      const clientRef = doc(db, "clients", docId);

      // Prevent duplicate client numbers
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

  // === ANNOUNCEMENT MANAGEMENT FUNCTIONS ===
  /**
   * Updates the active announcement in Firestore
   * Only one announcement can be active at a time
   * @param {string} message - The announcement message to display
   */
  const setAnnouncement = async (message) => {
    try {
      // First, deactivate any existing active announcements
      const q = query(
        collection(db, "announcements"),
        where("isActive", "==", true)
      );
      const snapshot = await getDocs(q);

      // Deactivate old announcements
      const batch = writeBatch(db);
      snapshot.docs.forEach((doc) => {
        batch.update(doc.ref, { isActive: false });
      });
      await batch.commit();

      // Create new active announcement
      const announcementRef = collection(db, "announcements");
      await addDoc(announcementRef, {
        message,
        createdAt: serverTimestamp(),
        isActive: true,
      });

      // Refresh announcements
      await getAnnouncements();
    } catch (error) {
      console.error("Error setting announcement:", error);
    }
  };

  // === RENDER APPLICATION UI ===
  return (
    <>
      <Router>
        <div className="min-h-screen bg-white">
          {/* Top navigation bar with user info */}
          <Nav userName={userName} photoURL={photoURL} />

          {/* Side navigation with client selection for admins */}
          <Sidebar
            isAdmin={isAdmin}
            setActiveClient={setActiveClient}
            activeClient={activeClient}
            activeClientName={selectedClient?.name}
            activeClientPrice={selectedClient?.priceMowTrim}
            activeClientUid={selectedClient?.uid}
            sideBarOpen={sideBarOpen}
            toggleSidebar={toggleSidebar}
          />
          {/* Main content area with routes */}
          <div
            className={`min-h-screen w-full ${
              sideBarOpen ? "md:w-5/6" : ""
            } ml-auto p-4 sm:p-8`}
          >
            <Routes>
              {/* Home/Dashboard Route */}
              <Route
                path="/"
                element={
                  isLoading ? (
                    // Loading state with spinner
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
                      announcements={announcements}
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
                      announcements={announcements}
                      setAnnouncement={setAnnouncement}
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
