import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { useCart } from "../context/CartContext";
import { useProductDetail } from "../hooks/useProductDetail";
import "../styles/productDetail.css";

export default function ProductDetail() {
  const { addToCart } = useCart();
  const { id } = useParams();

  const { product, loading, error } = useProductDetail(id);
  const [activeImage, setActiveImage] = useState("");
  const [quantity, setQuantity] = useState(1);
  
  // Selected variant state
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");

  const [openTab, setOpenTab] = useState("description"); // Default open tab
  const [zoomStyle, setZoomStyle] = useState({
    transformOrigin: "center center",
    transform: "scale(1)",
  });

  // Set default active image when product changes
  useEffect(() => {
    if (product) {
      setActiveImage(product.image);
      setQuantity(1);
    }
  }, [product]);

  // Set default color when product changes
  useEffect(() => {
    if (product?.variants) {
      const colorsList = [...new Set(product.variants.map(v => v.color).filter(Boolean))];
      if (colorsList.length > 0) {
        setSelectedColor(colorsList[0]);
      }
    }
  }, [product]);

  // Set default size when selected color changes
  useEffect(() => {
    if (selectedColor && product?.variants) {
      const availableSizes = product.variants
        .filter(v => v.color === selectedColor && v.stock > 0)
        .map(v => v.size);
      if (availableSizes.length > 0) {
        setSelectedSize(availableSizes[0]);
      } else {
        const firstSize = product.variants.filter(v => v.color === selectedColor).map(v => v.size)[0];
        setSelectedSize(firstSize || "");
      }
    }
  }, [selectedColor, product]);

  if (loading) {
    return (
      <div className="product-detail-page">
        <Navbar />
        <div className="page-container" style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "400px" }}>
          <div className="loader-spinner"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="product-detail-page">
        <Navbar />
        <div className="page-container" style={{ textAlign: "center", padding: "100px 20px" }}>
          <h2 style={{ fontFamily: "Playfair Display, serif", marginBottom: "20px" }}>Product Not Found</h2>
          <p style={{ fontFamily: "Inter, sans-serif", color: "#666", marginBottom: "30px" }}>
            The product you are looking for does not exist or has been moved.
          </p>
          <Link to="/" style={{
            fontFamily: "Inter, sans-serif",
            textDecoration: "underline",
            color: "#111",
            fontWeight: "500"
          }}>
            Back to Home
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  // Hover Zoom Logic
  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomStyle({
      transformOrigin: `${x}% ${y}%`,
      transform: "scale(1.8)",
    });
  };

  const handleMouseLeave = () => {
    setZoomStyle({
      transformOrigin: "center center",
      transform: "scale(1)",
    });
  };

  const toggleTab = (tabName) => {
    setOpenTab(openTab === tabName ? null : tabName);
  };

  // E-commerce helper variables
  const colors = product.variants ? [...new Set(product.variants.map(v => v.color).filter(Boolean))] : [];
  const sizes = product.variants ? [...new Set(product.variants.map(v => v.size).filter(Boolean))] : [];

  const activeVariant = product.variants?.find(
    v => v.color === selectedColor && v.size === selectedSize
  );

  const displayPrice = activeVariant && activeVariant.price 
    ? parseFloat(activeVariant.price) 
    : product.price;

  const displayStock = activeVariant ? activeVariant.stock : 0;

  const isSizeOutOfStock = (sizeName) => {
    const v = product.variants?.find(varItem => varItem.color === selectedColor && varItem.size === sizeName);
    return !v || v.stock <= 0;
  };

  const handleAddToCart = () => {
    if (sizes.length > 0 && !selectedSize) {
      alert("Please select a size.");
      return;
    }
    if (sizes.length > 0 && displayStock === 0) {
      return; // out of stock
    }

    const cartProduct = {
      ...product,
      id: activeVariant ? activeVariant.id : product.id,
      productId: product.id,
      price: displayPrice,
      selectedColor,
      selectedSize,
      sku: activeVariant ? activeVariant.sku : null,
    };
    addToCart(cartProduct, quantity);
  };

  const currentImage = activeImage || product.image || "";

  return (
    <div className="product-detail-page">
      <Navbar />

      <div className="page-container">
        <div className="product-detail-container">
          {/* Image Gallery Section */}
          <div className="image-gallery-section">
            <div className="thumbnail-list">
              {product.images?.map((img, index) => (
                <button
                   key={index}
                   className={`thumbnail-button ${currentImage === img ? "active" : ""}`}
                   onClick={() => setActiveImage(img)}
                >
                  <img src={img} alt={`${product.name} thumbnail ${index + 1}`} className="thumbnail-image" />
                </button>
              ))}
            </div>

            <div
              className="main-image-container"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              <img
                src={currentImage}
                alt={product.name}
                className="main-image"
                style={zoomStyle}
              />
            </div>
          </div>

          {/* Product Details Section */}
          <div className="product-details-info">
            <div className="product-details-header">
              <span className="product-category-breadcrumb">
                Home / {product.gender || "Catalog"}
              </span>
              <h1 className="product-title">{product.name}</h1>
              <p className="product-price">₹{displayPrice}</p>
              <p className="product-description">{product.description}</p>
            </div>

            <div className="product-details-buy-flow">
              {/* Color Variant Selector */}
              {colors.length > 0 && (
                <div className="color-selection-section">
                  <div className="color-selection-title">
                    Color: <span className="selected-value-text">{selectedColor}</span>
                  </div>
                  <div className="color-options">
                    {colors.map((c) => (
                      <button
                        key={c}
                        className={`color-btn ${selectedColor === c ? "active" : ""}`}
                        onClick={() => setSelectedColor(c)}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Size Variant Selector */}
              {sizes.length > 0 && (
                <div className="size-selection-section">
                  <div className="size-selection-title">
                    Size: <span className="selected-value-text">{selectedSize || "Select a size"}</span>
                  </div>
                  <div className="size-options-grid">
                    {sizes.map((s) => {
                      const outOfStock = isSizeOutOfStock(s);
                      return (
                        <button
                          key={s}
                          className={`size-btn ${selectedSize === s ? "active" : ""} ${outOfStock ? "out-of-stock" : ""}`}
                          disabled={false}
                          onClick={() => setSelectedSize(s)}
                        >
                          {s}
                        </button>
                      );
                    })}
                  </div>

                  {/* Stock Status Indicator */}
                  {selectedSize && (
                    <div className={`stock-status ${displayStock === 0 ? "out-of-stock" : displayStock <= 10 ? "low-stock" : "in-stock"}`}>
                      {displayStock === 0 
                        ? "Out of stock" 
                        : displayStock <= 10 
                        ? `Only ${displayStock} left - order soon` 
                        : "In Stock"
                      }
                    </div>
                  )}
                </div>
              )}

              {/* Purchase Controls */}
              <div className="purchase-section">
                <div className="quantity-selector">
                  <button
                    className="quantity-btn"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    —
                  </button>
                  <span className="quantity-value">{quantity}</span>
                  <button
                    className="quantity-btn"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    +
                  </button>
                </div>

                <button
                  className={`add-to-cart-btn ${(sizes.length > 0 && displayStock === 0) ? "disabled" : ""}`}
                  disabled={sizes.length > 0 && displayStock === 0}
                  onClick={handleAddToCart}
                >
                  {sizes.length > 0 && displayStock === 0 ? "OUT OF STOCK" : "ADD TO CART"}
                </button>
              </div>
            </div>

            {/* Accordion Tabs */}
            <div className="product-info-accordions">
              {/* Description & Fit Tab */}
              <div className={`accordion-item ${openTab === "description" ? "active" : ""}`}>
                <button className="accordion-header" onClick={() => toggleTab("description")}>
                  <span className="accordion-title">Description & Fit</span>
                  <span className="accordion-icon">{openTab === "description" ? "−" : "+"}</span>
                </button>
                <div className="accordion-content-wrapper">
                  <div className="accordion-content">
                    {product.description || "No description available."}
                  </div>
                </div>
              </div>

              {/* Shipping & Delivery Tab */}
              <div className={`accordion-item ${openTab === "shipping" ? "active" : ""}`}>
                <button className="accordion-header" onClick={() => toggleTab("shipping")}>
                  <span className="accordion-title">Shipping & Delivery</span>
                  <span className="accordion-icon">{openTab === "shipping" ? "−" : "+"}</span>
                </button>
                <div className="accordion-content-wrapper">
                  <div className="accordion-content">
                    Free standard shipping on orders over ₹1,500. Delivered in 3-5 business days.
                  </div>
                </div>
              </div>

              {/* Returns Tab */}
              <div className={`accordion-item ${openTab === "returns" ? "active" : ""}`}>
                <button className="accordion-header" onClick={() => toggleTab("returns")}>
                  <span className="accordion-title">Free Returns</span>
                  <span className="accordion-icon">{openTab === "returns" ? "−" : "+"}</span>
                </button>
                <div className="accordion-content-wrapper">
                  <div className="accordion-content">
                    We offer free returns within 30 days of purchase. Items must be unworn, unwashed, and in their original packaging with tags attached.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
