import axios from 'axios';
import React, { useContext, useState } from 'react';
import { toast } from "react-toastify";
import { backendUrl } from '../App';
import { AdminContext } from '../context/AdminContext';

const Login = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const { setToken } = useContext(AdminContext);

    const onSubmitHandler = async (event) => {
        event.preventDefault();
        try {
            //console.log(email, password);
            const response = await axios.post(backendUrl + '/api/admin/login', { email, password })
            // console.log(response);
            if (response.data.success) {
                localStorage.setItem('token', response.data.token)
                setToken(response.data.token);
            } else {
                toast.error(response.data.message);
            }

        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    }

    return (
        <div className='min-h-screen flex items-center justify-center w-full bg-gray-100'>
            <div className='bg-white shadow-xl rounded-lg px-8 py-6 max-w-md'>
                <h1 className='text-2xl font-bold mb-4 text-black'>Admin Panel</h1>
                <form onSubmit={onSubmitHandler}>
                    <div className='mb-3 min-w-72'>
                        <p className='text-sm font-medium text-black mb-2'>Email Address</p>
                        <input className='rounded-md w-full px-3 py-2 border border-black outline-none' onChange={(e) => setEmail(e.target.value)} value={email} type='email' placeholder='admin@coms.com' required />
                    </div>
                    <div className='mb-3 min-w-72'>
                        <p className='text-sm font-medium text-black mb-2'>Password</p>
                        <input className='rounded-md w-full px-3 py-2 border border-black outline-none' onChange={(e) => setPassword(e.target.value)} value={password} type='password' placeholder='1q2w3e4r' required />
                    </div>
                    <button className='mt-2 w-full py-2 px-4 rounded-md text-white bg-black font-bold hover:bg-gray-700' type='submit'>Login</button>
                </form>
            </div>
        </div>
    )
}

export default Login