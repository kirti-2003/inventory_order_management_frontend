import { useEffect, useState } from "react";
import { Package, Users, ShoppingCart, AlertTriangle } from "lucide-react";

import { getProducts } from "../../services/productService";
import { getCustomers } from "../../services/customerService";
import { getOrders } from "../../services/orderService";

import StatCard from "../../components/dashboard/StatCard";
import LowStockTable from "../../components/dashboard/LowStockTable";
import RecentOrdersTable from "../../components/dashboard/RecentOrdersTable";

function Dashboard() {
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      const [productsData, customersData, ordersData] = await Promise.all([
        getProducts(),
        getCustomers(),
        getOrders(),
      ]);

      setProducts(Array.isArray(productsData) ? productsData : []);
      setCustomers(Array.isArray(customersData) ? customersData : []);
      setOrders(Array.isArray(ordersData) ? ordersData : []);
    } catch (error) {
      console.error("Dashboard Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const lowStockProducts = products.filter(
    (product) =>
      Number(product.quantity_in_stock || 0) <=
      Number(product.low_stock_threshold || 0)
  );

  const recentOrders = [...orders].reverse();

  if (loading) {
    return <div className="p-4 text-gray-600 font-medium">Loading dashboard...</div>;
  }

  return (
    <div className="p-4 space-y-4">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 text-sm mt-1">
          Inventory & Order Management Overview
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
        <StatCard
          title="Products"
          value={products.length}
          icon={Package}
          color="#2563EB"
          bgColor="#EFF6FF"
        />

        <StatCard
          title="Customers"
          value={customers.length}
          icon={Users}
          color="#16A34A"
          bgColor="#F0FDF4"
        />

        <StatCard
          title="Orders"
          value={orders.length}
          icon={ShoppingCart}
          color="#7C3AED"
          bgColor="#F5F3FF"
        />

        <StatCard
          title="Low Stock Items"
          value={lowStockProducts.length}
          icon={AlertTriangle}
          color="#F97316"
          bgColor="#FFF7ED"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <LowStockTable products={lowStockProducts} />
        <RecentOrdersTable orders={recentOrders} />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-semibold text-gray-800">Inventory Overview</h3>
          <button className="text-xs text-red-500 font-semibold">This Month</button>
        </div>

        <div className="h-32 rounded-lg border border-dashed border-gray-300 bg-gray-50 flex items-center justify-center text-sm text-gray-400">
          Chart will be added later
        </div>
      </div>
    </div>
  );
}

export default Dashboard;