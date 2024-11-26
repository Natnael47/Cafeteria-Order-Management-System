import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { toast } from "react-toastify";
import { backendUrl } from "../App";
import { AdminContext } from '../context/AdminContext';

const Users = () => {
    const [usersData, setUsersData] = useState([]);
    const { token } = useContext(AdminContext);

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

        // Get the day, month, and year
        const day = String(date.getDate()).padStart(2, '0'); // Ensures 2-digit day
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Get month (1-12)
        const year = date.getFullYear(); // Get full year

        // Return formatted date as DD/MM/YYYY
        return `${day}/${month}/${year}`;
    };

    return (
        <div className="flex flex-col m-5 w-full">
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
                <button className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
                    Users
                </button>
                <button
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                    onClick={() => (window.location.href = "/user-feedback")}
                >
                    Feedback
                </button>
                <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300">Order</button>
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

            {/* Data Table */}
            <div className="bg-white shadow rounded">
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
                                <tr
                                    key={user.id}
                                    className={index % 2 === 0 ? "bg-gray-50" : ""}
                                >
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
                                    <td className="px-4 py-2 border">{formatDate(user.createdAt)}</td> {/* Apply the formatDate function */}
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
        </div>
    );
};

export default Users;
