import axios from 'axios';
import React, { useState } from 'react';
import { toast } from "react-toastify";
import { backendUrl } from '../../App';
import "./Login.css";

const Login = ({ setToken }) => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const onSubmitHandler = async (event) => {
        try {
            event.preventDefault();
            //console.log(email, password);
            const response = await axios.post(backendUrl + '/api/user/admin', { email, password })
            console.log(response);

            if (response.data.success) {
                setToken(response.data.token)
            } else {
                toast.error(response.data.message);
            }

        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    }

    return (
        <div>
            <div className="login-page">
                <h1>Admin Panel</h1>
                <form onSubmit={onSubmitHandler}>
                    <div className="forms">
                        <p>Email Address</p>
                        <input onChange={(e) => setEmail(e.target.value)} value={email} type='email' placeholder='your@email.com' required />
                    </div>
                    <div className="forms">
                        <p>Password</p>
                        <input onChange={(e) => setPassword(e.target.value)} value={password} type='password' placeholder='Enter your password' required />
                    </div>
                    <button type='submit'>Login</button>
                </form>
            </div>
        </div>
    )
}

export default Login