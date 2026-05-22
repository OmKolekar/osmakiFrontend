import { Link } from "react-router-dom";
import { useCart } from "../../../context/CartContext";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import "../styles/cart.css";

export default function Cart() {
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
        <header className="cart-header">
          <h1 className="cart-title">Shopping Cart</h1>
        </header>

        {/* Left Column: Cart Items */}
        <div className="cart-items-list">
          {cartItems.map((item) => (
            <div key={item.id} className="cart-item">
              <div className="cart-item-image-wrapper">
                <img src={item.image} alt={item.name} className="cart-item-image" />
              </div>

              <div className="cart-item-details">
                <div className="cart-item-meta">
                  <Link to={`/product/${item.id}`} className="cart-item-name">
                    {item.name}
                  </Link>
                  <span className="cart-item-category">
                    {item.brand || "OSMAKI"}
                  </span>
                </div>

                <div className="cart-item-row">
                  {/* Custom elegant quantity selector */}
                  <div className="quantity-selector">
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

                  <p className="cart-item-price">₹{item.price * item.quantity}</p>

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

        {/* Right Column: Summary Card */}
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
            onClick={() => alert("Checkout integration coming soon!")}
          >
            Proceed to Checkout
          </button>

          <Link to="/men" className="continue-shopping-link">
            Continue Shopping
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
}
