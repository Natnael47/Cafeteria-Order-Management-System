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
        <div className="mt-12 p-5 bg-[#f4f8f4]">
            <h2 className="text-2xl font-bold mb-5 text-center">User Feedback</h2>

            {/* Feedback List */}
            <div className="bg-white shadow-md rounded-lg p-5">
                {feedbackList.length === 0 ? (
                    <p className="text-center text-gray-600">No feedback available.</p>
                ) : (
                    <ul className="space-y-4">
                        {feedbackList.map((feedback, index) => (
                            <li key={index} className="bg-[#D7F6DA] rounded-lg p-4 shadow-md">
                                <div className="flex items-center mb-3">
                                    <img
                                        src="https://via.placeholder.com/50"
                                        alt="Customer"
                                        className="w-12 h-12 rounded-full object-cover mr-3"
                                    />
                                    <div>
                                        <h3 className="font-semibold text-gray-800">{feedback.username}</h3>
                                        <p className="text-sm text-gray-500">{new Date(feedback.date).toLocaleDateString()}</p>
                                    </div>
                                </div>

                                <p className="text-sm text-gray-600 mb-3">
                                    {feedback.comment.length > 200
                                        ? `${feedback.comment.slice(0, 200)}...`
                                        : feedback.comment}
                                </p>

                                <div className="flex justify-start space-x-1 text-yellow-500 text-xl">
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
