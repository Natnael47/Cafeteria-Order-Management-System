import axios from "axios";
import { Pencil, Trash2 } from "lucide-react";
import React, { useContext, useEffect, useRef, useState } from "react";
import Modal from "react-modal";
import { toast } from "react-toastify";
import { backendUrl } from "../App";
import { AdminContext } from "../context/AdminContext";

Modal.setAppElement("#root");

const List = () => {
    const { token, navigate } = useContext(AdminContext);
    const [list, setList] = useState([]);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selectedFoodId, setSelectedFoodId] = useState(null);
    const [editIndex, setEditIndex] = useState(null);
    const [editFood, setEditFood] = useState({
        name: "",
        category: "",
        price: "",
        image: "",
        description: "",
        menuStatus: "",
        prepTime: ""
    });
    const [originalFood, setOriginalFood] = useState(null);
    const [image, setImage] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);

    const editRef = useRef(null);

    const fetchList = async () => {
        const response = await axios.get(backendUrl + "/api/food/list", {
            headers: { token },
        });
        if (response.data.success) {
            setList(response.data.data);
        } else {
            toast.error("Error fetching list");
        }
    };

    const openModal = (foodId) => {
        setSelectedFoodId(foodId);
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setSelectedFoodId(null);
        setModalIsOpen(false);
    };

    const handleEditClick = (food, index) => {
        if (editIndex === index) {
            cancelEdit();
        } else {
            setEditFood({ ...food });
            setOriginalFood({ ...food });
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
        setEditFood({
            name: "",
            category: "",
            price: "",
            image: "",
            description: "",
            menuStatus: false,
        });
        setOriginalFood(null);
        setImage(false);
        setHasChanges(false);
    };

    const isEqual = (obj1, obj2) => {
        return JSON.stringify(obj1) === JSON.stringify(obj2);
    };

    const checkForChanges = (newData) => {
        setHasChanges(!isEqual(originalFood, newData));
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked, prepTime } = e.target;
        const newValue = type === "checkbox" ? checked : value;
        setEditFood((prevState) => {
            const updatedFood = { ...prevState, [name]: newValue };
            checkForChanges(updatedFood);
            return updatedFood;
        });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImage(file);
        setEditFood((prevState) => {
            const updatedFood = { ...prevState, image: file };
            checkForChanges(updatedFood);
            return updatedFood;
        });
    };

    const updateFood = async () => {
        const formData = new FormData();
        formData.append("id", editFood.id);
        formData.append("name", editFood.name);
        formData.append("category", editFood.category);
        formData.append("price", editFood.price);
        formData.append("description", editFood.description);
        formData.append("menuStatus", editFood.menuStatus ? "1" : "0");
        formData.append("prepTime", editFood.prepTime);
        if (editFood.image instanceof File) {
            formData.append("image", editFood.image);
        }

        try {
            const response = await axios.post(
                backendUrl + "/api/food/update",
                formData,
                {
                    headers: {
                        token,
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            if (response.data.success) {
                toast.success("Food Updated");
                fetchList();
                cancelEdit();
            } else {
                toast.error("Error updating food");
                console.log(response.data.message);
            }
        } catch (error) {
            console.log("Error updating food:", error.message);
        }
    };

    const removeFood = async () => {
        const response = await axios.post(
            backendUrl + "/api/food/remove",
            { id: selectedFoodId },
            { headers: { token } }
        );
        await fetchList();
        closeModal();
        if (response.data.success) {
            toast.success("Food Removed");
        } else {
            toast.error("Error removing");
        }
    };

    useEffect(() => {
        fetchList();
    }, []);

    const [searchTerm, setSearchTerm] = useState('');

    // Function to get the formatted date
    const getFormattedDate = () => {
        const today = new Date();
        const options = { weekday: 'short', day: '2-digit', year: 'numeric' };
        return today.toLocaleDateString('en-US', options);
    };

    // Filter and sort the inventory list based on the search term
    const filteredFoodList = list
        .filter((item) =>
            item.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .sort((a, b) => a.name.localeCompare(b.name));

    return (
        <div className="flex flex-col m-5 max-w-6.5xl w-full">
            {/* Header */}
            <div className="flex items-center justify-between mb-2">
                <h1 className="text-3xl font-bold text-gray-800">Food List</h1>
                <div className="flex items-center space-x-4">
                    {/* New Food Button */}
                    <button
                        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                        onClick={() => navigate('/add')}
                    >
                        + New
                    </button>
                    {/* Icon Button */}
                    <button className="p-2 bg-gray-200 rounded hover:bg-gray-300">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8h16M4 16h16" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Search and Show */}
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                    <label className="text-gray-700">Show</label>
                    <select className="border border-gray-300 rounded px-2 py-1">
                        <option value="10">10</option>
                        <option value="25">25</option>
                        <option value="50">50</option>
                    </select>
                    <label className="text-gray-700">entries</label>
                </div>
                {/* Search Bar */}
                <input
                    type="text"
                    placeholder="Filter item name"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="border border-gray-300 rounded px-4 py-2"
                />
            </div>
            <div className="bg-[#F3F4F6] rounded w-full max-w-[100%] max-h-[81vh] overflow-scroll">
                <div>
                    <div className="grid grid-cols-[0.5fr_0.9fr_0.8fr_0.8fr_0.5fr_0.5fr] items-center gap-2 p-3 border border-black text-sm font-medium bg-gray-700 text-white sm:grid">
                        <b>Image</b>
                        <b>Name</b>
                        <b>Category</b>
                        <b>Price</b>
                        <b>Remove</b>
                        <b>Modify</b>
                    </div>
                    {filteredFoodList.length > 0 ? (
                        filteredFoodList.map((item, index) => (
                            <div key={index}>
                                <div className={`grid grid-cols-[0.5fr_0.9fr_0.8fr_0.8fr_0.5fr_0.5fr] items-center gap-2 p-3 border border-black text-sm font-medium sm:grid ${item.menuStatus === false ? "bg-red-100" : "bg-white"}`}>
                                    <img
                                        src={backendUrl + "/images/" + item.image}
                                        alt=""
                                        className="w-20"
                                    />
                                    <p>{item.name}</p>
                                    <p>{item.category}</p>
                                    <p>${item.price}</p>
                                    <Trash2 size={28} onClick={() => openModal(item.id)} className="cursor-pointer pl-1" />
                                    <Pencil size={28} className="cursor-pointer pl-1" onClick={() => handleEditClick(item, index)} />
                                </div>

                                {editIndex === index && (
                                    <div
                                        ref={editRef}
                                        className="bg-white p-5 rounded shadow-md mt-2 mb-3 border-2 border-gray-600"
                                    >
                                        <h2 className="text-lg font-semibold mb-4">Edit Food</h2>

                                        <div>
                                            <div className="flex flex-row mb-4 mt-3 gap-8">
                                                <div className="add-img-upload flex-col">
                                                    <p className="mb-1">Upload Image</p>
                                                    <label
                                                        htmlFor="image"
                                                        className="flex items-center justify-center w-40 h-30 border-2 border-gray-500 rounded mb-2 cursor-pointer overflow-hidden"
                                                    >
                                                        <img
                                                            className="w-40 object-cover"
                                                            src={
                                                                image
                                                                    ? URL.createObjectURL(image)
                                                                    : backendUrl + "/images/" + editFood.image
                                                            }
                                                            alt=""
                                                        />
                                                    </label>
                                                    <input
                                                        onChange={handleImageChange}
                                                        type="file"
                                                        id="image"
                                                        hidden
                                                        accept="image/*"
                                                    />
                                                </div>

                                                <div className="flex flex-col">
                                                    <div className="flex flex-row mb-4 gap-8">
                                                        <div className="mb-2">
                                                            <label className="block text-sm font-medium mb-1">
                                                                Price
                                                            </label>
                                                            <input
                                                                type="number"
                                                                name="price"
                                                                value={editFood.price}
                                                                onChange={handleInputChange}
                                                                className="w-full border p-2 rounded"
                                                            />
                                                        </div>
                                                        <div className="mb-2">
                                                            <label className="block text-sm font-medium mb-1">
                                                                Category
                                                            </label>
                                                            <select
                                                                name="category"
                                                                value={editFood.category}
                                                                onChange={handleInputChange}
                                                                className="w-full border p-2 rounded"
                                                            >
                                                                <option value="Salad">Salad</option>
                                                                <option value="Rolls">Rolls</option>
                                                                <option value="Deserts">Deserts</option>
                                                                <option value="Sandwich">Sandwich</option>
                                                                <option value="Cake">Cake</option>
                                                                <option value="Pure Veg">Pure Veg</option>
                                                                <option value="Pasta">Pasta</option>
                                                                <option value="Noodles">Noodles</option>
                                                            </select>
                                                        </div>
                                                        <div className="mb-2">
                                                            <label className="block text-sm font-medium mb-1">
                                                                Menu Status
                                                            </label>
                                                            <input
                                                                type="checkbox"
                                                                name="menuStatus"
                                                                checked={editFood.menuStatus}
                                                                onChange={handleInputChange}
                                                                className="ml-2 w-5 h-5"
                                                            />
                                                        </div>
                                                        <div className="mb-2">
                                                            <label className="block text-sm font-medium mb-1">
                                                                Prep Time
                                                            </label>
                                                            <input
                                                                type="number"
                                                                name="prepTime"
                                                                value={editFood.prepTime}
                                                                onChange={handleInputChange}
                                                                className="w-full border p-2 rounded"
                                                            />
                                                        </div>

                                                    </div>

                                                    <div className="mb-2">
                                                        <label className="block text-sm font-medium mb-1">
                                                            Name
                                                        </label>
                                                        <input
                                                            type="text"
                                                            name="name"
                                                            value={editFood.name}
                                                            onChange={handleInputChange}
                                                            className="w-full border p-2 rounded"
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="mb-4">
                                                <label className="block text-sm font-medium mb-1">
                                                    Description
                                                </label>
                                                <textarea
                                                    name="description"
                                                    value={editFood.description}
                                                    onChange={handleInputChange}
                                                    className="w-full border p-2 rounded"
                                                />
                                            </div>

                                            <div className="flex justify-end mt-4">
                                                <button
                                                    onClick={cancelEdit}
                                                    className="bg-gray-300 px-4 py-2 rounded mr-2 hover:bg-gray-400"
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    onClick={updateFood}
                                                    disabled={!hasChanges}
                                                    className={`px-4 py-2 rounded ${hasChanges ? "bg-blue-500 text-white hover:bg-blue-600" : "bg-gray-300 cursor-not-allowed"}`}
                                                >
                                                    Save Changes
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-10 text-gray-500">
                            No foods match your search. Please try a different name.
                        </div>
                    )}
                    <div className="bg-gray-700 h-6 sm:grid"></div>
                </div>
            </div>

            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                contentLabel="Delete Confirmation"
                className="bg-white p-5 rounded shadow-md max-w-md mx-auto mt-20"
                overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
            >
                <h2 className="text-lg font-semibold">Confirm Delete</h2>
                <p>Are you sure you want to delete this item?</p>
                <div className="mt-4 flex justify-end">
                    <button
                        onClick={closeModal}
                        className="bg-gray-300 px-4 py-2 rounded mr-2 hover:bg-gray-400"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={removeFood}
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    >
                        Delete
                    </button>
                </div>
            </Modal>
        </div>
    );
};

export default List;
