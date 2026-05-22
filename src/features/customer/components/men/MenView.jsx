import ProductGrid from "../products/ProductGrid";

export default function MenView({ products }) {
  return (
    <div className="container">
      <div className="collection-grid-wrapper">
        <ProductGrid products={products} />
      </div>
    </div>
  );
}
