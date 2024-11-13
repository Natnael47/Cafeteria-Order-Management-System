import axios from "axios";
import { createContext, useState } from "react";
import { toast } from "react-toastify";
import { backendUrl } from "../App";

export const InventoryContext = createContext();

const InventoryContextProvide = (props) => {
    const [iToken, setIToken] = useState(localStorage.getItem('iToken') || '');
    const [inventoryList, setInventoryList] = useState([]);

    const fetchInventoryList = async () => {
        try {
            const response = await axios.get(`${backendUrl}/api/inventory/list-inventory`, {
                headers: { iToken },
            });
            if (response.data.success) {
                setInventoryList(response.data.data);
            } else {
                toast.error("Error fetching inventory list");
            }
        } catch (error) {
            console.error("Fetch inventory error:", error);
            toast.error("Error fetching inventory list");
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
        formData.append("initialQuantity", editInventory.initialQuantity); // Add this line to ensure initialQuantity is updated
        if (editInventory.image) formData.append("image", editInventory.image);

        try {
            const response = await axios.post(
                `${backendUrl}/api/inventory/update-inventory`,
                formData,
                {
                    headers: {
                        iToken,
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            if (response.data.success) {
                toast.success("Inventory Updated");
                fetchInventoryList();
                cancelEdit();
            } else {
                toast.error("Error updating inventory");
            }
        } catch (error) {
            console.error("Error updating inventory:", error.message);
            toast.error("Error updating inventory");
        }
    };


    const removeInventory = async (selectedInventoryId, fetchInventoryList, closeModal) => {
        try {
            const response = await axios.post(
                `${backendUrl}/api/inventory/remove-inventory`,
                { id: selectedInventoryId },
                { headers: { iToken } }
            );
            await fetchInventoryList();
            closeModal();
            if (response.data.success) {
                toast.success("Inventory Removed");
            } else {
                toast.error("Error removing inventory");
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
        formData.append("quantity", Number(data.quantity));
        formData.append("unit", data.unit);
        formData.append("pricePerUnit", Number(data.pricePerUnit));
        formData.append("category", data.category);
        formData.append("status", data.status);
        formData.append("dateReceived", data.dateReceived);
        formData.append("supplier", data.supplier);
        formData.append("expiryDate", data.expiryDate);
        if (image) formData.append("image", image);

        try {
            const response = await axios.post(`${backendUrl}/api/inventory/add-inventory`, formData, { headers: { iToken } });
            if (response.data.success) {
                setData({
                    name: "",
                    description: "",
                    quantity: "",
                    unit: "",
                    pricePerUnit: "",
                    category: "Electronics",
                    status: "",
                    dateReceived: "",
                    supplier: "",
                    expiryDate: "",
                });
                setImage(null);
                toast.success("Inventory item added successfully");
            } else {
                toast.error(response.data.message || "Failed to add inventory item");
            }
        } catch (error) {
            console.error("Error adding inventory item:", error);
            if (error.response) {
                toast.error(`Backend Error: ${error.response.data.message || "Failed to add inventory item"}`);
            } else if (error.request) {
                toast.error("Network Error: No response received from the server");
            } else {
                toast.error(`Error: ${error.message}`);
            }
        }
    };

    const value = {
        iToken,
        setIToken,
        inventoryList,
        setInventoryList,
        fetchInventoryList,
        updateInventory,
        removeInventory,
        addInventory,
    };

    return (
        <InventoryContext.Provider value={value}>
            {props.children}
        </InventoryContext.Provider>
    );
};

export default InventoryContextProvide;
