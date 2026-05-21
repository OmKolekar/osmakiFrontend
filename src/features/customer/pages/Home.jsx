import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import ProductCard from "../components/products/ProductCard";
import Hero from "../components/home/Hero";
import "../styles/home.css";
import "../styles/product.css";

const products = [
  {
    id: 1,
    name: "Hydrating Serum",
    price: 1200,
    image: "https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd",
  },
  {
    id: 2,
    name: "Skin Cleanser",
    price: 900,
    image: "https://images.unsplash.com/photo-1585386959984-a4155224a1ad",
  },
  {
    id: 3,
    name: "Body Lotion",
    price: 1100,
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348",
  },
];

export default function Home() {
  return (
    <div className="home-page">
      <Navbar />

      {/* HERO IMAGE */}
      <Hero />

      {/* PRODUCTS */}
      <div className="page-container">
        <section className="products">
          <h2 className="section-title">Best Sellers</h2>

          <div className="product-grid">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}

