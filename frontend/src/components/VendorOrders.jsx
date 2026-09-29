import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrders, updateOrderStatus } from "../features/orderSlice";
import { PackageSearch, IndianRupee, X, Check } from "lucide-react";

const statusStyles = {
  delivered: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
  processing: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
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

const VendorOrders = ({ myOrderProducts }) => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  const handleUpdateStatus = (orderId, status) => {
    dispatch(updateOrderStatus({ orderId, status }));
  };

  return (
    <div>
      <h1 className="mb-5 text-xl font-semibold text-slate-900">Orders</h1>

      {loading && (
        <p className="text-center text-sm text-slate-500">Loading orders…</p>
      )}
      {error && (
        <p className="text-center text-sm text-rose-600">{error}</p>
      )}

      {!loading && myOrderProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-white py-16 text-center">
          <PackageSearch className="mb-3 h-8 w-8 text-slate-300" />
          <p className="text-sm text-slate-500">
            No orders for your products yet.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {myOrderProducts.map((o) => {
            const isFinal = o.status === "Delivered" || o.status === "Cancelled";
            return (
              <div
                key={o._id}
                className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-5 md:flex-row md:items-center md:justify-between"
              >
                <div className="flex items-start gap-4">
                  {o.product.image ? (
                    <img
                      src={o.product.image}
                      alt={o.product.name}
                      className="h-14 w-14 rounded-md object-cover ring-1 ring-slate-200"
                    />
                  ) : (
                    <div className="h-14 w-14 rounded-md bg-slate-100" />
                  )}

                  <div className="space-y-1">
                    <h2 className="font-medium text-slate-900">
                      {o.product.name}
                    </h2>
                    <p className="text-sm text-slate-500">
                      Qty {o.quantity} ·{" "}
                      <span className="inline-flex items-center gap-0.5">
                        <IndianRupee className="h-3 w-3" />
                        {(o.product.price * o.quantity).toLocaleString("en-IN")}
                      </span>
                    </p>
                    <p className="text-sm text-slate-600">
                      {o.customer?.name || "Customer"}
                    </p>
                    <StatusBadge status={o.status} />
                  </div>
                </div>

                <div className="flex shrink-0 gap-2">
                  <button
                    onClick={() => handleUpdateStatus(o.orderId, "Cancelled")}
                    disabled={isFinal}
                    className="flex items-center gap-1.5 rounded-lg bg-rose-50 px-3.5 py-2 text-sm font-medium text-rose-700 hover:bg-rose-100 transition-colors disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-rose-50"
                  >
                    <X className="h-4 w-4" />
                    Reject
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(o.orderId, "Delivered")}
                    disabled={o.status !== "Processing"}
                    className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3.5 py-2 text-sm font-medium text-white hover:bg-emerald-700 transition-colors disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-emerald-600"
                  >
                    <Check className="h-4 w-4" />
                    Mark delivered
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default VendorOrders;