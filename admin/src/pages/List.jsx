import axios from "axios";
import React, { useContext, useEffect, useState } from 'react';
import Modal from 'react-modal'; // Import react-modal for confirmation dialogs
import { toast } from "react-toastify";
import { backendUrl } from "../App";
import { assets } from "../assets/assets";
import { AdminContext } from "../context/AdminContext";

Modal.setAppElement('#root'); // Set the root element for accessibility

const List = () => {
    const { token } = useContext(AdminContext);
    const [list, setList] = useState([]);
    const [isEdit, setIsEdit] = useState(false);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selectedFoodId, setSelectedFoodId] = useState(null);

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
                        <div key={index} className="grid grid-cols-[0.5fr_0.9fr_0.8fr_0.8fr_0.5fr_0.5fr] items-center gap-2 p-3 border border-black text-sm font-medium bg-white sm:grid">
                            <img src={backendUrl + "/images/" + item.image} alt="" className="w-20" />
                            <p>{item.name}</p>
                            <p>{item.category}</p>
                            <p>${item.price}</p>
                            <p onClick={() => openModal(item.id)} className="cursor-pointer pl-1">
                                <img src={assets.trash_icon} alt="" className="w-7 ml-2 hover:scale-125 transition-transform" />
                            </p>
                            <p className="cursor-pointer pl-1" onClick={() => setIsEdit(true)}>
                                <img src={assets.modify_icon} alt="" className="w-7 ml-2 hover:scale-125 transition-transform" />
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Modal for confirmation */}
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                contentLabel="Delete Confirmation"
                className="bg-white p-5 rounded shadow-md max-w-md mx-auto mt-20"
                overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
            >
                <h2 className="text-lg font-semibold mb-4">Confirm Delete</h2>
                <p>Are you sure you want to delete this food item?</p>
                <div className="mt-4 flex justify-end">
                    <button onClick={closeModal} className="bg-gray-300 px-4 py-2 rounded mr-2 hover:bg-gray-400">Cancel</button>
                    <button onClick={removeFood} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">Delete</button>
                </div>
            </Modal>
        </div>
    )
}

export default List;
