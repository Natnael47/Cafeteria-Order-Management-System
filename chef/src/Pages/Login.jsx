import axios from "axios";
import React, { useContext, useState } from "react";
import { toast } from "react-toastify";
import { ChefContext } from "../Context/ChefContext";

const Login = () => {

    const [state, setState] = useState("Chef");

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const { setCToken, backendUrl } = useContext(ChefContext);

    const onSubmitHandler = async (event) => {
        event.preventDefault();

        try {
            if (state === "Chef") {
                const { data } = await axios.post(backendUrl + "/api/user/admin", { email, password });
                if (data.success) {
                    localStorage.setItem('cToken', data.token)
                    setCToken(data.token);
                } else {
                    toast.error(data.message)
                }
            } else {
            }
        } catch (error) { }
    };

    return (
        <form onSubmit={onSubmitHandler} className="min-h-[80vh] flex items-center">
            <div className="flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-[#5E5E5E] text-sm shadow-lg bg-white">
                <p className="text-2xl font-bold text-black m-auto">
                    <span className="text-primary"> {state} </span> Login
                </p>
                <div className="w-full">
                    <p className="text-black font-semibold">Email</p>
                    <input
                        onChange={(e) => setEmail(e.target.value)}
                        className="border border-[#DADADA] rounded w-full p-2 mt-1"
                        type="email"
                        value={email}
                        required
                    />
                </div>
                <div className="w-full">
                    <p className="text-black font-semibold">Password</p>
                    <input
                        onChange={(e) => setPassword(e.target.value)}
                        className="border border-[#DADADA] rounded w-full p-2 mt-1"
                        type="password"
                        value={password}
                        required
                    />
                </div>
                <button className="bg-primary text-white w-full py-2 rounded-md text-base font-bold">
                    Login
                </button>
                {state === "Chef" ? (
                    <p className="text-center mt-4 text-black">
                        Waiter Login?{" "}
                        <span
                            className="text-blue-800 underline cursor-pointer"
                            onClick={() => setState("Waiter")}
                        >
                            Click here
                        </span>
                    </p>
                ) : (
                    <p className="text-center mt-4 text-black">
                        Chef Login?{" "}
                        <span
                            className="text-blue-800 underline cursor-pointer"
                            onClick={() => setState("Chef")}
                        >
                            Click here
                        </span>
                    </p>
                )}
            </div>
        </form>
    );
};

export default Login;
