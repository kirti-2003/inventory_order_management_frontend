function LowStockTable({ products }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold text-gray-800">Low Stock Products</h3>
        <button className="text-xs text-red-500 font-semibold">View all</button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="text-left py-3 px-3">Product</th>
              <th className="text-left py-3 px-3">SKU</th>
              <th className="text-left py-3 px-3">Stock</th>
              <th className="text-left py-3 px-3">Reorder Level</th>
              <th className="text-left py-3 px-3">Status</th>
            </tr>
          </thead>

          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center text-gray-400 py-6">
                  No low stock products
                </td>
              </tr>
            ) : (
              products.slice(0, 5).map((product) => (
                <tr key={product.product_id} className="border-b border-gray-100">
                  <td className="py-3 px-3 text-gray-700">{product.product_name}</td>
                  <td className="py-3 px-3 text-gray-700">{product.sku}</td>
                  <td className="py-3 px-3 text-gray-700">{product.quantity_in_stock}</td>
                  <td className="py-3 px-3 text-gray-700">{product.low_stock_threshold}</td>
                  <td className="py-3 px-3">
                    <span className="bg-red-100 text-red-600 text-xs font-semibold px-2 py-1 rounded-full">
                      Low
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

export default LowStockTable;