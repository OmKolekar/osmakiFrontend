import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import "../styles/cart.css";

export default function Cart() {
  const navigate = useNavigate();
  const { cartItems, updateQuantity, removeFromCart, cartTotal } = useCart();

  const tax = Math.round(cartTotal * 0.05); // 5% mock tax
  const shipping = cartTotal > 1500 || cartTotal === 0 ? 0 : 150; // free shipping over 1500
  const grandTotal = cartTotal + tax + shipping;

  if (cartItems.length === 0) {
    return (
      <div className="cart-page">
        <Navbar />
        <div className="empty-cart-view">
          <h2 className="empty-cart-title">Your Cart is Empty</h2>
          <p className="empty-cart-text">
            Explore our botanical formulations and find the perfect products for your skincare routine.
          </p>
          <Link to="/men" className="empty-cart-btn">
            Explore Collection
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="cart-page">
      <Navbar />

      <div className="cart-container">
        {/* Progress Indicator */}
        <div className="cart-progress-bar">
          <div className="progress-step active">
            <span className="step-dot"></span>
            <span className="step-text">Cart</span>
          </div>
          <div className="progress-line active"></div>
          <div className="progress-step">
            <span className="step-dot"></span>
            <span className="step-text">Shipping</span>
          </div>
          <div className="progress-line"></div>
          <div className="progress-step">
            <span className="step-dot"></span>
            <span className="step-text">Payment</span>
          </div>
        </div>

        <header className="cart-header">
          <h1 className="cart-title">Your Cart</h1>
        </header>

        <div className="cart-content-layout">
          {/* Left Column: Cart Items (70% width) */}
          <div className="cart-items-list">
            {cartItems.map((item) => (
              <div key={item.id} className="cart-item">
                <div className="cart-item-image-wrapper">
                  <img src={item.image} alt={item.name} className="cart-item-image" />
                </div>

                <div className="cart-item-details">
                  <div className="cart-item-meta">
                    <div className="cart-item-header-row">
                      <Link to={`/product/${item.productId || item.id}`} className="cart-item-name">
                        {item.name}
                      </Link>
                      <span className="cart-item-brand">{item.brand || "OSMAKI"}</span>
                    </div>
                    {(item.selectedColor || item.selectedSize) && (
                      <div className="cart-item-variant">
                        {item.selectedColor && <span>Color: <strong>{item.selectedColor}</strong></span>}
                        {item.selectedSize && <span>Size: <strong>{item.selectedSize}</strong></span>}
                      </div>
                    )}
                  </div>

                  <div className="cart-item-row">
                    {/* Capsule quantity selector */}
                    <div className="quantity-selector-capsule">
                      <button
                        className="qty-btn"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        −
                      </button>
                      <span className="qty-val">{item.quantity}</span>
                      <button
                        className="qty-btn"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        +
                      </button>
                    </div>

                    <div className="cart-item-price-container" style={{ textAlign: "right" }}>
                      <p className="cart-item-price" style={{ margin: 0 }}>₹{item.price * item.quantity}</p>
                      {item.originalPrice && parseFloat(item.originalPrice) > parseFloat(item.price) && (
                        <span style={{ fontSize: "12px", textDecoration: "line-through", color: "#888", display: "block", marginTop: "2px" }}>
                          ₹{item.originalPrice * item.quantity}
                        </span>
                      )}
                    </div>

                    <button
                      className="cart-item-remove-btn"
                      onClick={() => removeFromCart(item.id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right Column: Sidebar (30% width) */}
          <div className="cart-summary-sidebar">
            <div className="cart-summary-card">
              <h2 className="summary-title">Order Summary</h2>

              <div className="summary-row">
                <span>Subtotal</span>
                <span>₹{cartTotal}</span>
              </div>

              <div className="summary-row">
                <span>Shipping</span>
                <span>{shipping === 0 ? "Free" : `₹${shipping}`}</span>
              </div>

              <div className="summary-row">
                <span>Estimated Tax (5%)</span>
                <span>₹{tax}</span>
              </div>

              <div className="summary-row total">
                <span>Total</span>
                <span>₹{grandTotal}</span>
              </div>

              <button
                className="checkout-btn"
                onClick={() => navigate("/checkout")}
              >
                Proceed to Checkout
              </button>

              <Link to="/men" className="continue-shopping-link">
                Continue Shopping
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="cart-trust-badges">
              <div className="trust-badge">
                <span className="badge-icon">✓</span>
                <span className="badge-text">Secure Checkout</span>
              </div>
              <div className="trust-badge">
                <span className="badge-icon">✓</span>
                <span className="badge-text">Free Returns</span>
              </div>
              <div className="trust-badge">
                <span className="badge-icon">✓</span>
                <span className="badge-text">24h Dispatch</span>
              </div>
              <div className="trust-badge">
                <span className="badge-icon">✓</span>
                <span className="badge-text">Trusted Payments</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
