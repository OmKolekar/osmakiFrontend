import React, { useRef } from "react";

/**
 * VariantImageUploader
 * Handles high-fashion imagery for a single variant:
 * - Shows previews for both existing (Cloudinary) and newly selected files.
 * - Strictly enforces a maximum of 3 images per variant.
 * - Allows removing individual images (existing or new).
 * - Identifies primary thumbnail (01).
 */
export default function VariantImageUploader({
  imageUrls = [],
  files = [],
  maxImages = 3,
  onUrlsChange,
  onFilesChange,
  disabled = false,
  variantLabel = "Variant",
}) {
  const fileInputRef = useRef(null);

  const totalImages = imageUrls.length + files.length;
  const remainingSlots = Math.max(0, maxImages - totalImages);

  const handleSelectFiles = (e) => {
    const selectedList = Array.from(e.target.files || []);
    if (selectedList.length === 0) return;

    if (remainingSlots <= 0) {
      alert(`Maximum ${maxImages} images already reached for ${variantLabel}.`);
      return;
    }

    const filesToAdd = selectedList.slice(0, remainingSlots);
    if (selectedList.length > remainingSlots) {
      alert(`Only ${remainingSlots} image slot(s) remained. Added ${filesToAdd.length} of ${selectedList.length} selected.`);
    }

    onFilesChange([...files, ...filesToAdd]);
    // Reset file input so same file can be re-selected if removed
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemoveExistingUrl = (index) => {
    if (disabled) return;
    const updated = imageUrls.filter((_, idx) => idx !== index);
    onUrlsChange(updated);
  };

  const handleRemoveNewFile = (index) => {
    if (disabled) return;
    const updated = files.filter((_, idx) => idx !== index);
    onFilesChange(updated);
  };

  return (
    <div className="variant-uploader-wrap">
      <div className="variant-uploader-meta-row">
        <label className="admin-label" style={{ marginBottom: 0 }}>
          GARMENT IMAGERY ({totalImages}/{maxImages} PHOTOS)
        </label>
        <span className="variant-uploader-slot-count">
          {totalImages === maxImages ? (
            <span style={{ color: "#16a34a", fontWeight: "600" }}>✓ Max Capacity Reached</span>
          ) : (
            <span>{remainingSlots} of {maxImages} slots remaining</span>
          )}
        </span>
      </div>

      <div className="variant-gallery-slots-row">
        {/* 1. Existing Saved URLs */}
        {imageUrls.map((url, idx) => (
          <div key={`saved-${idx}`} className="variant-photo-card saved-card">
            <img src={url} alt={`Saved preview ${idx + 1}`} className="variant-photo-img" />
            <div className="variant-photo-badge primary-badge">
              {idx === 0 ? "01 PRIMARY" : `0${idx + 1}`}
            </div>
            {!disabled && (
              <button
                type="button"
                onClick={() => handleRemoveExistingUrl(idx)}
                className="variant-photo-delete-btn"
                title="Remove photo"
                aria-label="Remove photo"
              >
                ✕
              </button>
            )}
            <span className="variant-photo-tag saved-tag">Saved</span>
          </div>
        ))}

        {/* 2. Newly Added Local Files */}
        {files.map((file, idx) => {
          const previewUrl = URL.createObjectURL(file);
          const photoIndex = imageUrls.length + idx + 1;
          return (
            <div key={`new-${idx}`} className="variant-photo-card new-card">
              <img src={previewUrl} alt={`New file ${file.name}`} className="variant-photo-img" />
              <div className="variant-photo-badge">
                {photoIndex === 1 ? "01 PRIMARY" : `0${photoIndex}`}
              </div>
              {!disabled && (
                <button
                  type="button"
                  onClick={() => handleRemoveNewFile(idx)}
                  className="variant-photo-delete-btn"
                  title="Remove new photo"
                  aria-label="Remove photo"
                >
                  ✕
                </button>
              )}
              <span className="variant-photo-tag new-tag">New</span>
            </div>
          );
        })}

        {/* 3. Dropzone / Upload Trigger Button (Only if slots available) */}
        {totalImages < maxImages && !disabled && (
          <div
            className="variant-upload-dropzone"
            onClick={() => fileInputRef.current && fileInputRef.current.click()}
            role="button"
            tabIndex={0}
          >
            <input
              type="file"
              ref={fileInputRef}
              multiple
              accept="image/png,image/jpeg,image/webp,image/avif"
              style={{ display: "none" }}
              onChange={handleSelectFiles}
            />
            <div className="dropzone-icon-wrap">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                <polyline points="21 15 16 10 5 21"></polyline>
              </svg>
            </div>
            <span className="dropzone-label">+ Add Photo</span>
            <span className="dropzone-sub">{remainingSlots} slot{remainingSlots > 1 ? "s" : ""} left</span>
          </div>
        )}
      </div>

      <p className="variant-uploader-hint">
        💡 Maximum 3 photos per variant (Front showcase, back detail, or model perspective). First photo acts as primary catalog thumbnail.
      </p>
    </div>
  );
}
