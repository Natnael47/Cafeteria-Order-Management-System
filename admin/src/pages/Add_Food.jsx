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
        category: "Salad"
    });

    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setData(data => ({ ...data, [name]: value }));
    }

    const onSubmitHandler = async (event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("description", data.description);
        formData.append("price", Number(data.price));
        formData.append("category", data.category);
        formData.append("image", image);

        const response = await axios.post(backendUrl + "/api/food/add", formData, { headers: { token } });
        if (response.data.success) {
            setData({
                name: "",
                description: "",
                price: "",
                category: "Salad"
            });
            setImage(false);
            navigate('/list')
            toast.success("Food added successfully");
        } else {
            toast.error("Failed to add");
        }
    }

    return (
        <form className='flex flex-col w-full items-start m-5' onSubmit={onSubmitHandler}>
            <p className="mb-3 text-lg font-semibold">Add Food</p>

            <div className="bg-white px-8 py-4 border rounded w-full max-w-4xl max-h-[88vh] overflow-scroll">
                <div className="add-img-upload flex-col">
                    <p className='mt-3 mb-1'>Upload Image</p>
                    <label htmlFor='image'>
                        <img className="w-40" src={image ? URL.createObjectURL(image) : assets.upload_area} alt='' />
                    </label>
                    <input onChange={(e) => setImage(e.target.files[0])} type='file' id='image' hidden required />
                </div>
                <div className="w-full">
                    <p className="mb-2 mt-4">Food name</p>
                    <input className="w-full max-w-[500px] px-3 py-2" onChange={onChangeHandler} value={data.name} type='text' name='name' placeholder='Write Name' required />
                </div>
                <div className="w-full ">
                    <p className="mb-2 mt-4">Description</p>
                    <textarea className="w-full max-w-[500px] max-h-[100px] px-3 py-2" onChange={onChangeHandler} value={data.description} name='description' rows="6" placeholder='Write Description Here' required />
                </div>
                <div className="flex flex-col sm:flex-row gap-2 w-full sm:gap-8 mt-3">
                    <div>
                        <p className="mb-2">Food category</p>
                        <select className="w-full px-3 py-2 sm:w-[120px] relative max-h-48 overflow-y-auto" onChange={onChangeHandler} value={data.category} name='category'>
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

                    <div>
                        <p className="mb-2">Price</p>
                        <input className="w-full px-3 py-2 sm:w-[120px] max-h-[40px]" onChange={onChangeHandler} value={data.price} type='number' name='price' placeholder='$20' required />
                    </div>
                </div>

                {/* Buttons at the bottom */}
                <div className="flex gap-5 w-full mt-5">
                    <button
                        type='submit'
                        className='bg-black px-4 py-3 rounded-md mr-2 hover:bg-primary text-white w-28'
                    >
                        Add
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate('/list')}
                        className="bg-gray-300 px-4 py-3 rounded-md mr-2 hover:bg-gray-400 w-28"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </form>
    )
}

export default Add;
