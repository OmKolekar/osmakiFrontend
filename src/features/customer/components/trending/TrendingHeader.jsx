import React from "react";
import { usePageSections } from "../../hooks/usePageSections";
import HeroSlider from "../shared/HeroSlider";

export default function TrendingHeader() {
  const { sections, loading } = usePageSections("trending");

  const heroSections = sections.filter((s) => s.sectionType === "hero");

  const fallback = (
    <section className="category-hero">
      <img
        src="https://images.unsplash.com/photo-1620916566398-39f1143ab7be"
        alt="Trending Banner"
        className="category-hero-image"
      />
      <div className="category-hero-overlay"></div>
      <div className="category-hero-content">
        <span className="category-hero-tag">OSMAKI TRENDING</span>
        <h1 className="category-hero-title">Trending Now</h1>
        <p className="category-hero-subtitle">
          Discover the high-performance clean skincare formulations taking the beauty world by storm. Verified best-sellers and community favorites.
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
