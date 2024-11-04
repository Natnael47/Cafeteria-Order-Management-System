import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { backendUrl } from '../App';
import { assets } from '../assets/assets';

const Feedback = () => {
    const [feedbackList, setFeedbackList] = useState([]);
    const [startIndex, setStartIndex] = useState(0);
    const [expandedComment, setExpandedComment] = useState(null);

    useEffect(() => {
        const fetchFeedback = async () => {
            try {
                const response = await axios.get(`${backendUrl}/api/feedback/get-feedback`);
                setFeedbackList(response.data.feedback);
            } catch (error) {
                console.error("Error fetching feedback:", error);
            }
        };

        fetchFeedback();
    }, []);

    const visibleFeedback = feedbackList.slice(startIndex, startIndex + 3).concat(
        feedbackList.slice(0, Math.max(0, startIndex + 3 - feedbackList.length))
    );

    const handleNext = () => {
        setStartIndex((prevIndex) => (prevIndex + 1) % feedbackList.length);
    };

    const handlePrevious = () => {
        setStartIndex((prevIndex) => (prevIndex - 1 + feedbackList.length) % feedbackList.length);
    };

    const toggleCommentExpansion = (index) => {
        setExpandedComment(expandedComment === index ? null : index);
    };

    return (
        <div className="mt-12 text-center p-5 bg-[#f4f8f4]">
            <h2 className="text-2xl font-bold mb-5">What Our Customers Say?</h2>
            <div className="relative flex items-center justify-center">
                {/* Left button */}
                <button onClick={handlePrevious} className="absolute left-0 text-xl p-2 bg-gray-300 rounded-full">
                    ◀
                </button>

                {/* Feedback items */}
                <div className="flex space-x-5 overflow-hidden">
                    {visibleFeedback.map((feedback, index) => (
                        <div
                            key={index}
                            className={`bg-[#D7F6DA] rounded-lg shadow-md p-5 w-64 text-center transition-transform ${index === 1 ? 'transform scale-105' : 'scale-100'
                                }`}
                        >
                            <img
                                src={assets.person}
                                alt="Customer"
                                className="w-24 h-24 rounded-full object-cover mx-auto mb-2.5"
                            />
                            <h3 className="mt-2.5 mb-2.5 text-lg text-gray-800">{feedback.username}</h3>

                            {/* Comment section */}
                            <p className="text-sm text-gray-600 leading-relaxed">
                                {feedback.comment.length > 100 && expandedComment !== index
                                    ? `${feedback.comment.slice(0, 100)}...`
                                    : feedback.comment}
                                {feedback.comment.length > 100 && (
                                    <span
                                        onClick={() => toggleCommentExpansion(index)}
                                        className="text-blue-500 cursor-pointer ml-1"
                                    >
                                        {expandedComment === index ? 'show less' : 'more'}
                                    </span>
                                )}
                            </p>

                            <div className="flex justify-center mt-2.5 space-x-1 text-yellow-500 text-xl">
                                {Array.from({ length: Math.round(feedback.rating) }).map((_, i) => (
                                    <span key={i}>⭐</span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Right button */}
                <button onClick={handleNext} className="absolute right-0 text-xl p-2 bg-gray-300 rounded-full">
                    ▶
                </button>
            </div>
        </div>
    );
};

export default Feedback;
