import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import ProductCard from "../components/products/ProductCard";
import Hero from "../components/home/Hero";
import "../styles/home.css";
import "../styles/product.css";

import { products } from "../../../data/products";
const homeProducts = products.filter((p) => p.id <= 3);

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
            {homeProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}

