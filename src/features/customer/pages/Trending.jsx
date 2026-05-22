import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import TrendingHeader from "../components/trending/TrendingHeader";
import TrendingView from "../components/trending/TrendingView";
import "../styles/trending.css";
import "../styles/collection.css";

import { products } from "../../../data/products";
const trendingProducts = products.filter((p) => p.id >= 300 && p.id < 400);

export default function Trending() {
  return (
    <div className="trending-page">
      <Navbar />

      <TrendingHeader />

      <div className="page-container">
        <TrendingView products={trendingProducts} />
      </div>

      <Footer />
    </div>
  );
}
