import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { backendUrl } from '../App';

const User_Feedback = () => {
    const [feedbackList, setFeedbackList] = useState([]);

    // Fetch the feedback data when the component mounts
    useEffect(() => {
        const fetchFeedback = async () => {
            try {
                const response = await axios.get(`${backendUrl}/api/feedback/get-feedback`);
                setFeedbackList(response.data.feedback); // Save feedback data to state
                console.log(response.data.feedback);
            } catch (error) {
                console.error("Error fetching feedback:", error);
            }
        };

        fetchFeedback();
    }, []);

    return (
        <div className="bg-white px-8 py-4 border rounded w-full max-w-4xl max-h-[88vh] overflow-scroll">
            <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">User Feedback</h2>

            {/* Feedback List */}
            <div className="bg-white shadow-xl rounded-lg p-8 max-w-4xl mx-auto">
                {feedbackList.length === 0 ? (
                    <p className="text-center text-gray-600 text-lg">No feedback available.</p>
                ) : (
                    <ul className="space-y-6">
                        {feedbackList.map((feedback, index) => (
                            <li key={index} className="bg-[#D7F6DA] rounded-lg p-6 shadow-md transition transform hover:scale-105">
                                <div className="flex items-center mb-4">
                                    <img
                                        src="https://via.placeholder.com/50"
                                        alt="Customer"
                                        className="w-16 h-16 rounded-full object-cover mr-4"
                                    />
                                    <div>
                                        <h3 className="font-semibold text-gray-800 text-xl">{feedback.username}</h3>
                                        <p className="text-sm text-gray-500">
                                            {/* Format the date to the required style */}
                                            {new Date(feedback.date).toLocaleDateString('en-US', {
                                                weekday: 'long',
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric',
                                            })}
                                        </p>
                                    </div>
                                </div>

                                <p className="text-sm text-gray-600 mb-4">
                                    {feedback.comment.length > 200
                                        ? `${feedback.comment.slice(0, 200)}...`
                                        : feedback.comment}
                                </p>

                                <div className="flex justify-start space-x-1 text-yellow-500 text-2xl">
                                    {Array.from({ length: Math.round(feedback.rating) }).map((_, i) => (
                                        <span key={i}>⭐</span>
                                    ))}
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default User_Feedback;
