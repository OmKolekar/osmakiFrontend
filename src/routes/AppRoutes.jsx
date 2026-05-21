import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home, Products, ProductDetail } from "../features/customer";
import { Login } from "../features/auth";


export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/product-details" element={<ProductDetail />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}
