import React from "react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import "../styles/staticPages.css";

export default function TermsConditions() {
  return (
    <div className="static-page-wrapper">
      <Navbar />

      <header className="static-page-header">
        <span className="static-page-subtitle"></span>
        <h1>Terms & Conditions</h1>
      </header>

      <main className="static-page-content">
        <p style={{ fontStyle: "italic", color: "#666", marginBottom: "30px", fontFamily: "Inter, sans-serif" }}>
          Last Updated: May 28, 2026
        </p>

        <section className="static-page-section">
          <h2>1. Overview</h2>
          <p>
            Welcome to OSMAKI. This website is operated by OSMAKI Design Studios LLC. Throughout the site, the terms "we", "us" and "our" refer to OSMAKI. By visiting our site and/or purchasing products from us, you engage in our "Service" and agree to be bound by the following terms and conditions.
          </p>
        </section>

        <section className="static-page-section">
          <h2>2. Eligibility & Account Responsibilities</h2>
          <p>
            By agreeing to these Terms & Conditions, you represent that you are at least the age of majority in your state or province of residence. If you create an account on our platform, you are solely responsible for maintaining the confidentiality of your credentials and restrict access to your account.
          </p>
        </section>

        <section className="static-page-section">
          <h2>3. Intellectual Property Rights</h2>
          <p>
            All content on this website, including but not limited to text, graphics, logos, images, clothing designs, styling guides, digital downloads, and data compilations, is the property of OSMAKI or its content suppliers and is protected by international copyright, trademark, and intellectual property laws.
          </p>
        </section>

        <section className="static-page-section">
          <h2>4. Products & Pricing</h2>
          <p>
            We reserve the right to modify the prices of our premium apparel products or discontinue any design at any time without notice. We make every effort to display as accurately as possible the colors, textures, and measurements of our garments that appear on our storefront, but cannot guarantee your device's screen will accurately reflect the physical item's shade.
          </p>
        </section>

        <section className="static-page-section">
          <h2>5. Prohibited Uses</h2>
          <p>
            In addition to other prohibitions set forth in these Terms, you are prohibited from using the site or its content:
          </p>
          <ul>
            <li>For any unlawful purpose or to solicit others to perform unlawful acts.</li>
            <li>To infringe upon or violate our intellectual property rights or the rights of others.</li>
            <li>To submit false or misleading information.</li>
            <li>To upload or transmit viruses, malware, or any other type of malicious code that will disrupt the service.</li>
          </ul>
        </section>

        <section className="static-page-section">
          <h2>6. Product Care & Disclaimers</h2>
          <p>
            Our garments are crafted from organic and premium natural fibers, including organic linen, organic cotton, and delicate wool. To maintain the longevity and texture of your clothing, please follow the specific wash and care instructions printed on the inner garment label. OSMAKI shall not be held liable for shrinking, color bleeding, or fabric degradation resulting from improper washing, dry cleaning, or ironing techniques.
          </p>
        </section>

        <section className="static-page-section">
          <h2>7. Governing Law</h2>
          <p>
            These Terms & Conditions and any separate agreements whereby we provide you Services shall be governed by and construed in accordance with the laws of the State of New York, United States, without regard to its conflict of law principles.
          </p>
        </section>
      </main>

      <Footer />
    </div>
  );
}
