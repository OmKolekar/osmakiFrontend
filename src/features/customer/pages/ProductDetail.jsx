import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { useCart } from "../context/CartContext";
import { useProductDetail } from "../hooks/useProductDetail";
import "../styles/productDetail.css";

export default function ProductDetail() {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { id } = useParams();
  const { product, loading, error } = useProductDetail(id);

  // Active image & variant selection
  const [activeImage, setActiveImage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const [toastMessage, setToastMessage] = useState("");

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

  // Sync initial product data & select first available variant color/size
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
    const matchingVariant = product?.variants?.find(
      (v) => v.color?.toLowerCase() === colorName.toLowerCase()
    );
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

  if (loading) {
    return (
      <div className="product-detail-page">
        <Navbar />
        <div className="page-container detail-loader-wrap">
          <div className="detail-spinner"></div>
          <span className="detail-loader-text">RETRIEVING PRODUCT SPECIFICATIONS...</span>
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
          <span className="error-code-tag">404 // PRODUCT NOT FOUND</span>
          <h2 className="error-title">Garment Unavailable</h2>
          <p className="error-desc">
            The requested product has either expired, been relocated, or is currently unavailable.
          </p>
          <Link to="/" className="error-return-btn">RETURN TO HOME ARCHIVE ↗</Link>
        </div>
        <Footer />
      </div>
    );
  }

  // Consistent pricing calculations based solely on product input
  const basePrice = product.price ? parseFloat(product.price) : 0;
  const discountPrice = product.discountPrice ? parseFloat(product.discountPrice) : basePrice;
  const hasDiscount = discountPrice > 0 && discountPrice < basePrice;
  const discountPercent = hasDiscount ? Math.round(((basePrice - discountPrice) / basePrice) * 100) : 0;
  const savingsAmount = basePrice - discountPrice;

  // Real product images from product definition and variant images
  const allProductImages = [
    product.image,
    ...(product.variants?.flatMap((v) => v.images?.map((img) => img.imageUrl) || []) || []),
  ].filter(Boolean);
  const galleryThumbnails = [...new Set(allProductImages)];
  if (galleryThumbnails.length === 0 && product.image) {
    galleryThumbnails.push(product.image);
  }
  const currentImage = activeImage || galleryThumbnails[0] || "";

  // Available colors strictly from variants
  const colorsList = product.variants?.map((v) => v.color).filter(Boolean).length > 0
    ? [...new Set(product.variants.map((v) => v.color).filter(Boolean))]
    : [];

  // Available sizes strictly from variants (filtered by selected color if present)
  const variantsForSelectedColor = product.variants?.filter(
    (v) => !selectedColor || !v.color || v.color.toLowerCase() === selectedColor.toLowerCase()
  ) || [];

  const rawSizes = (variantsForSelectedColor.length > 0 ? variantsForSelectedColor : (product.variants || []))
    .map((v) => v.size)
    .filter(Boolean);

  const uniqueSizes = [...new Set(rawSizes)];

  const sizesList = uniqueSizes.map((s) => {
    const matchingVar = product.variants?.find(
      (v) => v.size === s && (!selectedColor || !v.color || v.color.toLowerCase() === selectedColor.toLowerCase())
    );
    const stock = matchingVar ? parseInt(matchingVar.stock, 10) : null;
    return {
      name: s,
      stock: stock !== null && !isNaN(stock) ? stock : null,
      isScarcity: stock !== null && stock > 0 && stock <= 5,
    };
  });

  // Basic Identity
  const subtitleText = product.subtitle || "";
  const brandName = product.brand || "OSMAKI";
  const categoryName = product.category?.name || "";

  // Add to Bag handler
  const handleAddToCart = () => {
    const activeVariant = product.variants?.find(
      (v) =>
        (!selectedColor || v.color?.toLowerCase() === selectedColor.toLowerCase()) &&
        (!selectedSize || v.size === selectedSize)
    ) || product.variants?.[0] || null;

    const cartProduct = {
      ...product,
      id: activeVariant ? activeVariant.id : product.id,
      productId: product.id,
      price: discountPrice > 0 ? discountPrice : basePrice,
      originalPrice: basePrice,
      selectedColor,
      selectedSize,
      sku: activeVariant?.sku || product.slug || "OSM-ITEM",
    };

    addToCart(cartProduct, quantity);
    showToast(`Added ${quantity} × ${product.name} ${selectedSize ? `(${selectedSize})` : ""} to Bag ✓`);
  };

  // Buy Now handler: adds to bag and directs straight to checkout
  const handleBuyNow = () => {
    handleAddToCart();
    navigate("/checkout");
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
            SPLIT 2-COLUMN PRODUCT STUDIO SECTION
           ========================================================================= */}
        <section className="detail-studio-layout">
          {/* -------------------- LEFT COLUMN: IMAGERY -------------------- */}
          <div className="studio-imagery-col">
            <div className="showcase-gallery-layout">
              {/* Left Vertical Column of Thumbnails (only if multiple images exist) */}
              {galleryThumbnails.length > 1 && (
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
              )}

              {/* Primary Showcase Image Frame */}
              <div
                className="showcase-image-frame"
                onMouseEnter={() => setIsZoomed(true)}
                onMouseLeave={() => setIsZoomed(false)}
                onMouseMove={handleMouseMove}
              >
                {/* Discount Badge */}
                {hasDiscount && (
                  <div className="frame-badges-left">
                    <span className="badge-pill discount-pill">SAVE {discountPercent}%</span>
                  </div>
                )}

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
                {currentImage ? (
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
                ) : (
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "#999" }}>
                    No Image Available
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* -------------------- RIGHT COLUMN: PRODUCT SPECIFICATION & PURCHASE -------------------- */}
          <div className="studio-spec-col">
            <div className="spec-sticky-panel">
              {/* Category & Brand Metadata + Gender Allocation */}
              <div className="spec-header-meta">
                <div className="spec-meta-badges">
                  {product.gender && (
                    <span className="spec-gender-badge">{product.gender.toUpperCase()}</span>
                  )}
                  {brandName && <span className="spec-brand-tag">{brandName.toUpperCase()}</span>}
                </div>
                {categoryName && <span className="spec-category-pill">{categoryName.toUpperCase()}</span>}
              </div>

              <h1 className="spec-product-title">
                {product.name ? product.name.toUpperCase() : "UNTITLED PRODUCT"}
              </h1>

              {/* Subtitle (only if configured in admin) */}
              {subtitleText && (
                <p className="spec-silhouette-desc">
                  {subtitleText}
                </p>
              )}

              {/* Pricing Presentation */}
              <div className="spec-pricing-block">
                <div className="price-primary-row">
                  <span className="sale-price">
                    ₹{(discountPrice > 0 ? discountPrice : basePrice).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </span>
                  {hasDiscount && (
                    <span className="strike-price">
                      ₹{basePrice.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                    </span>
                  )}
                  {hasDiscount && (
                    <span className="save-badge">
                      SAVE {discountPercent}% (₹{savingsAmount.toFixed(0)})
                    </span>
                  )}
                </div>
                <div className="price-sub-meta">
                  <span>INCLUSIVE OF ALL TAXES AND DUTIES</span>
                  <span>•</span>
                  <span>COMPLIMENTARY AIR DISPATCH + 7-DAY RETURNS</span>
                </div>
              </div>

              {/* Editorial Description & Notes */}
              {product.description && (
                <div className="spec-editorial-description">
                  <span className="spec-editorial-label">PRODUCT DETAILS & FIT</span>
                  <p className="spec-editorial-text">{product.description}</p>
                </div>
              )}

              {/* Combined Color Spectrum & Available Sizes in ONE LINE / ROW */}
              {(colorsList.length > 0 || sizesList.length > 0) && (
                <div className="spec-selectors-row">
                  {/* Left: Color Spectrum */}
                  {colorsList.length > 0 && (
                    <div className="spec-inline-selector">
                      <div className="selector-mini-label">
                        <span className="selector-title">COLOR SPECTRUM:</span>
                        {selectedColor && (
                          <span className="selector-val-highlight">{selectedColor.toUpperCase()} (CURRENT)</span>
                        )}
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
                  )}

                  {/* Right: Available Sizes */}
                  {sizesList.length > 0 && (
                    <div className="spec-inline-selector">
                      <div className="selector-mini-label">
                        <span className="selector-title">AVAILABLE SIZES:</span>
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
                              {sizeObj.isScarcity && (
                                <span className="scarcity-pill">{sizeObj.stock} LEFT</span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Purchase Controls Row: Buy Now (First & Larger), Add to Cart (Second & Smaller) */}
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

                {/* 1. Primary Buy Button (First & Larger in size) */}
                <button
                  type="button"
                  onClick={handleBuyNow}
                  className="spec-buy-now-btn"
                  title="Buy Now"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                  </svg>
                  <span>
                    BUY NOW — ₹{((discountPrice > 0 ? discountPrice : basePrice) * quantity).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </span>
                </button>

                {/* 2. Add to Cart Button (Second & Smaller in size) */}
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="spec-add-to-bag-btn"
                  title="Add to Cart"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                    <line x1="3" y1="6" x2="21" y2="6"></line>
                    <path d="M16 10a4 4 0 0 1-8 0"></path>
                  </svg>
                  <span>ADD TO CART</span>
                </button>

                {/* 3. Wishlist Toggle */}
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
                  navigate("/checkout");
                }}
                className="spec-express-checkout-btn"
              >
                <span className="express-bolt">⚡</span>
                <span>INSTANT EXPRESS CHECKOUT WITH UPI</span>
              </button>

              {/* Trust Badges */}
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
                  <span className="trust-sub">Certified Studio Quality</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
