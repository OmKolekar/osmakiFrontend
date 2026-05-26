import React from "react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import ProductCard from "../components/products/ProductCard";
import DynamicSections from "../components/home/DynamicSections";
import { useProducts } from "../hooks/useProducts";
import "../styles/home.css";
import "../styles/product.css";

export default function Home() {
  const { products, loading, error } = useProducts(null, false, true);

  return (
    <div className="home-page">
      <Navbar />

      {/* DYNAMIC SECTIONS */}
      <DynamicSections />

      {/* PRODUCTS */}
      <div className="page-container">
        <section className="products">

          {loading ? (
            <div className="collection-loader" style={{ textAlign: "center", padding: "50px" }}>
              <div className="loader-spinner" style={{ margin: "0 auto" }}></div>
            </div>
          ) : error ? (
            <div className="collection-error" style={{ textAlign: "center", padding: "50px", color: "red" }}>
              {error}
            </div>
          ) : products.length === 0 ? (
            <div className="no-products-message" style={{ textAlign: "center", padding: "40px 20px", fontFamily: "Playfair Display, serif" }}>
              <h3>No best sellers available.</h3>
              <p style={{ color: "#666", marginTop: "10px", fontFamily: "Inter, sans-serif" }}>Please browse other sections.</p>
            </div>
          ) : (
            <div className="product-grid">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </section>
      </div>

      <Footer />
    </div>
  );
}

