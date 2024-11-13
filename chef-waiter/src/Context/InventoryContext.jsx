import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { backendUrl } from "../App";

export const InventoryContext = createContext();

const InventoryContextProvide = (props) => {
    const [iToken, setIToken] = useState(localStorage.getItem('iToken') ? localStorage.getItem('iToken') : '');
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

    useEffect(() => {
        fetchInventoryList();
    }, [iToken]);

    const value = {
        iToken,
        setIToken,
        inventoryList,
        setInventoryList,
        fetchInventoryList,
        updateInventory,
        removeInventory,
    };

    return (
        <InventoryContext.Provider value={value}>
            {props.children}
        </InventoryContext.Provider>
    );
};

export default InventoryContextProvide;
