import axios from 'axios';
import React, { useContext, useState } from 'react';
import { toast } from 'react-toastify'; // Import toast for notifications
import { backendUrl } from '../App'; // Make sure this path is correct
import { StoreContext } from '../context/StoreContext';

const FeedbackPopUp = ({ setShowFeedback }) => {
    const { token } = useContext(StoreContext)// Get token from context
    const [feedback, setFeedback] = useState({
        rating: 0,
        comment: ''
    });

    const handleRatingChange = (ratingValue) => {
        setFeedback((prev) => ({ ...prev, rating: ratingValue }));
    };

    const handleCommentChange = (event) => {
        const value = event.target.value;
        setFeedback((prev) => ({ ...prev, comment: value }));
    };

    const submitFeedback = async (event) => {
        event.preventDefault();
        try {
            // Construct the feedback data object
            const feedbackData = {
                rating: feedback.rating,
                comment: feedback.comment,
            };

            // Send feedback to the backend
            const response = await axios.post(backendUrl + '/api/feedback/feedback', feedbackData, {
                headers: { token } // Include the token in the headers
            });

            if (response.data.success) {
                toast.success('Feedback submitted successfully!'); // Notify success
                setShowFeedback(false); // Close the popup
            } else {
                toast.error('Failed to submit feedback'); // Notify failure
            }
        } catch (error) {
            toast.error('An error occurred while submitting feedback'); // Notify error
            console.error(error); // Log the error
        }
    };

    return (
        <div className="absolute z-10 w-full h-full bg-gray-700/90 grid place-items-center">
            <form onSubmit={submitFeedback} className="w-[max(30vw,330px)] text-gray-500 bg-white flex flex-col gap-4 p-4 rounded-md text-sm animate-fadeIn w-[min(95vw, 350px)] text-center">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-bold text-black">We Appreciate Your Feedback</h2>
                    <button
                        type="button"
                        onClick={() => setShowFeedback(false)} // Close the popup
                        className="text-lg text-green-600 font-bold cursor-pointer"
                    >
                        ✖
                    </button>
                </div>
                <p className="text-gray-700 mb-4">We are always looking for ways to improve your experience. Please take a moment to evaluate and tell us what you think.</p>

                <div className="flex justify-center space-x-2 mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <span
                            key={star}
                            onClick={() => handleRatingChange(star)}
                            className={`text-2xl cursor-pointer ${feedback.rating >= star ? 'text-yellow-500' : 'text-gray-300'}`}
                        >
                            ★
                        </span>
                    ))}
                </div>

                <textarea
                    placeholder="What can we do to improve your experience?"
                    value={feedback.comment}
                    onChange={handleCommentChange}
                    className="border border-gray-300 w-full p-2 rounded-md mb-4 focus:outline-none"
                    rows={3}
                ></textarea>

                <button type="submit" className="bg-green-500 text-white py-2 w-full rounded-md font-semibold hover:bg-green-600 transition-colors">
                    Send My Feedback
                </button>
            </form>
        </div>
    );
};

export default FeedbackPopUp;
