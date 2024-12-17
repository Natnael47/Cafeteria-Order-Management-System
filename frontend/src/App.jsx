import React, { useState } from "react";
import { Route, Routes } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import FeedbackPopUp from "./components/FeedbackPopUp";
import Footer from "./components/Footer";
import LoginPopup from "./components/LoginPopup";
import { Navbar } from "./components/Navbar";
import SearchBar from "./components/SearchBar";
import About from "./pages/About";
import Cart from './pages/Cart';
import Contact from "./pages/Contact";
import Food_Detail from "./pages/Food_Detail";
import Home from './pages/Home';
import Login from "./pages/Login";
import Menu from "./pages/Menu";
import MyOrders from "./pages/MyOrders";
import MyProfile from "./pages/MyProfile";
import PlaceOrder from './pages/PlaceOrder';
import Verify from "./pages/Verify/Verify";

export const backendUrl = import.meta.env.VITE_BACKEND_URL;

const App = () => {
  const [showFeedback, setShowFeedback] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  return (
    <>
      <ToastContainer />
      {showFeedback && <FeedbackPopUp setShowFeedback={setShowFeedback} />}
      {showLogin && <LoginPopup setShowLogin={setShowLogin} />}

      <Navbar setShowFeedback={setShowFeedback} />

      <div className="app">
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
          <Route path="/login" element={<Login />} />
          <Route path="/food-detail/:id" element={<Food_Detail />} />
        </Routes>
      </div>

      <Footer />
    </>
  );
};

export default App;
