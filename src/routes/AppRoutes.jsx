import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import Dashboard from "../pages/Dashboard/Dashboard";
import { Suspense, lazy } from "react";
import Products from "../pages/Products/Products"
import Customers from "../pages/Customers/Customers";
import Orders from "../pages/Orders/Orders";

function AppRoutes() {
  return (
    <Suspense fallback={<div className="p-6">Loading…</div>}>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="/products/" element={<Products />} />
          <Route path="/customers/"element={<Customers/>} />
          <Route path="/orders/"element={<Orders/>} />
        </Route>
      </Routes>
     </Suspense>
  );
}

export default AppRoutes;