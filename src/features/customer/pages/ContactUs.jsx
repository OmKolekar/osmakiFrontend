import React, { useState } from "react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import "../styles/staticPages.css";

export default function ContactUs() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.name && formData.email && formData.message) {
      setSubmitted(true);
      // Reset form after a brief simulation
      setTimeout(() => {
        setFormData({ name: "", email: "", subject: "", message: "" });
      }, 500);
    }
  };

  return (
    <div className="static-page-wrapper">
      <Navbar />

      <header className="static-page-header">
        <span className="static-page-subtitle">Get In Touch</span>
        <h1>Contact Us</h1>
      </header>

      <main className="contact-layout">
        {/* Left Column: Contact Info */}
        <section className="contact-info">
          <div className="contact-info-block">
            <h3>Customer Concierge</h3>
            <p>
              For questions regarding garment measurements, sizing advice, style consultations, or shipping and returns assistance, our dedicated concierge team is here to guide you.
            </p>
            <p style={{ marginTop: "10px", fontWeight: 500 }}>
              Email: concierge@osmaki.com<br />
              Phone: +1 (800) 555-OSMA<br />
              Hours: Mon - Fri, 9:00 AM - 6:00 PM EST
            </p>
          </div>

          <div className="contact-info-block">
            <h3>Press & Partnerships</h3>
            <p>
              For editorial inquiries, brand collaborations, or wholesale/retail distribution opportunities:
            </p>
            <p style={{ marginTop: "10px", fontWeight: 500 }}>
              Email: press@osmaki.com
            </p>
          </div>

          <div className="contact-info-block">
            <h3>Atelier & Showroom</h3>
            <p>
              OSMAKI Design Studios LLC<br />
              452 Fifth Avenue, 18th Floor<br />
              New York, NY 10018<br />
              United States
            </p>
          </div>
        </section>

        {/* Right Column: Contact Form */}
        <section className="contact-form-container">
          {submitted ? (
            <div className="submit-success-msg">
              <h3 style={{ fontFamily: "Playfair Display, serif", fontSize: "20px", marginBottom: "10px" }}>Thank You</h3>
              <p>Your message has been successfully received. A member of our concierge team will reach out to you within 24 business hours.</p>
              <button 
                className="submit-button" 
                style={{ marginTop: "20px", width: "auto" }}
                onClick={() => setSubmitted(false)}
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="E.g. Elizabeth Bennet"
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="E.g. elizabeth@example.com"
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="subject">Subject</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="E.g. Sizing Advice / Order Status"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="message">Message</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Describe your inquiry in detail (e.g. height, fit preference, order number)..."
                  className="form-input"
                  required
                ></textarea>
              </div>

              <button type="submit" className="submit-button">
                Send Inquiry
              </button>
            </form>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
