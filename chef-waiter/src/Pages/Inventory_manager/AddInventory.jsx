import React, { useContext, useState } from 'react';
import { assets } from '../../assets/assets';
import { InventoryContext } from "../../Context/InventoryContext";

const AddInventory = () => {
    const { iToken, addInventory } = useContext(InventoryContext);

    const [image, setImage] = useState(null);
    const [data, setData] = useState({
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

    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setData((prevData) => ({ ...prevData, [name]: value }));
    };

    const onSubmitHandler = async (event) => {
        event.preventDefault();
        addInventory(data, image, setData, setImage);
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
                            <option value="Electronics">Electronics</option>
                            <option value="Furniture">Furniture</option>
                            <option value="Stationery">Stationery</option>
                            <option value="Cleaning Supplies">Cleaning Supplies</option>
                            <option value="Food Supplies">Food Supplies</option>
                        </select>
                    </div>
                    <div>
                        <p className="mb-2 mt-4">Quantity</p>
                        <input className="w-full px-3 py-2 sm:w-[150px] border border-gray-600 rounded-md focus:border-black" onChange={onChangeHandler} value={data.quantity} type='number' name='quantity' placeholder='0' required />
                    </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 w-full sm:gap-8 mt-3">

                    <div>
                        <p className="mb-2">Unit</p>
                        <input className="w-full px-3 py-2 sm:w-[150px] border border-gray-600 rounded-md focus:border-black" onChange={onChangeHandler} value={data.unit} type='text' name='unit' placeholder='kg, pcs, etc.' required />
                    </div>
                    <div>
                        <p className="mb-2">Price Per Unit</p>
                        <input className="w-full px-3 py-2 sm:w-[150px] border border-gray-600 rounded-md focus:border-black" onChange={onChangeHandler} value={data.pricePerUnit} type='number' name='pricePerUnit' placeholder='$' required />
                    </div>
                    <div>
                        <p className="mb-2">Status</p>
                        <input className="w-full px-3 py-2 sm:w-[150px] border border-gray-600 rounded-md focus:border-black" onChange={onChangeHandler} value={data.status} type='text' name='status' placeholder='Available, Pending, etc.' required />
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 w-full sm:gap-8 mt-3">
                    <div>
                        <p className="mb-2">Date Received</p>
                        <input className="w-full px-3 py-2 sm:w-[150px] border border-gray-600 rounded-md focus:border-black" onChange={onChangeHandler} value={data.dateReceived} type='date' name='dateReceived' required />
                    </div>
                    <div>
                        <p className="mb-2">Supplier</p>
                        <input className="w-full px-3 py-2 sm:w-[150px] border border-gray-600 rounded-md focus:border-black" onChange={onChangeHandler} value={data.supplier} type='text' name='supplier' required />
                    </div>
                    <div>
                        <p className="mb-2">Expiry Date</p>
                        <input className="w-full px-3 py-2 sm:w-[150px] border border-gray-600 rounded-md focus:border-black" onChange={onChangeHandler} value={data.expiryDate} type='date' name='expiryDate' required />
                    </div>
                </div>

                <div className="flex w-full justify-start gap-3 mt-8">
                    <button type="submit" className="px-8 py-2 rounded text-white bg-[#0b5ed7]">
                        Submit
                    </button>
                </div>
            </div>
        </form>

    );
}

export default AddInventory;
