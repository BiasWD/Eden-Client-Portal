import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Nav from "./components/Nav";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import Payments from "./components/Payments";
import Services from "./components/Services";
import Login from "./components/Login";
import Signup from "./components/Signup";


function App() {
  const [count, setCount] = useState(0);

  return (
    <>
    <Router>
      <div className="h-screen bg-white">
        <Nav />
        <Sidebar />
        <div className="h-full w-5/6 ml-auto p-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/payments" element={<Payments />} />
            <Route path="/services" element={<Services />} />
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
