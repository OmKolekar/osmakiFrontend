import productApi from "../api/productApi";

export const productService = {
  /**
   * Orchestrates uploading variant files to Cloudinary and creating the product.
   *
   * @param {Object} productForm The core product metadata form (name, basePrice, categoryId, etc).
   * @param {Array} variants List of variants with local files.
   * @returns {Promise<Object>} The created product response.
   */
  saveProduct: async (productForm, variants) => {
    const processedVariants = [];

    // 1. Loop through variants and sequentially upload their images
    for (const variant of variants) {
      let imageUrl = null;
      if (variant.files && variant.files.length > 0) {
        // Upload the selected image (using the first file if multiple were selected)
        imageUrl = await productApi.uploadImage(variant.files[0]);
      }

      processedVariants.push({
        sku: variant.sku.trim().toUpperCase(),
        size: variant.size?.trim() || null,
        color: variant.color?.trim() || null,
        price: parseFloat(variant.price) || parseFloat(productForm.basePrice) || 0,
        stock: parseInt(variant.stock) || 0,
        imageUrl: imageUrl,
      });
    }

    // 2. Build backend payload
    const payload = {
      name: productForm.name.trim(),
      description: productForm.description?.trim() || "",
      price: parseFloat(productForm.basePrice) || 0,
      categoryId: productForm.categoryId || null,
      gender: productForm.gender || "Unisex",
      brand: productForm.brand?.trim() || null,
      variants: processedVariants,
    };

    // 3. Post product creation to API
    return await productApi.createProduct(payload);
  },
};
export default productService;
