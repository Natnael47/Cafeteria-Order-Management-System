import React, { useState } from "react";
import { Route, Routes } from "react-router-dom";
import Footer from "./components/Footer/Footer";
import LoginPopUp from "./components/LoginPopUp/LoginPopUp";
import { Navbar } from "./components/Navbar/Navbar";
import SearchBar from "./components/SearchBar/SearchBar";
import About from "./pages/About";
import Cart from './pages/Cart/Cart';
import Contact from "./pages/Contact";
import Home from './pages/Home/Home';
import Menu from "./pages/Menu/Menu";
import MyOrders from "./pages/MyOrders/MyOrders";
import MyProfile from "./pages/MyProfile/MyProfile";
import PlaceOrder from './pages/PlaceOrder/PlaceOrder';
import Verify from "./pages/Verify/Verify";



const App = () => {

  const [showLogin, setShowLogin] = useState(false)

  return (
    <>
      {showLogin ? <LoginPopUp setShowLogin={setShowLogin} /> : <></>}
      <div className="app">
        <Navbar setShowLogin={setShowLogin} />
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
