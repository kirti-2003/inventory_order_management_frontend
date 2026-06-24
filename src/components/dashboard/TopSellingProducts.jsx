function TopSellingProducts({ orders = [] }) {
  const productMap = {};

  orders.forEach((order) => {
    (order.order_items || []).forEach((item) => {
      const name = item.product_name || "Unknown product";
      productMap[name] = (productMap[name] || 0) + Number(item.quantity || 0);
    });
  });

  const topProducts = Object.entries(productMap)
    .map(([name, qty]) => ({ name, qty }))
    .sort((a, b) => b.qty - a.qty)
    .slice(0, 5);

  const maxQty = topProducts.length > 0 ? topProducts[0].qty : 0;

  return (
    <div className="dashboard-panel-card rounded-xl border border-gray-100 bg-white shadow-sm">
      <h3 className="mb-4 text-sm font-semibold text-gray-800">
        Top Selling Products
      </h3>

      {topProducts.length === 0 ? (
        <p className="py-5 text-center text-sm text-gray-400">
          No sales data yet
        </p>
      ) : (
        <div className="space-y-4">
          {topProducts.map((product, index) => {
            const pct = maxQty > 0 ? Math.round((product.qty / maxQty) * 100) : 0;

            return (
              <div key={product.name} className="flex items-center gap-3">
                <span className="flex h-5 w-5 flex-none items-center justify-center rounded-full bg-gray-100 text-[11px] font-semibold text-gray-500">
                  {index + 1}
                </span>

                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex items-baseline justify-between gap-2">
                    <span className="truncate text-sm font-medium text-gray-700">
                      {product.name}
                    </span>
                    <span className="flex-none text-sm text-gray-500">
                      {product.qty} sold
                    </span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
                    <div
                      className="h-full rounded-full bg-blue-600"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default TopSellingProducts;