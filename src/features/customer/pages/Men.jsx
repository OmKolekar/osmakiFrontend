import React from "react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import MenHeader from "../components/men/MenHeader";
import MenView from "../components/men/MenView";
import ComingSoon from "../components/shared/ComingSoon";
import { COMING_SOON_CONFIG } from "../config/comingSoonConfig";
import { useProducts } from "../hooks/useProducts";
import "../styles/collection.css";

// COMING SOON TOGGLE:
// Set to false (or update COMING_SOON_CONFIG.men) to restore the original components and view.
const SHOW_COMING_SOON = COMING_SOON_CONFIG.men;

export default function Men() {
  // Original products hook preserved intact
  const { products, loading, error } = useProducts("Men");

  return (
    <div className="collection-page">
      <Navbar />

      {SHOW_COMING_SOON ? (
        <ComingSoon
          categoryTitle="Men's Collection"
          badge="COMING SOON"
          subtitle="Refined Curation in Progress"
          message="We are currently curating an exceptional collection tailored with precision, craftsmanship, and timeless elegance. Something extraordinary is being prepared for you."
          gentleNote="We look forward to welcoming you soon. In the meantime, you are warmly invited to explore our latest arrivals on the home page."
        />
      ) : (
        /* --- ORIGINAL COMPONENTS (PRESERVED) --- */
        <>
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
        </>
      )}

      <Footer />
    </div>
  );
}
