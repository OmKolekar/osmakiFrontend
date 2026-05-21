import "../../styles/productCard.css";

export default function ProductCard({ product }) {
  return (
    <div className="product-card">
      <img src={product.image} className="product-image" alt={product.name} />

      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>

        <p className="product-price">₹{product.price}</p>
      </div>
    </div>
  );
}
