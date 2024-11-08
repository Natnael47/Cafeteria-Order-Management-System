import React from 'react';

const ServicesSection = () => {
    return (
        <div className="bg-gray-100 rounded-lg p-10 mx-auto max-w-4xl mt-10 text-center">
            <h2 className="text-2xl font-semibold mb-8">Our Awesome Services</h2>
            <div className="grid md:grid-cols-3 gap-6">

                {/* Service 1 */}
                <div className="flex flex-col items-center text-center">
                    <h3 className="text-xl font-bold mt-4">Quality Food</h3>
                    <p className="text-gray-600 mt-2">
                        Cozy Cafe is a family-owned business that has been serving the community for over 10 years. We are dedicated to providing high-quality food and exceptional customer service.
                    </p>
                </div>

                {/* Service 2 */}
                <div className="flex flex-col items-center text-center">
                    <h3 className="text-xl font-bold mt-4">Fast Delivery</h3>
                    <p className="text-gray-600 mt-2">
                        Cozy Cafe is a family-owned business that has been serving the community for over 10 years. We are dedicated to providing high-quality food and exceptional customer service.
                    </p>
                </div>

                {/* Service 3 */}
                <div className="flex flex-col items-center text-center">
                    <h3 className="text-xl font-bold mt-4">Easy Recipes</h3>
                    <p className="text-gray-600 mt-2">
                        Cozy Cafe is a family-owned business that has been serving the community for over 10 years. We are dedicated to providing high-quality food and exceptional customer service.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default ServicesSection;
