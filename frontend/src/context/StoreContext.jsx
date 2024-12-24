import axios from "axios";
import Fuse from 'fuse.js';
import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { backendUrl } from "../App";


export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
    const [food_list, setFoodList] = useState([]);
    const [drink_list, setDrinkList] = useState([]);
    const [cartItems, setCartItems] = useState(() => {
        const savedCart = localStorage.getItem("cartItems");
        return savedCart ? JSON.parse(savedCart) : {};
    });
    const [search, setSearch] = useState('');
    const [token, setToken] = useState(localStorage.getItem("token") || "");
    const [userData, setUserData] = useState({
        firstName: '',
        lastName: '',
        gender: '',
        phone: '',
        address: { line1: '', line2: '' },
        dob: '',
        email: ''
    });
    const [showSearch, setShowSearch] = useState(false);
    const navigate = useNavigate();

    const fuseOptions = {
        keys: ['name'], // Search by the 'name' field in food_list
        threshold: 0.3, // Adjust sensitivity (lower is stricter)
        includeScore: true,
    };

    const filteredFoodList = food_list.filter((food) =>
        food.name.toLowerCase().includes(search.toLowerCase())
    );

    const autocompleteSuggestions = food_list.filter((food) =>
        food.name.toLowerCase().startsWith(search.toLowerCase())
    );

    const fuse = new Fuse(food_list, fuseOptions);

    // Perform fuzzy search
    const fuzzyResults = fuse.search(search);

    // Extract matching items (map Fuse results to original objects)
    const fuzzyMatchedItems = fuzzyResults.map(result => result.item);

    // Separate non-matching items
    const nonMatchingItems = food_list.filter(
        food => !fuzzyMatchedItems.includes(food)
    );

    // Prioritize the food list based on exact matches, starts-with matches, and fuzzy similarity
    const prioritizedFoodList = (() => {
        const searchLower = search.toLowerCase();

        // Exact matches
        const exactMatches = food_list.filter(
            (food) => food.name.toLowerCase() === searchLower
        );

        // Starts-with matches (excluding exact matches)
        const startsWithMatches = food_list.filter(
            (food) =>
                food.name.toLowerCase().startsWith(searchLower) &&
                !exactMatches.includes(food)
        );

        // Fuzzy matches (excluding exact and starts-with matches)
        const fuzzyResults = fuse.search(search);
        const fuzzyMatchedItems = fuzzyResults
            .map((result) => result.item)
            .filter(
                (food) =>
                    !exactMatches.includes(food) &&
                    !startsWithMatches.includes(food)
            );

        // Remaining items (not matching any criteria)
        const remainingItems = food_list.filter(
            (food) =>
                !exactMatches.includes(food) &&
                !startsWithMatches.includes(food) &&
                !fuzzyMatchedItems.includes(food)
        );

        // Combine all lists in priority order
        return [...exactMatches, ...startsWithMatches, ...fuzzyMatchedItems, ...remainingItems];
    })();

    const fetchFoodList = async () => {
        try {
            const response = await axios.get(`${backendUrl}/api/food/list-menu`);
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

    const fetchDrinkList = async () => {
        try {
            const response = await axios.get(`${backendUrl}/api/drink/list-menu`);
            if (response.data.success) {
                setDrinkList(response.data.data);
                //console.log(response.data.data);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error(error);
            toast.error(error.message);
        }
    };

    const addToCart = async (itemId, type) => {
        const key = `${type}-${itemId}`;
        setCartItems((prev) => {
            const updatedCart = { ...prev, [key]: (prev[key] || 0) + 1 };
            localStorage.setItem("cartItems", JSON.stringify(updatedCart));
            return updatedCart;
        });
        if (token) {
            await axios.post(`${backendUrl}/api/cart/add`, { itemId, type }, { headers: { token } });
        }
    };

    const removeFromCart = async (itemId, type) => {
        const key = `${type}-${itemId}`;
        setCartItems((prev) => {
            const updatedCart = { ...prev, [key]: prev[key] > 1 ? prev[key] - 1 : 0 };
            localStorage.setItem("cartItems", JSON.stringify(updatedCart));
            return updatedCart;
        });
        if (token) {
            await axios.post(`${backendUrl}/api/cart/remove`, { itemId, type }, { headers: { token } });
        }
    };

    const clearCart = () => {
        setCartItems({});
        localStorage.removeItem("cartItems");
    };

    const getCartItems = (type) => {
        return Object.keys(cartItems).reduce((count, key) => {
            if (cartItems[key] > 0) {
                count += 1; // Increment count for each non-zero item
            }
            return count;
        }, 0);
    };

    const getTotalCartAmount = () => {
        let totalAmount = 0;
        for (const key in cartItems) {
            if (cartItems[key] > 0) {
                const [type, id] = key.split("-");
                let itemInfo;
                if (type === "food") {
                    itemInfo = food_list.find((product) => product.id === Number(id));
                } else if (type === "drink") {
                    itemInfo = drink_list.find((product) => product.id === Number(id));
                }
                if (itemInfo) {
                    const price = parseFloat(itemInfo.price);
                    if (!isNaN(price)) {
                        totalAmount += price * cartItems[key];
                    }
                }
            }
        }
        return totalAmount;
    };

    const loadCartData = async () => {
        try {
            const response = await axios.post(`${backendUrl}/api/cart/get`, {}, { headers: { token } });
            if (response.data.cartData) {
                const localCart = JSON.parse(localStorage.getItem("cartItems")) || {};
                const mergedCart = { ...localCart, ...response.data.cartData };
                setCartItems(mergedCart);
                localStorage.setItem("cartItems", JSON.stringify(mergedCart));
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
            await fetchDrinkList();
            if (token) {
                await loadCartData();
                await loadUserProfileData();
            }
        }
        loadData();
    }, [token]);

    const fetchFavorites = async () => {
        try {
            const response = await axios.get(`${backendUrl}/api/user/get-favorite`, {
                headers: { token },
            });
            if (response.data.success) {
                const { favorites } = response.data.data;

                // Filter and extract favorite food and drinks
                const favoriteFoods = food_list.filter((food) =>
                    favorites.some((fav) => fav.foodId === food.id)
                );

                return { favoriteFoods };

            } else {
                toast.error("Failed to fetch favorites: " + response.data.message);
                return { favoriteFoods: [] };
            }
        } catch (error) {
            console.error("Error fetching favorites:", error);
            toast.error("Failed to fetch favorites.");
            return { favoriteFoods: [] };
        }
    };

    const contextValue = {
        food_list,
        drink_list,
        cartItems,
        setCartItems,
        clearCart,
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
        filteredFoodList: prioritizedFoodList, // Use prioritized list
        autocompleteSuggestions,
        fetchFavorites,
    };

    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    );
};

export default StoreContextProvider;
