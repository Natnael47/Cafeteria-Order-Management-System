import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { toast } from "react-toastify";
import { backendUrl } from "../App";
import { AdminContext } from '../context/AdminContext';

const Users = () => {
    const [usersData, setUsersData] = useState([]);
    const { token } = useContext(AdminContext);
    const [currentView, setCurrentView] = useState("users"); // Default to 'users' view

    // Fetch the users' data from the API
    const fetchUserList = async () => {
        try {
            const response = await axios.get(backendUrl + "/api/user/all-users", {
                headers: { token }, // Pass the token in headers for authorization
            });

            if (response.data.success) {
                setUsersData(response.data.data); // Assuming the response contains a 'data' field with the users
            } else {
                toast.error("Error fetching user list");
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
            toast.error("An error occurred while fetching users");
        }
    };

    // Fetch the user data on component mount
    useEffect(() => {
        fetchUserList();
    }, []);

    // Function to format the date
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    return (
        <div className="flex flex-col m-5 w-full max-w-6xl">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-semibold text-gray-700">Users</h1>
                <div className="flex items-center space-x-4">
                    <button className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
                        + New
                    </button>
                    <button className="p-2 bg-gray-200 rounded hover:bg-gray-300">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8h16M4 16h16" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex items-center space-x-4 mb-6">
                <button
                    className={`px-4 py-2 rounded ${currentView === "users" ? "bg-green-500 text-white" : "bg-gray-200 text-gray-700"} hover:bg-green-500 hover:text-white`}
                    onClick={() => setCurrentView("users")} // Switch to 'users'
                >
                    Users
                </button>
                <button
                    className={`px-4 py-2 rounded ${currentView === "feedback" ? "bg-green-500 text-white" : "bg-gray-200 text-gray-700"} hover:bg-green-500 hover:text-white`}
                    onClick={() => setCurrentView("feedback")} // Switch to 'feedback'
                >
                    Feedback
                </button>
                <button
                    className={`px-4 py-2 rounded ${currentView === "orders" ? "bg-green-500 text-white" : "bg-gray-200 text-gray-700"} hover:bg-green-500 hover:text-white`}
                    onClick={() => setCurrentView("orders")} // Switch to 'orders'
                >
                    Orders
                </button>
                <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300">Deleted</button>
            </div>

            {/* Search and Show */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                    <label className="text-gray-700">Show</label>
                    <select className="border border-gray-300 rounded px-2 py-1">
                        <option value="10">10</option>
                        <option value="25">25</option>
                        <option value="50">50</option>
                    </select>
                    <label className="text-gray-700">entries</label>
                </div>
                <input
                    type="text"
                    placeholder="Search"
                    className="border border-gray-300 rounded px-4 py-2"
                />
            </div>

            {/* the display Div */}
            <div className="bg-[#F3F4F6] rounded w-full max-w-6xl max-h-[88vh] overflow-scroll">
                {currentView === "users" && (
                    <div className="bg-white shadow rounded">
                        {/* Users Data Table */}
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="px-4 py-2 border">ID</th>
                                    <th className="px-4 py-2 border">Name</th>
                                    <th className="px-4 py-2 border">Email</th>
                                    <th className="px-4 py-2 border">Address</th>
                                    <th className="px-4 py-2 border">Gender</th>
                                    <th className="px-4 py-2 border">Phone</th>
                                    <th className="px-4 py-2 border">Account Created</th>
                                </tr>
                            </thead>
                            <tbody>
                                {usersData.length > 0 ? (
                                    usersData.map((user, index) => (
                                        <tr key={user.id} className={index % 2 === 0 ? "bg-gray-50" : ""}>
                                            <td className="px-4 py-2 border">{user.id}</td>
                                            <td className="px-4 py-2 border">{user.firstName} {user.lastName}</td>
                                            <td className="px-4 py-2 border">{user.email}</td>
                                            <td className="px-4 py-2 border">
                                                {user.address && user.address.line1 && user.address.line2
                                                    ? `${user.address.line1}, ${user.address.line2}`
                                                    : "No address available"}
                                            </td>
                                            <td className="px-4 py-2 border">{user.gender || 'Not Selected'}</td>
                                            <td className="px-4 py-2 border">{user.phone || 'No Phone'}</td>
                                            <td className="px-4 py-2 border">{formatDate(user.createdAt)}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="text-center py-4">No users found</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
                {currentView === "feedback" && (
                    <div className="p-5 bg-white shadow rounded">
                        {/* Feedback Content */}
                        <h2 className="text-lg font-semibold text-gray-700">Feedback</h2>
                        <p className="text-gray-600 mt-2">This is where feedback content will go.</p>
                    </div>
                )}
                {currentView === "orders" && (
                    <div className="p-5 bg-white shadow rounded">
                        {/* Orders Content */}
                        <h2 className="text-lg font-semibold text-gray-700">Orders</h2>
                        <p className="text-gray-600 mt-2">This is where orders content will go.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Users;
