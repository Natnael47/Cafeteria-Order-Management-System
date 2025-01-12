import axios from 'axios';
import { Star } from 'lucide-react';
import React, { useContext, useEffect, useState } from 'react';
import { toast } from "react-toastify";
import { backendUrl } from "../App";
import { AdminContext } from '../context/AdminContext';

const Users = () => {
    const [usersData, setUsersData] = useState([]);
    const { token } = useContext(AdminContext);
    const [currentView, setCurrentView] = useState("users"); // Default to 'users' view
    const [feedbackList, setFeedbackList] = useState([]);
    const [orders, setOrders] = useState([]);

    // Fetch the users' data from the API
    const fetchUserList = async () => {
        try {
            const response = await axios.get(backendUrl + "/api/user/all-users", {
                headers: { token }, // Pass the token in headers for authorization
            });

            if (response.data.success) {
                setUsersData(response.data.data); // Assuming the response contains a 'data' field with the users
                //console.log(response.data.data);
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
        // Check if there is a saved view in localStorage
        const savedView = localStorage.getItem('currentView');
        if (savedView) {
            setCurrentView(savedView); // Set the saved view as the current view
        } else {
            setCurrentView("users"); // Default to 'users' if no saved view
        }

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

    // Fetch the feedback data when the component mounts
    useEffect(() => {
        const fetchFeedback = async () => {
            try {
                const response = await axios.get(`${backendUrl}/api/feedback/get-feedback`);
                setFeedbackList(response.data.feedback); // Save feedback data to state
                //console.log(response.data.feedback);
            } catch (error) {
                console.error("Error fetching feedback:", error);
            }
        };

        fetchFeedback();
    }, []);

    // Save the current view to localStorage whenever it changes
    const handleTabChange = (view) => {
        setCurrentView(view);
        localStorage.setItem('currentView', view); // Save the current view to localStorage
    };

    const fetchOrder = async () => {
        if (!token) {
            return null;
        }
        try {
            const response = await axios.post(backendUrl + "/api/order/list", {}, { headers: { token } })
            if (response.data.success) {
                setOrders(response.data.orders);
                //console.log(response.data.orders);

            } else {
                toast.error(response.data.message)
            }

        } catch (error) {
            toast.error(error.message)
        }
    }

    const statusHandler = async (event, orderId) => {
        try {
            // Send a request to update the order status
            const response = await axios.post(backendUrl + "/api/order/status", {
                orderId,
                status: event.target.value, // Send the selected status value
            }, { headers: { token } });

            // Check if the response indicates success
            if (response.data.success) {
                // Refresh the list of orders after updating the status
                await fetchOrder(); //this must be this fetchAllOrders()
            } else {
                // Handle the error if the update was not successful
                console.error("Failed to update status:", response.data.message);
                toast.error("Failed to update status.");
            }
        } catch (error) {
            // Handle any errors that occur during the request
            console.error("Error updating status:", error);
            toast.error("An error occurred while updating the status.");
        }
    };

    const updateAccountStatus = async (event, userId) => {
        try {
            const newStatus = event.target.value;

            // Map the selected value to the correct status string, e.g., "BANNED" for "Suspended"
            let accountStatus = "";
            if (newStatus === "Active") {
                accountStatus = "ACTIVE";
            } else if (newStatus === "Suspended") {
                accountStatus = "BANNED";
            }

            const response = await axios.post(
                `${backendUrl}/api/user/update-account-status`,
                { userId, accountStatus }, // Send the data as required by the backend
                { headers: { token } }
            );

            console.log({ userId, accountStatus });


            if (response.data.success) {
                toast.success("Account status updated successfully");
                fetchUserList(); // Refresh the user list to reflect changes
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error("Error updating account status:", error);
            toast.error("An error occurred while updating the status.");
        }
    };

    useEffect(() => {
        fetchOrder();
    }, [token]);

    return (
        <div className="m-5 w-full max-w-6.5xl max-h-[90vh]">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Customer</h1>
                <div className="flex items-center space-x-4">

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
                    onClick={() => handleTabChange("users")} // Switch to 'users'
                >
                    Users
                </button>
                <button
                    className={`px-4 py-2 rounded ${currentView === "feedback" ? "bg-green-500 text-white" : "bg-gray-200 text-gray-700"} hover:bg-green-500 hover:text-white`}
                    onClick={() => handleTabChange("feedback")} // Switch to 'feedback'
                >
                    Feedback
                </button>
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
            <div className="bg-[#F3F4F6] rounded w-full max-w-6.5xl max-h-[72vh] overflow-scroll">
                {currentView === "users" && (
                    <div className="bg-white shadow-md rounded-lg p-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Users Data</h2>
                        {/* Users Data Table */}
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse rounded-lg overflow-hidden">
                                <thead>
                                    <tr className="bg-[#22C55E] text-white">
                                        <th className="px-4 py-3 text-sm font-semibold">ID</th>
                                        <th className="px-4 py-3 text-sm font-semibold">Name</th>
                                        <th className="px-4 py-3 text-sm font-semibold">Email</th>
                                        <th className="px-4 py-3 text-sm font-semibold">Address</th>
                                        <th className="px-4 py-3 text-sm font-semibold">Gender</th>
                                        <th className="px-4 py-3 text-sm font-semibold">Phone</th>
                                        <th className="px-4 py-3 text-sm font-semibold">Account Created</th>
                                        <th className="px-4 py-3 text-sm font-semibold">Account Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {usersData.length > 0 ? (
                                        usersData.map((user, index) => (
                                            <tr
                                                key={user.id}
                                                className={`transition-colors duration-200 
        ${user.accountStatus !== 'ACTIVE' ? "bg-red-50" : index % 2 === 0 ? "bg-gray-50" : "bg-white"}
        hover:bg-blue-100`}
                                            >
                                                <td className="px-4 py-3 text-sm border">{String(user.id).padStart(3, '0')}</td>
                                                <td className="px-4 py-3 text-sm border">
                                                    {user.firstName} {user.lastName}
                                                </td>
                                                <td className="px-4 py-3 text-sm border">{user.email}</td>
                                                <td className="px-4 py-3 text-sm border">
                                                    {user.address && user.address.line1 && user.address.line2
                                                        ? `${user.address.line1}, ${user.address.line2}`
                                                        : "No address available"}
                                                </td>
                                                <td className="px-4 py-3 text-sm border">{user.gender || "Not Selected"}</td>
                                                <td className="px-4 py-3 text-sm border">{user.phone || "No Phone"}</td>
                                                <td className="px-4 py-3 text-sm border">{formatDate(user.createdAt)}</td>
                                                {/* Status Dropdown */}
                                                <td className="px-4 py-3 text-sm border">
                                                    <select
                                                        className="p-2 border rounded"
                                                        value={user.accountStatus === "BANNED" ? "Suspended" : "Active"}
                                                        onChange={(event) => updateAccountStatus(event, user.id)}
                                                    >
                                                        <option value="Active">Active</option>
                                                        <option value="Suspended">Suspended</option>
                                                    </select>

                                                </td>

                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan="7"
                                                className="text-center py-4 text-gray-500 font-medium bg-gray-50"
                                            >
                                                No users found
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Feedback page */}
                {currentView === "feedback" && (
                    <div className="p-6 bg-white shadow rounded-lg">
                        {/* Feedback Content */}
                        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Customer Feedback</h2>

                        {/* Feedback List */}
                        <div className="space-y-4">
                            {feedbackList.length === 0 ? (
                                <p className="text-center text-gray-600 text-lg">No feedback available.</p>
                            ) : (
                                feedbackList.map((feedback, index) => {
                                    // Set background color based on rating
                                    let bgColor = "bg-gray-100"; // Default for 0 stars
                                    if (feedback.rating >= 4) bgColor = "bg-green-100";  // Greenish for 4-5 stars
                                    else if (feedback.rating >= 3) bgColor = "bg-yellow-100"; // Yellow for 3 stars
                                    else if (feedback.rating >= 2) bgColor = "bg-red-100"; // Light red for 2 stars
                                    else if (feedback.rating >= 1) bgColor = "bg-red-200"; // Darker red for 1 star

                                    return (
                                        <div
                                            key={index}
                                            className={`rounded-lg p-4 shadow-md transition-all hover:shadow-lg ${bgColor}`}
                                        >
                                            <div className="flex items-start space-x-4">
                                                {/* Customer Initial (Replaced Image) */}
                                                <div className="w-16 h-16 bg-gray-300 text-gray-800 text-xl font-bold rounded-full mx-auto flex items-center justify-center">
                                                    {feedback.username.charAt(0).toUpperCase()}
                                                </div>

                                                <div className="flex-1">
                                                    <div className="flex justify-between items-center mb-2">
                                                        <h3 className="font-semibold text-gray-800 text-xl">
                                                            {feedback.username}
                                                        </h3>
                                                        <p className="text-sm text-gray-500">
                                                            {/* Format the date */}
                                                            {new Date(feedback.date).toLocaleDateString('en-US', {
                                                                weekday: 'long',
                                                                year: 'numeric',
                                                                month: 'short',
                                                                day: 'numeric',
                                                            })}
                                                        </p>
                                                    </div>

                                                    {/* Full Feedback Comment */}
                                                    <p className="text-base text-gray-600 mb-4">
                                                        {feedback.comment} {/* Displaying the full comment */}
                                                    </p>

                                                    {/* Rating */}
                                                    <div className="flex items-center space-x-1 text-yellow-500 text-lg">
                                                        {Array.from({ length: Math.round(feedback.rating) }).map((_, i) => (
                                                            <div key={i}>
                                                                <Star color="#facc15" fill="#facc15" size={18} />
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Users;
