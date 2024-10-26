import axios from "axios";
import React, { useContext, useEffect, useState } from 'react';
import Modal from 'react-modal';
import { toast } from "react-toastify";
import { backendUrl } from "../App";
import { assets } from "../assets/assets";
import { AdminContext } from "../context/AdminContext";

Modal.setAppElement('#root'); // Set the root element for accessibility

const List = () => {
    const { token } = useContext(AdminContext);
    const [list, setList] = useState([]);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selectedFoodId, setSelectedFoodId] = useState(null);
    const [editIndex, setEditIndex] = useState(null); // Index of the item being edited
    const [editFood, setEditFood] = useState({ name: '', category: '', price: '', image: '', description: '' });
    const [image, setImage] = useState(false); // State for image preview

    const fetchList = async () => {
        const response = await axios.get(backendUrl + "/api/food/list", { headers: { token } });
        if (response.data.success) {
            setList(response.data.data);
        } else {
            toast.error("Error fetching list");
        }
    }

    const openModal = (foodId) => {
        setSelectedFoodId(foodId);
        setModalIsOpen(true);
    }

    const closeModal = () => {
        setSelectedFoodId(null);
        setModalIsOpen(false);
    }

    const handleEditClick = (food, index) => {
        if (editIndex === index) {
            // If the same item is clicked again, cancel edit
            cancelEdit();
        } else {
            // Otherwise, start editing the clicked item
            setEditFood({ ...food });
            setEditIndex(index); // Set the index of the item being edited
            setImage(false); // Reset image state for each new edit
        }
    }

    const cancelEdit = () => {
        setEditIndex(null); // Clear the edit index
        setEditFood({ name: '', category: '', price: '', image: '', description: '' });
        setImage(false); // Reset image state
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditFood(prevState => ({ ...prevState, [name]: value }));
    }

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImage(file);
        setEditFood(prevState => ({ ...prevState, image: file }));
    }

    const updateFood = async () => {
        const formData = new FormData();
        formData.append("id", editFood.id);
        formData.append("name", editFood.name);
        formData.append("category", editFood.category);
        formData.append("price", editFood.price);
        formData.append("description", editFood.description);
        if (editFood.image instanceof File) {
            formData.append("image", editFood.image);
        }

        try {
            const response = await axios.post(backendUrl + "/api/food/update", formData, {
                headers: {
                    token,
                    'Content-Type': 'multipart/form-data'
                }
            });
            if (response.data.success) {
                toast.success("Food Updated");
                fetchList();
                cancelEdit();
            } else {
                toast.error("Error updating food");
                console.log(error.message);
            }
        } catch (error) {
            // Handle the error appropriately
            console.log("Error updating food:", error.message);
        }
    }


    const removeFood = async () => {
        const response = await axios.post(backendUrl + "/api/food/remove", { id: selectedFoodId }, { headers: { token } });
        await fetchList();
        closeModal();
        if (response.data.success) {
            toast.success("Food Removed");
        } else {
            toast.error("Error removing");
        }
    }

    useEffect(() => {
        fetchList();
    }, []);

    return (
        <div className="flex flex-col m-5 w-full">
            <p className="mb-3 text-lg font-semibold">All Foods List</p>
            <div className="bg-[#F3F4F6] rounded w-full max-w-5.3xl max-h-[88vh] overflow-scroll">
                <div>
                    <div className="grid grid-cols-[0.5fr_0.9fr_0.8fr_0.8fr_0.5fr_0.5fr] items-center gap-2 p-3 border border-black text-sm font-medium bg-gray-700 text-white sm:grid">
                        <b>Image</b>
                        <b>Name</b>
                        <b>Category</b>
                        <b>Price</b>
                        <b>Remove</b>
                        <b>Modify</b>
                    </div>
                    {list.map((item, index) => (
                        <div key={index}>
                            <div className="grid grid-cols-[0.5fr_0.9fr_0.8fr_0.8fr_0.5fr_0.5fr] items-center gap-2 p-3 border border-black text-sm font-medium bg-white sm:grid">
                                <img src={backendUrl + "/images/" + item.image} alt="" className="w-20" />
                                <p>{item.name}</p>
                                <p>{item.category}</p>
                                <p>${item.price}</p>
                                <p onClick={() => openModal(item.id)} className="cursor-pointer pl-1">
                                    <img src={assets.trash_icon} alt="" className="w-7 ml-2 hover:scale-125 transition-transform" />
                                </p>
                                <p className="cursor-pointer pl-1" onClick={() => handleEditClick(item, index)}>
                                    <img src={assets.modify_icon} alt="" className="w-7 ml-2 hover:scale-125 transition-transform" />
                                </p>
                            </div>

                            {/* Editable form for the selected item */}
                            {editIndex === index && (
                                <div className="bg-white p-5 rounded shadow-md mt-2 mb-3">
                                    <h2 className="text-lg font-semibold mb-4">Edit Food</h2>

                                    <div>

                                        <div className="flex flex-row mb-4 mt-3 gap-8">
                                            <div className="add-img-upload flex-col">
                                                <p className='mb-1'>Upload Image</p>
                                                <label htmlFor='image' className="flex items-center justify-center w-40 h-30 border-2 border-dashed border-black rounded mb-2 cursor-pointer overflow-hidden">
                                                    <img
                                                        className="w-40 object-cover"
                                                        src={image ? URL.createObjectURL(image) : backendUrl + "/images/" + editFood.image}
                                                        alt=''
                                                    />
                                                </label>
                                                <input
                                                    onChange={handleImageChange}
                                                    type='file'
                                                    id='image'
                                                    hidden
                                                    accept="image/*"
                                                />
                                            </div>
                                            <div className="mb-4">
                                                <label className="block text-sm font-medium mb-1">Name</label>
                                                <input
                                                    type="text"
                                                    name="name"
                                                    value={editFood.name}
                                                    onChange={handleInputChange}
                                                    className="w-full border p-2 rounded"
                                                />
                                            </div>
                                            <div className="mb-4">
                                                <p className="block text-sm font-medium mb-1">Category</p>
                                                <select
                                                    className="w-full px-3 py-2 border rounded"
                                                    onChange={handleInputChange}
                                                    value={editFood.category}
                                                    name='category'
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
                                        </div>

                                        <div className="mb-4">
                                            <label className="block text-sm font-medium mb-1">Price</label>
                                            <input
                                                type="number"
                                                name="price"
                                                value={editFood.price}
                                                onChange={handleInputChange}
                                                className="w-full border p-2 rounded"
                                            />
                                        </div>
                                        <div className="mb-4">
                                            <label className="block text-sm font-medium mb-1">Description</label>
                                            <textarea
                                                name="description"
                                                value={editFood.description}
                                                onChange={handleInputChange}
                                                className="w-full border p-2 rounded"
                                            />
                                        </div>

                                        <div className="flex justify-end">
                                            <button onClick={cancelEdit} className="bg-gray-300 px-4 py-2 rounded mr-2">Cancel</button>
                                            <button onClick={updateFood} className="bg-blue-500 text-white px-4 py-2 rounded">Update</button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Modal for delete confirmation */}
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
                    <button onClick={closeModal} className="bg-gray-300 px-4 py-2 rounded mr-2 ">Cancel</button>
                    <button onClick={removeFood} className="bg-red-500 text-white px-4 py-2 rounded">Delete</button>
                </div>
            </Modal>
        </div>
    )
}

export default List;
