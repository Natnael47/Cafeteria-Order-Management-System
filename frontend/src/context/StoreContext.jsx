import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { backendUrl } from "../App";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
    const [food_list, setFoodList] = useState([]);
    const [cartItems, setCartItems] = useState(() => {
        // Check for token and load cartItems from localStorage only if a token exists
        const token = localStorage.getItem("token");
        if (token) {
            const savedCart = localStorage.getItem("cartItems");
            return savedCart ? JSON.parse(savedCart) : {};
        } else {
            localStorage.removeItem("cartItems"); // Clear cartItems if no token
            return {};
        }
    });
    const [search, setSearch] = useState('');
    const [token, setToken] = useState(localStorage.getItem("token") || ""); // Get token from local storage initially
    const [userData, setUserData] = useState(null);
    const [showSearch, setShowSearch] = useState(false);
    const navigate = useNavigate();

    const fetchFoodList = async () => {
        try {
            const response = await axios.get(`${backendUrl}/api/food/list`);
            if (response.data.success) {
                setFoodList(response.data.data);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error(error);
            toast.error(error.message);
        }
    };

    const addToCart = async (itemId) => {
        const id = Number(itemId);
        setCartItems((prev) => {
            const updatedCart = { ...prev, [id]: (prev[id] || 0) + 1 };
            if (token) {
                localStorage.setItem("cartItems", JSON.stringify(updatedCart)); // Save to localStorage only if logged in
            }
            return updatedCart;
        });
        if (token) {
            await axios.post(`${backendUrl}/api/cart/add`, { itemId: id }, { headers: { token } });
        }
    };

    const removeFromCart = async (itemId) => {
        const id = Number(itemId);
        setCartItems((prev) => {
            const updatedCart = { ...prev, [id]: prev[id] > 1 ? prev[id] - 1 : 0 };
            if (token) {
                localStorage.setItem("cartItems", JSON.stringify(updatedCart)); // Save to localStorage only if logged in
            }
            return updatedCart;
        });
        if (token) {
            await axios.post(`${backendUrl}/api/cart/remove`, { itemId: id }, { headers: { token } });
        }
    };

    const getCartItems = () => {
        return Object.keys(cartItems).filter((item) => cartItems[item] > 0).length;
    };

    const getTotalCartAmount = () => {
        let totalAmount = 0;
        for (const item in cartItems) {
            if (cartItems[item] > 0) {
                const itemInfo = food_list.find((product) => product.id === Number(item));
                if (itemInfo) {
                    const price = parseFloat(itemInfo.price);
                    if (!isNaN(price)) {
                        totalAmount += price * cartItems[item];
                    }
                }
            }
        }
        return totalAmount;
    };

    const loadCartData = async (token) => {
        try {
            const response = await axios.post(`${backendUrl}/api/cart/get`, {}, { headers: { token } });
            if (response.data.cartData) {
                setCartItems(response.data.cartData);
                localStorage.setItem("cartItems", JSON.stringify(response.data.cartData)); // Save to localStorage
            }
        } catch (error) {
            console.error("Error loading cart data:", error);
            toast.error("Failed to load cart items.");
        }
    };

    const loadUserProfileData = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/user/get-profile`, { headers: { token } });
            if (data.success) {
                setUserData({
                    firstName: data.userData.firstName,
                    lastName: data.userData.lastName,
                    email: data.userData.email,
                    gender: data.userData.gender,
                    address: data.userData.address,
                    dob: data.userData.dob,
                    phone: data.userData.phone,
                });
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error("Error loading profile data:", error);
            toast.error(error.message);
        }
    };

    useEffect(() => {
        async function loadData() {
            await fetchFoodList();
            if (token) {
                await loadCartData(token);
                await loadUserProfileData();
            }
        }
        loadData();
    }, [token]);

    // Clear cart items when token is removed (user logs out or token expires)
    useEffect(() => {
        if (!token) {
            setCartItems({});
            localStorage.removeItem("cartItems");
        }
    }, [token]);

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
        userData,
        setUserData,
        loadUserProfileData,
    };

    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    );
};

export default StoreContextProvider;
