import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { products } from "../../../data/products";
import { useCart } from "../../../context/CartContext";
import "../styles/productDetail.css";

export default function ProductDetail() {
  const { addToCart } = useCart();
  const { id } = useParams();
  const product = products.find((p) => p.id === parseInt(id));

  const [activeImage, setActiveImage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [openTab, setOpenTab] = useState("ingredients"); // Default open tab
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

  if (!product) {
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
                  className={`thumbnail-button ${activeImage === img ? "active" : ""}`}
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
                src={activeImage}
                alt={product.name}
                className="main-image"
                style={zoomStyle}
              />
            </div>
          </div>

          {/* Product Details Section */}
          <div className="product-details-info">
            <span className="product-category-breadcrumb">
              Home / {product.id >= 200 ? "Women" : product.id >= 100 ? "Men" : "Best Sellers"}
            </span>
            <h1 className="product-title">{product.name}</h1>
            <p className="product-price">₹{product.price}</p>
            <p className="product-description">{product.description}</p>

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
                className="add-to-cart-btn"
                onClick={() => addToCart(product, quantity)}
              >
                ADD TO CART
              </button>
            </div>

            {/* Accordion Tabs */}
            <div className="product-info-accordions">
              {/* Ingredients Tab */}
              <div className={`accordion-item ${openTab === "ingredients" ? "active" : ""}`}>
                <button className="accordion-header" onClick={() => toggleTab("ingredients")}>
                  <span className="accordion-title">Ingredients</span>
                  <span className="accordion-icon">↓</span>
                </button>
                <div className="accordion-content-wrapper">
                  <div className="accordion-content">{product.ingredients}</div>
                </div>
              </div>

              {/* Benefits Tab */}
              <div className={`accordion-item ${openTab === "benefits" ? "active" : ""}`}>
                <button className="accordion-header" onClick={() => toggleTab("benefits")}>
                  <span className="accordion-title">Benefits</span>
                  <span className="accordion-icon">↓</span>
                </button>
                <div className="accordion-content-wrapper">
                  <div className="accordion-content">{product.benefits}</div>
                </div>
              </div>

              {/* How To Use Tab */}
              <div className={`accordion-item ${openTab === "howToUse" ? "active" : ""}`}>
                <button className="accordion-header" onClick={() => toggleTab("howToUse")}>
                  <span className="accordion-title">How To Use</span>
                  <span className="accordion-icon">↓</span>
                </button>
                <div className="accordion-content-wrapper">
                  <div className="accordion-content">{product.howToUse}</div>
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
