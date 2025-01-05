import React, { useContext } from 'react';
import { Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import { AdminContext } from './context/AdminContext';
import Add_Drink from './pages/Add_Drink';
import AddEmployee from './pages/Add_Employee';
import Add from './pages/Add_Food';
import Dashboard from './pages/Dashboard';
import EmployeeProfile from './pages/Employee_Profile';
import EmployeesList from './pages/Employees_List';
import List_Drink from './pages/List_Drink';
import List from './pages/List_Food';
import Login from './pages/Login';
import Orders from './pages/Orders';
import Profile from './pages/Profile';
import Reports from './pages/Reports';
import Users from './pages/Users';

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
          <Route path='/add-drink' element={<Add_Drink />} />
          <Route path='/list' element={<List />} />
          <Route path='/list-drink' element={<List_Drink />} />
          <Route path='/orders' element={<Orders />} />
          <Route path='/reports' element={<Reports />} />
          <Route path='/users' element={<Users />} />
          <Route path='/add-employees' element={<AddEmployee />} />
          <Route path='/employees-list' element={<EmployeesList />} />
          <Route path='/employee-profile/:employeeId' element={<EmployeeProfile />} />
          <Route path='/profile' element={<Profile />} />
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
