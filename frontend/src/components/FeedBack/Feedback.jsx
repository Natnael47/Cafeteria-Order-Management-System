import React from 'react'
import { assets } from '../../assets/assets'
import "./feedback.css"

const Feedback = () => {
    return (
        <div className="feedback-container">
            <h2>What Our Customers Say?</h2>
            <div className="feedback-card">
                <img
                    src={assets.person}
                    alt=""
                    className="customer-image"
                />
                <h3>Lydia</h3>
                <p>
                    Cozy Cafe is a family-owned business that has been serving the
                    community for over 10 years. We are dedicated to providing
                    high-quality food and exceptional customer service.
                </p>
                <div className="rating">
                    <span>⭐</span>
                    <span>⭐</span>
                    <span>⭐</span>
                    <span>⭐</span>
                    <span>⭐</span>
                </div>
            </div>
        </div>
    )
}

export default Feedback
