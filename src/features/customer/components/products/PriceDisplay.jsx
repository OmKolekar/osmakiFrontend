import React from "react";

export default function PriceDisplay({ price, discountPrice, size = "md" }) {
  const hasDiscount =
    discountPrice &&
    parseFloat(discountPrice) > 0 &&
    parseFloat(discountPrice) < parseFloat(price);

  const calculateDiscountPercent = () => {
    if (!price || !discountPrice) return 0;
    const diff = parseFloat(price) - parseFloat(discountPrice);
    return Math.round((diff / parseFloat(price)) * 100);
  };

  const getContainerStyles = () => {
    switch (size) {
      case "sm":
        return { fontSize: "14px", lineHeight: "1.4" };
      case "lg":
        return { fontSize: "22px", lineHeight: "1.2" };
      default:
        return { fontSize: "16px", lineHeight: "1.3" };
    }
  };

  const currentPriceStyle = {
    fontWeight: "600",
    color: hasDiscount ? "#b91c1c" : "#111", // red highlight for discount, charcoal for regular
  };

  const originalPriceStyle = {
    textDecoration: "line-through",
    color: "#888",
    fontSize: "0.85em",
    marginLeft: "8px",
    fontWeight: "400",
  };

  const discountBadgeStyle = {
    color: "#15803d", // Green text for discount percentage
    fontSize: "0.75em",
    fontWeight: "600",
    marginLeft: "8px",
    letterSpacing: "0.5px",
    backgroundColor: "#f0fdf4",
    padding: "2px 8px",
    borderRadius: "4px",
    display: "inline-block",
  };

  return (
    <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", ...getContainerStyles() }}>
      {hasDiscount ? (
        <>
          <span style={currentPriceStyle}>₹{parseFloat(discountPrice).toFixed(2)}</span>
          <span style={originalPriceStyle}>₹{parseFloat(price).toFixed(2)}</span>
          <span style={discountBadgeStyle}>{calculateDiscountPercent()}% OFF</span>
        </>
      ) : (
        <span style={currentPriceStyle}>
          {price !== undefined && price !== null ? `₹${parseFloat(price).toFixed(2)}` : ""}
        </span>
      )}
    </div>
  );
}
