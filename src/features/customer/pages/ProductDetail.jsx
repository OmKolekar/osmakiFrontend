import React, { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { useCart } from "../context/CartContext";
import { useProductDetail } from "../hooks/useProductDetail";
import PriceDisplay from "../components/products/PriceDisplay";
import {
  DEFAULT_TECH_FEATURES,
  DEFAULT_MACRO_TILES,
  DEFAULT_ACCORDIONS,
  DEFAULT_SIZE_GUIDE,
} from "../../admin/data/defaultEditorialSpecs";
import "../styles/productDetail.css";

export default function ProductDetail() {
  const { addToCart } = useCart();
  const { id } = useParams();
  const { product, loading, error } = useProductDetail(id);

  // Active image & variant selection
  const [activeImage, setActiveImage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState("Onyx Black");
  const [selectedSize, setSelectedSize] = useState("L");
  const [activeAccordion, setActiveAccordion] = useState("silhouette");
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const [toastMessage, setToastMessage] = useState("");

  // Modals
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewForm, setReviewForm] = useState({ name: "", rating: 5, headline: "", text: "", sizePurchased: "L" });

  // Wishlist state persisted in localStorage
  const [isWishlisted, setIsWishlisted] = useState(() => {
    try {
      const saved = localStorage.getItem("osmaki_wishlist");
      const list = saved ? JSON.parse(saved) : [];
      return id ? list.includes(id) : false;
    } catch {
      return false;
    }
  });

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3000);
  };

  useEffect(() => {
    const handleSyncWishlist = () => {
      try {
        const saved = localStorage.getItem("osmaki_wishlist");
        const list = saved ? JSON.parse(saved) : [];
        if (id) setIsWishlisted(list.includes(id));
      } catch {
        // silent
      }
    };
    window.addEventListener("osmaki_wishlist_updated", handleSyncWishlist);
    return () => window.removeEventListener("osmaki_wishlist_updated", handleSyncWishlist);
  }, [id]);

  const handleToggleWishlist = () => {
    try {
      const saved = localStorage.getItem("osmaki_wishlist");
      let list = saved ? JSON.parse(saved) : [];
      if (isWishlisted) {
        list = list.filter((item) => item !== id);
        setIsWishlisted(false);
        showToast("Removed from Wishlist");
      } else {
        list.push(id);
        setIsWishlisted(true);
        showToast("Added to Wishlist");
      }
      localStorage.setItem("osmaki_wishlist", JSON.stringify(list));
      window.dispatchEvent(new Event("osmaki_wishlist_updated"));
    } catch (err) {
      console.error(err);
    }
  };

  // Sync initial product data
  useEffect(() => {
    if (product) {
      setActiveImage(product.image || "");
      if (product.variants && product.variants.length > 0) {
        const firstVariant = product.variants[0];
        if (firstVariant.color) setSelectedColor(firstVariant.color);
        if (firstVariant.size) setSelectedSize(firstVariant.size);
      }
    }
  }, [product]);

  // Handle color change
  const handleColorChange = (colorName) => {
    setSelectedColor(colorName);
    const matchingVariant = product?.variants?.find((v) => v.color?.toLowerCase() === colorName.toLowerCase());
    if (matchingVariant && matchingVariant.images && matchingVariant.images.length > 0) {
      setActiveImage(matchingVariant.images[0].imageUrl);
    }
    showToast(`Color selected: ${colorName}`);
  };

  // Zoom logic
  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPos({ x, y });
  };

  // Share Archive Link
  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast("Archive link copied to clipboard");
    }
  };

  if (loading) {
    return (
      <div className="product-detail-page">
        <Navbar />
        <div className="page-container detail-loader-wrap">
          <div className="detail-spinner"></div>
          <span className="detail-loader-text">RETRIEVING ARCHIVE SPECIFICATIONS...</span>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="product-detail-page">
        <Navbar />
        <div className="page-container detail-error-wrap">
          <span className="error-code-tag">404 // ARCHIVE NOT FOUND</span>
          <h2 className="error-title">Garment Unavailable</h2>
          <p className="error-desc">The requested architectural release has either expired, been relocated, or is currently undergoing studio curation.</p>
          <Link to="/" className="error-return-btn">RETURN TO HOME ARCHIVE ↗</Link>
        </div>
        <Footer />
      </div>
    );
  }

  // Real pricing & dynamic calculations
  const basePrice = parseFloat(product.price) || 999;
  const discountPrice = product.discountPrice ? parseFloat(product.discountPrice) : 999;
  const hasDiscount = discountPrice < basePrice;
  const discountPercent = hasDiscount ? Math.round(((basePrice - discountPrice) / basePrice) * 100) : 23;
  const savingsAmount = basePrice - discountPrice;
  const installmentAmount = (discountPrice / 3).toFixed(2);

  // Curated alternate angles for luxury streetwear tees to ensure a 3-image vertical column
  const defaultAlternateImages = [
    product.image || "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=1000&auto=format&fit=crop", // back graphic / primary
    "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=1000&auto=format&fit=crop", // front chest fit & silhouette
    "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=1000&auto=format&fit=crop", // reinforced 32mm collar detail
  ];

  // Variants and images
  const allProductImages = [
    product.image,
    ...(product.variants?.flatMap((v) => v.images?.map((img) => img.imageUrl) || []) || []),
  ].filter(Boolean);
  const mergedImages = [...new Set([...allProductImages, ...defaultAlternateImages])];
  const galleryThumbnails = mergedImages.slice(0, 3);
  const currentImage = activeImage || galleryThumbnails[0];

  // Real or Curated Colors
  const colorsList = product.variants?.map((v) => v.color).filter(Boolean).length > 0
    ? [...new Set(product.variants.map((v) => v.color).filter(Boolean))]
    : ["Onyx Black", "Vintage Slate", "Bone White", "Olive Drab"];

  // Sizes with architectural dimensions
  const sizesList = [
    { name: "S", chest: '38" CHEST', stock: 12 },
    { name: "M", chest: '41" CHEST', stock: 8 },
    { name: "L", chest: '44" CHEST', stock: 3, isScarcity: true },
    { name: "XL", chest: '47" CHEST', stock: 15 },
    { name: "XXL", chest: '50" CHEST', stock: 6 },
  ];

  // Dynamic Architectural Editorial Overlays
  const editionText = product.edition || "EDITION 01 // CORE ESSENTIALS";
  const fabricGsmText = product.fabricGsm || "240 GSM INTERLOCK";
  const subtitleText = product.subtitle || "Washed Onyx Black • Dropped Shoulder Silhouette • Pre-Shrunk Luxury Fit";
  const badgeLabelText = product.badgeLabel || `${discountPercent}% OFF ARCHIVE`;
  const batchLabelText = product.batchLabel || "BATCH 01 / ESSENTIALS";
  const modelSpecText = product.modelSpec || "MODEL SPEC: 6'1\" (185 CM) / 78 KG — WEARS SIZE L";
  const fitNoteText = product.fitNote || "Boxy silhouette. True-to-size gives the intended dramatic drape; size down for standard tailored fit.";

  // Dynamic Structured Editorial Content
  const techFeaturesList = product.techFeatures && Array.isArray(product.techFeatures) && product.techFeatures.length > 0
    ? product.techFeatures
    : DEFAULT_TECH_FEATURES;

  const macroTilesList = product.macroTiles && Array.isArray(product.macroTiles) && product.macroTiles.length > 0
    ? product.macroTiles
    : DEFAULT_MACRO_TILES;

  const accordionsData = {
    silhouette: product.accordions?.silhouette && product.accordions.silhouette.length > 0
      ? product.accordions.silhouette
      : DEFAULT_ACCORDIONS.silhouette,
    logistics: product.accordions?.logistics || DEFAULT_ACCORDIONS.logistics,
    care: product.accordions?.care || DEFAULT_ACCORDIONS.care,
  };

  const sizeGuideMatrix = product.sizeGuide && Array.isArray(product.sizeGuide) && product.sizeGuide.length > 0
    ? product.sizeGuide
    : DEFAULT_SIZE_GUIDE;

  // Add to Bag handler
  const handleAddToCart = () => {
    const activeVariant = product.variants?.find(
      (v) => v.color?.toLowerCase() === selectedColor.toLowerCase() && v.size === selectedSize
    ) || product.variants?.[0] || null;

    const cartProduct = {
      ...product,
      id: activeVariant ? activeVariant.id : product.id,
      productId: product.id,
      price: discountPrice,
      originalPrice: basePrice,
      selectedColor,
      selectedSize,
      sku: activeVariant?.sku || "OSM-240G-OVT-BLK",
    };

    addToCart(cartProduct, quantity);
    showToast(`Added ${quantity} × ${product.name} (${selectedSize}) to Bag ✓`);
  };

  return (
    <div className="product-detail-page luxury-white-theme">
      <Navbar />

      {/* Floating Notification Toast */}
      {toastMessage && (
        <div className="detail-toast-alert" role="status">
          <span className="toast-dot"></span>
          <span>{toastMessage}</span>
        </div>
      )}

      <main className="page-container detail-main-container">

        {/* =========================================================================
            2. SPLIT 2-COLUMN PRODUCT STUDIO SECTION
           ========================================================================= */}
        <section className="detail-studio-layout">
          {/* -------------------- LEFT COLUMN: IMAGERY & ARCHITECTURAL TILES -------------------- */}
          <div className="studio-imagery-col">
            {/* Modern Architectural Gallery: Left Vertical Column (3 larger images) + Showcase Frame */}
            <div className="showcase-gallery-layout">
              {/* Left Vertical Column of 3 Larger Images */}
              <div className="vertical-thumbnails-col" role="region" aria-label="Product angle thumbnails">
                {galleryThumbnails.map((imgUrl, idx) => {
                  const isCurrent = currentImage === imgUrl;
                  return (
                    <button
                      key={idx}
                      type="button"
                      className={`vertical-thumb-btn ${isCurrent ? "active" : ""}`}
                      onClick={() => setActiveImage(imgUrl)}
                      aria-label={`View perspective 0${idx + 1}`}
                      aria-pressed={isCurrent}
                    >
                      <div className="vertical-thumb-wrapper">
                        <img
                          src={imgUrl}
                          alt={`${product.name} view 0${idx + 1}`}
                          className="vertical-thumb-img"
                        />
                        <span className="thumb-index-tag">0{idx + 1}</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Primary Showcase Image (Compact sizing next to vertical column) */}
              <div
                className="showcase-image-frame"
                onMouseEnter={() => setIsZoomed(true)}
                onMouseLeave={() => setIsZoomed(false)}
                onMouseMove={handleMouseMove}
              >
                {/* Top Image Badges */}
                <div className="frame-badges-left">
                  <span className="badge-pill discount-pill">{badgeLabelText}</span>
                  <span className="badge-pill batch-pill">{batchLabelText}</span>
                </div>

                <div className="frame-badges-right">
                  <span className="badge-pill inspect-pill">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                      <circle cx="11" cy="11" r="8"></circle>
                      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                    HOVER TO INSPECT
                  </span>
                </div>

                {/* Main Image with Zoom Simulation */}
                <img
                  src={currentImage}
                  alt={product.name}
                  className={`showcase-img ${isZoomed ? "zoomed" : ""}`}
                  style={
                    isZoomed
                      ? { transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`, transform: "scale(1.75)" }
                      : undefined
                  }
                />

                {/* Bottom Model Spec Overlay */}
                <div className="frame-spec-overlay">
                  <span className="spec-item">{modelSpecText}</span>
                  <span className="spec-angle">3/4 ARCHITECTURAL VIEW</span>
                </div>
              </div>
            </div>

            {/* 4 Architectural Macro Detail Tiles */}
            <div className="architectural-tiles-grid">
              {macroTilesList.map((tile, idx) => (
                <div key={idx} className="arch-tile">
                  <div className="tile-img-wrap">
                    <img src={tile.imageUrl} alt={tile.title} className="tile-img" />
                    {tile.tag && <span className="tile-tag-overlay">{tile.tag}</span>}
                  </div>
                  <div className="tile-meta">
                    <h4 className="tile-title">{tile.title}</h4>
                    <p className="tile-desc">{tile.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>


          {/* -------------------- RIGHT COLUMN: PRODUCT SPECIFICATION & PURCHASE SIDEBAR -------------------- */}
          <div className="studio-spec-col">
            <div className="spec-sticky-panel">
              {/* Category Tag & Title */}
              <div className="spec-header-meta">
                <span className="spec-sub-tag">{editionText}</span>
                <span className="spec-gsm-pill">{fabricGsmText}</span>
              </div>

              <h1 className="spec-product-title">
                {product.name ? product.name.toUpperCase() : "OVERSIZED HEAVYWEIGHT T-SHIRT"}
              </h1>

              <p className="spec-silhouette-desc">
                {subtitleText}
              </p>

              {/* Star Rating & Review Metric */}
              <div className="spec-review-rating-row">
                <div className="stars-group" aria-label="Rating 4.92 out of 5 stars">
                  ★★★★★
                </div>
                <span className="rating-score">4.92</span>
                <span className="rating-count">(428 CLIENT REVIEWS)</span>
                <span className="verified-status-tag">● VERIFIED LUXURY FIT</span>
              </div>

              {/* Pricing Presentation */}
              <div className="spec-pricing-block">
                <div className="price-primary-row">
                  <span className="sale-price">₹{discountPrice.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
                  {hasDiscount && (
                    <span className="strike-price">₹{basePrice.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
                  )}
                  {hasDiscount && (
                    <span className="save-badge">SAVE {discountPercent}% (₹{savingsAmount.toFixed(0)})</span>
                  )}
                </div>
                <div className="price-sub-meta">
                  <span>INCLUSIVE OF ALL TAXES AND DUTIES</span>
                  <span>•</span>
                  <span>COMPLIMENTARY AIR DISPATCH + 7-DAY RETURNS</span>
                </div>
              </div>

              {/* Installment Callout Banner */}
              <div className="spec-installment-box">
                <span className="installment-icon">💳</span>
                <span className="installment-text">
                  Or split in 3 interest-free monthly installments of <strong>₹{installmentAmount}</strong> with zero surcharge.
                </span>
              </div>

              {/* Color Spectrum Selector */}
              <div className="spec-color-block">
                <div className="selector-label-row">
                  <span className="selector-title">COLOR SPECTRUM:</span>
                  <span className="selector-val-highlight">{selectedColor.toUpperCase()} (CURRENT)</span>
                </div>
                <div className="color-swatches-grid">
                  {colorsList.map((cName) => {
                    const isSelected = selectedColor.toLowerCase() === cName.toLowerCase();
                    return (
                      <button
                        key={cName}
                        type="button"
                        onClick={() => handleColorChange(cName)}
                        className={`color-pill-btn ${isSelected ? "selected" : ""}`}
                      >
                        <span className={`color-swatch-dot color-${cName.toLowerCase().replace(/\s+/g, "-")}`}></span>
                        <span className="color-btn-label">{cName.toUpperCase()}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Size Architecture Selector */}
              <div className="spec-size-block">
                <div className="selector-label-row">
                  <span className="selector-title">SIZE ARCHITECTURE:</span>
                  <button
                    type="button"
                    onClick={() => setIsSizeGuideOpen(true)}
                    className="size-guide-trigger-btn"
                  >
                    📏 SEPARATE SIZE GUIDE / MEASUREMENTS
                  </button>
                </div>

                <div className="size-buttons-row">
                  {sizesList.map((sizeObj) => {
                    const isSelected = selectedSize === sizeObj.name;
                    return (
                      <button
                        key={sizeObj.name}
                        type="button"
                        onClick={() => setSelectedSize(sizeObj.name)}
                        className={`size-card-btn ${isSelected ? "selected" : ""}`}
                      >
                        <span className="size-letter">{sizeObj.name}</span>
                        <span className="size-measurement">{sizeObj.chest}</span>
                        {sizeObj.isScarcity && (
                          <span className="scarcity-pill">3 LEFT</span>
                        )}
                      </button>
                    );
                  })}
                </div>

                <p className="size-recommendation-note">
                  ℹ️ {fitNoteText}
                </p>
              </div>

              {/* Purchase Controls Row */}
              <div className="spec-purchase-actions-row">
                <div className="quantity-stepper">
                  <button
                    type="button"
                    className="stepper-btn"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    aria-label="Decrease quantity"
                  >
                    —
                  </button>
                  <span className="stepper-value">{quantity}</span>
                  <button
                    type="button"
                    className="stepper-btn"
                    onClick={() => setQuantity(quantity + 1)}
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="spec-add-to-bag-btn"
                >
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                    <line x1="3" y1="6" x2="21" y2="6"></line>
                    <path d="M16 10a4 4 0 0 1-8 0"></path>
                  </svg>
                  <span>ADD TO BAG — ₹{(discountPrice * quantity).toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
                </button>

                <button
                  type="button"
                  onClick={handleToggleWishlist}
                  className={`spec-wishlist-toggle ${isWishlisted ? "active" : ""}`}
                  aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                  title={isWishlisted ? "Wishlisted" : "Add to Wishlist"}
                >
                  {isWishlisted ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="#000000" stroke="#000000" strokeWidth="2">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#111111" strokeWidth="1.8">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                    </svg>
                  )}
                </button>
              </div>

              {/* Express Checkout Button */}
              <button
                type="button"
                onClick={() => {
                  handleAddToCart();
                  showToast("Proceeding to Express Checkout...");
                }}
                className="spec-express-checkout-btn"
              >
                <span className="express-bolt">⚡</span>
                <span>INSTANT EXPRESS CHECKOUT WITH UPI</span>
              </button>

              {/* Trust Badges 3-Column Box */}
              <div className="spec-trust-services-grid">
                <div className="trust-card">
                  <span className="trust-icon">✈️</span>
                  <span className="trust-title">DISPATCH 24H</span>
                  <span className="trust-sub">Express Air Cargo</span>
                </div>
                <div className="trust-card">
                  <span className="trust-icon">🔄</span>
                  <span className="trust-title">7-DAY EXCHANGES</span>
                  <span className="trust-sub">Doorstep Reverse Pickup</span>
                </div>
                <div className="trust-card">
                  <span className="trust-icon">🛡️</span>
                  <span className="trust-title">100% AUTHENTIC</span>
                  <span className="trust-sub">Certified 240 GSM Cotton</span>
                </div>
              </div>

              {/* 4 Technical Feature Cards */}
              <div className="spec-tech-features-grid">
                {techFeaturesList.map((tf, idx) => (
                  <div key={idx} className="tech-box">
                    <span className="tech-heading">{tf.heading}</span>
                    <p className="tech-desc">{tf.desc}</p>
                  </div>
                ))}
              </div>

              {/* Collapsible Accordions (From Reference Design) */}
              <div className="spec-accordions-group">
                {/* Accordion 1: Silhouette Specification */}
                <div className={`spec-accordion-item ${activeAccordion === "silhouette" ? "open" : ""}`}>
                  <button
                    type="button"
                    className="spec-accordion-header"
                    onClick={() => setActiveAccordion(activeAccordion === "silhouette" ? null : "silhouette")}
                  >
                    <span className="accordion-label">SILHOUETTE SPECIFICATION & TAILORING</span>
                    <span className="accordion-arrow">{activeAccordion === "silhouette" ? "−" : "+"}</span>
                  </button>
                  {activeAccordion === "silhouette" && (
                    <div className="spec-accordion-body">
                      <ul className="spec-bullets-list">
                        {Array.isArray(accordionsData.silhouette) ? (
                          accordionsData.silhouette.map((bullet, idx) => (
                            <li key={idx}>{bullet}</li>
                          ))
                        ) : (
                          <li>{accordionsData.silhouette}</li>
                        )}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Accordion 2: Logistics */}
                <div className={`spec-accordion-item ${activeAccordion === "logistics" ? "open" : ""}`}>
                  <button
                    type="button"
                    className="spec-accordion-header"
                    onClick={() => setActiveAccordion(activeAccordion === "logistics" ? null : "logistics")}
                  >
                    <span className="accordion-label">AIR LOGISTICS, TRACKING & DISPATCH</span>
                    <span className="accordion-arrow">{activeAccordion === "logistics" ? "−" : "+"}</span>
                  </button>
                  {activeAccordion === "logistics" && (
                    <div className="spec-accordion-body">
                      <p className="spec-paragraph">
                        {accordionsData.logistics}
                      </p>
                    </div>
                  )}
                </div>

                {/* Accordion 3: Fabric Care */}
                <div className={`spec-accordion-item ${activeAccordion === "care" ? "open" : ""}`}>
                  <button
                    type="button"
                    className="spec-accordion-header"
                    onClick={() => setActiveAccordion(activeAccordion === "care" ? null : "care")}
                  >
                    <span className="accordion-label">FABRIC CARE PROTOCOL & LONGEVITY</span>
                    <span className="accordion-arrow">{activeAccordion === "care" ? "−" : "+"}</span>
                  </button>
                  {activeAccordion === "care" && (
                    <div className="spec-accordion-body">
                      <p className="spec-paragraph">
                        {accordionsData.care}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            3. MID-PAGE ARCHITECTURAL BANNER ("ENGINEERED FOR THE CULTURE")
           ========================================================================= */}
        <section className="detail-engineering-banner">
          <div className="eng-banner-container">
            <div className="eng-banner-left">
              <span className="eng-eyebrow">ARCHITECTURAL TEXTILE ENGINEERING // 2026</span>
              <h2 className="eng-title">ENGINEERED FOR THE CULTURE</h2>
              <p className="eng-body">
                We spent 9 months formulating our 240 GSM combed compact cotton. The resulting hand feel is dense, structured, and heavy enough to hold a sculptured drape without clinging to the body.
              </p>
            </div>

            <div className="eng-banner-right">
              <div className="eng-metric-card">
                <span className="eng-metric-num">0% SAG</span>
                <span className="eng-metric-label">Rib collar tested over 40 wash cycles with tension gauge preservation.</span>
              </div>
              <div className="eng-metric-card">
                <span className="eng-metric-num">+38% DENSITY</span>
                <span className="eng-metric-label">Heavier than market standard 180 GSM lightweight blank t-shirts.</span>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            4. AUTHENTIC CLIENT FIELD REPORTS & REVIEWS SECTION
           ========================================================================= */}
        <section className="detail-reviews-section">
          <div className="reviews-header-block">
            <div className="reviews-header-top">
              <span className="reviews-eyebrow">AUTHENTIC CLIENT FEEDBACK — VERIFIED PURCHASERS ONLY</span>
              <div className="reviews-action-btns">
                <button type="button" className="rev-filter-btn">FILTER: PHOTO REVIEWS (84)</button>
                <button type="button" onClick={() => setIsReviewModalOpen(true)} className="rev-write-btn">
                  WRITE A REPORT ↗
                </button>
              </div>
            </div>
            <h2 className="reviews-main-title">CLIENT FIELD REPORTS (428)</h2>
          </div>

          {/* Metric Ratings Summary Bar */}
          <div className="reviews-metric-dashboard">
            <div className="metric-score-box">
              <span className="big-rating-number">4.92</span>
              <div className="rating-stars-gold">★★★★★</div>
              <span className="recommend-tag">98.4% RECOMMEND THIS GARMENT</span>
            </div>

            <div className="metric-fit-profile">
              <span className="fit-label">FIT PROFILE METRIC</span>
              <div className="fit-scale-bar">
                <span className="scale-end">RUNS SMALL</span>
                <span className="scale-center-tag">TRUE BOXY OVERSIZED (89%)</span>
                <span className="scale-end">RUNS LARGE</span>
              </div>
              <p className="fit-note">Consensus: Order your usual size for signature drape.</p>
            </div>

            <div className="metric-lab-certificate">
              <span className="cert-check-icon">✓</span>
              <div className="cert-text-group">
                <span className="cert-title">300% 240 GSM LAB TESTED</span>
                <span className="cert-desc">Zero pilling or fiber breakdown reported after 30 days of daily active wear.</span>
              </div>
            </div>
          </div>

          {/* 3 Verified Client Reviews Cards */}
          <div className="reviews-cards-grid">
            <div className="review-card">
              <div className="review-card-top">
                <div className="review-stars">★★★★★</div>
                <span className="review-date">2 DAYS AGO</span>
              </div>
              <h3 className="review-headline">"Blank tees that cost 5x more"</h3>
              <p className="review-body">
                "The weight of this tee is genuinely insane. Easily rivals Represent or Cole Buxton blanks that cost ₹8,000+. The collar sits high and stiff, doesn't droop at all. Buying 4 more in bone white immediately."
              </p>
              <div className="review-author-meta">
                <span className="author-name">JAIDEEP V.</span>
                <span className="verified-badge">✓ VERIFIED CLIENT</span>
                <span className="purchase-spec">PURCHASED: SIZE L</span>
              </div>
            </div>

            <div className="review-card">
              <div className="review-card-top">
                <div className="review-stars">★★★★★</div>
                <span className="review-date">5 DAYS AGO</span>
              </div>
              <h3 className="review-headline">"Perfect boxy architectural drape"</h3>
              <p className="review-body">
                "I am 5'11 and ordered size M. It drops right at mid-fly with that exact wide-shoulder Japanese streetwear shape I've been hunting for in Indian brands. Pure regret not buying earlier."
              </p>
              <div className="review-author-meta">
                <span className="author-name">AARAV S.</span>
                <span className="verified-badge">✓ VERIFIED CLIENT</span>
                <span className="purchase-spec">PURCHASED: SIZE M</span>
              </div>
            </div>

            <div className="review-card">
              <div className="review-card-top">
                <div className="review-stars">★★★★★</div>
                <span className="review-date">8 DAYS AGO</span>
              </div>
              <h3 className="review-headline">"Holds up in machine wash"</h3>
              <p className="review-body">
                "Washed twice inside out on gentle cycle. Zero-sag ribbing, zero shrinkage around the chest, and the ribbed neck is still tight as day one. Quality is authentic 10/10."
              </p>
              <div className="review-author-meta">
                <span className="author-name">ROHIT G.</span>
                <span className="verified-badge">✓ VERIFIED CLIENT</span>
                <span className="purchase-spec">PURCHASED: SIZE XL</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* =========================================================================
          5. SIZE GUIDE MODAL
         ========================================================================= */}
      {isSizeGuideOpen && (
        <div className="detail-modal-backdrop" onClick={() => setIsSizeGuideOpen(false)}>
          <div className="detail-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-group">
                <span className="modal-eyebrow">ARCHITECTURAL MEASUREMENTS</span>
                <h3 className="modal-title">Garment Dimension Matrix (Inches)</h3>
              </div>
              <button onClick={() => setIsSizeGuideOpen(false)} className="modal-close-btn" aria-label="Close modal">✕</button>
            </div>

            <div className="modal-table-wrap">
              <table className="size-matrix-table">
                <thead>
                  <tr>
                    <th>SIZE</th>
                    <th>CHEST WIDTH</th>
                    <th>BODY LENGTH</th>
                    <th>SHOULDER DROP</th>
                    <th>SLEEVE OPENING</th>
                  </tr>
                </thead>
                <tbody>
                  {sizeGuideMatrix.map((row, idx) => {
                    const isSelected = row.size === selectedSize || (row.size && row.size.includes(selectedSize));
                    return (
                      <tr key={row.size || idx} className={isSelected ? "highlight-row" : ""}>
                        <td><strong>{row.size} {isSelected ? "(SELECTED)" : ""}</strong></td>
                        <td>{row.chest}</td>
                        <td>{row.length}</td>
                        <td>{row.shoulder}</td>
                        <td>{row.sleeve}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="modal-footer-note">
              <span>* Dimensions calibrated for deliberate relaxed boxy drape. Measurements may fluctuate ±0.5" due to hand-compacted fabric finishing.</span>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          6. WRITE CLIENT FIELD REPORT MODAL
         ========================================================================= */}
      {isReviewModalOpen && (
        <div className="detail-modal-backdrop" onClick={() => setIsReviewModalOpen(false)}>
          <div className="detail-modal-card review-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-group">
                <span className="modal-eyebrow">CLIENT ARCHIVE SUBMISSION</span>
                <h3 className="modal-title">Submit Client Field Report</h3>
              </div>
              <button onClick={() => setIsReviewModalOpen(false)} className="modal-close-btn" aria-label="Close modal">✕</button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setIsReviewModalOpen(false);
                showToast("Thank you. Your field report has been submitted for verification.");
              }}
              className="review-submit-form"
            >
              <div className="form-field-group">
                <label className="form-label">YOUR FULL NAME</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Jaideep Verma"
                  value={reviewForm.name}
                  onChange={(e) => setReviewForm({ ...reviewForm, name: e.target.value })}
                  className="form-input"
                />
              </div>

              <div className="form-field-group">
                <label className="form-label">RATING (1-5 STARS)</label>
                <select
                  value={reviewForm.rating}
                  onChange={(e) => setReviewForm({ ...reviewForm, rating: Number(e.target.value) })}
                  className="form-input"
                >
                  <option value={5}>★★★★★ (5/5) Exceptional Quality</option>
                  <option value={4}>★★★★☆ (4/5) Very Good</option>
                  <option value={3}>★★★☆☆ (3/5) Average</option>
                </select>
              </div>

              <div className="form-field-group">
                <label className="form-label">HEADLINE</label>
                <input
                  type="text"
                  required
                  placeholder="One sentence summary of your experience"
                  value={reviewForm.headline}
                  onChange={(e) => setReviewForm({ ...reviewForm, headline: e.target.value })}
                  className="form-input"
                />
              </div>

              <div className="form-field-group">
                <label className="form-label">REPORT DETAILS</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Describe the fabric weight, collar tension, and overall drape..."
                  value={reviewForm.text}
                  onChange={(e) => setReviewForm({ ...reviewForm, text: e.target.value })}
                  className="form-input form-textarea"
                />
              </div>

              <button type="submit" className="form-submit-btn">
                SUBMIT REPORT TO ARCHIVE ↗
              </button>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
