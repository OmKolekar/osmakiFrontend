import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import ProductDetailView from "../components/products/ProductDetailView";
import "../styles/productDetail.css";

export default function ProductDetail() {
  return (
    <div className="product-detail-page">
      <Navbar />

      <div className="page-container">
        <ProductDetailView />
      </div>

      <Footer />
    </div>
  );
}

