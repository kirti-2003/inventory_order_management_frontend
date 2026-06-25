import { LayoutDashboard, Package, Users, ShoppingCart } from "lucide-react";

function Sidebar({ sidebarOpen, setSidebarOpen }) {
  return (
    <aside className={`sidebar ${sidebarOpen ? "sidebar-open" : ""}`}>
      <div className="sidebar-brand">
        <h2>Inventory</h2>
        <p>Order Management</p>
      </div>

      <nav>
        <a href="/" onClick={() => setSidebarOpen(false)}>
          <LayoutDashboard size={18} />
          Dashboard
        </a>

        <a href="/products/" onClick={() => setSidebarOpen(false)}>
          <Package size={18} />
          Products
        </a>

        <a href="/customers" onClick={() => setSidebarOpen(false)}>
          <Users size={18} />
          Customers
        </a>

        <a href="/orders" onClick={() => setSidebarOpen(false)}>
          <ShoppingCart size={18} />
          Orders
        </a>
      </nav>
    </aside>
  );
}

export default Sidebar;