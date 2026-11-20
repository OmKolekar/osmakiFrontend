import React from "react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import "../styles/staticPages.css";

export default function AboutUs() {
  return (
    <div className="static-page-wrapper">
      <Navbar />

      <header className="static-page-header">
        <span className="static-page-subtitle"></span>
        <h1>Our Story</h1>
      </header>

      <main className="static-page-content">
        <section className="static-page-section">
          <h2>The Genesis of OSMAKI</h2>
          <p>
            OSMAKI was born out of a simple yet profound realization: that luxury fashion does not have to come at the expense of our planet. Inspired by the natural textures of raw fibers and the timeless beauty of minimalist design, we set out to create a modern clothing brand that bridges the gap between high-end tailoring and ecological responsibility.
          </p>
          <p>
            Founded by a collective of designers and textile experts, OSMAKI began with a clear mission—to engineer garments that offer exceptional fit and longevity without compromising on ethical sourcing or fabric integrity.
          </p>
        </section>

        <section className="static-page-section">
          <h2>Our Philosophy: Mindful Tailoring</h2>
          <p>
            We believe that clothing is an extension of one's identity. Every piece we design is an intentional blend of organic materials, premium stitching, and classic silhouettes that are built to last beyond seasonal trends.
          </p>
          <p>
            We reject the disposable nature of fast fashion. From selecting certified organic cotton and Belgian linen to sourcing recycled wool and biodegradable buttons, we ensure that every detail of our garments is curated for maximum comfort and minimal environmental footprint.
          </p>
        </section>

        <section className="static-page-section">
          <h2>Our Core Values</h2>
          <div className="story-values-grid">
            <div className="value-card">
              <h3>100% Certified Organic Fabrics</h3>
              <p>
                We source only GOTS-certified organic cotton, linen, and hemp, cultivated without synthetic pesticides or excessive water consumption.
              </p>
            </div>
            <div className="value-card">
              <h3>Exceptional Craftsmanship</h3>
              <p>
                Every seam, buttonhole, and lining is designed with precision. We partner with artisan workshops to ensure that our garments stand the test of time.
              </p>
            </div>
            <div className="value-card">
              <h3>Ethical Production</h3>
              <p>
                We partner exclusively with fair-trade certified manufacturing facilities. We guarantee safe working environments, fair living wages, and respect for all makers.
              </p>
            </div>
            <div className="value-card">
              <h3>Circular Fashion</h3>
              <p>
                To honor our commitment to the circular economy, we use biodegradable fibers and offer a garment recycling program to minimize landfill waste.
              </p>
            </div>
          </div>
        </section>

        <section className="static-page-section" style={{ textAlign: "center", marginTop: "60px" }}>
          <h2 style={{ borderLeft: "none", paddingLeft: 0, fontStyle: "italic" }}>"Timeless design, crafted for the future."</h2>
          <p style={{ maxWidth: "600px", margin: "20px auto 0 auto", color: "#666" }}>
            Welcome to OSMAKI. We invite you to experience the comfort and elegance of pure, high-performance sustainable apparel.
          </p>
        </section>
      </main>

      <Footer />
    </div>
  );
}
