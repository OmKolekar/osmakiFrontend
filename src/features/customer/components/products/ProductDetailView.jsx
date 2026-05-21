export default function ProductDetailView() {
  return (
    <div className="product-detail-container">
      <img
        src="https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd"
        className="product-image"
        alt="Hydrating Serum"
      />

      <div className="product-info">
        <h1 className="product-title">Hydrating Serum</h1>

        <p className="product-description">
          Lightweight serum designed to hydrate and restore skin balance.
        </p>

        <p className="product-price">₹1200</p>

        <button className="add-cart-btn">Add to Cart</button>
      </div>
    </div>
  );
}
