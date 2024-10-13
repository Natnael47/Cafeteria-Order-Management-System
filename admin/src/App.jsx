import React, { useContext } from 'react';
import { Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import { AdminContext } from './context/AdminContext';
import Add from './pages/Add';
import AddEmployee from './pages/AddEmployee';
import Dashboard from './pages/Dashboard';
import EmployeesList from './pages/EmployeesList';
import List from './pages/List';
import Login from './pages/Login';
import Orders from './pages/Orders';
import Reports from './pages/Reports';

export const backendUrl = import.meta.env.VITE_BACKEND_URL

const App = () => {

  const { token } = useContext(AdminContext);

  return token ? (
    <div className='bg-gray-100'>
      <ToastContainer />
      <Navbar />
      <div className='flex items-start'>
        <Sidebar />
        <Routes>
          <Route path='/' element={<Dashboard />} />
          <Route path='/add' element={<Add />} />
          <Route path='/list' element={<List />} />
          <Route path='/orders' element={<Orders />} />
          <Route path='/reports' element={<Reports />} />
          <Route path='/add-employees' element={<AddEmployee />} />
          <Route path='/employees-list' element={<EmployeesList />} />
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