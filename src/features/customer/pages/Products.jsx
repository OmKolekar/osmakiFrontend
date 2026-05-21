import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import ProductGrid from "../components/products/ProductGrid";
import "../styles/productPage.css";

export default function Products() {
  return (
    <div className="products-page">
      <Navbar />

      <div className="page-container">
        <div className="products-container">
          <h1 className="products-title">Shop All</h1>
          <ProductGrid />
        </div>
      </div>

      <Footer />
    </div>
  );
}