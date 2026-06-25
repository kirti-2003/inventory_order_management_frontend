import { Routes, Route } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import { Suspense, lazy } from "react";

const Dashboard = lazy(() => import("../pages/Dashboard/Dashboard"));
const Products = lazy(() => import("../pages/Products/Products"));
const Customers = lazy(() => import("../pages/Customers/Customers"));
const Orders = lazy(() => import("../pages/Orders/Orders"));

const PageLoader = () => (
  <div className="flex min-h-[60vh] items-center justify-center">
    <div className="flex flex-col items-center gap-3">
      <div className="h-9 w-9 animate-spin rounded-full border-4 border-slate-300 border-t-[#264653]" />
      <p className="text-sm font-semibold text-slate-600">Loading page...</p>
    </div>
  </div>
);

const LazyPage = ({ children }) => (
  <Suspense fallback={<PageLoader />}>{children}</Suspense>
);

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route
          index
          element={
            <LazyPage>
              <Dashboard />
            </LazyPage>
          }
        />

        <Route
          path="/products/"
          element={
            <LazyPage>
              <Products />
            </LazyPage>
          }
        />

        <Route
          path="/customers/"
          element={
            <LazyPage>
              <Customers />
            </LazyPage>
          }
        />

        <Route
          path="/orders/"
          element={
            <LazyPage>
              <Orders />
            </LazyPage>
          }
        />
      </Route>
    </Routes>
  );
}

export default AppRoutes;