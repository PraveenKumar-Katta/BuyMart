import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrders, updateOrderStatus } from "../features/orderSlice";

const VendorOrders = ({ myOrderProducts }) => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  const handleUpdateStatus = (orderId, status) => {
    console.log(orderId, status)
    dispatch(updateOrderStatus({ orderId, status }));
  };

  return (
    <div>
      <h1 className="text-4xl p-5 font-bold text-center">Orders</h1>

      {loading && <p className="text-center text-gray-500">Loading orders...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      <div className="space-y-4">
        {myOrderProducts.map((o) => (
          <div
            className="flex flex-col md:flex-row md:items-center justify-between border rounded-lg p-5 shadow-sm bg-white"
            key={o._id}
          >
            <div className="space-y-1">
              <h1 className="font-semibold text-lg">{o.product.name}</h1>
              <h3 className="text-gray-700">Qty: {o.quantity}</h3>
              <h3 className="text-gray-700">
                Amount: ₹{o.product.price * o.quantity}
              </h3>
              <h1 className="text-gray-800 font-medium">
                Customer Name: {o.customer.name}
              </h1>
              <p className="text-sm text-gray-600">
                Status:{" "}
                <span
                  className={`font-semibold ${
                    o.status === "Delivered"
                      ? "text-green-600"
                      : o.status === "Cancelled"
                      ? "text-red-600"
                      : "text-yellow-600"
                  }`}
                >
                  {o.status}
                </span>
              </p>
            </div>
            <div className="mt-3 md:mt-0 flex flex-wrap">
              <button
                onClick={() => handleUpdateStatus(o.orderId, "Cancelled")}
                className="bg-red-500 m-2 cursor-pointer hover:bg-red-600 text-white px-4 py-2 rounded-md font-medium"
                 // disable if already processed
              >
                Reject Order
              </button>
              <button
                onClick={() => handleUpdateStatus(o.orderId, "Delivered")}
                className="bg-green-500 m-2 cursor-pointer hover:bg-green-600 text-white px-4 py-2 rounded-md font-medium"
                disabled={o.status !== "Processing"} // disable if already processed
              >
                Mark As Delivered
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VendorOrders;
