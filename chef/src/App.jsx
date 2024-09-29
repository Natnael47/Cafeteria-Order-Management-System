import React, { useContext } from 'react';
import { Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './Components/Navbar';
import SideBar from './Components/SideBar';
import { ChefContext } from './Context/ChefContext';
import Dashboard from './Pages/Chef/Dashboard';
import Orders from './Pages/Chef/Orders';
import Login from './Pages/Login';

const App = () => {

  const { cToken } = useContext(ChefContext)

  return cToken ? (
    <div className='bg-gray-100'>
      <ToastContainer />
      <Navbar />
      <div className='flex items-start'>
        <SideBar />
        <Routes>
          <Route path='/' element={<></>} />
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/orders' element={<Orders />} />
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