import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home, Men, Women, Trending, ProductDetail, Cart, Checkout, OrderDetails, UserOrders, AboutUs, ContactUs, PrivacyPolicy, TermsConditions, RefundPolicy, ShippingPolicy } from "../features/customer";
import { Login } from "../features/auth";
import { AdminLayout, Dashboard, InventoryManager, AddProduct, EditProduct, InventoryLogs, SectionManager, OrderManager } from "../features/admin";
import AdminRoute from "./AdminRoute";
import ScrollToTop from "./ScrollToTop";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/men" element={<Men />} />
        <Route path="/women" element={<Women />} />
        <Route path="/trending" element={<Trending />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order/:orderId" element={<OrderDetails />} />
        <Route path="/orders" element={<UserOrders />} />
        <Route path="/login" element={<Login />} />

        {/* Informational & Legal Pages */}
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/contact-us" element={<ContactUs />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-conditions" element={<TermsConditions />} />
        <Route path="/refund-policy" element={<RefundPolicy />} />
        <Route path="/shipping-policy" element={<ShippingPolicy />} />

        {/* Protected Admin Routes */}
        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="inventory" element={<InventoryManager />} />
            <Route path="add-product" element={<AddProduct />} />
            <Route path="edit-product/:id" element={<EditProduct />} />
            <Route path="logs" element={<InventoryLogs />} />
            <Route path="sections" element={<SectionManager />} />
            <Route path="orders" element={<OrderManager />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
