import React, { useState, useEffect } from "react";

export default function SectionFormModal({
  isOpen,
  section,
  products,
  isSubmitting,
  onClose,
  onSubmit,
}) {
  const [page, setPage] = useState("home");
  const [sectionType, setSectionType] = useState("hero");
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [imageAltText, setImageAltText] = useState("");
  const [buttonText, setButtonText] = useState("");
  const [targetType, setTargetType] = useState("none");
  const [targetId, setTargetId] = useState("");
  const [targetUrl, setTargetUrl] = useState("");
  const [textColor, setTextColor] = useState("light");
  const [textAlign, setTextAlign] = useState("center");
  const [displayOrder, setDisplayOrder] = useState("0");
  const [isActive, setIsActive] = useState(true);

  // File Upload states
  const [desktopFile, setDesktopFile] = useState(null);
  const [mobileFile, setMobileFile] = useState(null);
  const [desktopPreview, setDesktopPreview] = useState("");
  const [mobilePreview, setMobilePreview] = useState("");

  // Sync state with section prop when modal opens/changes
  useEffect(() => {
    if (section) {
      setPage(section.page || "home");
      setSectionType(section.sectionType || "hero");
      setTitle(section.title || "");
      setSubtitle(section.subtitle || "");
      setImageAltText(section.imageAltText || "");
      setButtonText(section.buttonText || "");
      setTargetType(section.targetType || "none");
      setTargetId(section.targetId || "");
      setTargetUrl(section.targetUrl || "");
      setTextColor(section.textColor || "light");
      setTextAlign(section.textAlign || "center");
      setDisplayOrder(String(section.displayOrder || 0));
      setIsActive(section.isActive !== undefined ? section.isActive : true);
      setDesktopFile(null);
      setMobileFile(null);
      setDesktopPreview(section.desktopImage || "");
      setMobilePreview(section.mobileImage || "");
    } else {
      setPage("home");
      setSectionType("hero");
      setTitle("");
      setSubtitle("");
      setImageAltText("");
      setButtonText("");
      setTargetType("none");
      setTargetId("");
      setTargetUrl("");
      setTextColor("light");
      setTextAlign("center");
      setDisplayOrder("0");
      setIsActive(true);
      setDesktopFile(null);
      setMobileFile(null);
      setDesktopPreview("");
      setMobilePreview("");
    }
  }, [section, isOpen]);

  if (!isOpen) return null;

  const handleDesktopFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setDesktopFile(file);
      setDesktopPreview(URL.createObjectURL(file));
    }
  };

  const handleMobileFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMobileFile(file);
      setMobilePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const sectionData = {
      page,
      sectionType,
      title: title.trim() || null,
      subtitle: subtitle.trim() || null,
      imageAltText: imageAltText.trim() || null,
      buttonText: buttonText.trim() || null,
      targetType: targetType !== "none" ? targetType : null,
      targetId: targetType === "product" && targetId ? targetId : null,
      targetUrl:
        (targetType === "custom" || targetType === "external" || targetType === "category") &&
        targetUrl
          ? targetUrl.trim()
          : null,
      textColor,
      textAlign,
      displayOrder: parseInt(displayOrder) || 0,
      isActive,
    };

    onSubmit(sectionData, {
      desktopFile,
      mobileFile,
      desktopPreview,
      mobilePreview,
    });
  };

  return (
    <div className="modal-overlay">
      <form
        onSubmit={handleSubmit}
        className="modal-content"
        style={{
          maxWidth: "650px",
          width: "100%",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        <h3 className="modal-title">{section ? "Edit Page Section" : "Add Page Section"}</h3>
        <p className="modal-subtitle" style={{ marginBottom: "16px" }}>
          Configure how the banner/section renders and behaves on the storefront.
        </p>

        <div className="form-grid">
          <div className="form-row-2">
            <div className="form-group">
              <label className="form-label">Storefront Page *</label>
              <select
                value={page}
                onChange={(e) => setPage(e.target.value)}
                className="form-input"
                style={{ height: "46px" }}
                disabled={isSubmitting}
              >
                <option value="home">Home Page</option>
                <option value="men">Men's Category Page</option>
                <option value="women">Women's Category Page</option>
                <option value="trending">Trending Page</option>
                <option value="shop">Shop Page</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Section Type *</label>
              <select
                value={sectionType}
                onChange={(e) => setSectionType(e.target.value)}
                className="form-input"
                style={{ height: "46px" }}
                disabled={isSubmitting}
              >
                <option value="hero">Hero Banner</option>
                <option value="banner">Middle Promo Banner</option>
                <option value="newsletter">Newsletter Form Section</option>
              </select>
            </div>
          </div>

          {sectionType !== "newsletter" && (
            <>
              <div className="form-group">
                <label className="form-label">Section Title</label>
                <input
                  type="text"
                  placeholder="e.g. Summer Collection 2026"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="form-input"
                  disabled={isSubmitting}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Section Subtitle</label>
                <input
                  type="text"
                  placeholder="e.g. Refresh your look with our new active arrivals."
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  className="form-input"
                  disabled={isSubmitting}
                />
              </div>
            </>
          )}

          {sectionType === "newsletter" && (
            <>
              <div className="form-group">
                <label className="form-label">Newsletter Title</label>
                <input
                  type="text"
                  placeholder="e.g. Subscribe to Osmaki"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="form-input"
                  disabled={isSubmitting}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Newsletter Subtitle</label>
                <input
                  type="text"
                  placeholder="e.g. Join our mailing list for updates and promotional deals."
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  className="form-input"
                  disabled={isSubmitting}
                />
              </div>
            </>
          )}

          {/* IMAGE UPLOAD SECTION */}
          {sectionType !== "newsletter" && (
            <div
              style={{
                border: "1px dashed #d1d5db",
                borderRadius: "8px",
                padding: "16px",
                backgroundColor: "#fafafa",
              }}
            >
              <h4
                style={{
                  margin: "0 0 12px 0",
                  fontSize: "13px",
                  fontWeight: "600",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  color: "#555",
                }}
              >
                Image Upload Configuration
              </h4>

              <div className="form-row-2">
                <div className="form-group">
                  <label className="form-label">Desktop Image File</label>
                  <label className="btn-file-upload">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleDesktopFileChange}
                      style={{ display: "none" }}
                      disabled={isSubmitting}
                    />
                    <span style={{ fontSize: "12px", color: desktopFile ? "#047857" : "#666" }}>
                      {desktopFile ? `Selected: ${desktopFile.name}` : "Upload Desktop Image"}
                    </span>
                  </label>
                  {desktopPreview && (
                    <div style={{ marginTop: "10px", textAlign: "center" }}>
                      <img
                        src={desktopPreview}
                        alt="Desktop Preview"
                        style={{
                          maxWidth: "100%",
                          maxHeight: "100px",
                          objectFit: "cover",
                          borderRadius: "4px",
                          border: "1px solid #ccc",
                        }}
                      />
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label">Mobile Image File (Optional)</label>
                  <label className="btn-file-upload">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleMobileFileChange}
                      style={{ display: "none" }}
                      disabled={isSubmitting}
                    />
                    <span style={{ fontSize: "12px", color: mobileFile ? "#047857" : "#666" }}>
                      {mobileFile ? `Selected: ${mobileFile.name}` : "Upload Mobile Image"}
                    </span>
                  </label>
                  {mobilePreview && (
                    <div style={{ marginTop: "10px", textAlign: "center" }}>
                      <img
                        src={mobilePreview}
                        alt="Mobile Preview"
                        style={{
                          maxWidth: "100%",
                          maxHeight: "100px",
                          objectFit: "cover",
                          borderRadius: "4px",
                          border: "1px solid #ccc",
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="form-group" style={{ marginTop: "12px" }}>
                <label className="form-label">Image Alt Text (SEO)</label>
                <input
                  type="text"
                  placeholder="e.g. Model wearing Summer elite sportswear"
                  value={imageAltText}
                  onChange={(e) => setImageAltText(e.target.value)}
                  className="form-input"
                  disabled={isSubmitting}
                />
              </div>
            </div>
          )}

          {/* ACTION LINKS & TARGETS */}
          {sectionType !== "newsletter" && (
            <div
              style={{
                border: "1px solid #eee",
                borderRadius: "8px",
                padding: "16px",
                backgroundColor: "#ffffff",
              }}
            >
              <h4
                style={{
                  margin: "0 0 12px 0",
                  fontSize: "13px",
                  fontWeight: "600",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  color: "#555",
                }}
              >
                Action Button & Link Redirects
              </h4>

              <div className="form-row-2" style={{ marginBottom: "12px" }}>
                <div className="form-group">
                  <label className="form-label">Button Text</label>
                  <input
                    type="text"
                    placeholder="e.g. Shop Now"
                    value={buttonText}
                    onChange={(e) => setButtonText(e.target.value)}
                    className="form-input"
                    disabled={isSubmitting}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Link Redirect Type</label>
                  <select
                    value={targetType}
                    onChange={(e) => setTargetType(e.target.value)}
                    className="form-input"
                    style={{ height: "46px" }}
                    disabled={isSubmitting}
                  >
                    <option value="none">No Redirect Link</option>
                    <option value="product">Link to Product</option>
                    <option value="category">Link to Category</option>
                    <option value="custom">Custom Internal Route</option>
                    <option value="external">External Link URL</option>
                  </select>
                </div>
              </div>

              {targetType === "product" && (
                <div className="form-group">
                  <label className="form-label">Select Targeted Product *</label>
                  <select
                    value={targetId}
                    onChange={(e) => setTargetId(e.target.value)}
                    className="form-input"
                    required
                    style={{ height: "46px" }}
                    disabled={isSubmitting}
                  >
                    <option value="">-- Choose a Product --</option>
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} (Price: ₹{p.price})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {targetType === "category" && (
                <div className="form-group">
                  <label className="form-label">Target Category URL *</label>
                  <select
                    value={targetUrl}
                    onChange={(e) => setTargetUrl(e.target.value)}
                    className="form-input"
                    required
                    style={{ height: "46px" }}
                    disabled={isSubmitting}
                  >
                    <option value="">-- Choose a Category --</option>
                    <option value="/men">Men's Apparel</option>
                    <option value="/women">Women's Apparel</option>
                    <option value="/trending">Trending Collection</option>
                  </select>
                </div>
              )}

              {(targetType === "custom" || targetType === "external") && (
                <div className="form-group">
                  <label className="form-label">Redirect Link URL *</label>
                  <input
                    type="text"
                    placeholder={
                      targetType === "external"
                        ? "e.g. https://instagram.com/osmaki"
                        : "e.g. /contact-us"
                    }
                    value={targetUrl}
                    onChange={(e) => setTargetUrl(e.target.value)}
                    className="form-input"
                    required
                    disabled={isSubmitting}
                  />
                </div>
              )}
            </div>
          )}

          {/* OVERLAY STYLING CONFIGS */}
          {sectionType !== "newsletter" && (
            <div className="form-row-2">
              <div className="form-group">
                <label className="form-label">Text Overlay Theme</label>
                <select
                  value={textColor}
                  onChange={(e) => setTextColor(e.target.value)}
                  className="form-input"
                  style={{ height: "46px" }}
                  disabled={isSubmitting}
                >
                  <option value="light">White Text (For dark background banners)</option>
                  <option value="dark">Black Text (For light background banners)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Text Positioning Alignment</label>
                <select
                  value={textAlign}
                  onChange={(e) => setTextAlign(e.target.value)}
                  className="form-input"
                  style={{ height: "46px" }}
                  disabled={isSubmitting}
                >
                  <option value="center">Center Centered</option>
                  <option value="left">Left Aligned</option>
                  <option value="right">Right Aligned</option>
                </select>
              </div>
            </div>
          )}

          {/* DISPLAY ORDER & STATUS */}
          <div className="form-row-2">
            <div className="form-group">
              <label className="form-label">Display Order (Display Ranking)</label>
              <input
                type="number"
                min="0"
                placeholder="e.g. 0 (renders first)"
                value={displayOrder}
                onChange={(e) => setDisplayOrder(e.target.value)}
                className="form-input"
                disabled={isSubmitting}
              />
            </div>

            <div className="form-group" style={{ justifyContent: "center", paddingLeft: "10px" }}>
              <label
                className="form-label"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  cursor: "pointer",
                  marginTop: "20px",
                }}
              >
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  style={{ width: "18px", height: "18px", cursor: "pointer" }}
                  disabled={isSubmitting}
                />
                <span
                  style={{
                    fontSize: "14px",
                    fontWeight: "500",
                    textTransform: "none",
                    color: "#111",
                  }}
                >
                  Publish Immediately (Is Active)
                </span>
              </label>
            </div>
          </div>
        </div>

        <div className="modal-actions">
          <button
            type="button"
            onClick={onClose}
            className="btn-cancel"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn-submit"
            disabled={isSubmitting}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
            }}
          >
            {isSubmitting ? (
              <>
                <div
                  className="loader-spinner"
                  style={{
                    width: "16px",
                    height: "16px",
                    borderWidth: "2px",
                    borderColor: "#fff",
                    borderTopColor: "transparent",
                    margin: 0,
                  }}
                ></div>
                <span>Uploading...</span>
              </>
            ) : section ? (
              "Save Changes"
            ) : (
              "Create Section"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
