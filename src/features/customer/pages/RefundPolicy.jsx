import React from "react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import "../styles/staticPages.css";

export default function RefundPolicy() {
  return (
    <div className="static-page-wrapper">
      <Navbar />

      <header className="static-page-header">
        <span className="static-page-subtitle">Customer Care</span>
        <h1>Refund Policy</h1>
      </header>

      <main className="static-page-content">
        <p style={{ fontStyle: "italic", color: "#666", marginBottom: "30px", fontFamily: "Inter, sans-serif" }}>
          Last Updated: May 28, 2026
        </p>

        <section className="static-page-section">
          <h2>Our Apparel Guarantee</h2>
          <p>
            We want you to love your OSMAKI garments. We believe in the quality of our organic fabrics and tailoring, but we understand that finding the perfect fit is essential. If you are not completely satisfied with your purchase, we are here to support your returns and exchanges.
          </p>
        </section>

        <section className="static-page-section">
          <h2>Returns Within 30 Days</h2>
          <p>
            We accept returns on clothing items within <strong>30 days</strong> of the delivery date. To be eligible for a full refund back to the original method of payment, garments must meet the following criteria:
          </p>
          <ul>
            <li>Items must be in their original, unworn, unwashed, and undamaged condition.</li>
            <li>All original hangtags, barcode labels, and brand packaging must be fully attached.</li>
            <li>Free from makeup, perfume, deodorants, or any signs of wear.</li>
          </ul>
          <p>
            Please note that items marked as final sale or promotional gifts are not eligible for returns or exchanges.
          </p>
        </section>

        <section className="static-page-section">
          <h2>How to Initiate a Return</h2>
          <p>
            To start your return process, please follow these steps:
          </p>
          <ol>
            <li>Contact our customer concierge team at <strong>concierge@osmaki.com</strong> with your order number and the name of the garment you wish to return.</li>
            <li>Once approved, we will email you a pre-paid return shipping label and instructions on where to send your package.</li>
            <li>Pack the item securely (preferably in its original packaging) and drop it off at the designated carrier location.</li>
          </ol>
        </section>

        <section className="static-page-section">
          <h2>Damaged or Defective Garments</h2>
          <p>
            If you receive a garment that is damaged, defective, or incorrect, please notify us within <strong>48 hours</strong> of delivery at <strong>concierge@osmaki.com</strong>. Please include photos of the damaged seams or defects so we can expedite a free replacement or store credit.
          </p>
        </section>

        <section className="static-page-section">
          <h2>Processing & Refund Timeline</h2>
          <p>
            Once your return package is received at our design studio and inspected for eligibility, we will send you an email confirmation. Approved refunds will be credited back to your original payment method within <strong>5 to 10 business days</strong>, depending on your financial institution.
          </p>
        </section>

        <section className="static-page-section">
          <h2>Exchanges & Sizing Swaps</h2>
          <p>
            To exchange an item for a different size or color, we recommend initiating a return for the original garment and placing a new order through our storefront to ensure the desired size is in stock.
          </p>
        </section>
      </main>

      <Footer />
    </div>
  );
}
