import axios from 'axios';
import React, { useContext, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { StoreContext } from '../../context/StoreContext';
import "./Verify.css";

const Verify = () => {
    const { token, setCartItems, backendUrl } = useContext(StoreContext);

    const [searchParams, setSearchParams] = useSearchParams();

    const success = searchParams.get("success");
    const orderId = searchParams.get("orderId");

    const navigate = useNavigate();

    const verifyPayment = async () => {
        try {
            if (!token) {
                return null;
            }

            const response = await axios.post(backendUrl + '/api/order/verifyStripe', { success, orderId }, { headers: { token } })
            if (response.data.success) {
                setCartItems({});
                navigate('/myorders')
            } else {
                navigate('/cart')
            }

        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    }

    useEffect(() => {
        verifyPayment();
    }, [token]);

    return (
        <div className='verify'>
            <div className="spinner">

            </div>
        </div>
    )
}

export default Verify