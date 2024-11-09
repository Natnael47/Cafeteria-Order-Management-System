import axios from "axios";
import { createContext, useContext, useState } from "react";
import { toast } from "react-toastify";
import { backendUrl } from "../App";
import { ChefContext } from "./ChefContext";
import { InventoryContext } from "./InventoryContext";

export const AppContext = createContext(null);

const AppContextProvider = (props) => {

    const { cToken } = useContext(ChefContext);
    const { iToken } = useContext(InventoryContext);

    const [profileData, setProfileData] = useState(false);

    const get_Profile_Data = async () => {
        try {
            // Check for tokens in localStorage
            const token = localStorage.getItem("cToken") || localStorage.getItem("iToken");

            if (!token) {
                return toast.error("No authentication token found.");
            }

            // Set the appropriate token header
            const headers = localStorage.getItem("cToken")
                ? { cToken: token }
                : { iToken: token };

            const { data } = await axios.get(backendUrl + "/api/employee/profile", { headers });

            if (data.success) {
                setProfileData(data.profileData);
                // console.log("Profile Data:", data.profileData);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    }

    const value = {
        profileData, setProfileData, get_Profile_Data, cToken, iToken
    }

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    );
}

export default AppContextProvider;
