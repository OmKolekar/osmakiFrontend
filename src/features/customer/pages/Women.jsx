import React from "react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import WomenHeader from "../components/women/WomenHeader";
import WomenView from "../components/women/WomenView";
import ComingSoon from "../components/shared/ComingSoon";
import { COMING_SOON_CONFIG } from "../config/comingSoonConfig";
import { useProducts } from "../hooks/useProducts";
import "../styles/collection.css";

// COMING SOON TOGGLE:
// Set to false (or update COMING_SOON_CONFIG.women) to restore the original components and view.
const SHOW_COMING_SOON = COMING_SOON_CONFIG.women;

export default function Women() {
  // Original products hook preserved intact
  const { products, loading, error } = useProducts("Women");

  return (
    <div className="collection-page">
      <Navbar />

      {SHOW_COMING_SOON ? (
        <ComingSoon
          categoryTitle="Women's Collection"
          badge="COMING SOON"
          subtitle="Grace & Elegance Unfolding"
          message="Our upcoming women's collection is being crafted with gentle grace, modern silhouettes, and thoughtful luxury. We look forward to sharing these pieces with you very soon."
          gentleNote="Thank you for your patience and gentle anticipation. In the meantime, you are warmly invited to explore our latest arrivals on the home page."
        />
      ) : (
        /* --- ORIGINAL COMPONENTS (PRESERVED) --- */
        <>
          <WomenHeader />

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
              <WomenView products={products} />
            )}
          </div>
        </>
      )}

      <Footer />
    </div>
  );
}
