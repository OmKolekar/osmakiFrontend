import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { usePageSections } from "../../hooks/usePageSections";
import Hero from "./Hero";
import "../../styles/dynamicSections.css";

export default function DynamicSections() {
  const { sections, loading } = usePageSections("home");
  const [subscribedEmail, setSubscribedEmail] = useState("");
  const [subscribedMessage, setSubscribedMessage] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!subscribedEmail) return;
    setSubscribedMessage("Thank you for subscribing! Keep an eye on your inbox.");
    setSubscribedEmail("");
  };

  const getTargetLink = (section) => {
    if (section.targetType === "product" && section.targetId) {
      return `/product/${section.targetId}`;
    }
    if (section.targetType === "category" && section.targetId) {
      // Map basic categories if they exist, or just use custom URL
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

  if (loading) {
    return (
      <div className="sections-loader">
        <div className="loader-spinner"></div>
      </div>
    );
  }

  // If there are no dynamic sections defined in the DB yet,
  // fallback to the default static Hero component so the home page is not empty.
  if (sections.length === 0) {
    return <Hero />;
  }

  return (
    <div className="dynamic-sections-container">
      {sections.map((section) => {
        const isDarkText = section.textColor === "dark";
        const textAlignClass = `text-${section.textAlign || "center"}`;
        const targetLink = getTargetLink(section);

        switch (section.sectionType) {
          case "hero":
            return (
              <section key={section.id} className="dynamic-hero">
                <picture className="hero-picture">
                  {section.mobileImage && (
                    <source media="(max-width: 768px)" srcSet={section.mobileImage} />
                  )}
                  <img
                    src={section.desktopImage || "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519"}
                    alt={section.imageAltText || section.title || "Hero banner"}
                    className="hero-img"
                  />
                </picture>

                <div className={`hero-overlay ${textAlignClass} ${isDarkText ? "text-dark" : "text-light"}`}>
                  {section.title && <h1 className="hero-title">{section.title}</h1>}
                  {section.subtitle && <p className="hero-subtitle">{section.subtitle}</p>}
                  {section.buttonText && (
                    <button onClick={() => handleNavigation(section)} className="hero-action-btn">
                      {section.buttonText}
                    </button>
                  )}
                </div>
              </section>
            );

          case "banner":
            return (
              <section key={section.id} className="dynamic-banner-section">
                <div 
                  className="banner-card" 
                  onClick={() => handleNavigation(section)}
                  style={{ cursor: section.buttonText ? "default" : "pointer" }}
                >
                  <picture className="banner-picture">
                    {section.mobileImage && (
                      <source media="(max-width: 768px)" srcSet={section.mobileImage} />
                    )}
                    <img
                      src={section.desktopImage}
                      alt={section.imageAltText || section.title || "Promotion banner"}
                      className="banner-bg-img"
                    />
                  </picture>
                  <div className={`banner-content ${textAlignClass} ${isDarkText ? "text-dark" : "text-light"}`}>
                    {section.title && <h2 className="banner-title">{section.title}</h2>}
                    {section.subtitle && <p className="banner-subtitle">{section.subtitle}</p>}
                    {section.buttonText && (
                      <button onClick={(e) => { e.stopPropagation(); handleNavigation(section); }} className="banner-action-btn">
                        {section.buttonText}
                      </button>
                    )}
                  </div>
                </div>
              </section>
            );

          case "newsletter":
            const newsletterBg = (isMobile && section.mobileImage) ? section.mobileImage : section.desktopImage;
            return (
              <section 
                key={section.id} 
                className="dynamic-newsletter-section"
                style={
                  newsletterBg 
                    ? { backgroundImage: `url(${newsletterBg})` } 
                    : undefined
                }
              >
                <div className="newsletter-overlay-container">
                  <div className="newsletter-card-glass">
                    {section.title && <h2 className="newsletter-title">{section.title}</h2>}
                    {section.subtitle && <p className="newsletter-subtitle">{section.subtitle}</p>}
                    
                    <form onSubmit={handleSubscribe} className="newsletter-form-row">
                      <input
                        type="email"
                        placeholder="Enter your email address"
                        value={subscribedEmail}
                        onChange={(e) => setSubscribedEmail(e.target.value)}
                        required
                        className="newsletter-input-field"
                      />
                      <button type="submit" className="newsletter-submit-btn">
                        {section.buttonText || "Subscribe"}
                      </button>
                    </form>
                    {subscribedMessage && (
                      <p className="newsletter-success-msg">{subscribedMessage}</p>
                    )}
                  </div>
                </div>
              </section>
            );

          default:
            return null;
        }
      })}
    </div>
  );
}
