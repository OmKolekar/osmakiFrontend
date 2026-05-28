import React from "react";
import { usePageSections } from "../../hooks/usePageSections";
import HeroSlider from "../shared/HeroSlider";

export default function MenHeader() {
  const { sections, loading } = usePageSections("men");

  const heroSections = sections.filter((s) => s.sectionType === "hero");

  const fallback = (
    <section className="category-hero">
      <img
        src="https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf"
        alt="Men's Collection Banner"
        className="category-hero-image"
      />
      <div className="category-hero-overlay"></div>
      <div className="category-hero-content">
        <span className="category-hero-tag">OSMAKI MEN</span>
        <h1 className="category-hero-title">Men's Collection</h1>
        <p className="category-hero-subtitle">
          High-performance, botanical grooming essentials engineered for men's skin. Simple, clean, and effective.
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
