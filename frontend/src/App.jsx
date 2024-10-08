import React, { useState } from "react";
import { Route, Routes } from "react-router-dom";
import FeedbackPopUp from "./components/FeedbackPopUp";
import Footer from "./components/Footer";
import LoginPopUp from "./components/LoginPopUp";
import { Navbar } from "./components/Navbar";
import SearchBar from "./components/SearchBar/SearchBar";
import About from "./pages/About";
import Cart from './pages/Cart';
import Contact from "./pages/Contact";
import Home from './pages/Home';
import Menu from "./pages/Menu";
import MyOrders from "./pages/MyOrders";
import MyProfile from "./pages/MyProfile";
import PlaceOrder from './pages/PlaceOrder';
import Verify from "./pages/Verify/Verify";

export const backendUrl = import.meta.env.VITE_BACKEND_URL

const App = () => {

  const [showLogin, setShowLogin] = useState(false)
  const [showFeedback, setShowFeedback] = useState(false)

  return (
    <>
      {showLogin ? <LoginPopUp setShowLogin={setShowLogin} /> : <></>}
      {showFeedback ? <FeedbackPopUp setShowFeedback={setShowFeedback} /> : <></>}
      <div className="app">
        <Navbar setShowLogin={setShowLogin} setShowFeedback={setShowFeedback} />
        <SearchBar />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/orders" element={<PlaceOrder />} />
          <Route path="/myorders" element={<MyOrders />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/myprofile" element={<MyProfile />} />
          <Route path="/verify" element={<Verify />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </div>
      <Footer />
    </>
  );
};

export default App;
