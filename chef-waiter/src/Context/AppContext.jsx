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
            const { data } = await axios.get(backendUrl + "/api/employee/profile", { headers: { cToken } });
            if (data.success) {
                console.log("Full response data:", data);
                setProfileData(data.profileData);
                console.log(data.profileData);
                //console.log(cToken);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    }

    const value = {
        profileData, setProfileData, get_Profile_Data, cToken
    }
    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}

export default AppContextProvider;