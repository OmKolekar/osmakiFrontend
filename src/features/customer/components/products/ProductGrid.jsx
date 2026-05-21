import ProductCard from "./ProductCard";

export default function ProductGrid() {
  const products = new Array(8).fill({
    name: "Skincare Product",
    price: 1200,
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348",
  });

  return (
    <div className="products-grid">
      {products.map((p, i) => (
        <ProductCard key={i} product={p} />
      ))}
    </div>
  );
}
