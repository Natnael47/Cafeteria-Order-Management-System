import React, { useContext, useEffect, useRef, useState } from "react";
import Modal from "react-modal";
import { backendUrl } from "../../App";
import { InventoryContext } from "../../Context/InventoryContext";
import { assets } from "../../assets/assets";

Modal.setAppElement("#root");

const Inventory = () => {
    const {
        inventoryList,
        fetchInventoryList,
        updateInventory,
        removeInventory,
    } = useContext(InventoryContext);

    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selectedInventoryId, setSelectedInventoryId] = useState(null);
    const [editIndex, setEditIndex] = useState(null);
    const [selectedIndex, setSelectedIndex] = useState(null);
    const [editInventory, setEditInventory] = useState({
        name: "",
        category: "",
        quantity: "",
        unit: "",
        pricePerUnit: "",
        status: "",
        image: null,
    });
    const [originalInventory, setOriginalInventory] = useState(null);
    const [hasChanges, setHasChanges] = useState(false);

    const editRef = useRef(null);

    // useEffect for fetching data on mount and on focus
    useEffect(() => {
        fetchInventoryList(); // Fetch data on component mount
        // Optional: Refresh data when the page gains focus
        const handleFocus = () => {
            fetchInventoryList();
        };
        window.addEventListener("focus", handleFocus);
        return () => window.removeEventListener("focus", handleFocus);
    }, []); // Empty dependency array ensures it only runs on mount


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
            setSelectedIndex(null);
            setHasChanges(false);

            setTimeout(() => {
                editRef.current?.scrollIntoView({
                    behavior: "smooth",
                    block: "center",
                });
            }, 100);
        }
    };

    const handleNameClick = (index) => {
        if (selectedIndex === index) {
            setSelectedIndex(null);
        } else {
            setSelectedIndex(index);
            setEditIndex(null);
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
            image: null,
        });
        setOriginalInventory(null);
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

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setEditInventory((prevState) => {
            const updatedInventory = { ...prevState, image: file };
            checkForChanges(updatedInventory);
            return updatedInventory;
        });
    };

    const handleUpdateInventory = () => {
        updateInventory(editInventory, fetchInventoryList, cancelEdit);
    };

    const handleRemoveInventory = () => {
        removeInventory(selectedInventoryId, fetchInventoryList, closeModal);
    };

    return (
        <div className="flex flex-col m-5 w-full">
            <p className="mb-3 text-lg font-semibold">All Inventory Items</p>
            <div className="bg-[#F3F4F6] rounded w-full max-w-5.3xl max-h-[88vh] overflow-scroll">
                <div>
                    <div className="grid grid-cols-[0.7fr_0.7fr_0.7fr_0.6fr_0.5fr_0.5fr_0.5fr] items-center gap-2 p-3 border text-sm font-medium bg-[#FAFAFA] text-black sm:grid">
                        <b>Status</b>
                        <b>Name</b>
                        <b>Category</b>
                        <b>Quantity</b>
                        <b>Price / Unit</b>
                        <b>Remove</b>
                        <b>Modify</b>
                    </div>
                    {inventoryList.map((item, index) => (
                        <div key={index}>
                            <div className={`grid grid-cols-[0.7fr_0.7fr_0.7fr_0.6fr_0.5fr_0.5fr_0.5fr] items-center gap-2 p-3 border text-sm font-medium sm:grid ${item.status === "out of stock" ? "bg-red-100" : "bg-white"}`}>
                                <p className={`p-1 rounded-md ${item.status === "full" || item.status === "available" ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}>
                                    {item.status}
                                </p>
                                <p className="text-[#112F45] cursor-pointer hover:text-blue-500" onClick={() => handleNameClick(index)}>
                                    {item.name}
                                </p>
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
                            {selectedIndex === index && (
                                <div className="p-4 border-t bg-gray-50">
                                    <h3 className="text-lg font-semibold mb-2">{item.name}</h3>
                                    <img
                                        className="w-40 object-cover mb-2"
                                        src={
                                            item.image
                                                ? backendUrl + "/Inv_img/" + item.image
                                                : "placeholder.jpg"
                                        }
                                        alt=""
                                    />
                                    <p><strong>Category:</strong> {item.category}</p>
                                    <p><strong>Quantity:</strong> {item.quantity} {item.unit}</p>
                                    <p><strong>Price/Unit:</strong> ${item.pricePerUnit}</p>
                                    <p><strong>Status:</strong> {item.status}</p>
                                </div>
                            )}
                            {editIndex === index && (
                                <div ref={editRef} className="p-4 border-t bg-gray-50">
                                    {["name", "category", "quantity", "unit", "pricePerUnit", "status"].map((field, i) => (
                                        <div key={i} className="mb-2">
                                            <label className="block text-sm font-medium">{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                                            <input
                                                type={field === "quantity" || field === "pricePerUnit" ? "number" : "text"}
                                                name={field}
                                                value={editInventory[field]}
                                                onChange={handleInputChange}
                                                className="border p-2 rounded w-full"
                                            />
                                        </div>
                                    ))}
                                    <div className="mb-2">
                                        <label className="block text-sm font-medium">Image</label>
                                        <input
                                            type="file"
                                            onChange={handleImageChange}
                                            className="border p-2 rounded w-full"
                                        />
                                        {editInventory.image && (typeof editInventory.image === 'object' ? (
                                            <img
                                                className="w-40 object-cover mt-2"
                                                src={URL.createObjectURL(editInventory.image)}
                                                alt=""
                                            />
                                        ) : (
                                            <img
                                                className="w-40 object-cover mt-2"
                                                src={`${backendUrl}/Inv_img/${editInventory.image}`}
                                                alt=""
                                            />
                                        ))}
                                    </div>
                                    <div className="flex justify-end gap-4 mt-4">
                                        <button onClick={cancelEdit} className="py-2 px-4 bg-gray-300 text-gray-700 rounded">Cancel</button>
                                        <button onClick={handleUpdateInventory} disabled={!hasChanges} className="py-2 px-4 bg-blue-500 text-white rounded disabled:opacity-50">Save</button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
            <Modal isOpen={modalIsOpen} onRequestClose={closeModal} contentLabel="Delete Confirmation"
                className="bg-white p-5 rounded shadow-md max-w-md mx-auto mt-20"
                overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
            >
                <h2 className="text-lg font-semibold">Confirm Delete</h2>
                <p>Are you sure you want to delete this Inventory item?</p>
                <div className="mt-4 flex justify-end">
                    <button
                        onClick={closeModal}
                        className="bg-gray-300 px-4 py-2 rounded mr-2 hover:bg-gray-400 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleRemoveInventory}
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
                    >
                        Delete
                    </button>
                </div>
            </Modal>
        </div>
    );
};

export default Inventory;
