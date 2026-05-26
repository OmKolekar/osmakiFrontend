import React from "react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import MenHeader from "../components/men/MenHeader";
import MenView from "../components/men/MenView";
import { useProducts } from "../hooks/useProducts";
import "../styles/collection.css";

export default function Men() {
  const { products, loading, error } = useProducts("Men");

  return (
    <div className="collection-page">
      <Navbar />

      <MenHeader />

      <div className="page-container">
        {loading ? (
          <div className="collection-loader" style={{ textAlign: "center", padding: "50px" }}>
            <div className="loader-spinner" style={{ margin: "0 auto" }}></div>
          </div>
        ) : error ? (
          <div className="collection-error" style={{ textAlign: "center", padding: "50px", color: "red" }}>
            {error}
          </div>
        ) : products.length === 0 ? (
          <div className="no-products-message" style={{ textAlign: "center", padding: "80px 20px", fontFamily: "Playfair Display, serif" }}>
            <h3>No products available in this section.</h3>
            <p style={{ color: "#666", marginTop: "10px", fontFamily: "Inter, sans-serif" }}>Please check back later or explore other categories.</p>
          </div>
        ) : (
          <MenView products={products} />
        )}
      </div>

      <Footer />
    </div>
  );
}
