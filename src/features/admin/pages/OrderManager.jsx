import { useState, useEffect } from "react";
import { orderApi } from "../../customer/api/orderApi";
import { shippingApi } from "../../customer/api/shippingApi";
import "../styles/orderManager.css";

export default function OrderManager() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  
  // Filters state
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");

  // Shipment input fields (for SHIPPED state transition)
  const [carrier, setCarrier] = useState("Delhivery");
  const [trackingNumber, setTrackingNumber] = useState("");

  // Refund input state
  const [refundReason, setRefundReason] = useState("Customer Request");
  const [submittingAction, setSubmittingAction] = useState(false);

  // Shiprocket Logistics State
  const [shippingLoading, setShippingLoading] = useState(false);
  const [couriersList, setCouriersList] = useState([]);
  const [selectedCourierId, setSelectedCourierId] = useState("");
  const [pickupDate, setPickupDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split("T")[0];
  });
  const [shippingFeedback, setShippingFeedback] = useState("");
  const [trackingData, setTrackingData] = useState(null);
  const [showTrackingModal, setShowTrackingModal] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, [status, paymentStatus]); // Refetch on dropdown change

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const filters = {};
      if (status) filters.status = status;
      if (paymentStatus) filters.paymentStatus = paymentStatus;
      if (search) filters.search = search;

      const data = await orderApi.getAdminOrders(filters);
      setOrders(data);
      setError("");
    } catch (err) {
      console.error("Failed to fetch admin orders:", err);
      setError("Failed to load orders. Please make sure the backend server is running.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchOrders();
  };

  const handleClearFilters = () => {
    setSearch("");
    setStatus("");
    setPaymentStatus("");
    // We also need to trigger fetch with clean parameters
    setLoading(true);
    orderApi.getAdminOrders({})
      .then(data => {
        setOrders(data);
        setError("");
      })
      .catch(err => {
        console.error(err);
        setError("Failed to load orders.");
      })
      .finally(() => setLoading(false));
  };

  // Helper to retrieve active payment from order record
  const getActivePayment = (order) => {
    return order.payments?.find(p => p.status === "CAPTURED") || order.payments?.[0];
  };

  // Calculate high level statistics for dashboard cards
  const stats = {
    totalOrders: orders.length,
    pendingShipments: orders.filter(o => ["CONFIRMED", "PACKED"].includes(o.status)).length,
    totalEarnings: orders
      .filter(o => ["CONFIRMED", "PACKED", "SHIPPED", "DELIVERED"].includes(o.status))
      .reduce((sum, o) => sum + parseFloat(o.finalAmount || 0), 0),
    activeRefunds: orders.filter(o => o.status === "REFUNDED").length
  };

  // Transition Order Status
  const handleTransitionStatus = async (orderId, targetStatus) => {
    if (submittingAction) return;
    setSubmittingAction(true);

    try {
      const payload = {};
      if (targetStatus === "SHIPPED") {
        payload.carrier = carrier;
        payload.trackingNumber = trackingNumber || `AWB${Math.floor(100000 + Math.random() * 900000)}`;
      }

      const res = await orderApi.updateOrderStatus(orderId, targetStatus, payload);
      
      // Update local state list and selected modal
      const updatedOrders = orders.map(o => o.id === orderId ? { ...o, status: res.order.status, shipment: res.order.shipment || o.shipment } : o);
      setOrders(updatedOrders);
      
      // Refetch details to get updated relationships (payments, shipment logs)
      const freshDetails = await orderApi.getOrderDetails(orderId);
      setSelectedOrder(freshDetails);

      // Reset shipment inputs
      setTrackingNumber("");
      setCarrier("Delhivery");
      alert(`Order successfully marked as ${targetStatus}!`);
    } catch (err) {
      console.error(err);
      alert(err.message || "Failed to update order status");
    } finally {
      setSubmittingAction(false);
    }
  };

  // --- SHIPROCKET ACTIONS ---

  const handleCreateShiprocketOrder = async (orderId) => {
    setShippingLoading(true);
    setShippingFeedback("");
    try {
      const res = await shippingApi.createShipmentOrder(orderId);
      setShippingFeedback("✓ Shiprocket Order created successfully!");
      // Refresh order details
      const freshDetails = await orderApi.getOrderDetails(orderId);
      setSelectedOrder(freshDetails);
      setOrders((prev) => prev.map((o) => (o.id === orderId ? freshDetails : o)));
    } catch (err) {
      setShippingFeedback(`⚠️ ${err.message || "Failed to create Shiprocket order."}`);
    } finally {
      setShippingLoading(false);
    }
  };

  const handleFetchCouriers = async (orderId) => {
    setShippingLoading(true);
    setShippingFeedback("");
    try {
      const res = await shippingApi.getOrderCouriers(orderId);
      setCouriersList(res.courierCompanies || []);
      if (res.courierCompanies?.length > 0) {
        setSelectedCourierId(String(res.recommendedCourierId || res.courierCompanies[0].courierCompanyId));
      }
    } catch (err) {
      setShippingFeedback(`⚠️ ${err.message || "Failed to fetch couriers."}`);
    } finally {
      setShippingLoading(false);
    }
  };

  const handleAssignCourier = async (orderId) => {
    setShippingLoading(true);
    setShippingFeedback("");
    try {
      const res = await shippingApi.assignCourier(orderId, selectedCourierId ? Number(selectedCourierId) : null);
      setShippingFeedback(`✓ AWB ${res.shipment?.awbCode || ""} assigned via ${res.shipment?.courierName || "courier"}!`);
      const freshDetails = await orderApi.getOrderDetails(orderId);
      setSelectedOrder(freshDetails);
      setOrders((prev) => prev.map((o) => (o.id === orderId ? freshDetails : o)));
      setCouriersList([]);
    } catch (err) {
      setShippingFeedback(`⚠️ ${err.message || "Failed to assign courier."}`);
    } finally {
      setShippingLoading(false);
    }
  };

  const handleSchedulePickup = async (orderId) => {
    setShippingLoading(true);
    setShippingFeedback("");
    try {
      const res = await shippingApi.requestPickup(orderId, pickupDate);
      setShippingFeedback(`✓ Pickup scheduled! Token: ${res.pickupTokenNumber || "Generated"}`);
      const freshDetails = await orderApi.getOrderDetails(orderId);
      setSelectedOrder(freshDetails);
      setOrders((prev) => prev.map((o) => (o.id === orderId ? freshDetails : o)));
    } catch (err) {
      setShippingFeedback(`⚠️ ${err.message || "Failed to schedule pickup."}`);
    } finally {
      setShippingLoading(false);
    }
  };

  const handlePrintLabel = async (orderId) => {
    setShippingLoading(true);
    try {
      const res = await shippingApi.generateLabel(orderId);
      if (res.labelUrl) {
        window.open(res.labelUrl, "_blank");
      } else {
        alert("Shipping label URL was not returned by Shiprocket.");
      }
    } catch (err) {
      alert(err.message || "Failed to generate label.");
    } finally {
      setShippingLoading(false);
    }
  };

  const handlePrintInvoice = async (orderId) => {
    setShippingLoading(true);
    try {
      const res = await shippingApi.generateInvoice(orderId);
      if (res.invoiceUrl) {
        window.open(res.invoiceUrl, "_blank");
      } else {
        alert("Invoice URL was not returned by Shiprocket.");
      }
    } catch (err) {
      alert(err.message || "Failed to generate invoice.");
    } finally {
      setShippingLoading(false);
    }
  };

  const handleTrackShipment = async (orderId) => {
    setShippingLoading(true);
    try {
      const res = await shippingApi.trackShipment(orderId);
      setTrackingData(res);
      setShowTrackingModal(true);
    } catch (err) {
      alert(err.message || "Failed to retrieve tracking info.");
    } finally {
      setShippingLoading(false);
    }
  };

  // Process Refund Action
  const handleProcessRefund = async (orderId) => {
    if (!window.confirm("Are you sure you want to cancel and refund this order? This will void the transaction and return products to inventory.")) return;
    if (submittingAction) return;
    setSubmittingAction(true);

    try {
      await orderApi.refundOrder(orderId, refundReason);
      
      // Reload order list and details
      const freshOrders = await orderApi.getAdminOrders({ status, paymentStatus, search });
      setOrders(freshOrders);

      const freshDetails = await orderApi.getOrderDetails(orderId);
      setSelectedOrder(freshDetails);

      alert("Refund successfully issued. Stock levels have been restored.");
    } catch (err) {
      console.error(err);
      alert(err.message || "Failed to issue refund. Check if the payment status is CAPTURED.");
    } finally {
      setSubmittingAction(false);
    }
  };

  const getOrderStatusPillClass = (statusStr) => {
    switch (statusStr) {
      case "PENDING_PAYMENT": return "badge-status-placed";
      case "CONFIRMED": return "badge-status-confirmed";
      case "PACKED": return "badge-status-packed";
      case "SHIPPED": return "badge-status-shipped";
      case "DELIVERED": return "badge-status-delivered";
      case "CANCELLED": return "badge-status-cancelled";
      case "REFUNDED": return "badge-status-refunded";
      case "PAYMENT_FAILED": return "badge-status-failed";
      default: return "badge-status-placed";
    }
  };

  const getPaymentStatusPillClass = (payStatus) => {
    switch (payStatus) {
      case "INITIATED": return "badge-warning";
      case "CAPTURED": return "badge-success";
      case "FAILED": return "badge-danger";
      case "REFUNDED": return "badge-danger";
      default: return "badge-warning";
    }
  };

  return (
    <div className="order-manager-container">
      {/* Header */}
      <div className="admin-header">
        <h1 className="admin-header-title">Orders & Payments Management</h1>
        <button onClick={fetchOrders} className="btn-add-variant">
          Refresh List
        </button>
      </div>

      {/* Stats Summary Section */}
      <div className="dashboard-grid">
        <div className="stat-card">
          <div className="stat-label">Total Orders</div>
          <div className="stat-value">{stats.totalOrders}</div>
        </div>
        <div className="stat-card alert-warning">
          <div className="stat-label">Fulfillment Queue</div>
          <div className="stat-value">{stats.pendingShipments}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Verified Gross Revenue</div>
          <div className="stat-value">₹{stats.totalEarnings.toLocaleString("en-IN")}</div>
        </div>
        <div className="stat-card alert-danger">
          <div className="stat-label">Refunded Orders</div>
          <div className="stat-value">{stats.activeRefunds}</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="admin-card">
        <form onSubmit={handleSearchSubmit} className="orders-filters-bar">
          <div className="search-wrapper">
            <input
              type="text"
              placeholder="Search by Order ID, name, or street..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="search-input-field"
            />
          </div>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="filter-select-field"
          >
            <option value="">All Order Statuses</option>
            <option value="PENDING_PAYMENT">Pending Payment</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="PACKED">Packed</option>
            <option value="SHIPPED">Shipped</option>
            <option value="DELIVERED">Delivered</option>
            <option value="CANCELLED">Cancelled</option>
            <option value="REFUNDED">Refunded</option>
          </select>

          <select
            value={paymentStatus}
            onChange={(e) => setPaymentStatus(e.target.value)}
            className="filter-select-field"
          >
            <option value="">All Payment Statuses</option>
            <option value="INITIATED">Initiated</option>
            <option value="CAPTURED">Captured / Paid</option>
            <option value="FAILED">Failed</option>
            <option value="REFUNDED">Refunded</option>
          </select>

          <button type="submit" className="btn-primary-action">
            Apply Filters
          </button>

          <button type="button" onClick={handleClearFilters} className="btn-cancel" style={{ padding: "0 20px" }}>
            Reset
          </button>
        </form>

        {/* Loading / Error / Content */}
        {loading ? (
          <div style={{ textAlign: "center", padding: "40px 0", color: "#888" }}>
            Loading dashboard data...
          </div>
        ) : error ? (
          <div style={{ padding: "20px", color: "#dc2626", border: "1px solid #fca5a5", borderRadius: "8px", backgroundColor: "#fef2f2" }}>
            {error}
          </div>
        ) : orders.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 0", color: "#666" }}>
            No orders found matching the filter query.
          </div>
        ) : (
          <div className="variants-table-container" style={{ border: "none" }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Date</th>
                  <th>Customer</th>
                  <th style={{ textAlign: "center" }}>Items</th>
                  <th style={{ textAlign: "right" }}>Amount</th>
                  <th>Order Status</th>
                  <th>Payment</th>
                  <th style={{ textAlign: "right" }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => {
                  const payment = getActivePayment(order);
                  let address = {};
                  try {
                    address = JSON.parse(order.deliveryAddressSnapshot || "{}");
                  } catch (e) {}

                  return (
                    <tr key={order.id} className="expandable-row" onClick={() => setSelectedOrder(order)}>
                      <td>
                        <code style={{ fontVariantNumeric: "slashed-zero" }}>
                          #{order.id.substring(0, 8).toUpperCase()}
                        </code>
                      </td>
                      <td>
                        {new Date(order.createdAt).toLocaleDateString("en-IN", {
                          month: "short",
                          day: "numeric",
                          year: "numeric"
                        })}
                      </td>
                      <td>
                        <strong>{address.recipientName || order.user?.name || "Guest"}</strong>
                        <div style={{ fontSize: "11px", color: "#888" }}>{order.user?.email || "No Email"}</div>
                      </td>
                      <td style={{ textAlign: "center" }}>
                        {order.items?.reduce((sum, item) => sum + item.quantity, 0) || 0}
                      </td>
                      <td style={{ textAlign: "right", fontWeight: "600" }}>
                        ₹{order.finalAmount}
                      </td>
                      <td>
                        <span className={`badge ${getOrderStatusPillClass(order.status)}`}>
                          {order.status.replace(/_/g, " ")}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${getPaymentStatusPillClass(payment?.status || "INITIATED")}`}>
                          {payment?.status || "PENDING"}
                        </span>
                      </td>
                      <td style={{ textAlign: "right" }}>
                        <button className="action-link-btn" onClick={(e) => {
                          e.stopPropagation();
                          setSelectedOrder(order);
                        }}>
                          Fulfill / View
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detailed Fulfillment Modal overlay */}
      {selectedOrder && (
        <div className="modal-overlay" onClick={() => setSelectedOrder(null)}>
          <div className="modal-content order-details-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-row">
              <h2 className="modal-title">Order Details</h2>
              <button className="btn-close-modal" onClick={() => setSelectedOrder(null)}>×</button>
            </div>
            <p className="modal-subtitle">
              Order ID: <code>{selectedOrder.id}</code> (Placed on {new Date(selectedOrder.createdAt).toLocaleString("en-IN")})
            </p>

            <div className="modal-details-grid">
              {/* Delivery info */}
              <div className="modal-details-section">
                <h4 className="section-subtitle">Recipient Address</h4>
                {(() => {
                  let address = {};
                  try {
                    address = JSON.parse(selectedOrder.deliveryAddressSnapshot || "{}");
                  } catch (e) {}
                  return (
                    <div>
                      <p style={{ margin: "0 0 6px 0", fontWeight: "600" }}>{address.recipientName}</p>
                      <p style={{ margin: "0 0 4px 0" }}>{address.streetAddress}</p>
                      <p style={{ margin: "0 0 4px 0" }}>{address.city}, {address.state} - {address.postalCode}</p>
                      <p style={{ margin: "0 0 6px 0" }}>{address.country}</p>
                      <p style={{ margin: "0", fontSize: "12px", color: "#666" }}>Phone: {address.phone}</p>
                    </div>
                  );
                })()}
              </div>

              {/* Payment status info */}
              <div className="modal-details-section">
                <h4 className="section-subtitle">Payment Information</h4>
                {(() => {
                  const payment = getActivePayment(selectedOrder);
                  return (
                    <div>
                      <div className="details-row">
                        <span>Gateway Order:</span>
                        <strong>{payment?.gatewayOrderId || "N/A"}</strong>
                      </div>
                      <div className="details-row">
                        <span>Transaction ID:</span>
                        <strong>{payment?.gatewayPaymentId || "N/A"}</strong>
                      </div>
                      <div className="details-row">
                        <span>Status:</span>
                        <strong className={`status-text ${getPaymentStatusPillClass(payment?.status || "INITIATED")}`}>
                          {payment?.status || "PENDING"}
                        </strong>
                      </div>
                      <div className="details-row">
                        <span>Method:</span>
                        <strong>{payment?.method || "Online"}</strong>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>

            {/* SHIPROCKET LOGISTICS COMMAND CENTER */}
            <div className="modal-details-section shiprocket-logistics-box" style={{ marginBottom: "20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                <h4 className="section-subtitle" style={{ margin: 0, display: "flex", alignItems: "center", gap: "8px" }}>
                  <span>🚀</span> Shiprocket Fulfillment & Logistics
                </h4>
                {selectedOrder.shipment?.status && (
                  <span className={`badge ${selectedOrder.shipment.status === 'CREATION_FAILED' ? 'badge-danger' : 'badge-info'}`} style={{ fontSize: "11px", textTransform: "uppercase" }}>
                    {selectedOrder.shipment.status.replace(/_/g, " ")}
                  </span>
                )}
              </div>

              {shippingFeedback && (
                <div style={{ padding: "8px 12px", marginBottom: "12px", borderRadius: "4px", fontSize: "12px", backgroundColor: shippingFeedback.startsWith("✓") ? "#ecfdf5" : "#fef2f2", color: shippingFeedback.startsWith("✓") ? "#065f46" : "#991b1b", border: `1px solid ${shippingFeedback.startsWith("✓") ? "#a7f3d0" : "#fecaca"}` }}>
                  {shippingFeedback}
                </div>
              )}

              {/* Shiprocket Meta Grid */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "10px", fontSize: "12px", padding: "12px", backgroundColor: "#f9fafb", borderRadius: "6px", marginBottom: "14px" }}>
                <div>
                  <span style={{ color: "#6b7280", display: "block" }}>Shiprocket Order ID</span>
                  <strong>{selectedOrder.shipment?.shiprocketOrderId || "Not Created"}</strong>
                </div>
                <div>
                  <span style={{ color: "#6b7280", display: "block" }}>Shipment ID</span>
                  <strong>{selectedOrder.shipment?.shiprocketShipmentId || "—"}</strong>
                </div>
                <div>
                  <span style={{ color: "#6b7280", display: "block" }}>Courier Partner</span>
                  <strong>{selectedOrder.shipment?.courierName || selectedOrder.shipment?.carrier || "Pending Assignment"}</strong>
                </div>
                <div>
                  <span style={{ color: "#6b7280", display: "block" }}>AWB Number</span>
                  {selectedOrder.shipment?.awbCode ? (
                    <a href={`https://shiprocket.co/tracking/${selectedOrder.shipment.awbCode}`} target="_blank" rel="noopener noreferrer" style={{ color: "#2563eb", fontWeight: "600", textDecoration: "underline" }}>
                      {selectedOrder.shipment.awbCode} ↗
                    </a>
                  ) : (
                    <strong>—</strong>
                  )}
                </div>
                {selectedOrder.shipment?.pickupTokenNumber && (
                  <div>
                    <span style={{ color: "#6b7280", display: "block" }}>Pickup Token</span>
                    <strong>{selectedOrder.shipment.pickupTokenNumber}</strong>
                  </div>
                )}
              </div>

              {/* Error message display if failed */}
              {selectedOrder.shipment?.errorMessage && (
                <div style={{ padding: "8px 12px", marginBottom: "12px", borderRadius: "4px", fontSize: "12px", backgroundColor: "#fef2f2", color: "#991b1b", border: "1px solid #fecaca" }}>
                  <strong>Shiprocket Error:</strong> {selectedOrder.shipment.errorMessage}
                </div>
              )}

              {/* Dynamic Interactive Logistics Controls */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", alignItems: "center" }}>
                {/* 1. Create or Retry Shiprocket Order */}
                {(!selectedOrder.shipment?.shiprocketOrderId || selectedOrder.shipment?.status === "CREATION_FAILED") && (
                  <button
                    disabled={shippingLoading}
                    onClick={() => handleCreateShiprocketOrder(selectedOrder.id)}
                    className="btn-primary-action"
                    style={{ fontSize: "12px", padding: "8px 14px" }}
                  >
                    {shippingLoading ? "Contacting Shiprocket..." : selectedOrder.shipment?.status === "CREATION_FAILED" ? "🔄 Retry Shiprocket Order" : "🚀 Create Shiprocket Order"}
                  </button>
                )}

                {/* 2. Assign Courier & Generate AWB */}
                {selectedOrder.shipment?.shiprocketShipmentId && !selectedOrder.shipment?.awbCode && (
                  <>
                    {couriersList.length === 0 ? (
                      <button
                        disabled={shippingLoading}
                        onClick={() => handleFetchCouriers(selectedOrder.id)}
                        className="btn-primary-action"
                        style={{ fontSize: "12px", padding: "8px 14px", backgroundColor: "#0284c7" }}
                      >
                        {shippingLoading ? "Checking Rates..." : "📦 Select Courier & Generate AWB"}
                      </button>
                    ) : (
                      <div style={{ display: "flex", gap: "8px", alignItems: "center", width: "100%", marginTop: "8px", padding: "10px", backgroundColor: "#f0f9ff", borderRadius: "6px" }}>
                        <select
                          value={selectedCourierId}
                          onChange={(e) => setSelectedCourierId(e.target.value)}
                          className="filter-select-field"
                          style={{ flex: 1, padding: "6px 10px", fontSize: "12px" }}
                        >
                          {couriersList.map((c) => (
                            <option key={c.courierCompanyId} value={c.courierCompanyId}>
                              {c.courierName} — ₹{c.rate} (~{c.estimatedDeliveryDays || c.etd || "2-3"} days) {c.rating ? `★${c.rating}` : ""}
                            </option>
                          ))}
                        </select>
                        <button
                          disabled={shippingLoading}
                          onClick={() => handleAssignCourier(selectedOrder.id)}
                          className="btn-primary-action"
                          style={{ fontSize: "12px", padding: "8px 14px", whiteSpace: "nowrap" }}
                        >
                          {shippingLoading ? "Assigning..." : "Confirm & Generate AWB"}
                        </button>
                      </div>
                    )}
                  </>
                )}

                {/* 3. Schedule Pickup (when AWB is assigned and no pickup scheduled) */}
                {selectedOrder.shipment?.awbCode && !selectedOrder.shipment?.pickupTokenNumber && (
                  <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                    <input
                      type="date"
                      value={pickupDate}
                      onChange={(e) => setPickupDate(e.target.value)}
                      style={{ padding: "6px 10px", border: "1px solid #d1d5db", borderRadius: "4px", fontSize: "12px" }}
                    />
                    <button
                      disabled={shippingLoading}
                      onClick={() => handleSchedulePickup(selectedOrder.id)}
                      className="btn-primary-action"
                      style={{ fontSize: "12px", padding: "8px 14px", backgroundColor: "#4f46e5" }}
                    >
                      {shippingLoading ? "Scheduling..." : "🚚 Schedule Pickup"}
                    </button>
                  </div>
                )}

                {/* 4. Print Label */}
                {selectedOrder.shipment?.shiprocketShipmentId && (
                  <button
                    disabled={shippingLoading}
                    onClick={() => handlePrintLabel(selectedOrder.id)}
                    className="btn-cancel"
                    style={{ fontSize: "12px", padding: "8px 14px", border: "1px solid #111" }}
                  >
                    🏷️ Print Shipping Label
                  </button>
                )}

                {/* 5. Print Invoice */}
                {selectedOrder.shipment?.shiprocketOrderId && (
                  <button
                    disabled={shippingLoading}
                    onClick={() => handlePrintInvoice(selectedOrder.id)}
                    className="btn-cancel"
                    style={{ fontSize: "12px", padding: "8px 14px" }}
                  >
                    🧾 Commercial Invoice
                  </button>
                )}

                {/* 6. Live Carrier Tracking */}
                {selectedOrder.shipment?.awbCode && (
                  <button
                    disabled={shippingLoading}
                    onClick={() => handleTrackShipment(selectedOrder.id)}
                    className="btn-cancel"
                    style={{ fontSize: "12px", padding: "8px 14px", backgroundColor: "#f3f4f6" }}
                  >
                    📍 Live Tracking Checkpoints
                  </button>
                )}
              </div>
            </div>

            {/* Items Summary Table */}
            <h4 className="section-subtitle">Purchased Items</h4>
            <table className="modal-items-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th style={{ textAlign: "right" }}>Price</th>
                  <th style={{ textAlign: "center" }}>Qty</th>
                  <th style={{ textAlign: "right" }}>Discount</th>
                  <th style={{ textAlign: "right" }}>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {selectedOrder.items?.map((item) => {
                  const imgUrl = item.variant?.images?.[0]?.imageUrl || "https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd";
                  return (
                    <tr key={item.id}>
                      <td style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <img src={imgUrl} alt={item.productName} className="item-img-mini" />
                        <div>
                          <strong style={{ display: "block" }}>{item.productName}</strong>
                          <span style={{ fontSize: "11px", color: "#777" }}>
                            {item.size ? `Size: ${item.size} ` : ""}{item.color ? `Color: ${item.color}` : ""}
                          </span>
                        </div>
                      </td>
                      <td style={{ textAlign: "right" }}>₹{item.priceAtPurchase}</td>
                      <td style={{ textAlign: "center" }}>{item.quantity}</td>
                      <td style={{ textAlign: "right", color: "#b91c1c" }}>
                        {item.discount > 0 ? `-₹${item.discount}` : "—"}
                      </td>
                      <td style={{ textAlign: "right", fontWeight: "500" }}>₹{item.finalAmount}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Totals */}
            <div className="modal-totals-box">
              <div className="totals-line">
                <span>Subtotal:</span>
                <strong>₹{selectedOrder.subtotal}</strong>
              </div>
              {parseFloat(selectedOrder.discount) > 0 && (
                <div className="totals-line" style={{ color: "#b91c1c" }}>
                  <span>Coupon Discount:</span>
                  <strong>-₹{selectedOrder.discount}</strong>
                </div>
              )}
              <div className="totals-line">
                <span>Shipping:</span>
                <strong>{parseFloat(selectedOrder.shippingCharge) === 0 ? "Free" : `₹${selectedOrder.shippingCharge}`}</strong>
              </div>
              <div className="totals-line">
                <span>Estimated Tax (5%):</span>
                <strong>₹{selectedOrder.tax}</strong>
              </div>
              <div className="totals-line grand">
                <span>Grand Total:</span>
                <strong>₹{selectedOrder.finalAmount}</strong>
              </div>
            </div>

            {/* Fulfillment Status Actions Panel */}
            {!["CANCELLED", "REFUNDED", "PAYMENT_FAILED"].includes(selectedOrder.status) && (
              <div className="status-update-control-box">
                <h4 className="control-title">Fulfillment Actions (Fulfill Order)</h4>
                
                {/* 1. CONFIRMED state -> Mark as PACKED */}
                {selectedOrder.status === "CONFIRMED" && (
                  <div className="action-row">
                    <p style={{ margin: "0", fontSize: "13px", color: "#555" }}>
                      Order is paid and confirmed. Prepare packaging.
                    </p>
                    <button
                      disabled={submittingAction}
                      onClick={() => handleTransitionStatus(selectedOrder.id, "PACKED")}
                      className="btn-primary-action"
                    >
                      {submittingAction ? "Processing..." : "Mark as Packed"}
                    </button>
                  </div>
                )}

                {/* 2. PACKED state -> Transition to SHIPPED */}
                {selectedOrder.status === "PACKED" && (
                  <div>
                    <div className="shipment-inputs-grid">
                      <div className="form-group">
                        <label className="form-label" style={{ fontSize: "10px" }}>Shipping Carrier</label>
                        <select
                          value={carrier}
                          onChange={(e) => setCarrier(e.target.value)}
                          className="filter-select-field"
                          style={{ width: "100%", padding: "8px 12px", height: "38px" }}
                        >
                          <option value="Delhivery">Delhivery</option>
                          <option value="BlueDart">BlueDart</option>
                          <option value="FedEx">FedEx</option>
                          <option value="DTDC">DTDC</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label className="form-label" style={{ fontSize: "10px" }}>Tracking Number (AWB)</label>
                        <input
                          type="text"
                          placeholder="e.g. DELH987210"
                          value={trackingNumber}
                          onChange={(e) => setTrackingNumber(e.target.value)}
                          className="search-input-field"
                          style={{ padding: "8px 12px", height: "38px" }}
                        />
                      </div>
                    </div>
                    <div className="action-row">
                      <span style={{ fontSize: "12px", color: "#666" }}>
                        Assign tracking ID to dispatch shipment.
                      </span>
                      <button
                        disabled={submittingAction}
                        onClick={() => handleTransitionStatus(selectedOrder.id, "SHIPPED")}
                        className="btn-primary-action"
                      >
                        {submittingAction ? "Fulfilling..." : "Ship Order & Notify Customer"}
                      </button>
                    </div>
                  </div>
                )}

                {/* 3. SHIPPED state -> Transition to DELIVERED */}
                {selectedOrder.status === "SHIPPED" && (
                  <div className="action-row">
                    <p style={{ margin: "0", fontSize: "13px", color: "#555" }}>
                      Order is currently in transit with <strong>{selectedOrder.shipment?.carrier}</strong>.
                    </p>
                    <button
                      disabled={submittingAction}
                      onClick={() => handleTransitionStatus(selectedOrder.id, "DELIVERED")}
                      className="btn-primary-action"
                    >
                      {submittingAction ? "Processing..." : "Confirm Delivery Success"}
                    </button>
                  </div>
                )}

                {/* 4. Cancel & Refund Option (Only for confirmed / packed / shipped orders) */}
                {["CONFIRMED", "PACKED", "SHIPPED"].includes(selectedOrder.status) && (
                  <div style={{ marginTop: "24px", paddingTop: "20px", borderTop: "1px dashed #eee" }}>
                    <div className="form-group" style={{ marginBottom: "12px" }}>
                      <label className="form-label" style={{ fontSize: "10px" }}>Cancel/Refund Reason</label>
                      <input
                        type="text"
                        value={refundReason}
                        onChange={(e) => setRefundReason(e.target.value)}
                        className="search-input-field"
                        style={{ padding: "8px 12px", height: "38px" }}
                      />
                    </div>
                    <div className="action-row">
                      <span style={{ fontSize: "12px", color: "#666" }}>
                        Voids payment & returns product quantity to stock.
                      </span>
                      <button
                        disabled={submittingAction}
                        onClick={() => handleProcessRefund(selectedOrder.id)}
                        className="btn-danger-action"
                      >
                        Issue Refund
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {/* Status cancellation message */}
            {selectedOrder.status === "REFUNDED" && (
              <div style={{ marginTop: "20px", padding: "16px", backgroundColor: "#fdf2f8", border: "1px solid #fbcfe8", borderRadius: "8px" }}>
                <strong style={{ color: "#be185d", display: "block" }}>Order Refunded</strong>
                {selectedOrder.refunds?.[0] && (
                  <span style={{ fontSize: "13px", color: "#be185d" }}>
                    Reason: {selectedOrder.refunds[0].reason || "N/A"} (Amount: ₹{selectedOrder.refunds[0].amount})
                  </span>
                )}
              </div>
            )}

            {selectedOrder.status === "CANCELLED" && (
              <div style={{ marginTop: "20px", padding: "16px", backgroundColor: "#fef2f2", border: "1px solid #fca5a5", borderRadius: "8px" }}>
                <strong style={{ color: "#b91c1c", display: "block" }}>Order Cancelled</strong>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Real-time Shiprocket Tracking Modal */}
      {showTrackingModal && (
        <div className="modal-overlay" onClick={() => setShowTrackingModal(false)} style={{ zIndex: 1100 }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "600px" }}>
            <div className="modal-header-row">
              <h3 className="modal-title" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span>📍</span> Real-Time Shipment Tracking
              </h3>
              <button className="btn-close-modal" onClick={() => setShowTrackingModal(false)}>×</button>
            </div>
            
            <div style={{ margin: "16px 0", padding: "12px", backgroundColor: "#f9fafb", borderRadius: "6px", fontSize: "13px" }}>
              <div>Carrier: <strong>{trackingData?.tracking?.carrierName || trackingData?.shipment?.carrier || "Shiprocket"}</strong></div>
              <div>AWB Number: <strong>{trackingData?.shipment?.awbCode || trackingData?.tracking?.awbCode || "—"}</strong></div>
              <div>Current Status: <strong style={{ color: "#2563eb" }}>{trackingData?.tracking?.currentStatus || trackingData?.shipment?.status || "In Process"}</strong></div>
              {trackingData?.tracking?.edd && <div>Estimated Delivery: <strong>{trackingData.tracking.edd}</strong></div>}
            </div>

            <h4 style={{ fontSize: "14px", margin: "14px 0 8px 0" }}>Activity Checkpoints</h4>
            <div style={{ maxHeight: "250px", overflowY: "auto", border: "1px solid #e5e7eb", borderRadius: "6px", padding: "10px" }}>
              {trackingData?.tracking?.activities?.length > 0 ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {trackingData.tracking.activities.map((act, i) => (
                    <div key={i} style={{ display: "flex", gap: "10px", fontSize: "12px", borderBottom: i < trackingData.tracking.activities.length - 1 ? "1px solid #f3f4f6" : "none", paddingBottom: "8px" }}>
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
                  Package is currently awaiting courier pickup scan. Detailed checkpoints will appear as the courier scans the parcel.
                </p>
              )}
            </div>

            <div style={{ marginTop: "16px", textAlign: "right" }}>
              <button onClick={() => setShowTrackingModal(false)} className="btn-primary-action" style={{ fontSize: "12px", padding: "6px 16px" }}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
