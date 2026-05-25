import sectionApi from "../api/sectionApi";

export const sectionService = {
  /**
   * Orchestrates uploading files to Cloudinary and creating or updating the section.
   *
   * @param {Object} sectionData The core form metadata fields.
   * @param {Object} files Object containing desktopFile, mobileFile, and previews.
   * @param {string|null} editingSectionId ID of section if editing, null if creating.
   * @returns {Promise<Object>} The saved section record response.
   */
  saveSection: async (sectionData, files, editingSectionId) => {
    let finalDesktopImage = files.desktopPreview || "";
    let finalMobileImage = files.mobilePreview || "";

    // 1. Upload Desktop image if a new file is chosen
    if (files.desktopFile) {
      finalDesktopImage = await sectionApi.uploadImage(files.desktopFile);
    }

    // 2. Upload Mobile image if a new file is chosen
    if (files.mobileFile) {
      finalMobileImage = await sectionApi.uploadImage(files.mobileFile);
    }

    // Compile ultimate payload
    const payload = {
      ...sectionData,
      desktopImage: finalDesktopImage,
      mobileImage: finalMobileImage,
    };

    // 3. Persist to API
    if (editingSectionId) {
      return await sectionApi.updateSection(editingSectionId, payload);
    } else {
      return await sectionApi.createSection(payload);
    }
  },
};
export default sectionService;
