import React from "react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import "../styles/staticPages.css";

export default function ShippingPolicy() {
  return (
    <div className="static-page-wrapper">
      <Navbar />

      <header className="static-page-header">
        <span className="static-page-subtitle"></span>
        <h1>Shipping Policy</h1>
      </header>

      <main className="static-page-content">
        <p style={{ fontStyle: "italic", color: "#666", marginBottom: "30px", fontFamily: "Inter, sans-serif" }}>
          Last Updated: May 28, 2026
        </p>

        <section className="static-page-section">
          <h2>Our Carbon-Neutral Shipping</h2>
          <p>
            At OSMAKI, our commitment to natural beauty extends to how we treat the earth. We are proud to partner with eco-conscious couriers to ensure that every single shipment leaving our design studios is <strong>100% carbon-neutral</strong>. Through carbon offsets, we invest in reforestation and clean energy projects to neutralize the environmental impact of your garment deliveries.
          </p>
        </section>

        <section className="static-page-section">
          <h2>Order Processing Times</h2>
          <p>
            All orders are processed and prepared for shipping within <strong>1 to 2 business days</strong>. Orders placed before 1:00 PM EST Monday through Friday will be processed the same day. Orders placed on weekends or major holidays will begin processing on the following business day.
          </p>
        </section>

        <section className="static-page-section">
          <h2>Shipping Rates & Delivery Estimates</h2>
          <p>
            We offer complimentary standard shipping on all domestic orders over $75.
          </p>
          <ul>
            <li><strong>Standard Shipping:</strong> 3-6 business days. Free for orders over $75, or a flat fee of $6.95.</li>
            <li><strong>Express Shipping:</strong> 2-3 business days. Flat fee of $14.95.</li>
            <li><strong>Overnight Delivery:</strong> Next business day (order must be placed by 11:00 AM EST). Flat fee of $29.95.</li>
          </ul>
        </section>

        <section className="static-page-section">
          <h2>Tracking Your Order</h2>
          <p>
            As soon as your package has been picked up by our courier, you will receive a shipping confirmation email containing your tracking link and carrier details. Please allow up to 24 hours for tracking information to update.
          </p>
        </section>

        <section className="static-page-section">
          <h2>International Shipping</h2>
          <p>
            We currently ship to Canada, Europe, Australia, and select parts of Asia. International shipping rates are calculated at checkout based on package weight and destination. Please note that customs, duties, and local taxes are the responsibility of the customer and are collected at delivery.
          </p>
        </section>

        <section className="static-page-section">
          <h2>Eco-Packaging Commitment</h2>
          <p>
            To keep our footprint as light as possible, your clothing items will arrive in fully recyclable shipping boxes made from post-consumer waste, wrapped in acid-free tissue paper. Our protective dust bags are made from organic cotton and are reusable. We encourage you to reuse, recycle, or compost all packaging elements.
          </p>
        </section>
      </main>

      <Footer />
    </div>
  );
}
