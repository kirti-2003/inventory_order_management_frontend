import { LayoutDashboard, Package, Users, ShoppingCart } from "lucide-react";

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <h2>Inventory</h2>
        <p>Order Management</p>
      </div>

      <nav>
        <a href="/">
          <LayoutDashboard size={18} />
          Dashboard
        </a>

        <a href="/products/">
          <Package size={18} />
          Products
        </a>

        <a href="/customers">
          <Users size={18} />
          Customers
        </a>

        <a href="/orders">
          <ShoppingCart size={18} />
          Orders
        </a>
      </nav>
    </aside>
  );
}

export default Sidebar;