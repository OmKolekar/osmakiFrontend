import { useState } from "react";
import { Link } from "react-router-dom";
import "../../styles/footer.css";
import { FaInstagram } from "react-icons/fa";

export default function Footer() {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      alert(`Thank you for subscribing, ${email}!`);
      setEmail("");
    }
  };

  return (
    <footer className="footer">
      <div className="footer-inner">
        {/* Brand Section */}
        <div className="footer-brand">
          <Link to="/" className="footer-logo">
            𝓞SMAKÌ
          </Link>
          <p className="footer-desc">
            Premium sustainable apparel, crafted with organic fabrics and high-quality tailoring to elevate your everyday modern wardrobe.
          </p>
          <div className="footer-socials">
<a
  href="https://instagram.com/osmaki.in/"
  target="_blank"
  rel="noreferrer"
  className="footer-social-link"
>
  <FaInstagram className="instagram-icon" />
  Instagram
</a>            {/* <a href="https://facebook.com" target="_blank" rel="noreferrer" className="footer-social-link">Facebook</a>
            <a href="https://pinterest.com" target="_blank" rel="noreferrer" className="footer-social-link">Pinterest</a> */}
          </div>
        </div>

        {/* Shop Navigation */}
        <div className="footer-column">
          <h3 className="footer-title">Shop</h3>
          <ul className="footer-links">
            <li>
              <Link to="/men" className="footer-link">Men</Link>
            </li>
            <li>
              <Link to="/women" className="footer-link">Women</Link>
            </li>
            <li>
              <Link to="/trending" className="footer-link">Trending</Link>
            </li>
          </ul>
        </div>

        {/* Company & Support */}
        <div className="footer-column">
          <h3 className="footer-title">Company</h3>
          <ul className="footer-links">
            <li>
              <Link to="/about-us" className="footer-link">Our Story</Link>
            </li>
            <li>
              <Link to="/contact-us" className="footer-link">Contact Us</Link>
            </li>
            <li>
              <Link to="/shipping-policy" className="footer-link">Shipping Policy</Link>
            </li>
            <li>
              <Link to="/refund-policy" className="footer-link">Refund Policy</Link>
            </li>
          </ul>
        </div>

        {/* Newsletter Section */}
        <div className="footer-newsletter">
          <h3 className="footer-title">Newsletter</h3>
          <p className="footer-newsletter-text">
            Subscribe to receive styling guides, clean skincare updates, and 10% off your first order.
          </p>
          <form onSubmit={handleSubscribe} className="footer-newsletter-form">
            <div className="footer-input-group">
              <input
                type="email"
                placeholder="Enter your email"
                className="footer-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button type="submit" className="footer-submit-btn">
                Join
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="footer-bottom">
        <div className="footer-copyright">
          © {new Date().getFullYear()} OSMAKI. All rights reserved.
        </div>
        <div className="footer-bottom-links">
          <Link to="/privacy-policy" className="footer-bottom-link">Privacy Policy</Link>
          <Link to="/terms-conditions" className="footer-bottom-link">Terms & Conditions</Link>
        </div>
      </div>
    </footer>
  );
}
