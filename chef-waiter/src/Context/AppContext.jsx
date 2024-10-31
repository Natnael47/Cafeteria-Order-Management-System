import axios from "axios";
import { createContext, useContext, useState } from "react";
import { toast } from "react-toastify";
import { backendUrl } from "../App";
import { ChefContext } from "./ChefContext";
import { WaiterContext } from "./WaiterContext";

export const AppContext = createContext(null);

const AppContextProvider = (props) => {

    const { cToken } = useContext(ChefContext);
    const { wToken } = useContext(WaiterContext);

    const [profileData, setProfileData] = useState(false);

    const get_Profile_Data = async () => {
        try {
            // Check for tokens in localStorage
            const token = localStorage.getItem("cToken") || localStorage.getItem("wToken");

            if (!token) {
                return toast.error("No authentication token found.");
            }

            // Set the appropriate token header
            const headers = localStorage.getItem("cToken")
                ? { cToken: token }
                : { wToken: token };

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
        profileData, setProfileData, get_Profile_Data, cToken, wToken
    }

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    );
}

export default AppContextProvider;
