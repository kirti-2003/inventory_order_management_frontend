function RecentOrdersTable({ orders }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold text-gray-800">Recent Orders</h3>
        <button className="text-xs text-red-500 font-semibold">View all</button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="text-left py-3 px-3">Order ID</th>
              <th className="text-left py-3 px-3">Customer</th>
              <th className="text-left py-3 px-3">Total</th>
              <th className="text-left py-3 px-3">Status</th>
            </tr>
          </thead>

          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center text-gray-400 py-6">
                  No recent orders
                </td>
              </tr>
            ) : (
              orders.slice(0, 5).map((order) => (
                <tr key={order.order_id} className="border-b border-gray-100">
                  <td className="py-3 px-3 text-gray-700 break-all">{order.order_id}</td>
                  <td className="py-3 px-3 text-gray-700 break-all">{order.customer_id}</td>
                  <td className="py-3 px-3 text-gray-700">₹{order.total_amount || 0}</td>
                  <td className="py-3 px-3">
                    <span className="bg-orange-100 text-orange-600 text-xs font-semibold px-2 py-1 rounded-full">
                      {order.status || "Pending"}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default RecentOrdersTable;