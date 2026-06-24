const STATUS_STYLES = {
  PENDING: "bg-orange-100 text-orange-600",
  PROCESSING: "bg-blue-100 text-blue-600",
  SHIPPED: "bg-sky-100 text-sky-600",
  DELIVERED: "bg-green-100 text-green-600",
  COMPLETED: "bg-green-100 text-green-600",
  CANCELLED: "bg-red-100 text-red-600",
};

const formatCurrency = (value) =>
  `₹${Number(value || 0).toLocaleString("en-IN")}`;

function RecentOrdersTable({ orders }) {
  return (
    <div className="dashboard-panel-card rounded-xl border border-gray-100 bg-white shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-800">Recent Orders</h3>
        {/* <button className="rounded-full px-2 py-1 text-xs font-semibold text-red-500 transition-colors hover:bg-red-50">
          View all
        </button> */}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 text-xs uppercase tracking-wide text-gray-400">
              <th className="px-3 py-2.5 text-left font-medium">Order</th>
              <th className="px-3 py-2.5 text-left font-medium">Customer</th>
              <th className="px-3 py-2.5 text-right font-medium">Total</th>
              <th className="px-3 py-2.5 text-right font-medium">Status</th>
            </tr>
          </thead>

          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan="4" className="py-5 text-center text-gray-400">
                  No recent orders
                </td>
              </tr>
            ) : (
              orders.slice(0, 5).map((order) => {
                const status = (order.status || "PENDING").toUpperCase();
                const statusStyle =
                  STATUS_STYLES[status] || "bg-gray-100 text-gray-600";

                return (
                  <tr
                    key={order.order_id}
                    className="border-b border-gray-50 last:border-0 hover:bg-gray-50/60"
                  >
                    <td
                      className="px-3 py-3 font-medium text-gray-700"
                      title={order.order_id}
                    >
                      {order.order_number || order.order_id}
                    </td>
                    <td
                      className="max-w-95 truncate px-3 py-3 text-gray-600"
                      title={order.customer_name || order.customer_id}
                    >
                      {order.customer_name || order.customer_id || "Unknown"}
                    </td>
                    <td className="px-3 py-3 text-right text-gray-700">
                      {formatCurrency(order.total_amount)}
                    </td>
                    <td className="px-3 py-3 text-right">
                      <span
                        className={`inline-block rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyle}`}
                      >
                        {status}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default RecentOrdersTable;