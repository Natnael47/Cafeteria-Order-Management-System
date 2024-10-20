import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { backendUrl } from "../App";
//import { food_list } from "../assets/assets";

export const StoreContext = createContext(null)

const StoreContextProvider = (props) => {

    //const backendUrl = import.meta.env.VITE_BACKEND_URL

    const [food_list, setFoodList] = useState([]);

    const [cartItems, setCartItems] = useState({});

    const [search, setSearch] = useState('');

    const navigate = useNavigate();

    const [showSearch, setShowSearch] = useState(false);

    //const url = "http://localhost:4000";

    const [token, setToken] = useState("");

    const [userData, setUserData] = useState(false);

    const fetchFoodList = async () => {
        try {
            const response = await axios.get(backendUrl + "/api/food/list");
            if (response.data.success) {
                setFoodList(response.data.data);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);

        }
    }

    const addToCart = async (itemId) => {
        const id = Number(itemId); // Ensure itemId is a number
        if (!cartItems[id]) {
            setCartItems((prev) => ({ ...prev, [id]: 1 }));
        } else {
            setCartItems((prev) => ({ ...prev, [id]: prev[id] + 1 }));
        }
        if (token) {
            await axios.post(backendUrl + "/api/cart/add", { itemId: id }, { headers: { token } })
        }
    }

    const getCartItems = () => {
        let totalItems = 0;
        for (const item in cartItems) {
            if (cartItems[item] > 0) {
                totalItems += cartItems[item];
            }
        }
        return totalItems;
    }

    const removeFromCart = async (itemId) => {
        const id = Number(itemId); // Ensure itemId is a number
        setCartItems((prev) => ({ ...prev, [id]: prev[id] - 1 }));
        if (token) {
            await axios.post(backendUrl + "/api/cart/remove", { itemId: id }, { headers: { token } })
        }
    }

    const getTotalCartAmount = () => {
        let totalAmount = 0;

        for (const item in cartItems) {
            if (cartItems[item] > 0) {
                // Ensure item ID is treated as a number if needed
                const itemId = Number(item);

                // Find the item info from food_list
                const itemInfo = food_list.find((product) => product._id === itemId);

                if (!itemInfo) {
                    console.error("Item not found in food_list:", itemId);
                    continue; // Skip this item if it's not found
                }

                // Convert price to number
                const price = parseFloat(itemInfo.price);
                if (isNaN(price)) {
                    console.error("Price is not a valid number for item:", itemInfo);
                    continue; // Skip this item if price is not valid
                }

                totalAmount += price * cartItems[item];
            }
        }

        return totalAmount;
    };

    useEffect(() => {
        async function loadData() {
            await fetchFoodList();
            if (localStorage.getItem("token")) {
                setToken(localStorage.getItem("token"));
                await loadCartData(localStorage.getItem("token"));
            }
        }
        loadData();
    }, [])

    useEffect(() => {
        if (token) {
            loadUserProfileData()
        } else {
            setUserData(false);
        }
    }, [token])

    const loadCartData = async (token) => {
        const response = await axios.post(backendUrl + "/api/cart/get", {}, { headers: { token } });
        setCartItems(response.data.cartData);
    }

    const loadUserProfileData = async () => {
        try {

            const { data } = await axios.get(backendUrl + "/api/user/get-profile", { headers: { token } });
            if (data.success) {
                setUserData(data.userData);
            } else {
                toast.error(data.message);
            }

        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    }

    const contextValue = {
        food_list,
        cartItems,
        setCartItems,
        getCartItems,
        addToCart,
        removeFromCart,
        getTotalCartAmount,
        token,
        setToken,
        backendUrl,
        search,
        setSearch,
        showSearch,
        setShowSearch,
        navigate,
        userData, setUserData,
        loadUserProfileData
    }

    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    )
}

export default StoreContextProvider;
