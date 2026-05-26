import React from "react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import TrendingHeader from "../components/trending/TrendingHeader";
import TrendingView from "../components/trending/TrendingView";
import { useProducts } from "../hooks/useProducts";
import "../styles/trending.css";
import "../styles/collection.css";

export default function Trending() {
  const { products, loading, error } = useProducts(null, true);

  return (
    <div className="trending-page">
      <Navbar />

      <TrendingHeader />

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
            <h3>No trending products available.</h3>
            <p style={{ color: "#666", marginTop: "10px", fontFamily: "Inter, sans-serif" }}>Please check back later or explore other categories.</p>
          </div>
        ) : (
          <TrendingView products={products} />
        )}
      </div>

      <Footer />
    </div>
  );
}
