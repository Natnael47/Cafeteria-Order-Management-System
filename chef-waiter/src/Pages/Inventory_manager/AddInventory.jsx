import axios from "axios";
import React, { useContext, useState } from 'react';
import { toast } from "react-toastify";
import { backendUrl } from "../../App";
import { assets } from '../../assets/assets';
import { InventoryContext } from "../../Context/InventoryContext";

const AddInventory = () => {
    const { iToken } = useContext(InventoryContext);

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

    // Handle input changes
    const onChangeHandler = (event) => {
        const { name, value } = event.target;
        setData((prevData) => ({ ...prevData, [name]: value }));
    };

    // Handle form submission
    const onSubmitHandler = async (event) => {
        event.preventDefault();

        // Prepare data in FormData
        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("description", data.description);
        formData.append("quantity", data.quantity);
        formData.append("unit", data.unit);
        formData.append("pricePerUnit", data.pricePerUnit);
        formData.append("category", data.category);
        formData.append("status", data.status);
        formData.append("dateReceived", data.dateReceived);
        formData.append("supplier", data.supplier);
        formData.append("expiryDate", data.expiryDate);
        if (image) formData.append("image", image);

        try {
            const response = await axios.post(`${backendUrl}/api/inventory/add-inventory`, formData, { headers: { iToken } });

            if (response.data.success) {
                setData({
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
                setImage(null);
                toast.success("Inventory item added successfully");
            } else {
                toast.error(response.data.message || "Failed to add inventory item");
            }
        } catch (error) {
            console.error("Error adding inventory item:", error);
            if (error.response) {
                // Backend errors
                toast.error(`Backend Error: ${error.response.data.message || "Failed to add inventory item"}`);
            } else if (error.request) {
                // Network errors
                toast.error("Network Error: No response received from the server");
            } else {
                // Other errors
                toast.error(`Error: ${error.message}`);
            }
        }
    };

    return (
        <form className='flex flex-col w-full items-start m-5' onSubmit={onSubmitHandler}>
            <p className="mb-3 text-lg font-semibold">Add Inventory Item</p>

            <div className="bg-white px-8 py-4 border rounded w-full max-w-4xl max-h-[88vh] overflow-scroll">
                {/* Image Upload */}
                <div className="add-img-upload flex-col">
                    <p className='mt-3 mb-1'>Upload Image</p>
                    <label htmlFor='image'>
                        <img className="w-40" src={image ? URL.createObjectURL(image) : assets.upload_area} alt='' />
                    </label>
                    <input onChange={(e) => setImage(e.target.files[0])} type='file' id='image' hidden />
                </div>

                {/* Inventory Item Fields */}
                {[
                    { label: "Item Name", name: "name", type: "text", placeholder: "Item Name" },
                    { label: "Description", name: "description", type: "textarea", placeholder: "Description" },
                    { label: "Quantity", name: "quantity", type: "number", placeholder: "Quantity" },
                    { label: "Unit", name: "unit", type: "text", placeholder: "Unit (e.g., kg, pcs)" },
                    { label: "Price Per Unit", name: "pricePerUnit", type: "number", placeholder: "Price per Unit" },
                    { label: "Category", name: "category", type: "text", placeholder: "Category" },
                    { label: "Status", name: "status", type: "text", placeholder: "Status" },
                    { label: "Date Received", name: "dateReceived", type: "date" },
                    { label: "Supplier", name: "supplier", type: "text", placeholder: "Supplier" },
                    { label: "Expiry Date", name: "expiryDate", type: "date" },
                ].map((field, index) => (
                    <div key={index} className="w-full mb-4">
                        <p className="mb-2">{field.label}</p>
                        {field.type === "textarea" ? (
                            <textarea
                                className="w-full max-w-[500px] max-h-[100px] px-3 py-2"
                                onChange={onChangeHandler}
                                value={data[field.name]}
                                name={field.name}
                                placeholder={field.placeholder}
                                rows="6"
                            />
                        ) : (
                            <input
                                className="w-full px-3 py-2"
                                onChange={onChangeHandler}
                                value={data[field.name]}
                                type={field.type}
                                name={field.name}
                                placeholder={field.placeholder}
                            />
                        )}
                    </div>
                ))}

                {/* Submit Button */}
                <button type='submit' className='w-28 py-3 mt-5 bg-black px-10 text-white rounded-md hover:bg-primary text-center'>Add</button>
            </div>
        </form>
    );
};

export default AddInventory;
