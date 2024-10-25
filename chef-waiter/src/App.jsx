import React, { useContext } from 'react';
import { Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './Components/Navbar';
import SideBar from './Components/SideBar';
import { ChefContext } from './Context/ChefContext';
import { WaiterContext } from './Context/WaiterContext';
import Dashboard from './Pages/Chef/Dashboard';
import Orders from './Pages/Chef/Orders';
import Login from './Pages/Login';
import Profile from './Pages/Profile';
import Customer from './Pages/Waiter/Customer';
import MyOrders from './Pages/Waiter/MyOrders';
import Tip from './Pages/Waiter/Tip';

export const backendUrl = import.meta.env.VITE_BACKEND_URL

const App = () => {

  const { cToken } = useContext(ChefContext);

  const { wToken } = useContext(WaiterContext);

  return cToken || wToken ? (
    <div className='bg-gray-100'>
      <ToastContainer />
      <Navbar />
      <div className='flex items-start'>
        <SideBar />
        <Routes>
          <Route path='/' element={<></>} />
          <Route path='/profile' element={<Profile />} />
          {/* Chef Route----- */}
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/orders' element={<Orders />} />

          {/* Waiter Route----- */}
          <Route path='/myOrder' element={<MyOrders />} />
          <Route path='/tip' element={<Tip />} />
          <Route path='/customer' element={<Customer />} />
        </Routes>
      </div>
    </div>
  ) : (
    <>
      <Login />
      <ToastContainer />
    </>
  )
}

export default App