import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import Modal from 'react-modal';
import { toast } from 'react-toastify';
import { backendUrl } from '../../App';
import { InventoryContext } from '../../Context/InventoryContext';

const InventoryOrders = () => {
    const { orderList, fetchInventoryOrders, supplierList, fetchSuppliers, iToken, fetchPackages, packageList } = useContext(InventoryContext);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [isPackageSelectorOpen, setIsPackageSelectorOpen] = useState(null); // Track which order to add to a package
    const [selectedPackageId, setSelectedPackageId] = useState(null);
    const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
    const [orderToRemove, setOrderToRemove] = useState(null); // Store the order to remove

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
    });

    useEffect(() => {
        fetchInventoryOrders(); // Initial data fetch
        fetchPackages(); // Fetch packages
        fetchSuppliers(); // Fetch suppliers
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewPackageData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleAddPackage = async () => {
        const { name, description, supplierId } = newPackageData;

        if (!supplierId || !name || !description) {
            toast.error('Please fill in all fields and select a valid supplier.');
            return;
        }

        try {
            const response = await axios.post(
                `${backendUrl}/api/inventory/new-package`,
                { name, description, supplierId: parseInt(supplierId, 10) },
                { headers: { iToken } }
            );

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
        <div className="flex flex-col m-5 w-full">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-semibold text-gray-700">Inventory Orders</h1>
            </div>

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
                <div className="flex items-center space-x-4">
                    <input
                        type="text"
                        placeholder="Search"
                        className="border border-gray-300 rounded px-4 py-2"
                    />
                    <button
                        onClick={() => setIsPopupOpen(true)}
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                    >
                        New Package
                    </button>
                </div>
            </div>

            <div className="bg-white shadow border border-black rounded overflow-hidden">
                <div className="grid grid-cols-[1.5fr_2fr_1fr_1fr_1fr_2fr_1fr] bg-gray-200 border-b border-black font-medium text-gray-700">
                    <div className="px-4 py-2 border-r border-black">Order Status</div>
                    <div className="px-4 py-2 border-r border-black">Inventory Item</div>
                    <div className="px-4 py-2 border-r border-black">Quantity</div>
                    <div className="px-4 py-2 border-r border-black">Unit</div>
                    <div className="px-4 py-2 border-r border-black">Price</div>
                    <div className="px-4 py-2 border-r border-black">Order Date</div>
                    <div className="px-4 py-2">Package</div>
                </div>

                {orderList.length > 0 ? (
                    orderList.map((order, index) => (
                        <div
                            key={index}
                            className={`grid grid-cols-[1.5fr_2fr_1fr_1fr_1fr_2fr_1fr] text-sm ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} border-b border-black`}
                        >
                            <div className="px-4 py-2 border-r border-black">{order.orderStatus}</div>
                            <div className="px-4 py-2 border-r border-black">{order.inventoryName}</div>
                            <div className="px-4 py-2 border-r border-black">
                                {order.quantityOrdered} {order.unit}
                            </div>
                            <div className="px-4 py-2 border-r border-black">{order.unit}</div>
                            <div className="px-4 py-2 border-r border-black">ETB {order.totalPrice}</div>
                            <div className="px-4 py-2 border-r border-black">
                                {new Date(order.orderDate).toLocaleDateString()}
                            </div>
                            <div className="px-4 py-2">
                                {isOrderInPackage(order.id, packageList) ? (
                                    <button
                                        className="text-red-500"
                                        onClick={() => handleRemoveOrder(order)}  // Call handleRemoveOrder with the current order
                                    >
                                        -
                                    </button>

                                ) : (
                                    <button
                                        className="text-green-500"
                                        onClick={() => handlePackageClick(order.id)}
                                    >
                                        +
                                    </button>
                                )}

                            </div>


                        </div>
                    ))
                ) : (
                    <div className="text-center text-gray-500 py-4">No orders found.</div>
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
                <div className="bg-gray-100 p-4 border-t border-black mt-2">
                    <h3 className="font-semibold text-gray-700 mb-2">Select a Package</h3>
                    {packageList.map((pkg) => (
                        <button
                            key={pkg.id}
                            className="bg-blue-500 text-white px-4 py-2 rounded m-2"
                            onClick={() => handlePackageSelection(pkg.id, isPackageSelectorOpen)}
                        >
                            {pkg.name}
                        </button>
                    ))}
                </div>
            )}


            {isPopupOpen && (
                <Modal
                    isOpen={isPopupOpen}
                    onRequestClose={() => setIsPopupOpen(false)}
                    className="bg-white p-6 rounded shadow-lg w-[90%] max-w-lg mx-auto mt-20"
                    overlayClassName="fixed inset-0 bg-black bg-opacity-50 z-50"
                >
                    <h2 className="text-xl font-semibold text-gray-700 mb-4">Add New Package</h2>
                    <input
                        type="text"
                        name="name"
                        value={newPackageData.name}
                        onChange={handleChange}
                        placeholder="Package Name"
                        className="w-full border border-gray-300 rounded px-4 py-2 mb-2"
                    />
                    <input
                        type="text"
                        name="description"
                        value={newPackageData.description}
                        onChange={handleChange}
                        placeholder="Description"
                        className="w-full border border-gray-300 rounded px-4 py-2 mb-2"
                    />
                    <select
                        name="supplierId"
                        value={newPackageData.supplierId}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded px-4 py-2 mb-2"
                    >
                        <option value="">Select Supplier</option>
                        {supplierList.map((supplier) => (
                            <option key={supplier.id} value={supplier.id}>
                                {supplier.name}
                            </option>
                        ))}
                    </select>
                    <div className="flex justify-end space-x-4 mt-4">
                        <button
                            onClick={() => setIsPopupOpen(false)}
                            className="bg-gray-300 text-gray-700 px-4 py-2 rounded"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleAddPackage}
                            className="bg-blue-500 text-white px-4 py-2 rounded"
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