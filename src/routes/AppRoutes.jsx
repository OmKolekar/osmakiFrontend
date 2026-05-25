import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home, Men, Women, Trending, ProductDetail, Cart } from "../features/customer";
import { Login } from "../features/auth";
import { AdminLayout, Dashboard, InventoryManager, AddProduct, InventoryLogs, SectionManager } from "../features/admin";
import AdminRoute from "./AdminRoute";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/men" element={<Men />} />
        <Route path="/women" element={<Women />} />
        <Route path="/trending" element={<Trending />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/login" element={<Login />} />

        {/* Protected Admin Routes */}
        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="inventory" element={<InventoryManager />} />
            <Route path="add-product" element={<AddProduct />} />
            <Route path="logs" element={<InventoryLogs />} />
            <Route path="sections" element={<SectionManager />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
