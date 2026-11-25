import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { orderApi } from "../api/orderApi";
import { shippingApi } from "../api/shippingApi";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import "../styles/orderDetails.css";

export default function OrderDetails() {
  const { orderId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancelling, setCancelling] = useState(false);

  // Live Shiprocket Tracking State
  const [showTrackingModal, setShowTrackingModal] = useState(false);
  const [trackingData, setTrackingData] = useState(null);
  const [trackingLoading, setTrackingLoading] = useState(false);

  const handleTrackLive = async () => {
    setTrackingLoading(true);
    try {
      const res = await shippingApi.trackShipment(orderId);
      setTrackingData(res);
      setShowTrackingModal(true);
    } catch (err) {
      alert(err.message || "Failed to load live tracking details.");
    } finally {
      setTrackingLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    fetchOrderDetails();
  }, [orderId, user]);

  const fetchOrderDetails = async () => {
    setLoading(true);
    try {
      const details = await orderApi.getOrderDetails(orderId);
      setOrder(details);
      setError("");
    } catch (err) {
      console.error("Failed to load order details:", err);
      setError(err.message || "Failed to load order information");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;
    setCancelling(true);
    try {
      await orderApi.cancelOrder(orderId);
      await fetchOrderDetails(); // Reload details
    } catch (err) {
      alert(err.message || "Failed to cancel order");
    } finally {
      setCancelling(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="order-details-page">
        <Navbar />
        <div className="order-loading-view">
          <div className="order-spinner"></div>
          <p>Retrieving your order details...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="order-details-page">
        <Navbar />
        <div className="order-error-view">
          <h2>Order Not Found</h2>
          <p>{error || "We couldn't locate this order in our record."}</p>
          <Link to="/orders" className="back-orders-btn">
            Back to My Orders
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  // Parse address snapshot
  let address = {};
  try {
    address = JSON.parse(order.deliveryAddressSnapshot || "{}");
  } catch (err) {
    console.error("Failed to parse address snapshot:", err);
  }

  // Find successfully captured payment
  const activePayment = order.payments?.find(p => p.status === "CAPTURED") || order.payments?.[0];

  // Helper to determine status color
  const getStatusClass = (status) => {
    switch (status) {
      case "CONFIRMED":
      case "DELIVERED":
        return "status-success";
      case "PENDING_PAYMENT":
      case "INITIATED":
        return "status-warning";
      case "CANCELLED":
      case "PAYMENT_FAILED":
      case "FAILED":
        return "status-danger";
      default:
        return "status-info";
    }
  };

  const formatStatus = (status) => {
    return status.replace(/_/g, " ");
  };

  // Timeline Steps
  const timelineSteps = [
    { label: "Placed", status: "PENDING_PAYMENT", active: true },
    { label: "Confirmed", status: "CONFIRMED", active: ["CONFIRMED", "PACKED", "SHIPPED", "OUT_FOR_DELIVERY", "DELIVERED"].includes(order.status) },
    { label: "Packed", status: "PACKED", active: ["PACKED", "SHIPPED", "OUT_FOR_DELIVERY", "DELIVERED"].includes(order.status) },
    { label: "Shipped", status: "SHIPPED", active: ["SHIPPED", "OUT_FOR_DELIVERY", "DELIVERED"].includes(order.status) },
    { label: "Delivered", status: "DELIVERED", active: order.status === "DELIVERED" }
  ];

  return (
    <div className="order-details-page">
      <Navbar />

      <div className="order-details-container printable-invoice">
        {/* Breadcrumb / Action header */}
        <div className="order-details-header no-print">
          <Link to="/orders" className="back-link">
            ← My Orders
          </Link>
          <div className="header-actions">
            <button onClick={handlePrint} className="action-secondary-btn">
              Download Invoice (PDF)
            </button>
            {["PENDING_PAYMENT", "CONFIRMED"].includes(order.status) && (
              <button
                onClick={handleCancelOrder}
                disabled={cancelling}
                className="action-danger-btn"
              >
                {cancelling ? "Cancelling..." : "Cancel Order"}
              </button>
            )}
          </div>
        </div>

        {/* Order Main Card */}
        <div className="order-main-summary-card">
          <div className="summary-left">
            <span className="order-date-tag">
              Placed on {new Date(order.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
            </span>
            <h1 className="order-title">Order #{order.id.substring(0, 8).toUpperCase()}</h1>
            <div className="order-badges-row">
              <span className={`status-badge ${getStatusClass(order.status)}`}>
                Order: {formatStatus(order.status)}
              </span>
              {activePayment && (
                <span className={`status-badge ${getStatusClass(activePayment.status)}`}>
                  Payment: {formatStatus(activePayment.status)}
                </span>
              )}
            </div>
          </div>

          <div className="summary-right no-print">
            <div className="amount-focus-box">
              <span className="amount-label">Grand Total</span>
              <span className="amount-value">₹{order.finalAmount}</span>
            </div>
          </div>
        </div>

        {/* Timeline Status Tracker (No Print) */}
        {!["CANCELLED", "REFUNDED", "PAYMENT_FAILED"].includes(order.status) && (
          <div className="order-timeline-card no-print">
            <h3 className="card-sub-title">Order Progress</h3>
            <div className="timeline-tracker">
              {timelineSteps.map((step, idx) => (
                <div key={idx} className={`timeline-node ${step.active ? "completed" : ""}`}>
                  <div className="node-dot">
                    {step.active && <span className="checkmark">✓</span>}
                  </div>
                  <span className="node-label">{step.label}</span>
                  {idx < timelineSteps.length - 1 && (
                    <div className={`node-line ${timelineSteps[idx + 1].active ? "completed" : ""}`}></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Shipment Tracker Details (No Print) */}
        {order.shipment && !["CANCELLED", "REFUNDED", "PAYMENT_FAILED"].includes(order.status) && (
          <div className="shipment-tracker-card no-print">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px", flexWrap: "wrap", gap: "10px" }}>
              <h3 className="card-sub-title" style={{ margin: 0 }}>Delivery & Tracking</h3>
              {order.shipment.awbCode && (
                <button
                  type="button"
                  disabled={trackingLoading}
                  onClick={handleTrackLive}
                  style={{
                    padding: "6px 14px",
                    fontSize: "12px",
                    fontWeight: "600",
                    backgroundColor: "#111",
                    color: "#fff",
                    borderRadius: "4px",
                    cursor: "pointer",
                    border: "none",
                  }}
                >
                  {trackingLoading ? "Fetching..." : "📍 Track Package Live"}
                </button>
              )}
            </div>

            <div className="shipment-details-grid">
              <div className="shipment-col">
                <span>Shipping Partner:</span>
                <strong>{order.shipment.courierName || order.shipment.carrier}</strong>
              </div>
              <div className="shipment-col">
                <span>Tracking / AWB:</span>
                {order.shipment.awbCode ? (
                  <a
                    href={`https://shiprocket.co/tracking/${order.shipment.awbCode}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "#2563eb", fontWeight: "600", textDecoration: "underline" }}
                  >
                    {order.shipment.awbCode} ↗
                  </a>
                ) : (
                  <strong>{order.shipment.trackingNumber || "Assigning tracking..."}</strong>
                )}
              </div>
              <div className="shipment-col">
                <span>Estimated Delivery:</span>
                <strong>
                  {order.shipment.estimatedDelivery
                    ? new Date(order.shipment.estimatedDelivery).toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })
                    : "Standard Timeline"
                  }
                </strong>
              </div>
              <div className="shipment-col">
                <span>Shipment Status:</span>
                <span className={`shipment-status-pill ${getStatusClass(order.shipment.status)}`}>
                  {formatStatus(order.shipment.status)}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Information Grid */}
        <div className="info-blocks-grid">
          {/* Address Snapshot Block */}
          <div className="info-block">
            <h3 className="info-block-title">Delivery Address</h3>
            <div className="info-block-content">
              <p className="recipient-name"><strong>{address.recipientName}</strong></p>
              <p className="address-line">{address.streetAddress}</p>
              <p className="address-line">{address.city}, {address.state} - {address.postalCode}</p>
              <p className="address-line">{address.country}</p>
              <p className="address-phone">Phone: {address.phone}</p>
            </div>
          </div>

          {/* Payment Details Block */}
          <div className="info-block">
            <h3 className="info-block-title">Payment Information</h3>
            <div className="info-block-content">
              <div className="info-row">
                <span>Gateway Order:</span>
                <strong>{activePayment?.gatewayOrderId || "N/A"}</strong>
              </div>
              {activePayment?.gatewayPaymentId && (
                <div className="info-row">
                  <span>Transaction ID:</span>
                  <strong>{activePayment.gatewayPaymentId}</strong>
                </div>
              )}
              <div className="info-row">
                <span>Method:</span>
                <strong>{activePayment?.method || "Online"}</strong>
              </div>
              <div className="info-row">
                <span>Payment Status:</span>
                <strong className={`status-text ${getStatusClass(activePayment?.status || "INITIATED")}`}>
                  {formatStatus(activePayment?.status || "INITIATED")}
                </strong>
              </div>
            </div>
          </div>
        </div>

        {/* Invoice Items Table */}
        <div className="invoice-items-card">
          <h3 className="invoice-card-title">Order Items Summary</h3>
          <div className="invoice-table-wrapper">
            <table className="invoice-table">
              <thead>
                <tr>
                  <th>Product Details</th>
                  <th className="text-right">Price</th>
                  <th className="text-center">Quantity</th>
                  <th className="text-right">Discount</th>
                  <th className="text-right">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {order.items?.map((item) => {
                  const image = item.variant?.images?.[0]?.imageUrl || "";
                  return (
                    <tr key={item.id}>
                      <td className="item-details-cell">
                        <img src={image} alt={item.productName} className="item-table-img no-print" />
                        <div className="item-meta">
                          <span className="item-title">{item.productName}</span>
                          <span className="item-variant">
                            {item.size && <span>Size: <strong>{item.size}</strong></span>}
                            {item.color && <span>Color: <strong>{item.color}</strong></span>}
                          </span>
                        </div>
                      </td>
                      <td className="text-right">₹{item.priceAtPurchase}</td>
                      <td className="text-center">{item.quantity}</td>
                      <td className="text-right discount-cell">
                        {item.discount > 0 ? `-₹${item.discount}` : "—"}
                      </td>
                      <td className="text-right">₹{item.finalAmount}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pricing Totals Column */}
          <div className="invoice-totals-section">
            <div className="totals-table">
              <div className="totals-row">
                <span>Subtotal</span>
                <span>₹{order.subtotal}</span>
              </div>
              {order.discount > 0 && (
                <div className="totals-row discount">
                  <span>Coupon Discount</span>
                  <span>-₹{order.discount}</span>
                </div>
              )}
              <div className="totals-row">
                <span>Shipping</span>
                <span>{order.shippingCharge === 0 ? "Free" : `₹${order.shippingCharge}`}</span>
              </div>
              {order.tax > 0 && (
                <div className="totals-row">
                  <span>Estimated Tax</span>
                  <span>₹{order.tax}</span>
                </div>
              )}
              <div className="totals-row grand-total">
                <span>Grand Total</span>
                <span>₹{order.finalAmount}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Invoice Footer disclaimer */}
        <div className="invoice-disclaimer print-only">
          <p>Thank you for purchasing with OSMAKÌ.</p>
          <p>This is a computer-generated invoice and does not require a physical signature.</p>
        </div>
      </div>

      {/* Customer Live Tracking Modal */}
      {showTrackingModal && (
        <div className="modal-overlay" onClick={() => setShowTrackingModal(false)} style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.6)", zIndex: 1200, display: "flex", alignItems: "center", justifyContent: "center", padding: "16px" }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ backgroundColor: "#fff", borderRadius: "8px", maxWidth: "560px", width: "100%", padding: "24px", maxHeight: "90vh", overflowY: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <h3 style={{ margin: 0, fontSize: "18px", fontWeight: "700" }}>Live Package Tracking</h3>
              <button onClick={() => setShowTrackingModal(false)} style={{ background: "none", border: "none", fontSize: "20px", cursor: "pointer" }}>×</button>
            </div>

            <div style={{ padding: "12px 16px", backgroundColor: "#f9fafb", borderRadius: "6px", marginBottom: "16px", fontSize: "13px" }}>
              <div style={{ marginBottom: "4px" }}>Carrier: <strong>{trackingData?.tracking?.carrierName || trackingData?.shipment?.carrier || "Shiprocket Express"}</strong></div>
              <div style={{ marginBottom: "4px" }}>Tracking AWB: <strong>{trackingData?.shipment?.awbCode || trackingData?.tracking?.awbCode || "—"}</strong></div>
              <div>Current Status: <strong style={{ color: "#2563eb" }}>{trackingData?.tracking?.currentStatus || trackingData?.shipment?.status}</strong></div>
              {trackingData?.tracking?.edd && <div style={{ marginTop: "4px" }}>Estimated Delivery: <strong>{trackingData.tracking.edd}</strong></div>}
            </div>

            <h4 style={{ margin: "0 0 10px 0", fontSize: "14px" }}>Transit Milestones</h4>
            <div style={{ border: "1px solid #e5e7eb", borderRadius: "6px", padding: "12px", maxHeight: "240px", overflowY: "auto" }}>
              {trackingData?.tracking?.activities?.length > 0 ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {trackingData.tracking.activities.map((act, i) => (
                    <div key={i} style={{ display: "flex", gap: "10px", fontSize: "12px" }}>
                      <span style={{ color: "#2563eb", fontWeight: "bold" }}>●</span>
                      <div>
                        <strong>{act.activity || act.status}</strong>
                        {act.location && <span style={{ color: "#6b7280" }}> — {act.location}</span>}
                        <div style={{ fontSize: "11px", color: "#9ca3af" }}>{act.date}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ margin: 0, fontSize: "12px", color: "#6b7280" }}>
                  Your shipment has been registered with the courier. Tracking scans will update automatically as the package moves across transport hubs.
                </p>
              )}
            </div>

            <div style={{ marginTop: "16px", textAlign: "right" }}>
              <button
                type="button"
                onClick={() => setShowTrackingModal(false)}
                style={{ padding: "8px 18px", backgroundColor: "#000", color: "#fff", borderRadius: "4px", border: "none", cursor: "pointer", fontSize: "13px" }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
