import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import WomenHeader from "../components/women/WomenHeader";
import WomenView from "../components/women/WomenView";
import "../styles/collection.css";

import { products } from "../../../data/products";
const womenProducts = products.filter((p) => p.id >= 200 && p.id < 300);

export default function Women() {
  return (
    <div className="collection-page">
      <Navbar />

      <WomenHeader />

      <div className="page-container">
        <WomenView products={womenProducts} />
      </div>

      <Footer />
    </div>
  );
}
