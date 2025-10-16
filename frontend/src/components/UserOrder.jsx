import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrders } from "../features/orderSlice";

const MyOrders = () => {
  let user = JSON.parse(localStorage.getItem("userInfo"));
  let { orders } = useSelector((state) => state.orders);
  let dispatch = useDispatch();
  console.log(orders);
  const myOrders = orders.filter((o) => o.user._id === user.id);
  console.log(myOrders);
  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">My Orders</h1>
      <div className="space-y-4">
        {myOrders.length === 0 ? (
          <p className="text-gray-600">You have no orders yet.</p>
        ) : (
          myOrders.map((o) => (
            <div
              key={o._id}
              className="border rounded-lg p-5 shadow-sm bg-white"
            >
              <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-2">
                <h2 className="font-semibold text-lg">
                  Order ID: <span className="font-mono">{o._id}</span>
                </h2>
                <p
                  className={`px-3 py-1 rounded text-sm font-medium ${
                    o.orderStatus === "Delivered"
                      ? "bg-green-100 text-green-700"
                      : o.orderStatus === "Processing"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {o.orderStatus}
                </p>
              </div>

              {o.createdAt && (
                <p className="text-sm text-gray-500 mb-3">
                  Placed on: {new Date(o.createdAt).toLocaleDateString()}
                </p>
              )}

              <ul className="list-disc list-inside space-y-1">
                {o.products.map((p) => (
                  <li key={p._id} className="text-gray-700">
                    <img src={p.product.image} alt={p.product.name} />
                    {p.product.name} — Qty: {p.quantity} × ₹{p.product.price}
                    <span className="font-semibold ml-2">
                      = ₹{p.product.price * p.quantity}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MyOrders;
