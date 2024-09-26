import React, { useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Login from './components/Login/Login';
import Navbar from './components/Navbar/Navbar';
import Sidebar from './components/Sidebar/Sidebar';
import Add from './pages/Add/Add';
import Dashboard from './pages/Dashboard/Dashboard';
import List from './pages/List/List';
import Orders from './pages/Orders/Orders';
import Reports from './pages/Reports/Reports';

export const backendUrl = import.meta.env.VITE_BACKEND_URL

const App = () => {

  const url = "http://localhost:4000";

  const [token, setToken] = useState(localStorage.getItem('token') ? localStorage.getItem('token') : '');

  useEffect(() => {
    localStorage.setItem('token', token);
  }, [token])


  return (
    <div>
      <ToastContainer />
      {token === ""
        ? <Login setToken={setToken} />
        : <>
          <Navbar setToken={setToken} />
          <hr />
          <div className="app-content">
            <Sidebar />
            <Routes>
              <Route path='/dashboard' element={<Dashboard url={url} token={token} />} />
              <Route path='/add' element={<Add token={token} />} />
              <Route path='/list' element={<List token={token} />} />
              <Route path='/orders' element={<Orders token={token} />} />
              <Route path='/reports' element={<Reports url={url} token={token} />} />
            </Routes>
          </div>
        </>
      }
    </div>
  )
}

export default App