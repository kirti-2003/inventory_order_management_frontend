const STATUS_COLORS = {
  PENDING: "#F97316",
  PROCESSING: "#2563EB",
  SHIPPED: "#0EA5E9",
  DELIVERED: "#16A34A",
  COMPLETED: "#16A34A",
  CANCELLED: "#DC2626",
};

const formatCurrency = (value) =>
  `₹${Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;

function OrderStatusBreakdown({ orders = [] }) {
  const totalOrders = orders.length;

  const statusCounts = orders.reduce((acc, order) => {
    const status = (order.status || "UNKNOWN").toUpperCase();
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  const sortedStatuses = Object.entries(statusCounts).sort(
    (a, b) => b[1] - a[1]
  );

  const totalRevenue = orders
    .filter((order) => (order.status || "").toUpperCase() !== "CANCELLED")
    .reduce((sum, order) => sum + Number(order.total_amount || 0), 0);

  return (
    <div className="order-status-card overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
      <div className="order-status-card__header flex items-start justify-between gap-4 border-b border-gray-100">
        <h3 className="text-sm font-semibold text-gray-800">
          Order Status Breakdown
        </h3>
        <div className="shrink-0 text-right">
          <p className="text-xs text-gray-400">Revenue (excl. cancelled)</p>
          <p className="text-base font-bold text-gray-900">
            {formatCurrency(totalRevenue)}
          </p>
        </div>
      </div>

      <div className="order-status-card__body">
        {totalOrders === 0 ? (
          <p className="py-5 text-center text-sm text-gray-400">
            No orders yet
          </p>
        ) : (
          <div className="space-y-4">
            {sortedStatuses.map(([status, count]) => {
              const pct = Math.round((count / totalOrders) * 100);
              const color = STATUS_COLORS[status] || "#6B7280";

              return (
                <div key={status}>
                  <div className="mb-1.5 flex items-center justify-between gap-3 text-sm">
                    <span className="font-medium text-gray-700">{status}</span>
                    <span className="shrink-0 text-gray-500">
                      {count}{" "}
                      <span className="text-gray-400">({pct}%)</span>
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${pct}%`, backgroundColor: color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default OrderStatusBreakdown;