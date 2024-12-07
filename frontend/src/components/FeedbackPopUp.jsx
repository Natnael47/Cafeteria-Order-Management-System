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
        <div className="absolute z-20 w-full h-full bg-gray-800/80 grid place-items-center backdrop-blur-sm">
            <form
                onSubmit={submitFeedback}
                className="w-[max(30vw, 330px)] bg-white shadow-2xl rounded-lg p-6 animate-slideIn text-gray-600 max-w-[95vw] text-center"
            >
                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-green-700">We Appreciate Your Feedback</h2>
                    <button
                        type="button"
                        onClick={() => setShowFeedback(false)}
                        className="text-2xl text-red-500 hover:text-red-600 transition-transform transform hover:scale-110 cursor-pointer"
                    >
                        ✖
                    </button>
                </div>

                {/* Description */}
                <p className="text-gray-700 mb-6 leading-relaxed">
                    We are always looking for ways to improve your experience. Please take a moment to share your thoughts with us.
                </p>

                {/* Star Rating */}
                <div className="flex justify-center space-x-2 mb-6">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <span
                            key={star}
                            onClick={() => handleRatingChange(star)}
                            className={`text-3xl cursor-pointer transition-transform transform hover:scale-110 ${feedback.rating >= star ? 'text-yellow-400' : 'text-gray-300'
                                }`}
                        >
                            ★
                        </span>
                    ))}
                </div>

                {/* Text Area */}
                <textarea
                    placeholder="What can we do to improve your experience?"
                    value={feedback.comment}
                    onChange={handleCommentChange}
                    className="border border-gray-300 w-full p-3 rounded-md mb-6 focus:outline-none focus:ring-2 focus:ring-green-400 transition-shadow"
                    rows={4}
                ></textarea>

                {/* Submit Button */}
                <button
                    type="submit"
                    className="bg-gradient-to-r from-green-400 to-green-500 text-white py-3 w-full rounded-lg font-bold text-lg shadow-md hover:from-green-500 hover:to-green-600 hover:shadow-lg transition-all duration-300"
                >
                    Send My Feedback
                </button>
            </form>
        </div>
    );
};

export default FeedbackPopUp;
