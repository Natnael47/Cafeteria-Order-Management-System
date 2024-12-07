import axios from 'axios';
import { Minus, Package, Plus } from 'lucide-react';
import React, { useContext, useEffect, useState } from 'react';
import Modal from 'react-modal';
import { toast } from 'react-toastify';
import { backendUrl } from '../../App';
import SortingDropdown from '../../Components/SortingDropdown';
import { InventoryContext } from '../../Context/InventoryContext';

const InventoryOrders = () => {
    const { orderList, fetchInventoryOrders, supplierList, fetchSuppliers, iToken, fetchPackages, packageList } = useContext(InventoryContext);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [isPackageSelectorOpen, setIsPackageSelectorOpen] = useState(null); // Track which order to add to a package
    const [selectedPackageId, setSelectedPackageId] = useState(null);
    const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
    const [orderToRemove, setOrderToRemove] = useState(null); // Store the order to remove
    const [requestList, setRequestList] = useState([]); // State for request data

    const fetchInventoryRequests = async () => {
        try {
            const response = await axios.get(`${backendUrl}/api/inventory/inventory-requests`, {
                headers: { iToken },
            });
            if (response.data.success) {
                setRequestList(response.data.data); // Update the state with fetched order data
            } else {
                toast.error("Error fetching inventory orders");
            }
        } catch (error) {
            console.error("Error fetching requests:", error);
            toast.error("Failed to fetch requests.");
        }
    };

    const removeOrderFromPackage = async (packageId, orderId) => {
        try {
            const formData = {
                packageId,
                orderId,
            };

            const response = await axios.post(
                backendUrl + "/api/inventory/remove-package",
                formData,
                { headers: { iToken } }
            );

            if (response.data.success) {
                toast.success("Order removed from package successfully");
                fetchInventoryOrders(); // Refresh the list of orders after removal
                fetchPackages();
                setIsConfirmationModalOpen(false); // Close the confirmation modal
            } else {
                toast.error(response.data.message || "Failed to remove order from package");
            }
        } catch (error) {
            console.error("Error removing order from package:", error);
            toast.error("An error occurred while removing the order from the package.");
        }
    };

    const handleRemoveOrder = (order) => {
        if (!order.packageId) {
            toast.error("Package ID is missing.");
            return;
        }

        // Set the packageId from the selected order
        setOrderToRemove({
            packageId: order.packageId, // Ensure this is correct
            orderId: order.id,           // The order that is being removed
        });

        // Open the confirmation modal
        setIsConfirmationModalOpen(true);
    };
    const closePackageModal = () => {
        setIsPackageSelectorOpen(null); // Close the modal
    };

    const [searchTerm, setSearchTerm] = useState('');
    const [sortAttribute, setSortAttribute] = useState('name');  // Default sort by name
    const [sortOrder, setSortOrder] = useState('ascending');     // Default ascending
    const [currentView, setCurrentView] = useState("Order"); // Default to 'users' view

    // Save the current view to localStorage whenever it changes
    const handleTabChange = (view) => {
        setCurrentView(view);
        localStorage.setItem('currentView', view); // Save the current view to localStorage
    };

    const handleSortChange = (attribute, order) => {
        setSortAttribute(attribute);
        setSortOrder(order);
        // Save the selected sorting state to localStorage
        localStorage.setItem('sortAttribute', attribute);
        localStorage.setItem('sortOrder', order);
    };

    const handlePackageSelection = async (packageId, orderId) => {
        try {
            // Validate the data before sending
            if (!packageId || !orderId) {
                toast.error("Invalid package or order information.");
                return;
            }

            const formDataToSend = {
                packageId, // The package ID being selected
                orderId,   // The order ID that we are associating with the package
            };

            // Make the API request
            const response = await axios.post(
                backendUrl + "/api/inventory/add-package",
                formDataToSend,
                { headers: { 'Content-Type': 'application/json', iToken } }
            );

            // Handle the response data
            if (response.data.success) {
                toast.success("Package added to order");
                fetchInventoryOrders(); // Refresh the list after adding the package
                fetchPackages();
                setIsPackageSelectorOpen(null); // Close the package selector
            } else {
                toast.error(response.data.message || "Failed to add package");
            }
        } catch (error) {
            // Check if the error response is from the backend (400 error)
            if (error.response && error.response.data && error.response.data.message) {
                // Show the backend error message in the toast
                toast.error(error.response.data.message);
            } else {
                // Handle any unexpected errors (network, server, etc.)
                toast.error("An unexpected error occurred. Please try again.");
            }
        }
    };

    const [newPackageData, setNewPackageData] = useState({
        name: '',
        description: '',
        supplierId: '',
        packageType: '',
        chefId: ''
    });

    useEffect(() => {
        fetchInventoryOrders();
        fetchPackages();
        fetchSuppliers();
        fetchInventoryRequests(); // Fetch request data on mount
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewPackageData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleAddPackage = async () => {
        const { name, description, supplierId, packageType, chefId } = newPackageData;

        // Ensure packageType is sent as "Order" or "Request" (capitalized)
        const formattedPackageType = packageType === 'order' ? 'Order' : packageType === 'request' ? 'Request' : packageType;

        // Validation
        if (!name || !description || (formattedPackageType === 'Order' && !supplierId) || (formattedPackageType === 'Request' && !chefId)) {
            toast.error('Please fill in all fields and select a valid supplier or employee.');
            return;
        }

        // Prepare the data to send based on package type
        const dataToSend = {
            name,
            description,
            packageType: formattedPackageType, // Send capitalized package type
            // Only send chefId for 'Request' type
            ...(formattedPackageType === 'Request' && { chefId: parseInt(chefId, 10) }),
            // Only send supplierId for 'Order' type
            ...(formattedPackageType === 'Order' && { supplierId: parseInt(supplierId, 10) }),
        };

        console.log("Data to Send:", dataToSend); // Debugging log

        try {
            const response = await axios.post(
                `${backendUrl}/api/inventory/new-package`,
                dataToSend,
                { headers: { iToken } }
            );

            console.log("Response Data:", response.data);

            if (response.data.success) {
                toast.success('Package added successfully');
                fetchInventoryOrders();
                fetchPackages();
                setIsPopupOpen(false);
            } else {
                toast.error(response.data.message || 'Failed to add package');
            }
        } catch (error) {
            console.error('Error adding package:', error);
            toast.error('Failed to add package. Please try again.');
        }
    };

    const isOrderInPackage = (orderId, packageList) => {
        return packageList.some((pkg) =>
            pkg.orders.some((order) => order.orderId === orderId)
        );
    };


    const handlePackageClick = (orderId) => {
        setIsPackageSelectorOpen(orderId);  // Set the order ID to track which order is being modified
        setSelectedPackageId(null);  // Reset selected package on new order
    };

    return (
        <div className="flex flex-col m-5 w-full max-w-6.5xl">
            {/* Header */}
            <div className="flex flex-col space-y-2 mb-2">
                {/* Top Section: Title and Buttons */}
                <div className="flex items-center justify-between h-[10vh]">
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-800">Inventory Orders</h1>
                    <div className="flex items-center space-x-3">
                        {/* New Inventory Button */}
                        <button
                            className="px-4 py-2 bg-green-600 text-white font-medium rounded-md shadow-sm hover:bg-green-700 transition"
                            onClick={() => setIsPopupOpen(true)}
                        >
                            + New Package
                        </button>

                        {/* Icon Button */}
                        <button className="p-2 bg-gray-100 text-gray-700 rounded-md shadow-sm hover:bg-gray-200 transition">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                className="w-5 h-5"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8h16M4 16h16" />
                            </svg>
                        </button>
                    </div>
                </div>
                {/* Tabs */}
                <div className="flex items-center space-x-4 mb-6">
                    <button
                        className={`px-4 py-2 rounded ${currentView === "Order" ? "bg-green-500 text-white" : "bg-gray-200 text-gray-700"}`}
                        onClick={() => handleTabChange("Order")}
                    >
                        Order
                    </button>
                    <button
                        className={`px-4 py-2 rounded ${currentView === "request" ? "bg-green-500 text-white" : "bg-gray-200 text-gray-700"}`}
                        onClick={() => handleTabChange("request")}
                    >
                        Request
                    </button>
                </div>

                {/* Middle Section: Search and Entries */}
                <div className="flex items-center justify-between">
                    {/* Entries Dropdown */}
                    <div className="flex items-center space-x-2 text-sm">
                        <label className="font-medium text-gray-700">Show</label>
                        <select className="border border-gray-300 rounded px-3 py-1.5 focus:ring focus:ring-gray-200">
                            <option value="10">10</option>
                            <option value="25">25</option>
                            <option value="50">50</option>
                        </select>
                        <label className="font-medium text-gray-700">entries</label>
                    </div>
                    {/* Sorting  & search */}
                    <div className="flex items-center justify-end gap-5">
                        <SortingDropdown onSortChange={handleSortChange} />
                        {/* Search Bar */}
                        <input
                            type="text"
                            placeholder="Search by item name"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="border border-gray-300 rounded px-4 py-2 w-full sm:w-64 shadow-sm focus:ring focus:ring-gray-200"
                        />
                    </div>
                </div>
            </div>

            <div className="bg-[#F3F4F6] rounded w-full max-w-6.5xl max-h-[68vh] overflow-scroll">
                {currentView === "Order" && (
                    <>
                        {/* Order Table Header */}
                        <div className="grid grid-cols-[1.5fr_2fr_1fr_1fr_1fr_2fr_1fr] bg-gray-100 border-b border-gray-300 font-semibold text-gray-700 text-sm">
                            <div className="px-4 py-3 border-r border-gray-300 text-center">Order Status</div>
                            <div className="px-4 py-3 border-r border-gray-300 text-center">Inventory Item</div>
                            <div className="px-4 py-3 border-r border-gray-300 text-center">Quantity</div>
                            <div className="px-4 py-3 border-r border-gray-300 text-center">Unit</div>
                            <div className="px-4 py-3 border-r border-gray-300 text-center">Price</div>
                            <div className="px-4 py-3 border-r border-gray-300 text-center">Order Date</div>
                            <div className="px-4 py-3 text-center">Package</div>
                        </div>
                        {/* Order Data Rows */}
                        {orderList.length > 0 ? (
                            orderList.map((order, index) => (
                                <div key={index} className="grid grid-cols-[1.5fr_2fr_1fr_1fr_1fr_2fr_1fr] text-sm">
                                    <div className="px-4 py-3 border-r border-gray-300 text-center">{order.orderStatus}</div>
                                    <div className="px-4 py-3 border-r border-gray-300 text-center">{order.inventoryName}</div>
                                    <div className="px-4 py-3 border-r border-gray-300 text-center">{order.quantityOrdered} {order.unit}</div>
                                    <div className="px-4 py-3 border-r border-gray-300 text-center">{order.unit}</div>
                                    <div className="px-4 py-3 border-r border-gray-300 text-center">{order.totalPrice}</div>
                                    <div className="px-4 py-3 border-r border-gray-300 text-center">{new Date(order.orderDate).toLocaleDateString()}</div>
                                    <div className="px-4 py-3 text-center">
                                        {isOrderInPackage(order.id, packageList) ? (
                                            <Minus onClick={() => handleRemoveOrder(order)} className="text-red-500 cursor-pointer" />
                                        ) : (
                                            <Plus onClick={() => handlePackageClick(order.id)} className="text-green-500 cursor-pointer" />
                                        )}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center text-gray-500 py-6">No orders found.</div>
                        )}
                    </>
                )}

                {currentView === "request" && (
                    <>
                        {/* Request Table Header */}
                        <div className="grid grid-cols-[2fr_1fr_2fr_2fr_1fr_1fr] bg-gray-100 border-b border-gray-300 font-semibold text-gray-700 text-sm">
                            <div className="px-4 py-3 border-r border-gray-300 text-center">Request Item</div>
                            <div className="px-4 py-3 border-r border-gray-300 text-center">Quantity</div>
                            <div className="px-4 py-3 border-r border-gray-300 text-center">Requested By</div>
                            <div className="px-4 py-3 border-r border-gray-300 text-center">Request Date</div>
                            <div className="px-4 py-3 border-r border-gray-300 text-center">Package</div>
                            <div className="px-4 py-3 text-center">Reject</div>
                        </div>

                        {/* Request Data Rows */}
                        {requestList.length > 0 ? (
                            requestList.map((request, index) => (
                                <div key={index} className="grid grid-cols-[2fr_1fr_2fr_2fr_1fr_1fr] text-sm">
                                    <div className="px-4 py-3 border-r border-gray-300 text-center">{request.inventory.name}</div>
                                    <div className="px-4 py-3 border-r border-gray-300 text-center">{request.quantity}</div>
                                    <div className="px-4 py-3 border-r border-gray-300 text-center">
                                        {request.employee.firstName} {request.employee.lastName}
                                    </div>
                                    <div className="px-4 py-3 border-r border-gray-300 text-center">
                                        {new Date(request.dateRequested).toLocaleDateString()}
                                    </div>
                                    <div className="px-4 py-3 border-r border-gray-300 text-center">
                                        {request.package ? request.package.name : "N/A"}
                                    </div>
                                    <div className="px-4 py-3 text-center">
                                        <button className="text-red-500 hover:underline">Reject</button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center text-gray-500 py-6">No requests found.</div>
                        )}
                    </>
                )}
            </div>

            {isConfirmationModalOpen && (
                <Modal
                    isOpen={isConfirmationModalOpen}
                    onRequestClose={() => setIsConfirmationModalOpen(false)}
                    className="bg-white p-6 rounded shadow-lg w-[90%] max-w-lg mx-auto mt-20"
                    overlayClassName="fixed inset-0 bg-black bg-opacity-50 z-50"
                >
                    <h2 className="text-xl font-semibold text-gray-700 mb-4">
                        Confirm Removal
                    </h2>
                    <p className="mb-4">
                        Are you sure you want to remove this order from the package?
                    </p>
                    <div className="flex justify-end space-x-4 mt-4">
                        <button
                            onClick={() => setIsConfirmationModalOpen(false)}
                            className="bg-gray-300 text-gray-700 px-4 py-2 rounded"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={() => {
                                if (orderToRemove) {
                                    // Send the correct packageId and orderId to the remove function
                                    removeOrderFromPackage(orderToRemove.packageId, orderToRemove.orderId); // Pass the correct IDs
                                }
                            }}
                            className="bg-red-500 text-white px-4 py-2 rounded"
                        >
                            Confirm
                        </button>

                    </div>
                </Modal>
            )}

            {isPackageSelectorOpen !== null && (
                <Modal
                    isOpen={isPackageSelectorOpen !== null}
                    onRequestClose={closePackageModal}
                    className="bg-white p-8 rounded-lg shadow-2xl w-[90%] max-w-lg mx-auto mt-20"
                    overlayClassName="fixed inset-0 bg-black bg-opacity-60 z-50"
                >
                    <h3 className="text-3xl font-semibold text-gray-800 mb-8 text-center">Select a Package</h3>
                    <div className="grid grid-cols-2 gap-6">
                        {packageList.map((pkg) => (
                            <button
                                key={pkg.id}
                                className="flex items-center justify-center bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-4 rounded-lg font-medium shadow-lg hover:from-blue-600 hover:to-blue-700 transform hover:scale-105 transition-all duration-300"
                                onClick={() => handlePackageSelection(pkg.id, isPackageSelectorOpen)}
                            >
                                <Package className="mr-3 text-white" size={32} />
                                {pkg.name}
                            </button>
                        ))}
                    </div>
                    <div className="flex justify-end mt-8">
                        <button
                            onClick={closePackageModal}
                            className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition-all duration-200"
                        >
                            Cancel
                        </button>
                    </div>
                </Modal>
            )}

            {isPopupOpen && (
                <Modal
                    isOpen={isPopupOpen}
                    onRequestClose={() => setIsPopupOpen(false)}
                    className="bg-white p-6 rounded-lg shadow-xl w-[90%] max-w-lg mx-auto mt-20"
                    overlayClassName="fixed inset-0 bg-black bg-opacity-50 z-50"
                >
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Add New Package</h2>
                    <div className="space-y-4">
                        {/* Package Name Input */}
                        <input
                            type="text"
                            name="name"
                            value={newPackageData.name}
                            onChange={handleChange}
                            placeholder="Package Name"
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />

                        {/* Description Input */}
                        <input
                            type="text"
                            name="description"
                            value={newPackageData.description}
                            onChange={handleChange}
                            placeholder="Description"
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />

                        {/* Package Type Selection */}
                        <select
                            name="packageType"
                            value={newPackageData.packageType}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="" disabled>
                                Select Package Type
                            </option>
                            <option value="order">Order</option>
                            <option value="request">Request</option>
                        </select>

                        {/* Conditional Rendering Based on Package Type */}
                        {newPackageData.packageType === "order" && (
                            <select
                                name="supplierId"
                                value={newPackageData.supplierId}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="" disabled>
                                    Select Supplier
                                </option>
                                {supplierList
                                    .filter((supplier) => supplier.status === "active") // Filter active suppliers
                                    .map((supplier) => (
                                        <option key={supplier.id} value={supplier.id}>
                                            {supplier.name}
                                        </option>
                                    ))}
                            </select>
                        )}

                        {newPackageData.packageType === "request" && (
                            <select
                                name="chefId"
                                value={newPackageData.chefId}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="" disabled>
                                    Select Employee
                                </option>
                                {requestList.length > 0 ? (
                                    Array.from(
                                        new Map(
                                            requestList.map((request) => [
                                                request.employee.id,
                                                request.employee,
                                            ])
                                        ).values()
                                    ).map((employee) => (
                                        <option key={employee.id} value={employee.id}>
                                            {employee.firstName} {employee.lastName}
                                        </option>
                                    ))
                                ) : (
                                    <option disabled>No employees available</option>
                                )}
                            </select>
                        )}
                    </div>

                    <div className="flex justify-end space-x-4 mt-6">
                        <button
                            onClick={() => setIsPopupOpen(false)}
                            className="bg-gray-300 text-gray-800 px-5 py-2 rounded-lg hover:bg-gray-400 transition"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleAddPackage}
                            className="bg-blue-600 text-white px-5 py-2 rounded-lg shadow hover:bg-blue-700 transition-transform transform hover:scale-105"
                        >
                            Add Package
                        </button>
                    </div>
                </Modal>
            )}

        </div>
    );
};

export default InventoryOrders;