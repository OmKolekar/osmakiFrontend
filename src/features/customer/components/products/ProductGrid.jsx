import ProductCard from "./ProductCard";
import "../../styles/product.css";

export default function ProductGrid({ products }) {
  const displayProducts = products || new Array(8).fill({
    name: "Skincare Product",
    price: 1200,
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348",
  });

  return (
    <div className="product-grid">
      {displayProducts.map((p, i) => (
        <ProductCard key={p.id || i} product={p} />
      ))}
    </div>
  );
}
