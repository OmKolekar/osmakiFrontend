import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import MenHeader from "../components/men/MenHeader";
import MenView from "../components/men/MenView";
import "../styles/collection.css";

import { products } from "../../../data/products";
const menProducts = products.filter((p) => p.id >= 100 && p.id < 200);

export default function Men() {
  return (
    <div className="collection-page">
      <Navbar />

      <MenHeader />

      <div className="page-container">
        <MenView products={menProducts} />
      </div>

      <Footer />
    </div>
  );
}
