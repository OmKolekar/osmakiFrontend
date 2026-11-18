import React from "react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import TrendingHeader from "../components/trending/TrendingHeader";
import TrendingView from "../components/trending/TrendingView";
import ComingSoon from "../components/shared/ComingSoon";
import { COMING_SOON_CONFIG } from "../config/comingSoonConfig";
import { useProducts } from "../hooks/useProducts";
import "../styles/trending.css";
import "../styles/collection.css";

// COMING SOON TOGGLE:
// Set to false (or update COMING_SOON_CONFIG.trending) to restore the original components and view.
const SHOW_COMING_SOON = COMING_SOON_CONFIG.trending;

export default function Trending() {
  // Original products hook preserved intact
  const { products, loading, error } = useProducts(null, true);

  return (
    <div className="trending-page">
      <Navbar />

      {SHOW_COMING_SOON ? (
        <ComingSoon
          categoryTitle="Trending Now"
          badge="COMING SOON"
          subtitle="The Latest Highlights"
          message="We are curating the season's most coveted styles and standout pieces. Our trending collection is being refreshed to bring you distinct inspiration."
          gentleNote="New arrivals are just around the corner. Thank you for your continued patience and curiosity."
        />
      ) : (
        /* --- ORIGINAL COMPONENTS (PRESERVED) --- */
        <>
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
        </>
      )}

      <Footer />
    </div>
  );
}
