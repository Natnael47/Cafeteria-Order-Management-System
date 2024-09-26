import axios from "axios";
import React, { useEffect, useState } from 'react';
import { toast } from "react-toastify";
import { backendUrl } from "../../App";
import { assets } from "../../assets/assets";
import "./List.css";

const List = ({ token }) => {

    const [list, setList] = useState([]);

    const fetchList = async () => {
        const response = await axios.get(backendUrl + "/api/food/list", { headers: { token } });
        //console.log(response.data);
        if (response.data.success) {
            setList(response.data.data);
        } else {
            toast.error("Error fetching list");
        }
    }

    const removeFood = async (foodId) => {
        const response = await axios.post(backendUrl + "/api/food/remove", { id: foodId }, { headers: { token } })
        await fetchList();
        if (response.data.success) {
            toast.success(response.data.message);
        } else {
            toast.error("Error");
        }
    }

    useEffect(() => {
        fetchList();
    }, []);

    return (
        <div className="list add flex-col">
            <p> <b>All Foods List</b></p>
            <div className="list-table">
                <div className="list-table-format title">
                    <b>Image</b>
                    <b>Name</b>
                    <b>Category</b>
                    <b>Price</b>
                    <b>Action</b>
                </div>
                {list.map((item, index) => {
                    return (
                        <div key={index} className="list-table-format">
                            <img src={backendUrl + "/images/" + item.image} alt="" />
                            <p>{item.name}</p>
                            <p>{item.category}</p>
                            <p>${item.price}</p>
                            <p onClick={() => removeFood(item._id)} className="cursor"><img src={assets.trash_icon} alt="" /></p>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default List