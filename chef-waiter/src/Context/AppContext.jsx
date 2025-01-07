import axios from "axios";
import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { backendUrl } from "../App";
import { ChefContext } from "./ChefContext";
import { InventoryContext } from "./InventoryContext";

export const AppContext = createContext(null);

const AppContextProvider = (props) => {
    const navigate = useNavigate();

    const { cToken, setCToken } = useContext(ChefContext);
    const { iToken, setIToken } = useContext(InventoryContext);

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

    // Inside AppContextProvider

    const changePassword = async (oldPassword, newPassword, confirmPassword, cToken, iToken) => {
        if (newPassword !== confirmPassword) {
            toast.error("New password and confirm password do not match.");
            return false; // Indicate failure
        }

        try {
            const response = await axios.post(
                `${backendUrl}/api/employee/change-password`,
                {
                    oldPassword,
                    newPassword,
                },
                {
                    headers: {
                        ctoken: cToken || "",
                        itoken: iToken || "",
                    },
                }
            );

            if (response.data.success) {
                toast.success("Password changed successfully!");
                return true; // Indicate success
            } else {
                toast.error(response.data.message || "Failed to change password.");
                return false; // Indicate failure
            }
        } catch (error) {
            console.error(error);
            toast.error("An error occurred. Please try again later.");
            return false; // Indicate failure
        }
    };

    const value = {
        profileData, setProfileData, get_Profile_Data, cToken, iToken,
        changePassword, navigate, setIToken, setCToken
    }

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    );
}

export default AppContextProvider;
