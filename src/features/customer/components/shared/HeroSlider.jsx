import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/heroSlider.css";

export default function HeroSlider({ sections = [], fallback = null }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();
  const timeoutRef = useRef(null);

  const getTargetLink = (section) => {
    if (section.targetType === "product" && section.targetId) {
      return `/product/${section.targetId}`;
    }
    if (section.targetType === "category") {
      return section.targetUrl || "/";
    }
    if (section.targetUrl) {
      return section.targetUrl;
    }
    return "/";
  };

  const handleNavigation = (section) => {
    const link = getTargetLink(section);
    if (link.startsWith("http")) {
      window.open(link, "_blank", "noopener,noreferrer");
    } else {
      navigate(link);
    }
  };

  const resetTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  useEffect(() => {
    if (sections.length <= 1) return;

    resetTimeout();
    timeoutRef.current = setTimeout(
      () =>
        setCurrentIndex((prevIndex) =>
          prevIndex === sections.length - 1 ? 0 : prevIndex + 1
        ),
      5000
    );

    return () => {
      resetTimeout();
    };
  }, [currentIndex, sections.length]);

  if (!sections || sections.length === 0) {
    return fallback;
  }

  const handlePrev = (e) => {
    e.stopPropagation();
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? sections.length - 1 : prevIndex - 1
    );
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setCurrentIndex((prevIndex) =>
      prevIndex === sections.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handleDotClick = (index, e) => {
    e.stopPropagation();
    setCurrentIndex(index);
  };

  return (
    <section className="hero-slider-container">
      <div
        className="hero-slider-track"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {sections.map((section, idx) => {
          const isActive = idx === currentIndex;
          const isDarkText = section.textColor === "dark";
          const textAlignClass = `text-${section.textAlign || "center"}`;

          return (
            <div
              key={section.id || idx}
              className={`hero-slide-item ${isActive ? "active" : ""}`}
            >
              <picture className="hero-slide-picture">
                {section.mobileImage && (
                  <source media="(max-width: 768px)" srcSet={section.mobileImage} />
                )}
                <img
                  src={section.desktopImage || "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519"}
                  alt={section.imageAltText || section.title || "Hero banner"}
                  className="hero-slide-img"
                />
              </picture>
              <div className="hero-slide-overlay"></div>
              <div className={`hero-slide-content ${textAlignClass} ${isDarkText ? "text-dark" : "text-light"}`}>
                {section.title && <h1 className="hero-slide-title">{section.title}</h1>}
                {section.subtitle && <p className="hero-slide-subtitle">{section.subtitle}</p>}
                {section.buttonText && (
                  <button
                    onClick={() => handleNavigation(section)}
                    className="hero-slide-btn"
                  >
                    {section.buttonText}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {sections.length > 1 && (
        <>
          <button className="slider-arrow prev" onClick={handlePrev} aria-label="Previous Slide">
            &#10094;
          </button>
          <button className="slider-arrow next" onClick={handleNext} aria-label="Next Slide">
            &#10095;
          </button>

          <div className="slider-dots">
            {sections.map((_, idx) => (
              <button
                key={idx}
                className={`slider-dot ${idx === currentIndex ? "active" : ""}`}
                onClick={(e) => handleDotClick(idx, e)}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
