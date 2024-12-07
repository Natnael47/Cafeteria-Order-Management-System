import { Award, Soup, Timer } from 'lucide-react';
import React from 'react';

const ServicesSection = () => {
    return (
        <div className="bg-gradient-to-r from-green-100 via-blue-100 to-green-100 p-10 rounded-lg shadow-lg mx-auto max-w-6xl mt-10">
            <h2 className="text-3xl font-extrabold text-gray-800 text-center mb-12">
                Our Awesome Services
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
                {/* Service 1 */}
                <div className="flex flex-col items-center text-center bg-white p-8 rounded-xl shadow-md transition-all transform hover:scale-105 hover:shadow-lg hover:translate-y-1 duration-300">
                    <div className="bg-green-500 text-white p-5 rounded-full mb-6">
                        <Award size={32} />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Quality Food</h3>
                    <p className="text-gray-600 mb-2">
                        Cozy Cafe is a family-owned business that has been serving the community for over 10 years. We are dedicated to providing high-quality food and exceptional customer service.
                    </p>
                    <p className="text-sm text-gray-500">
                        Our chefs use fresh, locally sourced ingredients to craft delicious meals that meet the highest standards of quality.
                    </p>
                </div>

                {/* Service 2 */}
                <div className="flex flex-col items-center text-center bg-white p-8 rounded-xl shadow-md transition-all transform hover:scale-105 hover:shadow-lg hover:translate-y-1 duration-300">
                    <div className="bg-green-500 text-white p-5 rounded-full mb-6">
                        <Timer size={32} />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Fast Delivery</h3>
                    <p className="text-gray-600 mb-2">
                        Cozy Cafe ensures your food arrives hot and fresh in no time! With our quick and reliable delivery service, you won’t have to wait long to enjoy your meal.
                    </p>
                    <p className="text-sm text-gray-500">
                        We guarantee fast delivery within 30 minutes or less, so you can enjoy your food when it's at its best.
                    </p>
                </div>

                {/* Service 3 */}
                <div className="flex flex-col items-center text-center bg-white p-8 rounded-xl shadow-md transition-all transform hover:scale-105 hover:shadow-lg hover:translate-y-1 duration-300">
                    <div className="bg-green-500 text-white p-5 rounded-full mb-6">
                        <Soup size={32} />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Easy Recipes</h3>
                    <p className="text-gray-600 mb-2">
                        Cozy Cafe provides easy-to-follow recipes for those who want to recreate their favorite dishes at home. Our recipe collection makes cooking fun and accessible.
                    </p>
                    <p className="text-sm text-gray-500">
                        From appetizers to desserts, our recipes are simple yet packed with flavor. Perfect for chefs of all skill levels!
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ServicesSection;
