import "./App.css";
import { Routes, Route } from "react-router";
import Sidebar from "./components/Sidebar";
import Movies from "./components/Movies";
import Banner from "./components/Banner";
import Footer from "./components/Footer";
import { Contact, Admin, VerifyUser, Payment } from "./pages/index";

function App() {
  return (
    <>
      <div className="w-screen">
        <Sidebar />
        <Banner />
        <div className="sm:m-0 ml-[100px]">
          <Routes>
            <Route path="/movies" element={<Movies />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/my-account" element={<VerifyUser />} />
            <Route path="/cart-movies/*" element={<Payment />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </>
  );
}

export default App;
