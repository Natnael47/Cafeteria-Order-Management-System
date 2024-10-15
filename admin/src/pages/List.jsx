import axios from "axios";
import React, { useContext, useEffect, useState } from 'react';
import { toast } from "react-toastify";
import { backendUrl } from "../App";
import { assets } from "../assets/assets";
import { AdminContext } from "../context/AdminContext";

const List = () => {

    const { token } = useContext(AdminContext);
    const [list, setList] = useState([]);
    const [isEdit, setIsEdit] = useState(false);

    const fetchList = async () => {
        const response = await axios.get(backendUrl + "/api/food/list", { headers: { token } });
        if (response.data.success) {
            //console.log(response.data.data);
            setList(response.data.data);
        } else {
            toast.error("Error fetching list");
        }
    }

    const removeFood = async (foodId) => {
        //console.log({ foodId });
        const response = await axios.post(backendUrl + "/api/food/remove", { id: foodId }, { headers: { token } });
        await fetchList();
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
                    <div className="grid grid-cols-[0.5fr_0.9fr_0.8fr_0.8fr_0.5fr_0.5fr] items-center gap-2 p-3 border border-black text-sm font-medium bg-gray-200 sm:grid">
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
                            <p onClick={() => removeFood(item._id)} className="cursor-pointer pl-1">
                                <img src={assets.trash_icon} alt="" className="w-7 ml-2 hover:scale-105 transition-transform duration-200" />
                            </p>
                            <p className="cursor-pointer pl-1" onClick={() => setIsEdit(true)}>
                                <img src={assets.modify_icon} alt="" className="w-7 ml-2 hover:scale-105 transition-transform duration-200" />
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>

    )
}

export default List;
