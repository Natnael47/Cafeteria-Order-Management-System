import axios from "axios";
import React, { useContext, useState } from 'react';
import { toast } from "react-toastify";
import { backendUrl } from "../App";
import { assets } from '../assets/assets';
import { AdminContext } from "../context/AdminContext";

const Add = () => {
    const { token, navigate } = useContext(AdminContext);

    const [image, setImage] = useState(false);
    const [data, setData] = useState({
        name: "",
        description: "",
        price: "",
        category: "Salad",
        prepTime: "",
        isFasting: false,
    });

    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = name === "isFasting" ? event.target.value === "true" : event.target.value;
        setData(data => ({ ...data, [name]: value }));
    }

    const onSubmitHandler = async (event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("description", data.description);
        formData.append("price", Number(data.price));
        formData.append("category", data.category);
        formData.append("prepTime", data.prepTime);
        formData.append("isFasting", data.isFasting);
        formData.append("image", image);

        try {
            const response = await axios.post(`${backendUrl}/api/food/add`, formData, {
                headers: { token },
            });

            if (response.data.success) {
                setData({
                    name: "",
                    description: "",
                    price: "",
                    category: "Salad",
                    prepTime: "",
                    isFasting: false,
                });
                setImage(false);
                navigate("/list");
                toast.success("Food added successfully");
            } else {
                toast.error(response.data.message || "Failed to add");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "An error occurred");
        }
    };


    return (
        <form
            className="flex flex-col w-full items-start m-5"
            onSubmit={onSubmitHandler}
        >
            {/* Form Title */}
            <p className="mb-2 text-2xl font-bold text-gray-800">Add Dish</p>

            {/* Form Container */}
            <div className="bg-white px-8 py-6 border shadow-lg rounded-lg w-full max-w-4xl">
                {/* Image Upload */}
                <div className="flex flex-col items-start mb-4">
                    <p className="mb-1 ml-1 text-lg font-semibold text-gray-700">Upload Image</p>
                    <label htmlFor="image" className="cursor-pointer">
                        <img
                            className="w-[150px] h-[100px] object-cover rounded-md border"
                            src={image ? URL.createObjectURL(image) : assets.upload_area}
                            alt="Upload"
                        />
                    </label>
                    <input
                        onChange={(e) => setImage(e.target.files[0])}
                        type="file"
                        id="image"
                        hidden
                        required
                    />
                </div>

                {/* Food Name and Category */}
                <div className="flex flex-wrap justify-between w-full gap-6 mb-6">
                    {/* Food Name */}
                    <div className="flex-1 min-w-[220px]">
                        <p className="mb-2 font-semibold text-gray-700">Name</p>
                        <input
                            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                            onChange={onChangeHandler}
                            value={data.name}
                            type="text"
                            name="name"
                            placeholder="Write Name"
                            required
                        />
                    </div>

                    {/* Category */}
                    <div className="flex-1 min-w-[220px]">
                        <p className="mb-2 font-semibold text-gray-700">Category</p>
                        <select
                            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                            onChange={onChangeHandler}
                            value={data.category}
                            name="category"
                            required
                        >
                            <option value="Salad">Salad</option>
                            <option value="Rolls">Rolls</option>
                            <option value="Deserts & Cakes">Deserts & Cakes</option>
                            <option value="Sandwich">Sandwich</option>
                            <option value="Special">Special</option>
                            <option value="Pasta">Pasta</option>
                            <option value="Breakfast">Breakfast</option>
                            <option value="Pizzas">Pizzas</option>
                            <option value="Fasting">Fasting</option>
                            <option value="Main Dishes">Main Dishes</option>
                            <option value="Appetizers">Appetizers</option>
                        </select>
                    </div>
                </div>

                {/* Description */}
                <div className="w-full mb-6">
                    <p className="mb-2 font-semibold text-gray-700">Description</p>
                    <textarea
                        className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                        onChange={onChangeHandler}
                        value={data.description}
                        name="description"
                        rows="3"
                        placeholder="Write Description Here"
                        required
                    />
                </div>

                {/* Price and Cook Time */}
                <div className="flex flex-wrap justify-between w-full gap-6 mb-6">
                    {/* Price */}
                    <div className="flex-1 min-w-[220px]">
                        <p className="mb-2 font-semibold text-gray-700">Price</p>
                        <input
                            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                            onChange={onChangeHandler}
                            value={data.price}
                            type="number"
                            name="price"
                            placeholder="$20"
                            required
                        />
                    </div>

                    {/* Cook Time */}
                    <div className="flex-1 min-w-[220px]">
                        <p className="mb-2 font-semibold text-gray-700">Prep Time (in minutes)</p>
                        <input
                            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                            onChange={onChangeHandler}
                            value={data.prepTime}
                            type="number"
                            name="prepTime"
                            placeholder="30"
                        />
                    </div>
                    {/* is Fasting */}
                    <div className="flex-1 min-w-[220px]">
                        <p className="mb-2 font-semibold text-gray-700">Fasting</p>
                        <select
                            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                            onChange={onChangeHandler}
                            value={data.isFasting}
                            name="isFasting"
                            required
                        >
                            <option value="false">Not Fasting</option>
                            <option value="true">Fasting</option>
                        </select>
                    </div>
                </div>

                {/* Buttons */}
                <div className="flex justify-end gap-4">
                    <button
                        type="submit"
                        className="bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-3 rounded-lg shadow-md transition-all"
                    >
                        Add
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate("/list")}
                        className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-semibold px-6 py-3 rounded-lg shadow-md transition-all"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </form>
    );

}

export default Add;
