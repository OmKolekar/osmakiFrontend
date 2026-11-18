import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import "../../styles/productCard.css";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const [showSizeSelector, setShowSizeSelector] = useState(false);
  const [addingState, setAddingState] = useState("idle"); // "idle" | "loading" | "added" | "error"
  const [isHovered, setIsHovered] = useState(false);
  const sizeSelectorRef = useRef(null);

  // Price & Discount calculations
  const priceNum = parseFloat(product.price);
  const discountPriceNum = product.discountPrice ? parseFloat(product.discountPrice) : null;
  const hasDiscount = discountPriceNum && discountPriceNum > 0 && discountPriceNum < priceNum;

  const discountPercent = hasDiscount
    ? Math.round(((priceNum - discountPriceNum) / priceNum) * 100)
    : 0;

  const formatPrice = (val) => {
    if (val === undefined || val === null || isNaN(val)) return "";
    const num = parseFloat(val);
    const hasDecimals = num % 1 !== 0;
    return `₹${num.toLocaleString("en-IN", {
      minimumFractionDigits: hasDecimals ? 2 : 0,
      maximumFractionDigits: 2,
    })}`;
  };

  // Primary & Secondary Image resolution
  const variantImages = product.variants?.flatMap((v) => v.images?.map((img) => img.imageUrl) || []).filter(Boolean) || [];
  const allImages = [...new Set([product.image, ...variantImages].filter(Boolean))];
  const primaryImage = product.image || allImages[0] || "https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd";
  const secondaryImage = allImages.length > 1 && allImages[1] !== primaryImage ? allImages[1] : null;

  // Real sizes and colors from actual product variants
  const availableSizes = product.variants && Array.isArray(product.variants)
    ? [...new Set(product.variants.filter((v) => v.size && (v.stock === undefined || v.stock > 0)).map((v) => v.size))]
    : [];

  const availableColors = product.variants && Array.isArray(product.variants)
    ? [...new Set(product.variants.map((v) => v.color).filter(Boolean))]
    : [];

  // Wishlist state persisted to localStorage
  const [isWishlisted, setIsWishlisted] = useState(() => {
    try {
      const saved = localStorage.getItem("osmaki_wishlist");
      const list = saved ? JSON.parse(saved) : [];
      return list.includes(product.id);
    } catch {
      return false;
    }
  });

  useEffect(() => {
    const handleSyncWishlist = () => {
      try {
        const saved = localStorage.getItem("osmaki_wishlist");
        const list = saved ? JSON.parse(saved) : [];
        setIsWishlisted(list.includes(product.id));
      } catch {
        // silent fallback
      }
    };
    window.addEventListener("osmaki_wishlist_updated", handleSyncWishlist);
    return () => window.removeEventListener("osmaki_wishlist_updated", handleSyncWishlist);
  }, [product.id]);

  const handleToggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const saved = localStorage.getItem("osmaki_wishlist");
      let list = saved ? JSON.parse(saved) : [];
      if (isWishlisted) {
        list = list.filter((id) => id !== product.id);
        setIsWishlisted(false);
      } else {
        list.push(product.id);
        setIsWishlisted(true);
      }
      localStorage.setItem("osmaki_wishlist", JSON.stringify(list));
      window.dispatchEvent(new Event("osmaki_wishlist_updated"));
    } catch (err) {
      console.error("Failed to update wishlist:", err);
    }
  };

  // Close size selector when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (sizeSelectorRef.current && !sizeSelectorRef.current.contains(e.target)) {
        setShowSizeSelector(false);
      }
    };
    if (showSizeSelector) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showSizeSelector]);

  // Direct add or open size drawer
  const handleQuickAddClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (addingState === "loading" || addingState === "added") return;

    if (availableSizes.length > 0) {
      setShowSizeSelector(!showSizeSelector);
    } else {
      executeAddToCart(null);
    }
  };

  const handleSelectSize = (size, e) => {
    e.preventDefault();
    e.stopPropagation();
    executeAddToCart(size);
  };

  const executeAddToCart = async (selectedSize) => {
    setAddingState("loading");
    try {
      const variant = selectedSize
        ? product.variants?.find((v) => v.size === selectedSize)
        : product.variants?.[0] || null;

      const cartProduct = {
        ...product,
        id: variant ? variant.id : product.id,
        productId: product.id,
        price: (variant?.discountPrice || product.discountPrice) || (variant?.price || product.price),
        originalPrice: variant?.price || product.price,
        selectedSize: selectedSize || null,
        selectedColor: variant?.color || null,
        sku: variant?.sku || null,
      };

      await addToCart(cartProduct, 1);
      setAddingState("added");
      setShowSizeSelector(false);

      setTimeout(() => {
        setAddingState("idle");
      }, 2000);
    } catch (err) {
      console.error("Failed to add product to bag:", err);
      setAddingState("error");
      setTimeout(() => {
        setAddingState("idle");
      }, 2500);
    }
  };

  // Color helper mapping for real color dots
  const getColorHex = (name) => {
    if (!name) return "#111111";
    const key = name.toLowerCase().trim();
    const hexMap = {
      black: "#111111",
      white: "#f8f8f8",
      charcoal: "#2e2e2e",
      grey: "#71717a",
      gray: "#71717a",
      bone: "#f3f0e6",
      chalk: "#e7e5e4",
      slate: "#475569",
      olive: "#4b5320",
      brown: "#5c4033",
      navy: "#0f172a",
      beige: "#f5f5dc",
      cream: "#fffdd0",
      sand: "#d4a373",
      tan: "#d2b48c",
      washed: "#3f3f46",
    };
    return hexMap[key] || "#262626";
  };

  return (
    <article
      className="product-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        if (!showSizeSelector) {
          setShowSizeSelector(false);
        }
      }}
    >
      {/* 1. PRODUCT IMAGE CONTAINER (Aspect Ratio 3:4) */}
      <div className="product-image-container">
        <Link
          to={`/product/${product.id}`}
          className="product-image-link"
          tabIndex={0}
          aria-label={`View details for ${product.name}`}
        >
          <img
            src={primaryImage}
            alt={product.name}
            className={`product-image primary ${isHovered && secondaryImage ? "has-secondary" : ""}`}
            loading="lazy"
          />

          {secondaryImage && (
            <img
              src={secondaryImage}
              alt={`${product.name} alternate view`}
              className={`product-image secondary ${isHovered ? "active" : ""}`}
              loading="lazy"
            />
          )}
        </Link>

        {/* Top Left Badge: DROP 001 */}
        <div className="product-badge-group">
          <span className="product-badge drop-badge">DROP 001</span>
        </div>

        {/* Top Right: Compact Discount Badge + Wishlist Heart Button */}
        <div className="product-top-actions">
          {hasDiscount && (
            <span className="product-discount-badge">{discountPercent}% OFF</span>
          )}

          <button
            type="button"
            className={`wishlist-btn ${isWishlisted ? "active" : ""}`}
            onClick={handleToggleWishlist}
            aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
            aria-pressed={isWishlisted}
            title={isWishlisted ? "Wishlisted" : "Add to wishlist"}
          >
            {isWishlisted ? (
              <svg width="17" height="17" viewBox="0 0 24 24" fill="#000000" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
            ) : (
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#111111" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
            )}
          </button>
        </div>

        {/* Shopping Interaction: Quick Add & Compact Size Drawer */}
        <div className="quick-add-container" ref={sizeSelectorRef}>
          {showSizeSelector ? (
            <div className="size-selector-drawer" onClick={(e) => e.stopPropagation()}>
              <div className="size-selector-header">
                <span className="size-selector-title">SELECT SIZE</span>
                <button
                  type="button"
                  className="size-close-btn"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setShowSizeSelector(false);
                  }}
                  aria-label="Close size selector"
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>

              <div className="size-pills-row">
                {availableSizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    className="size-pill-btn"
                    onClick={(e) => handleSelectSize(size, e)}
                    disabled={addingState === "loading"}
                    aria-label={`Select size ${size}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <button
              type="button"
              className={`quick-add-btn ${addingState === "added" ? "added" : ""} ${addingState === "loading" ? "loading" : ""}`}
              onClick={handleQuickAddClick}
              disabled={addingState === "loading"}
              aria-label={availableSizes.length > 0 ? "Select size to add to bag" : "Quick add to bag"}
            >
              {addingState === "loading" ? (
                <span className="quick-add-spinner" aria-hidden="true"></span>
              ) : addingState === "added" ? (
                <>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  <span>ADDED TO BAG</span>
                </>
              ) : (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                    <line x1="3" y1="6" x2="21" y2="6"></line>
                    <path d="M16 10a4 4 0 0 1-8 0"></path>
                  </svg>
                  <span>{availableSizes.length > 0 ? "QUICK ADD" : "ADD TO BAG"}</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* 2. REFINED PRODUCT INFORMATION SECTION */}
      <div className="product-info">
        {/* Subtle Subtitle / Category Descriptor */}
        <div className="product-subtitle">
          {product.gender ? `${product.gender.toUpperCase()} · ` : ""}RELAXED FIT · EVERYDAY ESSENTIAL
        </div>

        {/* Product Title */}
        <h3 className="product-name">
          <Link to={`/product/${product.id}`} className="product-name-link">
            {product.name}
          </Link>
        </h3>

        {/* Refined Monochrome Pricing Presentation */}
        <div className="product-price-row">
          <span className="product-current-price">
            {hasDiscount ? formatPrice(discountPriceNum) : formatPrice(priceNum)}
          </span>

          {hasDiscount && (
            <span className="product-original-price">
              {formatPrice(priceNum)}
            </span>
          )}

          {hasDiscount && (
            <span className="product-savings-tag">
              SAVE {formatPrice(priceNum - discountPriceNum)}
            </span>
          )}
        </div>

        {/* Optional Real Color Swatches (Rendered only when real variants exist) */}
        {availableColors.length > 1 && (
          <div className="product-colors-row" aria-label={`Available in ${availableColors.length} colors`}>
            {availableColors.slice(0, 4).map((color) => (
              <span
                key={color}
                className="color-swatch-dot"
                title={color}
                style={{ backgroundColor: getColorHex(color) }}
                aria-hidden="true"
              />
            ))}
            {availableColors.length > 4 && (
              <span className="color-count-label">+{availableColors.length - 4}</span>
            )}
          </div>
        )}
      </div>
    </article>
  );
}
