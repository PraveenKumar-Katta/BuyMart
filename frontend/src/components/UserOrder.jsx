import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrders } from "../features/orderSlice";
import { PackageSearch, Calendar, IndianRupee } from "lucide-react";
import { Link } from "react-router-dom";

const statusStyles = {
  delivered: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
  processing: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
  shipped: "bg-blue-50 text-blue-700 ring-1 ring-blue-200",
  cancelled: "bg-rose-50 text-rose-700 ring-1 ring-rose-200",
};

const StatusBadge = ({ status }) => (
  <span
    className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
      statusStyles[status?.toLowerCase()] ||
      "bg-slate-100 text-slate-600 ring-1 ring-slate-200"
    }`}
  >
    {status || "Unknown"}
  </span>
);

const MyOrders = () => {
  const user = JSON.parse(localStorage.getItem("userInfo"));
  const { orders } = useSelector((state) => state.orders);
  const dispatch = useDispatch();

  const myOrders = orders.filter((o) => o.user._id === user.id);

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  const orderTotal = (o) =>
    o.products.reduce((sum, p) => sum + p.product.price * p.quantity, 0);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <Link
        to="/dashboard"
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-zinc-500 transition hover:text-zinc-900"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-4 w-4"
          aria-hidden="true"
        >
          <path d="M15 18l-6-6 6-6" />
        </svg>
        Back to Dashboard
      </Link>
      <h1 className="text-2xl font-semibold text-slate-900 mb-6">My orders</h1>

      {myOrders.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50 py-20 text-center">
          <PackageSearch className="mb-3 h-10 w-10 text-slate-300" />
          <p className="font-medium text-slate-700">No orders yet</p>
          <p className="mt-1 max-w-sm text-sm text-slate-500">
            Once you place an order, you'll be able to track it here.
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {myOrders.map((o) => (
            <div
              key={o._id}
              className="rounded-xl border border-slate-200 bg-white overflow-hidden"
            >
              <div className="flex flex-col gap-2 border-b border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs text-slate-400">Order ID</p>
                  <p className="font-mono text-sm text-slate-700">{o._id}</p>
                </div>

                <div className="flex items-center gap-3">
                  {o.createdAt && (
                    <span className="flex items-center gap-1 text-xs text-slate-500">
                      <Calendar className="h-3.5 w-3.5" />
                      {new Date(o.createdAt).toLocaleDateString()}
                    </span>
                  )}
                  <StatusBadge status={o.orderStatus} />
                </div>
              </div>

              <ul className="divide-y divide-slate-100">
                {o.products.map((p) => (
                  <li key={p._id} className="flex items-center gap-4 px-5 py-3">
                    {p.product.image ? (
                      <img
                        src={p.product.image}
                        alt={p.product.name}
                        className="h-12 w-12 rounded-md object-cover ring-1 ring-slate-200"
                      />
                    ) : (
                      <div className="h-12 w-12 rounded-md bg-slate-100" />
                    )}

                    <div className="flex-1 min-w-0">
                      <p className="truncate text-sm font-medium text-slate-800">
                        {p.product.name}
                      </p>
                      <p className="text-xs text-slate-500">
                        Qty {p.quantity} × ₹
                        {p.product.price.toLocaleString("en-IN")}
                      </p>
                    </div>

                    <p className="flex items-center gap-0.5 text-sm font-semibold text-slate-900">
                      <IndianRupee className="h-3.5 w-3.5" />
                      {(p.product.price * p.quantity).toLocaleString("en-IN")}
                    </p>
                  </li>
                ))}
              </ul>

              <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50 px-5 py-3">
                <span className="text-sm text-slate-500">Order total</span>
                <span className="flex items-center gap-0.5 text-sm font-semibold text-slate-900">
                  <IndianRupee className="h-3.5 w-3.5" />
                  {orderTotal(o).toLocaleString("en-IN")}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
