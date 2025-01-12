import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify'; // Assuming you're using react-toastify for error messages
import { backendUrl } from '../../App';
import { StoreContext } from '../../context/StoreContext';
import "./Verify.css";

const Verify = () => {
    const { token, setCartItems } = useContext(StoreContext);

    const [searchParams, setSearchParams] = useSearchParams();
    const [loading, setLoading] = useState(true);  // Loading state for the payment verification
    const [error, setError] = useState(null); // Error state to store any issues during verification

    const success = searchParams.get("success");
    const orderId = searchParams.get("orderId");

    const navigate = useNavigate();

    const verifyPayment = async () => {
        try {
            if (!token || !orderId || success === null) {
                setError("Invalid parameters or missing token");
                setLoading(false);
                return;
            }

            const response = await axios.post(
                `${backendUrl}/api/order/verifyStripe`,
                { success, orderId },
                { headers: { token } }
            );

            if (response.data.success) {
                toast.success('Order placed successfully!');
                setCartItems({});
                navigate('/myorders');
            } else {
                setError("Payment verification failed. Please try again.");
                navigate('/cart');
            }
        } catch (error) {
            console.error("Error during payment verification:", error);
            setError("An error occurred while verifying the payment. Please try again.");
            toast.error(error.message || "Payment verification failed.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        verifyPayment();
    }, [token, success, orderId]);  // Added dependencies to re-run when success or orderId changes

    return (
        <div className='verify'>
            {loading ? (
                <div className="spinner">Loading...</div>
            ) : error ? (
                <div className="error-message">{error}</div>
            ) : (
                <div className="success-message">
                    Payment Verified Successfully. Redirecting...
                </div>
            )}
        </div>
    );
}

export default Verify;
