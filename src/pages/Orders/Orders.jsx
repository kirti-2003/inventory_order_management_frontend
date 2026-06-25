import { useEffect, useState } from "react";
import { Eye, Trash2, X, Plus } from "lucide-react";
import { getOrders, deleteOrder, createOrder } from "../../services/orderService";
import { getCustomers } from "../../services/customerService";
import { getProducts } from "../../services/productService";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const [showAddModal, setShowAddModal] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);

  const [formData, setFormData] = useState({
    customer_id: "",
    product_id: "",
    quantity: 1,
    });

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await getOrders();
      setOrders(data);
    } catch (error) {
      console.error(error);
      alert("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  const fetchDropdownData = async () => {
    try {
        const [customersData, productsData] = await Promise.all([
        getCustomers(),
        getProducts(),
        ]);

        setCustomers(customersData);
        setProducts(productsData);
    } catch (error) {
        console.error(error);
        alert("Failed to load customers/products");
    }
    };

  useEffect(() => {
    fetchOrders();
    fetchDropdownData();
    }, []);

  const handleDelete = async (orderId) => {
    if (!window.confirm("Delete this order?")) return;

    try {
      await deleteOrder(orderId);
      fetchOrders();
    } catch (error) {
      console.error(error);
      alert("Failed to delete order");
    }
  };

  const handleCreateOrder = async (e) => {
    e.preventDefault();

    if (!formData.customer_id || !formData.product_id || formData.quantity <= 0) {
        alert("Please fill all fields correctly");
        return;
    }

    try {
        await createOrder({
        company_id: "COMP_00001",
        customer_id: formData.customer_id,
        items: [
            {
            product_id: formData.product_id,
            quantity: Number(formData.quantity),
            },
        ],
        });

        setShowAddModal(false);
        setFormData({
        customer_id: "",
        product_id: "",
        quantity: 1,
        });

        fetchOrders();
    } catch (error) {
        console.error(error);
        alert(error?.response?.data?.detail || "Failed to create order");
    }
    };

  const formatAmount = (amount) => {
    return `₹${Number(amount || 0).toLocaleString("en-IN")}`;
  };

  const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-5 md:px-10 md:py-4">

  {/* Header outside table card */}
  <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
    <div>
      <h1 className="text-3xl font-bold text-slate-900">
        Order History
      </h1>
      <p className="mt-1 text-sm text-slate-500">
        View and manage all customer orders
      </p>
    </div>

    <button
      onClick={() => setShowAddModal(true)}
       className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#264653] px-5 py-3 text-sm font-semibold text-white hover:bg-[#1f3b46] md:w-auto"    >
      <Plus size={18} />
      Add Order
    </button>
  </div>

  {/* Only table card */}
 <div className="w-full rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:p-6">

        <div className="w-full overflow-x-auto rounded-xl border border-slate-200 bg-white">
          <table className="w-full min-w-[850px] border-collapse lg:min-w-0">
            <thead>
              <tr className="bg-[#d9eaf1] text-left text-sm font-semibold text-slate-700">
                <th className="px-6 py-4">S No</th>
                <th className="px-6 py-4">Customer Name</th>
                <th className="px-6 py-4">Order Number</th>
                <th className="px-6 py-4">Total Amount</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-center">Action</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-10 text-center text-slate-500"
                  >
                    Loading orders...
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-10 text-center text-slate-500"
                  >
                    No orders found
                  </td>
                </tr>
              ) : (
                orders.map((order, index) => (
                  <tr
                    key={order.order_id}
                    className="border-t border-slate-200 text-sm text-slate-700 hover:bg-slate-50"
                  >
                    <td className="px-6 py-5">{index + 1}</td>
                    <td className="px-6 py-5 font-medium">
                      {order.customer_name || "-"}
                    </td>
                    <td className="px-6 py-5">{order.order_number}</td>
                    <td className="px-6 py-5">
                      {formatAmount(order.total_amount)}
                    </td>
                    <td className="px-6 py-5">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          order.status === "CANCELLED"
                            ? "bg-red-100 text-red-600"
                            : order.status === "COMPLETED"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center justify-center gap-3">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="rounded-lg bg-blue-50 p-2 text-blue-600 hover:bg-blue-100"
                          title="View order"
                        >
                          <Eye size={18} />
                        </button>

                        <button
                          onClick={() => handleDelete(order.order_id)}
                          className="rounded-lg bg-red-50 p-2 text-red-600 hover:bg-red-100"
                          title="Delete order"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
            <div className="w-full max-w-xl rounded-2xl bg-white p-7 shadow-xl">
            <div className="mb-6 flex items-start justify-between">
                <div>
                <h2 className="text-xl font-bold text-slate-800">Add Order</h2>
                <p className="mt-1 text-sm text-slate-500">
                    Select customer and product to create an order
                </p>
                </div>

                <button
                onClick={() => setShowAddModal(false)}
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
                >
                <X size={20} />
                </button>
            </div>

            <form onSubmit={handleCreateOrder} className="space-y-5">
                <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Customer
                </label>
                <select
                    value={formData.customer_id}
                    onChange={(e) =>
                    setFormData({ ...formData, customer_id: e.target.value })
                    }
                    className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-[#264653]"
                >
                    <option value="">Select customer</option>
                    {customers.map((customer) => (
                    <option key={customer.customer_id} value={customer.customer_id}>
                        {customer.full_name}
                    </option>
                    ))}
                </select>
                </div>

                <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Product
                </label>
                <select
                    value={formData.product_id}
                    onChange={(e) =>
                    setFormData({ ...formData, product_id: e.target.value })
                    }
                    className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-[#264653]"
                >
                    <option value="">Select product</option>
                    {products.map((product) => (
                    <option key={product.product_id} value={product.product_id}>
                        {product.product_name} — Stock: {product.quantity_in_stock}
                    </option>
                    ))}
                </select>
                </div>

                <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Quantity
                </label>
                <input
                    type="number"
                    min="1"
                    value={formData.quantity}
                    onChange={(e) =>
                    setFormData({ ...formData, quantity: e.target.value })
                    }
                    className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-[#264653]"
                />
                </div>

                <div className="flex justify-end gap-3 pt-4">
                <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                >
                    Cancel
                </button>

                <button
                    type="submit"
                    className="rounded-lg bg-[#264653] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#1f3b46]"
                >
                    Create Order
                </button>
                </div>
            </form>
            </div>
        </div>
        )}

      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-4xl rounded-2xl bg-white p-7 shadow-xl">
            <div className="mb-6 flex items-start justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-800">
                  Order Details
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  {selectedOrder.order_number}
                </p>
              </div>

              <button
                onClick={() => setSelectedOrder(null)}
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mb-6 grid grid-cols-3 gap-4 rounded-xl bg-slate-50 p-4">
              <div>
                <p className="text-xs text-slate-500">Customer</p>
                <p className="font-semibold text-slate-800">
                  {selectedOrder.customer_name}
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-500">Placed On</p>
                <p className="font-semibold text-slate-800">
                  {formatDate(selectedOrder.created_at)}
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-500">Total Amount</p>
                <p className="font-semibold text-slate-800">
                  {formatAmount(selectedOrder.total_amount)}
                </p>
              </div>
            </div>

            <div className="overflow-hidden rounded-lg border border-slate-200">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#d9eaf1] text-left text-sm font-semibold text-slate-700">
                    <th className="px-5 py-4">Product Name</th>
                    <th className="px-5 py-4">Quantity</th>
                    <th className="px-5 py-4">Unit Price</th>
                    <th className="px-5 py-4">Total Price</th>
                    <th className="px-5 py-4">Placed On</th>
                  </tr>
                </thead>

                <tbody>
                  {selectedOrder.order_items?.map((item) => (
                    <tr
                      key={item.order_item_id}
                      className="border-t border-slate-200 text-sm text-slate-700"
                    >
                      <td className="px-5 py-4 font-medium">
                        {item.product_name}
                      </td>
                      <td className="px-5 py-4">{item.quantity}</td>
                      <td className="px-5 py-4">
                        {formatAmount(item.unit_price)}
                      </td>
                      <td className="px-5 py-4">
                        {formatAmount(item.line_total)}
                      </td>
                      <td className="px-5 py-4">
                        {formatDate(selectedOrder.created_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setSelectedOrder(null)}
                className="rounded-lg bg-slate-800 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}