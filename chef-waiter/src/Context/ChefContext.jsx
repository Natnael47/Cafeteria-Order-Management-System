import axios from "axios";
import { createContext, useState } from "react";
import { toast } from "react-toastify";
import { backendUrl } from "../App";

export const ChefContext = createContext();

const ChefContextProvider = (props) => {

    const [cToken, setCToken] = useState(localStorage.getItem('cToken') ? localStorage.getItem('cToken') : '');

    const [profileData, setProfileData] = useState(null);

    const get_Profile_Data = async () => {
        try {
            const { data } = await axios.get(backendUrl + "/api/employee/profile", { headers: { cToken } });
            //console.log("Sending cToken:", cToken);
            if (data.success) {
                setProfileData(data.profileData);
                console.log(data.profileData);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
            console.log(error.message);

        }
    }


    const value = {
        cToken, setCToken,
        profileData, setProfileData, get_Profile_Data
    }
    return (
        <ChefContext.Provider value={value}>
            {props.children}
        </ChefContext.Provider>
    )
}

export default ChefContextProvider;