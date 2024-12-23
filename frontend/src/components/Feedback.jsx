import axios from 'axios';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { backendUrl } from '../App';

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
        <div className="mt-12 text-center p-5">
            <h2 className="text-3xl font-bold mb-8 text-gray-800">What Our Customers Say</h2>
            <div className="relative flex items-center justify-center">
                {/* Left Button */}
                <button
                    onClick={handlePrevious}
                    className="absolute left-0 p-3 bg-gray-200 hover:bg-gray-300 rounded-lg transition duration-300 shadow-lg z-20"
                >
                    <ChevronLeft size={28} />
                </button>

                {/* Feedback Items */}
                <div className="flex space-x-8 overflow-hidden w-full max-w-4xl py-8 gap-x-5 relative">
                    <AnimatePresence>
                        {visibleFeedback.map((feedback, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{
                                    opacity: 1,
                                    scale: index === 1 ? 1.1 : 1,
                                    transition: { duration: 0.5 },
                                }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className={`border border-gray-300 bg-white ${index === 1 ? 'rounded-lg h-auto' : 'rounded-lg'
                                    } shadow-lg p-6 text-center transform transition-all duration-500 ${index === 1 ? 'scale-110 z-10' : 'z-0'
                                    } w-72`}
                            >
                                <div className="w-16 h-16 bg-gray-300 text-gray-800 text-xl font-bold rounded-full mx-auto flex items-center justify-center mb-4">
                                    {feedback.username.charAt(0).toUpperCase()}
                                </div>
                                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                                    {feedback.username}
                                </h3>

                                {/* Comment Section */}
                                <p className="text-sm text-gray-600 leading-relaxed">
                                    {expandedComment === index
                                        ? feedback.comment
                                        : `${feedback.comment.slice(0, 100)}${feedback.comment.length > 100 ? '...' : ''
                                        }`}
                                    {feedback.comment.length > 100 && (
                                        <span
                                            onClick={() => toggleCommentExpansion(index)}
                                            className="text-blue-500 cursor-pointer ml-1"
                                        >
                                            {expandedComment === index ? 'Show Less' : 'Read More'}
                                        </span>
                                    )}
                                </p>

                                <div className="flex justify-center mt-4 space-x-1">
                                    {Array.from({ length: Math.round(feedback.rating) }).map((_, i) => (
                                        <div key={i} className="bg-white rounded-lg p-1">
                                            <Star color="#facc15" fill="#facc15" size={18} />
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {/* Right Button */}
                <button
                    onClick={handleNext}
                    className="absolute right-0 p-3 bg-gray-200 hover:bg-gray-300 rounded-lg transition duration-300 shadow-lg z-20"
                >
                    <ChevronRight size={28} />
                </button>
            </div>
        </div>
    );
};

export default Feedback;
