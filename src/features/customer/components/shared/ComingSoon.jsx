import React from "react";
import { Link } from "react-router-dom";
import "../../styles/comingSoon.css";

/**
 * ComingSoon component for presenting an elegant, minimal blank screen
 * with a warm and gentle message for collections in curation.
 */
export default function ComingSoon({
  categoryTitle = "Collection",
  badge = "COMING SOON",
  subtitle = "Crafted with quiet distinction",
  message = "We are thoughtfully curating our upcoming collection with the highest standards of craftsmanship and understated luxury. Something truly exceptional is on its way.",
  gentleNote = "Thank you for your patience and gentle anticipation.",
  showHomeButton = true,
  homeButtonText = "Return to Home",
}) {
  return (
    <main className="coming-soon-container" role="main" aria-label={`${categoryTitle} Coming Soon`}>
      <div className="coming-soon-content">
        {/* Subtle decorative emblem */}
        <div className="coming-soon-icon" aria-hidden="true">
          <span className="coming-soon-sparkle">✦</span>
        </div>

        {/* Category Badge */}
        {badge && <span className="coming-soon-badge">{badge}</span>}

        {/* Main Heading */}
        <h1 className="coming-soon-title">{categoryTitle}</h1>

        {/* Elegant Accent Line */}
        <div className="coming-soon-divider" aria-hidden="true"></div>

        {/* Subtitle */}
        {subtitle && <p className="coming-soon-subtitle">{subtitle}</p>}

        {/* Gentle Message Paragraph */}
        {message && <p className="coming-soon-message">{message}</p>}

        {/* Gentle Note */}
        {gentleNote && <p className="coming-soon-note">{gentleNote}</p>}

        {/* Gentle Home Action */}
        {showHomeButton && (
          <div className="coming-soon-action">
            <Link to="/" className="coming-soon-btn">
              <span>{homeButtonText}</span>
              <span className="coming-soon-arrow">→</span>
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
