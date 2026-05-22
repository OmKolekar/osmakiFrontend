import ProductGrid from "../products/ProductGrid";

export default function TrendingView({ products }) {
  return (
    <div className="container">
      <div className="trending-grid-wrapper">
        <ProductGrid products={products} />
      </div>
    </div>
  );
}
