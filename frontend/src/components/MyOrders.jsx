import React from "react";
import { useSelector } from "react-redux";
import { PackageSearch, IndianRupee } from "lucide-react";

const statusStyles = {
  pending: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
  processing: "bg-blue-50 text-blue-700 ring-1 ring-blue-200",
  shipped: "bg-violet-50 text-violet-700 ring-1 ring-violet-200",
  delivered: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
  cancelled: "bg-rose-50 text-rose-700 ring-1 ring-rose-200",
};

const StatusBadge = ({ status }) => (
  <span
    className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium capitalize ${
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

  const myOrderProducts = orders.flatMap((o) =>
    o.products
      .filter((p) => p.vendor === user.id)
      .map((p) => ({
        ...p,
        customer: o.user,
        orderId: o._id,
        orderDate: o.createdAt,
      }))
  );

  const totalRevenue = myOrderProducts.reduce(
    (sum, p) => sum + (p.price || 0) * (p.quantity || 1),
    0
  );

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-6 flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            Your orders
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Products customers have ordered from your store.
          </p>
        </div>

        {myOrderProducts.length > 0 && (
          <div className="flex gap-6 text-right">
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-400">
                Items
              </p>
              <p className="text-lg font-semibold text-slate-900">
                {myOrderProducts.length}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-400">
                Revenue
              </p>
              <p className="flex items-center justify-end gap-0.5 text-lg font-semibold text-slate-900">
                <IndianRupee className="h-4 w-4" />
                {totalRevenue.toLocaleString("en-IN")}
              </p>
            </div>
          </div>
        )}
      </div>

      {myOrderProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50 py-20 text-center">
          <PackageSearch className="mb-3 h-10 w-10 text-slate-300" />
          <p className="font-medium text-slate-700">No orders yet</p>
          <p className="mt-1 max-w-sm text-sm text-slate-500">
            When a customer buys one of your products, it'll show up here.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-200">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3 font-medium">Product</th>
                <th className="px-4 py-3 font-medium">Customer</th>
                <th className="px-4 py-3 font-medium">Qty</th>
                <th className="px-4 py-3 font-medium">Price</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {myOrderProducts.map((p, idx) => (
                <tr key={`${p.orderId}-${idx}`} className="hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {p.image ? (
                        <img
                          src={p.image}
                          alt={p.name}
                          className="h-10 w-10 rounded-md object-cover ring-1 ring-slate-200"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-md bg-slate-100" />
                      )}
                      <span className="font-medium text-slate-800">
                        {p.name || "Untitled product"}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {p.customer?.name || p.customer?.email || "Customer"}
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {p.quantity || 1}
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    <span className="flex items-center gap-0.5">
                      <IndianRupee className="h-3.5 w-3.5" />
                      {(p.price || 0).toLocaleString("en-IN")}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={p.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MyOrders;