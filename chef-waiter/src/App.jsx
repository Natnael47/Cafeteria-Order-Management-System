import React, { useContext } from 'react';
import { Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './Components/Navbar';
import SideBar from './Components/SideBar';
import { ChefContext } from './Context/ChefContext';
import { InventoryContext } from './Context/InventoryContext';
import Dashboard from './Pages/Chef/Dashboard';
import Orders from './Pages/Chef/Orders';
import Request_Stock from './Pages/Chef/Request_Stock';
import AddInventory from './Pages/Inventory_manager/AddInventory';
import Inventory from './Pages/Inventory_manager/Inventory';
import Inventory_Dashboard from './Pages/Inventory_manager/Inventory_Dashboard';
import Inventory_Orders from './Pages/Inventory_manager/Inventory_Orders';
import Stock from './Pages/Inventory_manager/Stock';
import Suppliers from './Pages/Inventory_manager/Suppliers';
import Login from './Pages/Login';
import Profile from './Pages/Profile';

export const backendUrl = import.meta.env.VITE_BACKEND_URL

const App = () => {

  const { cToken } = useContext(ChefContext);

  const { iToken } = useContext(InventoryContext);

  return cToken || iToken ? (
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
          <Route path='/request' element={<Request_Stock />} />

          {/* inventory manager Route----- */}
          <Route path='/inventory' element={<Inventory />} />
          <Route path='/inv-dashboard' element={<Inventory_Dashboard />} />
          <Route path='/suppliers' element={<Suppliers />} />
          <Route path='/inv-orders' element={<Inventory_Orders />} />
          <Route path='/store' element={<Stock />} />
          <Route path='/add_inventory' element={<AddInventory />} />
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