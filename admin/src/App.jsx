import React, { useContext } from 'react';
import { Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import { AdminContext } from './context/AdminContext';
import AddEmployee from './pages/Add_Employee';
import Add from './pages/Add_Food';
import Dashboard from './pages/Dashboard';
import EmployeeProfile from './pages/Employee_Profile';
import EmployeesList from './pages/Employees_List';
import List from './pages/List_Food';
import Login from './pages/Login';
import Orders from './pages/Orders';
import Reports from './pages/Reports';

export const backendUrl = import.meta.env.VITE_BACKEND_URL;

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
          <Route path='/employee-profile/:employeeId' element={<EmployeeProfile />} /> {/* Updated route */}
        </Routes>
      </div>
    </div>
  ) : (
    <>
      <Login />
      <ToastContainer />
    </>
  );
};

export default App;
