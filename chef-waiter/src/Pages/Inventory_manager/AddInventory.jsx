import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook
import { assets } from '../../assets/assets';
import { InventoryContext } from "../../Context/InventoryContext";

const AddInventory = () => {
    const { addInventory } = useContext(InventoryContext);
    const navigate = useNavigate(); // Initialize the navigate hook

    const [image, setImage] = useState(null);
    const [data, setData] = useState({
        name: "",
        description: "",
        unit: "kg",
        category: "Electronics",
    });

    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setData((prevData) => ({ ...prevData, [name]: value }));
    };

    const onSubmitHandler = async (event) => {
        event.preventDefault();
        await addInventory(data, image, setData, setImage);  // Ensure addInventory completes
        navigate('/inventory');  // Navigate to /inventory after submission
    };

    const onCancelHandler = () => {
        navigate('/inventory');  // Navigate to /inventory when cancel is clicked
    };

    return (
        <form className="flex flex-col w-full items-start m-5" onSubmit={onSubmitHandler}>
            {/* Form Title */}
            <p className="mb-2 text-2xl font-semibold text-gray-800">Add Inventory Item</p>

            {/* Form Container */}
            <div className="bg-white px-8 py-6 border shadow-lg rounded-lg w-full max-w-4xl">

                {/* Image Upload */}
                <div className="flex flex-col items-start mb-4">
                    <p className="mb-2 ml-1 text-lg font-semibold text-gray-700">Upload Image</p>
                    <label htmlFor="image" className="cursor-pointer">
                        <img
                            className="w-[150px] h-[100px] object-cover rounded-md border-2 border-gray-300"
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

                {/* Item Name and Category */}
                <div className="flex flex-wrap justify-between w-full gap-6 mb-4">
                    {/* Item Name */}
                    <div className="flex-1 min-w-[220px]">
                        <p className="mb-2 font-semibold text-gray-700">Item Name</p>
                        <input
                            className="w-full px-4 py-3 border border-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
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
                            className="w-full px-4 py-3 border border-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                            onChange={onChangeHandler}
                            value={data.category}
                            name="category"
                            required
                        >
                            <option value="Beverages">Beverages</option>
                            <option value="Snacks">Snacks</option>
                            <option value="Dairy Products">Dairy Products</option>
                            <option value="Produce">Produce</option>
                            <option value="Meat & Poultry">Meat & Poultry</option>
                            <option value="Grains">Grains</option>
                            <option value="Condiments">Condiments</option>
                            <option value="Cleaning Supplies">Cleaning Supplies</option>
                            <option value="Bakery">Bakery</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                </div>

                {/* Unit */}
                <div className="flex flex-wrap justify-between w-full gap-6 mb-4">
                    <div className="flex-1 min-w-[220px]">
                        <p className="mb-2 font-semibold text-gray-700">Unit</p>
                        <select
                            className="w-full px-4 py-3 border border-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                            onChange={onChangeHandler}
                            value={data.unit}
                            name="unit"
                        >
                            <option value="kg">kg</option>
                            <option value="g">g</option>
                            <option value="liters">liters</option>
                            <option value="ml">ml</option>
                            <option value="pieces">pieces</option>
                            <option value="packs">packs</option>
                            <option value="boxes">boxes</option>
                            <option value="loaves">Loaf (kg)</option>
                        </select>
                    </div>
                </div>

                {/* Description */}
                <div className="w-full mb-4">
                    <p className="mb-2 font-semibold text-gray-700">Description</p>
                    <textarea
                        className="w-full px-4 py-3 border border-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                        onChange={onChangeHandler}
                        value={data.description}
                        name="description"
                        rows="3"
                        placeholder="Write Description Here"
                        required
                    />
                </div>

                {/* Buttons */}
                <div className="flex justify-end gap-4">
                    <button
                        type="submit"
                        className="bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-3 rounded-lg shadow-md transition-all"
                    >
                        Submit
                    </button>
                    <button
                        type="button"
                        onClick={onCancelHandler}
                        className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-semibold px-6 py-3 rounded-lg shadow-md transition-all"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </form>

    );
};

export default AddInventory;
