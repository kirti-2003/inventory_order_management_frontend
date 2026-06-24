import { useEffect, useState } from "react";
import { Package, Users, ShoppingCart, AlertTriangle } from "lucide-react";

import { getProducts } from "../../services/productService";
import { getCustomers } from "../../services/customerService";
import { getOrders } from "../../services/orderService";

import StatCard from "../../components/dashboard/StatCard";
import LowStockTable from "../../components/dashboard/LowStockTable";
import RecentOrdersTable from "../../components/dashboard/RecentOrdersTable";
import OrderStatusBreakdown from "../../components/dashboard/OrderStatusBreakdown";
import TopSellingProducts from "../../components/dashboard/TopSellingProducts";

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
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-[3px] border-gray-200 border-t-blue-600" />
          <p className="text-sm font-medium text-gray-500">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-screen-2xl">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Inventory & Order Management Overview
        </p>
      </div>

      {/* Stat cards */}
      <div className="dashboard-stats-grid">
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

      {/* Tables */}
      <div className="dashboard-panels-grid">
        <LowStockTable products={lowStockProducts} />
        <RecentOrdersTable orders={recentOrders} />
      </div>

      {/* Order status + top products */}
      <div className="dashboard-panels-grid">
        <OrderStatusBreakdown orders={orders} />
        <TopSellingProducts orders={orders} />
      </div>
    </div>
  );
}

export default Dashboard;