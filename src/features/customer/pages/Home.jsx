import React, { useState } from "react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import ProductCard from "../components/products/ProductCard";
import { useProducts } from "../hooks/useProducts";
import "../styles/home.css";
import "../styles/product.css";

export default function Home() {
  const { products, loading, error } = useProducts();
  const [allocationEmail, setAllocationEmail] = useState("");
  const [allocationStatus, setAllocationStatus] = useState("");

  const scrollToDrop = () => {
    const el = document.getElementById("product-section");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleAllocationSubmit = (e) => {
    e.preventDefault();
    if (allocationEmail.trim()) {
      setAllocationStatus("✓ Allocation registered. Priority access will be dispatched to your inbox.");
      setAllocationEmail("");
    }
  };

  return (
    <div className="home-page">
      <Navbar />

      <div className="page-container">
        {/* PRODUCT SPOTLIGHT SECTION */}
        <section id="product-section" className="home-product-section">
          <div className="products">
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
                <h3>No pieces available.</h3>
                <p style={{ color: "#666", marginTop: "10px", fontFamily: "Inter, sans-serif" }}>Please check back shortly.</p>
              </div>
            ) : (
              <div className="product-grid">
                {products.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            )}
          </div>

          <div className="scarcity-status-banner">
            <span className="scarcity-dot"></span>
            <span className="scarcity-text">FIRST EDITION RUN // STRICTLY 100 PIECES WORLDWIDE // COMPLIMENTARY EXPRESS DISPATCH</span>
          </div>
        </section>

        {/* 4. WIDE ARCHITECTURAL TEXT BANNER (Inspired directly by the Stitch black banner in the screenshot) */}
        <section id="details-section" className="architectural-dark-banner">
          <div className="dark-banner-inner">
            <div className="dark-banner-content">
              <span className="dark-banner-badge">ARCHITECTURAL SUBSTANCE // 02 LIMITED DROP</span>
              <h2 className="dark-banner-heading">100 PIECES. ZERO ORDINARY.</h2>
              <p className="dark-banner-description">
                A limited release designed to stand apart. Zero-sag 1.25" collar with reinforced interior taping. Built on the details: thoughtful design, refined essentials, and no unnecessary noise. Small drop, big energy — be part of the first chapter.
              </p>
              <div className="dark-banner-action">
                <button onClick={scrollToDrop} className="dark-banner-btn">
                  EXPLORE THE DROP ↗
                </button>
              </div>
            </div>

            <div className="dark-banner-metrics">
              <div className="metric-box">
                <span className="metric-value">100%</span>
                <span className="metric-title">LONG STAPLE COTTON</span>
                <span className="metric-sub">Single-origin premium yarn</span>
              </div>
              <div className="metric-box">
                <span className="metric-value">100 PCS</span>
                <span className="metric-title">FIRST EDITION RUN</span>
                <span className="metric-sub">Strictly numbered release</span>
              </div>
              <div className="metric-box">
                <span className="metric-value">0.0%</span>
                <span className="metric-title">POST-WASH TWIST</span>
                <span className="metric-sub">Mechanical steam compacting</span>
              </div>
            </div>
          </div>
        </section>

        {/* 5. QUALITY & PHILOSOPHY CARDS SECTION */}
        <section className="philosophy-section">
          <div className="philosophy-inner">
            <div className="philosophy-header">
              <span className="philosophy-badge">03 / PREMIUM QUALITY</span>
              <h2 className="philosophy-heading">THE ART OF KEEPING IT SIMPLE.</h2>
              <p className="philosophy-subheading">
                BUILT ON THE DETAILS. Thoughtful design. Refined essentials. Everyday silhouettes crafted to outlast the moment.
              </p>
            </div>

            <div className="philosophy-grid">
              <div className="philosophy-card">
                <div className="card-top-row">
                  <span className="card-index">01</span>
                  <span className="card-tag">COLLECTION PHILOSOPHY</span>
                </div>
                <h3 className="card-heading">DESIGNED WITH INTENTION.</h3>
                <p className="card-text">
                  A clean silhouette, effortless styling, and a look that speaks for itself. Redefining the essentials, one detail at a time. Designed to be worn on repeat.
                </p>
              </div>

              <div className="philosophy-card">
                <div className="card-top-row">
                  <span className="card-index">02</span>
                  <span className="card-tag">LIMITED QUANTITY</span>
                </div>
                <h3 className="card-heading">SMALL DROP. BIG ENERGY.</h3>
                <p className="card-text">
                  Just 100 pieces in this release. Every garment is formulated with heavyweight 240+ GSM cotton and geometric cut lines. Be part of the first chapter.
                </p>
              </div>

              <div className="philosophy-card">
                <div className="card-top-row">
                  <span className="card-index">03</span>
                  <span className="card-tag">STREETWEAR IDENTITY</span>
                </div>
                <h3 className="card-heading">WEAR YOUR OWN STANDARD.</h3>
                <p className="card-text">
                  Everyday silhouettes. A distinctive attitude. Not another basic. Your size. Your moment. Find your fit before this limited release disappears.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 6. DROP ALLOCATION & NEWSLETTER SECTION */}
        <section className="allocation-section">
          <div className="allocation-inner">
            <div className="allocation-card">
              <div className="allocation-header">
                <span className="allocation-badge">GET IN BEFORE THE NEXT CHAPTER</span>
                <h2 className="allocation-title">BE FIRST. STAY DIFFERENT.</h2>
                <p className="allocation-text">
                  A first release that sets the tone for everything to come. Subscribe to receive private allocation access for future drops and structural studies.
                </p>
              </div>

              <form onSubmit={handleAllocationSubmit} className="allocation-form">
                <input
                  type="email"
                  placeholder="ENTER EMAIL FOR ALLOCATION"
                  value={allocationEmail}
                  onChange={(e) => setAllocationEmail(e.target.value)}
                  required
                  className="allocation-input"
                />
                <button type="submit" className="allocation-submit-btn">
                  REQUEST ALLOCATION ↗
                </button>
              </form>

              {allocationStatus && (
                <p className="allocation-success-note">{allocationStatus}</p>
              )}

              <div className="allocation-footer-tag">
                <span>MADE TO BE WORN. BUILT TO BE REMEMBERED.</span>
              </div>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}
