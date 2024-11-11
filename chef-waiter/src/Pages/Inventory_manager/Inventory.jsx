import axios from "axios";
import React, { useContext, useEffect, useRef, useState } from "react";
import Modal from "react-modal";
import { toast } from "react-toastify";
import { backendUrl } from "../../App";
import { InventoryContext } from "../../Context/InventoryContext";
import { assets } from "../../assets/assets";

Modal.setAppElement("#root");

const Inventory = () => {
    const { iToken } = useContext(InventoryContext);
    const [inventoryList, setInventoryList] = useState([]);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selectedInventoryId, setSelectedInventoryId] = useState(null);
    const [editIndex, setEditIndex] = useState(null);
    const [editInventory, setEditInventory] = useState({
        name: "",
        category: "",
        quantity: "",
        unit: "",
        pricePerUnit: "",
        status: "",
    });
    const [originalInventory, setOriginalInventory] = useState(null);
    const [image, setImage] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);

    const editRef = useRef(null);

    const fetchInventoryList = async () => {
        const response = await axios.get(backendUrl + "/api/inventory/list-inventory", {
            headers: { iToken },
        });
        if (response.data.success) {
            setInventoryList(response.data.data);
        } else {
            toast.error("Error fetching inventory list");
        }
    };

    const openModal = (inventoryId) => {
        setSelectedInventoryId(inventoryId);
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setSelectedInventoryId(null);
        setModalIsOpen(false);
    };

    const handleEditClick = (inventory, index) => {
        if (editIndex === index) {
            cancelEdit();
        } else {
            setEditInventory({ ...inventory });
            setOriginalInventory({ ...inventory });
            setEditIndex(index);
            setImage(false);
            setHasChanges(false);

            setTimeout(() => {
                editRef.current?.scrollIntoView({
                    behavior: "smooth",
                    block: "center",
                });
            }, 100);
        }
    };

    const cancelEdit = () => {
        setEditIndex(null);
        setEditInventory({
            name: "",
            category: "",
            quantity: "",
            unit: "",
            pricePerUnit: "",
            status: "",
        });
        setOriginalInventory(null);
        setImage(false);
        setHasChanges(false);
    };

    const checkForChanges = (newData) => {
        setHasChanges(JSON.stringify(originalInventory) !== JSON.stringify(newData));
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditInventory((prevState) => {
            const updatedInventory = { ...prevState, [name]: value };
            checkForChanges(updatedInventory);
            return updatedInventory;
        });
    };

    const updateInventory = async () => {
        const formData = new FormData();
        formData.append("id", editInventory.id);
        formData.append("name", editInventory.name);
        formData.append("category", editInventory.category);
        formData.append("quantity", editInventory.quantity);
        formData.append("unit", editInventory.unit);
        formData.append("pricePerUnit", editInventory.pricePerUnit);
        formData.append("status", editInventory.status);
        if (editInventory.image instanceof File) {
            formData.append("image", editInventory.image);
        }

        try {
            const response = await axios.post(
                `${backendUrl}/api/inventory/update`,
                formData,
                { headers: { Authorization: `Bearer ${iToken}`, "Content-Type": "multipart/form-data" } }
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
        }
    };

    const removeInventory = async () => {
        const response = await axios.post(
            `${backendUrl}/api/inventory/remove`,
            { id: selectedInventoryId },
            { headers: { Authorization: `Bearer ${iToken}` } }
        );
        await fetchInventoryList();
        closeModal();
        if (response.data.success) {
            toast.success("Inventory Removed");
        } else {
            toast.error("Error removing inventory");
        }
    };

    useEffect(() => {
        fetchInventoryList();
    }, []);

    return (
        <div className="flex flex-col m-5 w-full">
            <p className="mb-3 text-lg font-semibold">All Inventory Items</p>
            <div className="bg-[#F3F4F6] rounded w-full max-w-5.3xl max-h-[88vh] overflow-scroll">
                <div>
                    <div className="grid grid-cols-[0.5fr_0.7fr_0.7fr_0.6fr_0.6fr_0.5fr_0.5fr] items-center gap-2 p-3 border border-black text-sm font-medium bg-gray-700 text-white sm:grid">
                        <b>Image</b>
                        <b>Name</b>
                        <b>Category</b>
                        <b>Quantity</b>
                        <b>Price per Unit</b>
                        <b>Remove</b>
                        <b>Modify</b>
                    </div>
                    {inventoryList.map((item, index) => (
                        <div key={index}>
                            <div className={`grid grid-cols-[0.5fr_0.7fr_0.7fr_0.7fr_0.5fr_0.5fr_0.5fr] items-center gap-2 p-3 border border-black text-sm font-medium sm:grid ${item.status === "out of stock" ? "bg-red-100" : "bg-white"}`}>
                                <img
                                    src={`${backendUrl}/Inv_img/${item.image}`}
                                    alt=""
                                    className="w-14"
                                />
                                <p>{item.name}</p>
                                <p>{item.category}</p>
                                <p>{item.quantity} {item.unit}</p>
                                <p>${item.pricePerUnit}</p>
                                <p onClick={() => openModal(item.id)} className="cursor-pointer pl-1">
                                    <img src={assets.trash_icon} alt="Remove" className="w-7 ml-2 hover:scale-125 transition-transform" />
                                </p>
                                <p className="cursor-pointer pl-1" onClick={() => handleEditClick(item, index)}>
                                    <img src={assets.modify_icon} alt="Modify" className="w-7 ml-2 hover:scale-125 transition-transform" />
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <Modal isOpen={modalIsOpen} onRequestClose={closeModal}>
                <h2>Confirm Deletion</h2>
                <button onClick={removeInventory}>Confirm</button>
                <button onClick={closeModal}>Cancel</button>
            </Modal>
        </div>
    );
};

export default Inventory;
