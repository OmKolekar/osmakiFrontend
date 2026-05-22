export default function TrendingHeader() {
  return (
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
}
