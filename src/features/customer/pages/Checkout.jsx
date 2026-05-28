import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { useCart } from "../context/CartContext";
import { orderApi } from "../api/orderApi";
import { paymentApi } from "../api/paymentApi";
import { couponApi } from "../api/couponApi";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import "../styles/checkout.css";

export default function Checkout() {
  const { user } = useAuth();
  const { cartItems, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate("/login", { state: { from: "/checkout" } });
    }
  }, [user, navigate]);

  // Redirect if cart is empty
  useEffect(() => {
    if (cartItems.length === 0 && !loadingOrder) {
      // Allow them to stay if they just placed an order, otherwise redirect
    }
  }, [cartItems]);

  // Address State
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    recipientName: "",
    phone: "",
    streetAddress: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India",
    isDefault: false,
  });

  // Checkout Options
  const [shippingMethod, setShippingMethod] = useState("standard");
  const [paymentMethod, setPaymentMethod] = useState("online"); // 'online' (Razorpay/Mock) or 'cod'
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);

  // Pricing Summary State
  const [summary, setSummary] = useState({
    subtotal: cartTotal,
    shippingCharge: cartTotal >= 1500 ? 0 : 150,
    discount: 0,
    tax: Math.round(cartTotal * 0.05 * 100) / 100,
    finalAmount: cartTotal + (cartTotal >= 1500 ? 0 : 150) + Math.round(cartTotal * 0.05 * 100) / 100,
  });

  // UI States
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [loadingOrder, setLoadingOrder] = useState(false);
  const [error, setError] = useState("");
  
  // Payment Simulator State
  const [showSimulator, setShowSimulator] = useState(false);
  const [simulatorDetails, setSimulatorDetails] = useState(null);

  // Fetch Addresses on Mount
  useEffect(() => {
    if (user) {
      fetchAddresses();
    }
  }, [user]);

  // Re-calculate Summary when options change
  useEffect(() => {
    if (user && cartItems.length > 0) {
      calculateSummary();
    }
  }, [selectedAddressId, shippingMethod, appliedCoupon, cartItems]);

  const fetchAddresses = async () => {
    try {
      const list = await orderApi.getAddresses(user.id);
      setAddresses(list);
      if (list.length > 0) {
        const def = list.find((a) => a.isDefault) || list[0];
        setSelectedAddressId(def.id);
      } else {
        setShowAddressForm(true);
      }
    } catch (err) {
      console.error("Failed to load addresses:", err);
    }
  };

  const calculateSummary = async () => {
    setLoadingSummary(true);
    try {
      const summaryData = await orderApi.getCheckoutSummary(
        user.id,
        selectedAddressId || null,
        appliedCoupon ? appliedCoupon.code : null,
        shippingMethod
      );
      setSummary(summaryData);
      setError("");
    } catch (err) {
      console.error("Failed to fetch checkout summary:", err);
      setError(err.message || "Failed to update pricing calculations");
    } finally {
      setLoadingSummary(false);
    }
  };

  // Address Submit Handler
  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    try {
      const added = await orderApi.addAddress({
        userId: user.id,
        ...newAddress,
      });
      setAddresses((prev) => [added.address, ...prev]);
      setSelectedAddressId(added.address.id);
      setShowAddressForm(false);
      setNewAddress({
        recipientName: "",
        phone: "",
        streetAddress: "",
        city: "",
        state: "",
        postalCode: "",
        country: "India",
        isDefault: false,
      });
    } catch (err) {
      setError(err.message || "Failed to add address");
    }
  };

  // Coupon Handlers
  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setCouponLoading(true);
    setCouponError("");
    try {
      const validation = await couponApi.validateCoupon(couponCode, summary.subtotal);
      setAppliedCoupon({
        code: validation.code,
        discount: validation.discount,
      });
      setCouponCode("");
    } catch (err) {
      setCouponError(err.message || "Invalid coupon code");
      setAppliedCoupon(null);
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponError("");
  };

  // Load Razorpay Script Dynamically
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // Place Order Action
  const handlePlaceOrder = async () => {
    if (!selectedAddressId) {
      setError("Please select or add a shipping address");
      return;
    }
    setLoadingOrder(true);
    setError("");

    try {
      // 1. Create Pending Order
      const placement = await orderApi.createOrder(
        user.id,
        selectedAddressId,
        appliedCoupon ? appliedCoupon.code : null,
        shippingMethod
      );

      const { orderId } = placement;

      // 2. Create Payment Request
      const gatewayResponse = await paymentApi.createPaymentRequest(orderId);

      if (gatewayResponse.isMock) {
        // Trigger Test Gateway Modal
        setSimulatorDetails(gatewayResponse);
        setShowSimulator(true);
      } else {
        // Trigger Real Razorpay Gateway
        const scriptLoaded = await loadRazorpayScript();
        if (!scriptLoaded) {
          throw new Error("Failed to load Razorpay Payment Gateway. Check network connection.");
        }

        const options = {
          key: gatewayResponse.keyId,
          amount: Math.round(parseFloat(gatewayResponse.amount) * 100), // paise
          currency: "INR",
          name: "OSMAKÌ Botanicals",
          description: `Order Purchase #${orderId.substring(0, 8)}`,
          order_id: gatewayResponse.gatewayOrderId,
          handler: async function (response) {
            try {
              setLoadingOrder(true);
              const verification = await paymentApi.verifyPayment({
                appOrderId: orderId,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpayOrderId: response.razorpay_order_id,
                razorpaySignature: response.razorpay_signature,
              });

              if (verification.success) {
                clearCart();
                navigate(`/order/${orderId}`, { state: { animate: true } });
              }
            } catch (err) {
              setError(err.message || "Payment verification failed");
              setLoadingOrder(false);
            }
          },
          prefill: {
            name: user.name,
            email: user.email,
            contact: user.phone || "",
          },
          theme: {
            color: "#111111",
          },
          modal: {
            ondismiss: function () {
              setLoadingOrder(false);
              setError("Payment cancelled by customer.");
            },
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      }
    } catch (err) {
      setError(err.message || "Order placement failed");
      setLoadingOrder(false);
    }
  };

  // Mock Payment Action Simulation
  const handleSimulatePayment = async (success) => {
    setShowSimulator(false);
    if (!simulatorDetails) return;

    const { appOrderId, gatewayOrderId } = simulatorDetails;

    if (!success) {
      setError("Test payment declined. Order created in PENDING_PAYMENT status.");
      setLoadingOrder(false);
      // Let them view the pending order
      navigate(`/order/${appOrderId}`);
      return;
    }

    try {
      const mockPayload = {
        appOrderId,
        razorpayPaymentId: `pay_mock_${Math.random().toString(36).substring(2, 10)}`,
        razorpayOrderId: gatewayOrderId,
        razorpaySignature: "mock_signature_success",
      };

      const verification = await paymentApi.verifyPayment(mockPayload);
      if (verification.success) {
        clearCart();
        navigate(`/order/${appOrderId}`, { state: { justPlaced: true } });
      }
    } catch (err) {
      setError(err.message || "Simulated payment verification failed");
    } finally {
      setLoadingOrder(false);
    }
  };

  return (
    <div className="checkout-page">
      <Navbar />

      <div className="checkout-container">
        {/* Progress Timeline */}
        <div className="checkout-progress">
          <div className="progress-step active">
            <span className="step-dot"></span>
            <span className="step-text">Cart</span>
          </div>
          <div className="progress-line active"></div>
          <div className="progress-step active">
            <span className="step-dot"></span>
            <span className="step-text">Checkout</span>
          </div>
          <div className="progress-line"></div>
          <div className="progress-step">
            <span className="step-dot"></span>
            <span className="step-text">Payment</span>
          </div>
        </div>

        <div className="checkout-layout">
          {/* Left Column: Form Configurations (70%) */}
          <div className="checkout-forms">
            <h1 className="checkout-main-title">Shipping & Payment</h1>

            {error && <div className="checkout-error-banner">{error}</div>}

            {/* Section 1: Address Manager */}
            <section className="checkout-section">
              <h2 className="section-title">1. Delivery Address</h2>

              {!showAddressForm ? (
                <div className="address-selector-block">
                  {addresses.map((addr) => (
                    <label
                      key={addr.id}
                      className={`address-card-label ${selectedAddressId === addr.id ? "selected" : ""}`}
                    >
                      <input
                        type="radio"
                        name="selectedAddress"
                        value={addr.id}
                        checked={selectedAddressId === addr.id}
                        onChange={() => setSelectedAddressId(addr.id)}
                        className="address-radio"
                      />
                      <div className="address-card-content">
                        <div className="address-card-header">
                          <span className="recipient-name">{addr.recipientName}</span>
                          {addr.isDefault && <span className="default-pill">Default</span>}
                        </div>
                        <p className="address-detail">{addr.streetAddress}</p>
                        <p className="address-detail">
                          {addr.city}, {addr.state} - <strong>{addr.postalCode}</strong>
                        </p>
                        <p className="address-phone">Phone: {addr.phone}</p>
                      </div>
                    </label>
                  ))}

                  <button
                    type="button"
                    className="add-address-trigger-btn"
                    onClick={() => setShowAddressForm(true)}
                  >
                    + Add New Shipping Address
                  </button>
                </div>
              ) : (
                <form onSubmit={handleAddressSubmit} className="address-form-grid">
                  <div className="form-row span-2">
                    <input
                      type="text"
                      placeholder="Recipient Full Name"
                      required
                      value={newAddress.recipientName}
                      onChange={(e) => setNewAddress({ ...newAddress, recipientName: e.target.value })}
                      className="checkout-input"
                    />
                  </div>
                  <div className="form-row">
                    <input
                      type="tel"
                      placeholder="Phone Number"
                      required
                      value={newAddress.phone}
                      onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                      className="checkout-input"
                    />
                  </div>
                  <div className="form-row">
                    <input
                      type="text"
                      placeholder="Postal / ZIP Code"
                      required
                      value={newAddress.postalCode}
                      onChange={(e) => setNewAddress({ ...newAddress, postalCode: e.target.value })}
                      className="checkout-input"
                    />
                  </div>
                  <div className="form-row span-2">
                    <input
                      type="text"
                      placeholder="Street Address, Apartment, Suite"
                      required
                      value={newAddress.streetAddress}
                      onChange={(e) => setNewAddress({ ...newAddress, streetAddress: e.target.value })}
                      className="checkout-input"
                    />
                  </div>
                  <div className="form-row">
                    <input
                      type="text"
                      placeholder="City"
                      required
                      value={newAddress.city}
                      onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                      className="checkout-input"
                    />
                  </div>
                  <div className="form-row">
                    <input
                      type="text"
                      placeholder="State"
                      required
                      value={newAddress.state}
                      onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                      className="checkout-input"
                    />
                  </div>
                  <div className="form-row span-2 default-checkbox-row">
                    <label className="checkbox-container">
                      <input
                        type="checkbox"
                        checked={newAddress.isDefault}
                        onChange={(e) => setNewAddress({ ...newAddress, isDefault: e.target.checked })}
                      />
                      <span>Make this my default shipping address</span>
                    </label>
                  </div>
                  <div className="form-actions span-2">
                    <button type="submit" className="save-address-btn">
                      Save Address
                    </button>
                    {addresses.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setShowAddressForm(false)}
                        className="cancel-address-btn"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              )}
            </section>

            {/* Section 2: Shipping Method */}
            <section className="checkout-section">
              <h2 className="section-title">2. Shipping Method</h2>
              <div className="shipping-options-grid">
                <label className={`shipping-option-card ${shippingMethod === "standard" ? "selected" : ""}`}>
                  <input
                    type="radio"
                    name="shippingMethod"
                    value="standard"
                    checked={shippingMethod === "standard"}
                    onChange={() => setShippingMethod("standard")}
                    className="shipping-radio"
                  />
                  <div className="shipping-option-info">
                    <div className="shipping-option-header">
                      <span className="option-name">Standard Delivery</span>
                      <span className="option-price">{summary.subtotal >= 1500 ? "FREE" : "₹150"}</span>
                    </div>
                    <span className="option-duration">Delivered in 4 - 6 business days.</span>
                  </div>
                </label>

                <label className={`shipping-option-card ${shippingMethod === "express" ? "selected" : ""}`}>
                  <input
                    type="radio"
                    name="shippingMethod"
                    value="express"
                    checked={shippingMethod === "express"}
                    onChange={() => setShippingMethod("express")}
                    className="shipping-radio"
                  />
                  <div className="shipping-option-info">
                    <div className="shipping-option-header">
                      <span className="option-name">Express Dispatch</span>
                      <span className="option-price">₹250</span>
                    </div>
                    <span className="option-duration">Delivered in 1 - 2 business days.</span>
                  </div>
                </label>
              </div>
            </section>

            {/* Section 3: Payment Method */}
            <section className="checkout-section">
              <h2 className="section-title">3. Payment Method</h2>
              <div className="payment-options-grid">
                <label className={`payment-option-card ${paymentMethod === "online" ? "selected" : ""}`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="online"
                    checked={paymentMethod === "online"}
                    onChange={() => setPaymentMethod("online")}
                    className="payment-radio"
                  />
                  <div className="payment-option-info">
                    <span className="payment-name">UPI / Card / NetBanking / Wallet</span>
                    <span className="payment-desc">Pay securely using UPI, Debit/Credit Card, or Wallets</span>
                  </div>
                </label>
              </div>
            </section>

            {/* Section 4: Cart Items Review */}
            <section className="checkout-section">
              <h2 className="section-title">4. Review Cart Items</h2>
              <div className="checkout-items-preview">
                {cartItems.map((item) => (
                  <div key={item.id} className="checkout-preview-item">
                    <img src={item.image} alt={item.name} className="preview-item-img" />
                    <div className="preview-item-info">
                      <h4 className="preview-item-name">{item.name}</h4>
                      <p className="preview-item-variant">
                        {item.selectedSize && <span>Size: <strong>{item.selectedSize}</strong></span>}
                        {item.selectedColor && <span>Color: <strong>{item.selectedColor}</strong></span>}
                      </p>
                      <p className="preview-item-qty">Qty: {item.quantity}</p>
                    </div>
                    <span className="preview-item-price">₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Right Column: Checkout Summary (30%) */}
          <div className="checkout-summary-sidebar">
            <div className="checkout-summary-card">
              <h3 className="summary-card-title">Order Summary</h3>

              {/* Coupon Section */}
              <div className="coupon-card-section">
                {!appliedCoupon ? (
                  <div className="coupon-input-group">
                    <input
                      type="text"
                      placeholder="Enter Coupon (e.g. WELCOME10)"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      className="coupon-field"
                      disabled={couponLoading}
                    />
                    <button
                      type="button"
                      onClick={handleApplyCoupon}
                      className="coupon-apply-btn"
                      disabled={couponLoading}
                    >
                      {couponLoading ? "..." : "Apply"}
                    </button>
                  </div>
                ) : (
                  <div className="applied-coupon-pill">
                    <div className="coupon-pill-text">
                      <span className="coupon-icon">✓</span>
                      <span>Coupon <strong>{appliedCoupon.code}</strong> applied</span>
                    </div>
                    <button type="button" onClick={handleRemoveCoupon} className="coupon-remove-btn">
                      ✕
                    </button>
                  </div>
                )}
                {couponError && <p className="coupon-error-txt">{couponError}</p>}
              </div>

              <div className="summary-breakdowns">
                <div className="summary-line">
                  <span>Subtotal</span>
                  <span>₹{summary.subtotal}</span>
                </div>
                {summary.discount > 0 && (
                  <div className="summary-line discount">
                    <span>Discount</span>
                    <span>-₹{summary.discount}</span>
                  </div>
                )}
                <div className="summary-line">
                  <span>Shipping</span>
                  <span>{summary.shippingCharge === 0 ? "Free" : `₹${summary.shippingCharge}`}</span>
                </div>
                <div className="summary-line">
                  <span>Estimated Tax (5%)</span>
                  <span>₹{summary.tax}</span>
                </div>
                <div className="summary-line total">
                  <span>Total</span>
                  <span>₹{summary.finalAmount}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handlePlaceOrder}
                disabled={loadingOrder || loadingSummary || showAddressForm}
                className="place-order-cta"
              >
                {loadingOrder ? "Processing..." : `Place Order (₹${summary.finalAmount})`}
              </button>
              
              <Link to="/cart" className="back-to-cart-link">
                ← Modify Shopping Cart
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Test Payment Gateway Simulator Modal */}
      {showSimulator && simulatorDetails && (
        <div className="simulator-overlay">
          <div className="simulator-modal">
            <div className="simulator-header">
              <span className="simulator-logo">𝓞SMAKÌ Payment Gate</span>
              <span className="simulator-badge">Test Mode</span>
            </div>
            
            <div className="simulator-content">
              <h3>Simulated Payment Processing</h3>
              <p className="simulator-info">
                You are checking out in <strong>Test Sandbox Mode</strong> because no production API keys were detected in the backend `.env`.
              </p>
              
              <div className="simulator-transaction-card">
                <div className="sim-row">
                  <span>Order Reference:</span>
                  <strong>#{simulatorDetails.appOrderId.substring(0, 8)}</strong>
                </div>
                <div className="sim-row">
                  <span>Mock Gateway Order:</span>
                  <span>{simulatorDetails.gatewayOrderId}</span>
                </div>
                <div className="sim-row">
                  <span>Total Charge:</span>
                  <strong className="sim-amount">₹{simulatorDetails.amount}</strong>
                </div>
              </div>

              <div className="simulator-select-payment">
                <p>Select Simulated Transaction Resolution:</p>
                <div className="simulator-actions-column">
                  <button
                    type="button"
                    onClick={() => handleSimulatePayment(true)}
                    className="simulator-btn success"
                  >
                    Simulate Successful Transaction (Confirm Order)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSimulatePayment(false)}
                    className="simulator-btn failure"
                  >
                    Simulate Payment Declined / Cancelled (Pending Status)
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
