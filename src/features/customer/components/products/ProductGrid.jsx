import ProductCard from "./ProductCard";
import "../../styles/product.css";

export default function ProductGrid({ products }) {
  const displayProducts = Array.isArray(products) ? products : [];

  return (
    <div className="product-grid">
      {displayProducts.map((p, i) => (
        <ProductCard key={p.id || i} product={p} />
      ))}
    </div>
  );
}
