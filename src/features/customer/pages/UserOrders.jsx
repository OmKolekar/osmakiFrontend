import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { orderApi } from "../api/orderApi";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import "../styles/userOrders.css";

export default function UserOrders() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // SWR: Initialize instantly from cache if available (0ms render)
  const [orders, setOrders] = useState(() => {
    try {
      if (user?.id) {
        const raw = sessionStorage.getItem(`osmaki_orders_${user.id}`);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) return parsed;
        }
      }
    } catch {}
    return [];
  });
  const [loading, setLoading] = useState(() => {
    try {
      if (user?.id) {
        const raw = sessionStorage.getItem(`osmaki_orders_${user.id}`);
        if (raw) return false;
      }
    } catch {}
    return true;
  });
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    fetchUserOrders();
  }, [user]);

  const fetchUserOrders = async () => {
    try {
      const list = await orderApi.getUserOrders(user.id);
      setOrders(list);
      sessionStorage.setItem(`osmaki_orders_${user.id}`, JSON.stringify(list));
      setError("");
    } catch (err) {
      console.error("Failed to load user orders:", err);
      if (orders.length === 0) {
        setError(err.message || "Failed to retrieve your order history");
      }
    } finally {
      setLoading(false);
    }
  };

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
        return "status-danger";
      default:
        return "status-info";
    }
  };

  const formatStatus = (status) => {
    return status.replace(/_/g, " ");
  };

  return (
    <div className="user-orders-page">
      <Navbar />

      <div className="user-orders-container">
        <h1 className="orders-page-title">My Orders</h1>
        <p className="orders-page-subtitle">Track your shipments, view receipts, and print invoices.</p>

        {loading ? (
          <div className="orders-loading-view">
            <div className="orders-spinner"></div>
            <p>Loading your order history...</p>
          </div>
        ) : error ? (
          <div className="orders-error-view">
            <p>{error}</p>
            <button onClick={fetchUserOrders} className="retry-btn">
              Retry
            </button>
          </div>
        ) : orders.length === 0 ? (
          <div className="orders-empty-view">
            <div className="empty-box-icon">📦</div>
            <h2>No Orders Found</h2>
            <p>You haven't placed any orders with us yet. Start exploring our collection!</p>
            <Link to="/" className="browse-shop-btn">
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order) => (
              <div key={order.id} className="order-history-card">
                <div className="history-card-header">
                  <div className="header-info-group">
                    <div className="info-cell">
                      <span className="info-label">Order Placed</span>
                      <span className="info-val">
                        {new Date(order.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </span>
                    </div>
                    <div className="info-cell">
                      <span className="info-label">Total Amount</span>
                      <span className="info-val">₹{order.finalAmount}</span>
                    </div>
                    <div className="info-cell">
                      <span className="info-label">Ship To</span>
                      <span className="info-val recipient-cell">
                        {JSON.parse(order.deliveryAddressSnapshot || "{}").recipientName || "Customer"}
                      </span>
                    </div>
                  </div>
                  <div className="header-status-group">
                    <span className="order-id-txt">ID: #{order.id.substring(0, 8).toUpperCase()}</span>
                    <span className={`status-pill ${getStatusClass(order.status)}`}>
                      {formatStatus(order.status)}
                    </span>
                  </div>
                </div>

                <div className="history-card-body">
                  <div className="body-items-list">
                    {order.items?.map((item) => {
                      const image = item.variant?.images?.[0]?.imageUrl || "https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd";
                      return (
                        <div key={item.id} className="body-item-row">
                          <img src={image} alt={item.productName} className="item-thumbnail" />
                          <div className="item-text-info">
                            <span className="item-title-name">{item.productName}</span>
                            <span className="item-variant-spec">
                              {item.size && <span>Size: <strong>{item.size}</strong></span>}
                              {item.color && <span>Color: <strong>{item.color}</strong></span>}
                            </span>
                            <span className="item-qty-price">
                              Qty: {item.quantity} @ ₹{item.priceAtPurchase}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="body-actions-column">
                    <Link to={`/order/${order.id}`} className="view-details-cta">
                      View Details & Invoice
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
