import React from 'react'

const Inventory_Dashboard = () => {
    return (
        <div className="p-5">
            {/* Header Section with Summary Display */}
            <div className="flex flex-col m-5 w-full">
                <p className="mb-3 text-lg font-semibold">Inventory Dashboard</p>

                {/* Display for Total Purchase, Sales, and Profit */}
                <div className="grid grid-cols-3 gap-4 mb-4">
                    {/* Total Purchase */}
                    <div className="p-4 bg-white rounded shadow">
                        <p className="text-sm font-semibold">Total Purchase</p>
                        <p className="text-2xl text-red-500">Rs. 400</p>
                    </div>
                    {/* Total Sales */}
                    <div className="p-4 bg-white rounded shadow">
                        <p className="text-sm font-semibold">Total Sales</p>
                        <p className="text-2xl text-green-500">Rs. 200</p>
                    </div>
                    {/* Total Profit */}
                    <div className="p-4 bg-white rounded shadow">
                        <p className="text-sm font-semibold">Total Profit</p>
                        <p className="text-2xl text-black">Rs. 200</p>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default Inventory_Dashboard