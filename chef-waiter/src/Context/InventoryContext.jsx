import axios from "axios";
import { createContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { backendUrl } from "../App";

export const InventoryContext = createContext();

const InventoryContextProvide = (props) => {
    const [iToken, setIToken] = useState(localStorage.getItem('iToken') || '');
    const [inventoryList, setInventoryList] = useState([]);
    const [orderList, setOrderList] = useState([]); // State to store supplier orders
    const [supplierList, setSupplierList] = useState([]); // State to store supplier data
    const [packageList, setPackageList] = useState([]); // State to store package data
    const navigate = useNavigate();

    const fetchInventoryList = async () => {
        try {
            const response = await axios.get(`${backendUrl}/api/inventory/list-inventory`, {
                headers: { iToken },
            });
            if (response.data.success) {
                setInventoryList(response.data.data);
                console.log(response.data.data);

            } else {
                toast.error("Error fetching inventory list");
            }
        } catch (error) {
            console.error("Fetch inventory error:", error);
            toast.error("Error fetching inventory list");
        }
    };

    const fetchPackages = async () => {
        try {
            const response = await axios.get(`${backendUrl}/api/inventory/packages`, {
                headers: { iToken },
            });
            if (response.data.success) {
                setPackageList(response.data.data); // Update the state with fetched package data
            } else {
                toast.error("Error fetching package list");
            }
        } catch (error) {
            console.error("Fetch packages error:", error);
            toast.error("Error fetching package list");
        }
    };

    // New function to fetch supplier orders
    const fetchInventoryOrders = async () => {
        try {
            const response = await axios.get(`${backendUrl}/api/inventory/inv-orders`, {
                headers: { iToken },
            });
            if (response.data.success) {
                setOrderList(response.data.data);
                //console.log(response.data.data);
            } else {
                toast.error("Error fetching inventory orders");
            }
        } catch (error) {
            console.error("Fetch inventory orders error:", error);
            toast.error("Error fetching inventory orders");
        }
    };

    const fetchSuppliers = async () => {
        try {
            const response = await axios.get(`${backendUrl}/api/inventory/list-suppliers`, {
                headers: { iToken },
            });
            if (response.data.success) {
                setSupplierList(response.data.data); // Update the state with the fetched supplier data
            } else {
                toast.error("Error fetching supplier list");
            }
        } catch (error) {
            console.error("Fetch suppliers error:", error);
            toast.error("Error fetching supplier list");
        }
    };

    const updateInventory = async (editInventory, fetchInventoryList, cancelEdit) => {
        const formData = new FormData();
        formData.append("id", editInventory.id);
        formData.append("name", editInventory.name);
        formData.append("category", editInventory.category);
        formData.append("quantity", editInventory.quantity);
        formData.append("unit", editInventory.unit);
        formData.append("pricePerUnit", editInventory.pricePerUnit);
        formData.append("status", editInventory.status);
        formData.append("initialQuantity", editInventory.initialQuantity);
        if (editInventory.image) formData.append("image", editInventory.image);

        try {
            const response = await axios.post(`${backendUrl}/api/inventory/update-inventory`, formData, {
                headers: { iToken, "Content-Type": "multipart/form-data" },
            });
            if (response.data.success) {
                toast.success("Inventory Updated");
                fetchInventoryList();
                cancelEdit();
            } else {
                toast.error(response.data.message || "Error updating inventory");
            }
        } catch (error) {
            console.error("Error updating inventory:", error);
            if (error.response) {
                toast.error(` ${error.response.data.message || "Failed to update inventory"}`);
            } else if (error.request) {
                toast.error("Network Error: No response received from the server");
            } else {
                toast.error(`Error: ${error.message}`);
            }
        }
    };


    const removeInventory = async (selectedInventoryId, fetchInventoryList, closeModal) => {
        try {
            const response = await axios.post(
                `${backendUrl}/api/inventory/remove-inventory`,
                { id: selectedInventoryId },
                { headers: { iToken } }
            );

            if (response.data.success) {
                await fetchInventoryList();
                closeModal();
                toast.success("Inventory Removed");
            } else {
                toast.error(response.data.message || "Error removing inventory");
            }
        } catch (error) {
            console.error("Error removing inventory:", error.message);
            toast.error("Error removing inventory");
        }
    };

    const addInventory = async (data, image, setData, setImage) => {
        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("description", data.description);
        formData.append("unit", data.unit);
        formData.append("category", data.category);
        if (image) formData.append("image", image);

        try {
            const response = await axios.post(`${backendUrl}/api/inventory/add-inventory`, formData, { headers: { iToken } });
            if (response.data.success) {
                setData({
                    name: "",
                    description: "",
                    unit: "",
                    category: "Electronics",
                });
                setImage(null);
                toast.success("Inventory item added successfully");
                return true; // Success
            } else {
                toast.error(response.data.message || "Failed to add inventory item");
                return false; // Failure
            }
        } catch (error) {
            console.error("Error adding inventory item:", error);
            if (error.response) {
                toast.error(`${error.response.data.message || "Failed to add inventory item"}`);
            } else if (error.request) {
                toast.error("Network Error: No response received from the server");
            } else {
                toast.error(`Error: ${error.message}`);
            }
            return false; // Failure
        }
    };

    const addSupplier = async (data, setData) => {
        try {
            // Prepare contactInfo as JSON string
            const contactInfo = JSON.stringify({
                email: data.email,
                phone: data.phone,
                address: data.address,
            });

            // Prepare payload for the request
            const payload = {
                name: data.name,
                contactInfo: contactInfo,
                status: data.status || "active", // Default to active if not provided
            };

            // Make the API request
            const response = await axios.post(`${backendUrl}/api/inventory/add-supplier`, payload, {
                headers: { iToken },
            });

            if (response.data.success) {
                // Clear the form after successful submission
                setData({
                    name: "",
                    email: "",
                    phone: "",
                    address: "",
                    status: "active",
                });
                toast.success("Supplier added successfully");
            } else {
                toast.error(response.data.message || "Failed to add supplier");
            }
        } catch (error) {
            console.error("Error adding supplier:", error);
            if (error.response) {
                toast.error(` ${error.response.data.message || "Failed to add supplier"}`);
            } else if (error.request) {
                toast.error("Network Error: No response received from the server");
            } else {
                toast.error(`Error: ${error.message}`);
            }
        }
    };

    // Function to update a supplier
    const updateSupplier = async (editSupplier, fetchSuppliers, cancelEdit) => {
        const payload = {
            id: editSupplier.id,
            name: editSupplier.name,
            contactInfo: JSON.stringify({
                email: editSupplier.email,
                phone: editSupplier.phone,
                address: editSupplier.address,
            }),
            status: editSupplier.status,
        };

        try {
            const response = await axios.post(
                `${backendUrl}/api/inventory/update-supplier`,
                payload,
                { headers: { iToken } }
            );

            if (response.data.success) {
                toast.success("Supplier updated successfully");
                fetchSuppliers();
                cancelEdit(); // Call to reset or close the edit form
            } else {
                toast.error("Error updating supplier");
            }
        } catch (error) {
            console.error("Error updating supplier:", error.message);
            toast.error("Error updating supplier");
        }
    };

    // Function to remove a supplier
    const removeSupplier = async (supplierId, fetchSuppliers, closeModal) => {
        try {
            const response = await axios.post(
                `${backendUrl}/api/inventory/remove-supplier`,
                { id: supplierId },
                { headers: { iToken } }
            );

            if (response.data.success) {
                fetchSuppliers();
                closeModal(); // Call to close the confirmation modal
                toast.success("Supplier removed successfully");
            } else {
                toast.error(response.data.message || "Error removing supplier");
            }
        } catch (error) {
            console.error("Error removing supplier:", error.message);
            toast.error("Error removing supplier");
        }
    };

    const value = {
        iToken,
        addSupplier,
        fetchPackages, packageList,
        setIToken,
        inventoryList,
        setInventoryList,
        fetchInventoryList,
        fetchInventoryOrders, // Expose the new function
        updateInventory,
        removeInventory,
        addInventory,
        orderList, // Expose the state for supplier orders
        navigate,
        fetchSuppliers,
        supplierList,
        updateSupplier,
        removeSupplier
    };

    return (
        <InventoryContext.Provider value={value}>
            {props.children}
        </InventoryContext.Provider>
    );
};

export default InventoryContextProvide;
