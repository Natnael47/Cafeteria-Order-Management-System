import React, { useContext, useEffect } from 'react';
import { InventoryContext } from '../../Context/InventoryContext';

const Inventory_Orders = () => {

    const { orderList, fetchInventoryOrders } = useContext(InventoryContext);

    useEffect(() => {
        fetchInventoryOrders();
    }, []);

    return (
        <div className="flex flex-col m-5 w-full">
            <p className="mb-3 text-lg font-semibold">All Orders</p>
            <div className="bg-[#F3F4F6] rounded w-full max-w-5.3xl max-h-[88vh] overflow-scroll">
                <div>
                    <div className="grid grid-cols-[0.7fr_0.7fr_0.7fr_0.6fr_0.5fr_0.5fr_0.5fr] items-center gap-2 p-3 border text-sm font-medium bg-[#FAFAFA] text-black sm:grid">
                        <b>Order Status</b>
                        <b>Inventory Item</b>
                        <b>Quantity</b>
                        <b>Unit</b>
                        <b>Price</b>
                        <b>Status</b>
                        <b>Order Date</b>
                    </div>
                    {orderList.map((order, index) => (
                        <div key={index}>
                            <div className={`grid grid-cols-[0.7fr_0.7fr_0.7fr_0.6fr_0.5fr_0.5fr_0.5fr] items-center gap-2 p-3 border text-sm font-medium sm:grid`}>
                                <p>{order.orderStatus}</p> {/* Displaying order ID */}
                                <p>{order.inventoryName}</p> {/* Displaying inventory name */}
                                <p>{order.quantityOrdered} {order.unit}</p> {/* Displaying quantity */}
                                <p>{order.unit}</p> {/* Displaying unit */}
                                <p>${order.totalPrice}</p> {/* Displaying price per unit */}
                                <p> {order.inventoryStatus} % {order.pricePerUnit}</p> {/* Displaying order status */}
                                <p>{new Date(order.orderDate).toLocaleDateString()}</p> {/* Displaying formatted order date */}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Inventory_Orders;
