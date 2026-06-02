import React from "react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import "../styles/staticPages.css";

export default function PrivacyPolicy() {
  return (
    <div className="static-page-wrapper">
      <Navbar />

      <header className="static-page-header">
        <span className="static-page-subtitle">Legal & Safety</span>
        <h1>Privacy Policy</h1>
      </header>

      <main className="static-page-content">
        <p style={{ fontStyle: "italic", color: "#666", marginBottom: "30px", fontFamily: "Inter, sans-serif" }}>
          Last Updated: May 28, 2026
        </p>

        <section className="static-page-section">
          <h2>1. Introduction</h2>
          <p>
            At OSMAKI, we respect your privacy and are committed to protecting the personal data you share with us. This Privacy Policy details how we collect, process, secure, and share your personal information when you visit or make a purchase from our apparel storefront.
          </p>
        </section>

        <section className="static-page-section">
          <h2>2. Information We Collect</h2>
          <p>
            We collect several categories of information to provide you with a premium, seamless shopping experience:
          </p>
          <ul>
            <li>
              <strong>Personal Identifiers:</strong> Name, shipping address, billing address, phone number, and email address.
            </li>
            <li>
              <strong>Transaction Information:</strong> Details about the clothing and apparel you view, place in your cart, and purchase, as well as payment details (processed securely through encrypted third-party payment gateways).
            </li>
            <li>
              <strong>Device & Connection Data:</strong> IP address, browser type, operating system, and browsing behavior on our site, collected via cookies and tracking pixels.
            </li>
          </ul>
        </section>

        <section className="static-page-section">
          <h2>3. How We Use Your Information</h2>
          <p>
            We process your personal information based on legitimate business interests, including:
          </p>
          <ul>
            <li>Processing and fulfilling your apparel orders, including sending shipping notifications and handling returns or sizing exchanges.</li>
            <li>Detecting and preventing potential fraud or security risks.</li>
            <li>Providing tailored clothing recommendations, fit estimations, and styling suggestions that match your preferences.</li>
            <li>Sending marketing communications and promotional offers, which you can opt-out of at any time.</li>
          </ul>
        </section>

        <section className="static-page-section">
          <h2>4. Data Sharing & Third Parties</h2>
          <p>
            We do not sell your personal data. We only share information with trusted third-party service providers who assist us in operating our storefront:
          </p>
          <ul>
            <li><strong>Payment Processors:</strong> To securely authorize and capture payments.</li>
            <li><strong>Fulfillment & Logistics Partners:</strong> To package and ship your garments to your delivery address.</li>
            <li><strong>Analytics & Advertising Partners:</strong> To help us understand customer behavior and optimize our digital presence.</li>
          </ul>
        </section>

        <section className="static-page-section">
          <h2>5. Your Rights</h2>
          <p>
            Depending on your location, you may have rights regarding your personal information, including the right to access, correct, delete, or limit the use of your data. If you wish to exercise any of these rights, please reach out to us at <strong>privacy@osmaki.com</strong>.
          </p>
        </section>

        <section className="static-page-section">
          <h2>6. Updates to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time to reflect changes in our operational, legal, or regulatory requirements. Any updates will be posted on this page with the modified "Last Updated" date.
          </p>
        </section>
      </main>

      <Footer />
    </div>
  );
}
