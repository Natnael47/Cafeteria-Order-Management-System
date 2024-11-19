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
        <form className='flex flex-col w-full items-start m-5' onSubmit={onSubmitHandler}>
            <p className="mb-3 text-lg font-semibold">Add Inventory Item</p>
            <div className="bg-white px-8 py-4 border rounded w-full max-w-4xl max-h-[88vh] overflow-scroll">
                <div className="add-img-upload flex-col">
                    <p className='mt-3 mb-1'>Upload Image</p>
                    <label htmlFor='image'>
                        <img className="w-40" src={image ? URL.createObjectURL(image) : assets.upload_area} alt='' />
                    </label>
                    <input onChange={(e) => setImage(e.target.files[0])} type='file' id='image' hidden required />
                </div>
                <div className="w-full">
                    <p className="mb-2 mt-4">Item Name</p>
                    <input className="w-full max-w-[500px] px-3 py-2 border border-gray-600 rounded-md focus:border-black" onChange={onChangeHandler} value={data.name} type='text' name='name' placeholder='Write Name' required />
                </div>
                <div className="w-full">
                    <p className="mb-2 mt-4">Description</p>
                    <textarea className="w-full max-w-[500px] max-h-[100px] px-3 py-2 border border-gray-600 rounded-md focus:border-black" onChange={onChangeHandler} value={data.description} name='description' rows="6" placeholder='Write Description Here' required />
                </div>
                <div className="flex flex-row sm:flex-row gap-2 w-full sm:gap-8">
                    <div>
                        <p className="mb-2 mt-4">Category</p>
                        <select
                            className="w-full max-w-[200px] px-3 py-2 border border-gray-600 rounded-md focus:border-black"
                            onChange={onChangeHandler}
                            value={data.category}
                            name="category"
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
                <div className="flex flex-col sm:flex-row gap-2 w-full sm:gap-8 mt-3">
                    <div>
                        <p className="mb-2">Unit</p>
                        <select
                            className="w-full px-3 py-2 sm:w-[150px] border border-gray-600 rounded-md focus:border-black"
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

                <div className="flex w-full justify-start gap-3 mt-8">
                    <button type="submit" className="px-8 py-2 rounded text-white bg-[#0b5ed7]">
                        Submit
                    </button>
                    <button
                        type="button"
                        onClick={onCancelHandler}
                        className="px-8 py-2 rounded text-white bg-gray-500 hover:bg-gray-600"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </form>
    );
};

export default AddInventory;
