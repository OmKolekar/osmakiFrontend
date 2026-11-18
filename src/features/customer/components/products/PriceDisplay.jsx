import React from "react";

export default function PriceDisplay({
  price,
  discountPrice,
  size = "md",
  showBadge = true,
  className = "",
}) {
  const hasDiscount =
    discountPrice &&
    parseFloat(discountPrice) > 0 &&
    parseFloat(discountPrice) < parseFloat(price);

  const calculateDiscountPercent = () => {
    if (!price || !discountPrice) return 0;
    const diff = parseFloat(price) - parseFloat(discountPrice);
    return Math.round((diff / parseFloat(price)) * 100);
  };

  const formatPrice = (val) => {
    if (val === undefined || val === null || isNaN(val)) return "";
    const num = parseFloat(val);
    const hasDecimals = num % 1 !== 0;
    return `₹${num.toLocaleString("en-IN", {
      minimumFractionDigits: hasDecimals ? 2 : 0,
      maximumFractionDigits: 2,
    })}`;
  };

  const getContainerStyles = () => {
    switch (size) {
      case "sm":
        return { fontSize: "14px", lineHeight: "1.4" };
      case "lg":
        return { fontSize: "26px", lineHeight: "1.2" };
      case "md":
      default:
        return { fontSize: "18px", lineHeight: "1.3" };
    }
  };

  const simpleFont = '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';

  // Premium monochrome streetwear styling (replaces old bright green)
  const currentPriceStyle = {
    fontFamily: simpleFont,
    fontWeight: "750",
    fontSize: "1.05em",
    color: "#0a0a0a",
    letterSpacing: "-0.02em",
  };

  const originalPriceStyle = {
    fontFamily: simpleFont,
    textDecoration: "line-through",
    color: "#737373",
    fontSize: "0.78em",
    marginLeft: "8px",
    fontWeight: "400",
  };

  const discountBadgeStyle = {
    fontFamily: simpleFont,
    color: "#000000",
    fontSize: "0.68em",
    fontWeight: "700",
    marginLeft: "8px",
    letterSpacing: "0.5px",
    backgroundColor: "#f4f4f5",
    border: "1px solid rgba(0, 0, 0, 0.08)",
    padding: "2px 7px",
    borderRadius: "3px",
    display: "inline-block",
    textTransform: "uppercase",
  };

  return (
    <div
      className={`price-display-wrap ${className}`}
      style={{
        display: "flex",
        alignItems: "center",
        flexWrap: "wrap",
        fontFamily: simpleFont,
        ...getContainerStyles(),
      }}
    >
      {hasDiscount ? (
        <>
          <span style={currentPriceStyle}>{formatPrice(discountPrice)}</span>
          <span style={originalPriceStyle}>{formatPrice(price)}</span>
          {showBadge && (
            <span style={discountBadgeStyle}>{calculateDiscountPercent()}% OFF</span>
          )}
        </>
      ) : (
        <span style={currentPriceStyle}>
          {price !== undefined && price !== null ? formatPrice(price) : ""}
        </span>
      )}
    </div>
  );
}
