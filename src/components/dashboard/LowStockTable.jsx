function LowStockTable({ products }) {
  return (
    <div className="dashboard-panel-card rounded-xl border border-gray-100 bg-white shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-800">
          Low Stock Products
        </h3>
        {/* <button className="rounded-full px-2 py-1 text-xs font-semibold text-red-500 transition-colors hover:bg-red-50">
          View all
        </button> */}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 text-xs uppercase tracking-wide text-gray-400">
              <th className="px-3 py-2.5 text-left font-medium">Product</th>
              <th className="px-3 py-2.5 text-left font-medium">SKU</th>
              <th className="px-3 py-2.5 text-right font-medium">Stock</th>
              
              <th className="px-3 py-2.5 text-right font-medium">Status</th>
            </tr>
          </thead>

          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan="5" className="py-5 text-center text-gray-400">
                  No low stock products
                </td>
              </tr>
            ) : (
              products.slice(0, 5).map((product) => {
                const stock = Number(product.quantity_in_stock || 0);
                const isOutOfStock = stock <= 0;

                return (
                  <tr
                    key={product.product_id || product.sku}
                    className="border-b border-gray-50 last:border-0 hover:bg-gray-50/60"
                  >
                    <td className="px-3 py-3 font-medium text-gray-700">
                      {product.product_name}
                    </td>
                    <td className="px-3 py-3 text-gray-500">{product.sku}</td>
                    <td className="px-3 py-3 text-right text-gray-700">
                      {stock}
                    </td>
                    {/* <td className="px-3 py-3 text-right text-gray-700">
                      {product.low_stock_threshold}
                    </td> */}
                    <td className="px-3 py-3 text-right">
                      <span
                        className={`inline-block rounded-full px-2.5 py-1 text-xs font-semibold ${
                          isOutOfStock
                            ? "bg-red-100 text-red-600"
                            : "bg-orange-100 text-orange-600"
                        }`}
                      >
                        {isOutOfStock ? "Out of Stock" : "Low"}
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

export default LowStockTable;