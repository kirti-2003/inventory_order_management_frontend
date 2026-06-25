import { Menu } from "lucide-react";

function Header({ setSidebarOpen }) {
  return (
    <header className="header">
      <button
        className="hamburger-btn"
        onClick={() => setSidebarOpen(true)}
      >
        <Menu size={24} />
      </button>

      <h3>Inventory Order Management</h3>
    </header>
  );
}

export default Header;