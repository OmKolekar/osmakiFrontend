import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { useCart } from "../context/CartContext";
import { useProductDetail } from "../hooks/useProductDetail";
import PriceDisplay from "../components/products/PriceDisplay";
import "../styles/productDetail.css";

export default function ProductDetail() {
  const { addToCart } = useCart();
  const { id } = useParams();

  const { product, loading, error } = useProductDetail(id);
  const [activeImage, setActiveImage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [prevImage, setPrevImage] = useState("");
  
  // Selected variant state
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");

  const [openTab, setOpenTab] = useState("description"); // Default open tab

  // Mobile image slider state
  const [mobileActiveIndex, setMobileActiveIndex] = useState(0);

  const handleMobileScroll = (e) => {
    const { scrollLeft, clientWidth } = e.currentTarget;
    if (clientWidth > 0) {
      const index = Math.round(scrollLeft / clientWidth);
      setMobileActiveIndex(index);
    }
  };

  const scrollToSlide = (index) => {
    const slider = document.querySelector(".mobile-image-slider");
    if (slider) {
      slider.scrollTo({
        left: slider.clientWidth * index,
        behavior: "smooth"
      });
      setMobileActiveIndex(index);
    }
  };

  // Reset slider scroll when variants change
  useEffect(() => {
    setMobileActiveIndex(0);
    const slider = document.querySelector(".mobile-image-slider");
    if (slider) {
      slider.scrollLeft = 0;
    }
  }, [selectedColor, selectedSize]);


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

  const activeVariant = product?.variants?.find(
    v => v.color === selectedColor && v.size === selectedSize
  );

  // Reset active image when selected variant changes
  useEffect(() => {
    if (activeVariant && activeVariant.images && activeVariant.images.length > 0) {
      setActiveImage(activeVariant.images[0].imageUrl);
    } else {
      setActiveImage("");
    }
  }, [selectedColor, selectedSize, activeVariant]);

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
    
    const img = e.currentTarget.querySelector(".main-image");
    if (img) {
      img.style.transformOrigin = `${x}% ${y}%`;
      img.style.transform = "scale(1.8)";
    }
  };

  const handleMouseLeave = (e) => {
    const img = e.currentTarget.querySelector(".main-image");
    if (img) {
      img.style.transformOrigin = "center center";
      img.style.transform = "scale(1)";
    }
  };

  const toggleTab = (tabName) => {
    setOpenTab(openTab === tabName ? null : tabName);
  };

  // E-commerce helper variables
  const colors = product.variants ? [...new Set(product.variants.map(v => v.color).filter(Boolean))] : [];
  const sizes = product.variants ? [...new Set(product.variants.map(v => v.size).filter(Boolean))] : [];


  const displayPrice = activeVariant && activeVariant.price 
    ? parseFloat(activeVariant.price) 
    : product.price;

  const displayDiscountPrice = activeVariant && activeVariant.discountPrice 
    ? parseFloat(activeVariant.discountPrice) 
    : product.discountPrice;

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
      price: displayDiscountPrice && displayDiscountPrice < displayPrice ? displayDiscountPrice : displayPrice,
      originalPrice: displayPrice,
      selectedColor,
      selectedSize,
      sku: activeVariant ? activeVariant.sku : null,
    };
    addToCart(cartProduct, quantity);
  };

  const activeVariantImages = activeVariant?.images?.map(img => img.imageUrl) || [];
  const displayImages = activeVariantImages.length > 0 ? activeVariantImages : (product.images || []);
  const currentImage = activeImage || (displayImages.length > 0 ? displayImages[0] : product.image || "");

  // Sync state during rendering to prevent race conditions with multiple initial renders
  if (currentImage !== prevImage) {
    setPrevImage(currentImage);
    setImageLoaded(false);
  }



  return (
    <div className="product-detail-page">
      <Navbar />

      <div className="page-container">
        <div className="product-detail-container">
          {/* Mobile Header (visible only on mobile) */}
          <div className="mobile-product-header">
            <span className="product-category-breadcrumb">
              Home / {product.gender || "Catalog"}
            </span>
            <h1 className="product-title">{product.name}</h1>
          </div>

          {/* Image Gallery Section */}
          <div className="image-gallery-section">
            <div className="thumbnail-list">
              {displayImages.map((img, index) => (
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
                className={`main-image ${imageLoaded ? "loaded" : "not-loaded"}`}
                onLoad={() => setImageLoaded(true)}
              />
            </div>
          </div>

          {/* Mobile Image Slider Section (visible only on mobile) */}
          {displayImages.length > 0 && (
            <div className="mobile-image-slider-wrapper">
              <div className="mobile-image-slider" onScroll={handleMobileScroll}>
                {displayImages.map((img, index) => (
                  <div key={index} className="mobile-slider-slide">
                    <img src={img} alt={`${product.name} slide ${index + 1}`} className="mobile-slider-image" />
                  </div>
                ))}
              </div>
              {displayImages.length > 1 && (
                <>
                  <div className="mobile-slider-dots">
                    {displayImages.map((_, index) => (
                      <span
                        key={index}
                        className={`slider-dot ${mobileActiveIndex === index ? "active" : ""}`}
                        onClick={() => scrollToSlide(index)}
                      ></span>
                    ))}
                  </div>
                  <div className="mobile-thumbnail-list">
                    {displayImages.map((img, index) => (
                      <button
                         key={index}
                         className={`mobile-thumbnail-button ${mobileActiveIndex === index ? "active" : ""}`}
                         onClick={() => scrollToSlide(index)}
                      >
                        <img src={img} alt={`${product.name} mobile thumbnail ${index + 1}`} className="mobile-thumbnail-image" />
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {/* Product Details Section */}
          <div className="product-details-info">
            <div className="product-details-header">
              {/* Desktop Header (hidden on mobile) */}
              <div className="desktop-product-header">
                <span className="product-category-breadcrumb">
                  Home / {product.gender || "Catalog"}
                </span>
                <h1 className="product-title">{product.name}</h1>
              </div>
              <div style={{ margin: "15px 0" }}>
                <PriceDisplay price={displayPrice} discountPrice={displayDiscountPrice} size="lg" />
              </div>
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
