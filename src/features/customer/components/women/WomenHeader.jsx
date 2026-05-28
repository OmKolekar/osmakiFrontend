import React from "react";
import { usePageSections } from "../../hooks/usePageSections";
import HeroSlider from "../shared/HeroSlider";

export default function WomenHeader() {
  const { sections, loading } = usePageSections("women");

  const heroSections = sections.filter((s) => s.sectionType === "hero");

  const fallback = (
    <section className="category-hero">
      <img
        src="https://images.unsplash.com/photo-1556228720-195a672e8a03"
        alt="Women's Collection Banner"
        className="category-hero-image"
      />
      <div className="category-hero-overlay"></div>
      <div className="category-hero-content">
        <span className="category-hero-tag">OSMAKI WOMEN</span>
        <h1 className="category-hero-title">Women's Collection</h1>
        <p className="category-hero-subtitle">
          Pure botanical formulations engineered to nourish, restore, and illuminate your natural beauty.
        </p>
      </div>
    </section>
  );

  if (loading) {
    return (
      <div className="collection-loader" style={{ textAlign: "center", padding: "45px" }}>
        <div className="loader-spinner" style={{ margin: "0 auto" }}></div>
      </div>
    );
  }

  return <HeroSlider sections={heroSections} fallback={fallback} />;
}
