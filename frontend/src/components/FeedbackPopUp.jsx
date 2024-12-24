import axios from 'axios';
import { Star, X } from 'lucide-react';
import React, { useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify'; // Import toast for notifications
import { backendUrl } from '../App'; // Make sure this path is correct
import { StoreContext } from '../context/StoreContext';

const FeedbackPopUp = ({ setShowFeedback }) => {
    const { token } = useContext(StoreContext); // Get token from context
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
            const feedbackData = {
                rating: feedback.rating,
                comment: feedback.comment,
            };

            const response = await axios.post(`${backendUrl}/api/feedback/feedback`, feedbackData, {
                headers: { token },
            });

            if (response.data.success) {
                toast.success('Feedback submitted successfully!');
                setShowFeedback(false);
            } else {
                toast.error('Failed to submit feedback');
            }
        } catch (error) {
            toast.error('An error occurred while submitting feedback');
            console.error(error);
        }
    };

    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "auto";
        };
    }, []);

    return (
        <div className="absolute z-20 w-full h-full bg-black/40 grid place-items-center backdrop-blur-sm">
            <form
                onSubmit={submitFeedback}
                className="w-[max(30vw, 330px)] bg-white shadow-2xl rounded-2xl mb-40 p-6 animate-slideIn text-gray-700 max-w-[95vw] text-center"
            >
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-extrabold text-green-700">We Value Your Feedback</h2>
                    <button
                        type="button"
                        onClick={() => setShowFeedback(false)}
                        className="text-2xl text-red-500 hover:text-red-600 transition-transform transform hover:scale-110 cursor-pointer"
                    >
                        <X />
                    </button>
                </div>

                {/* Description */}
                <p className="text-gray-600 mb-6 leading-relaxed">
                    Help us improve by sharing your thoughts. We appreciate your feedback!
                </p>

                {/* Star Rating */}
                <div className="flex justify-center space-x-3 mb-6">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <span
                            key={star}
                            onClick={() => handleRatingChange(star)}
                            className={`text-4xl cursor-pointer transition-transform transform hover:scale-110 ${feedback.rating >= star ? 'text-yellow-400' : 'text-gray-300'
                                }`}
                        >
                            <Star fill={feedback.rating >= star ? 'currentColor' : 'none'} />
                        </span>
                    ))}
                </div>

                {/* Text Area */}
                <textarea
                    placeholder="Tell us how we can improve your experience..."
                    value={feedback.comment}
                    onChange={handleCommentChange}
                    className="border border-gray-300 w-full p-3 rounded-lg mb-6 focus:outline-none focus:ring-2 focus:ring-green-400 transition-shadow resize-none"
                    rows={4}
                ></textarea>

                {/* Submit Button */}
                <button
                    type="submit"
                    className="bg-gradient-to-r from-green-400 to-green-500 text-white py-3 w-full rounded-lg font-bold text-lg shadow-md hover:from-green-500 hover:to-green-600 hover:shadow-lg transition-all duration-300"
                >
                    Submit Feedback
                </button>
            </form>
        </div>
    );
};

export default FeedbackPopUp;
