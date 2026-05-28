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
      const imageUrls = [];
      if (variant.files && variant.files.length > 0) {
        for (const file of variant.files) {
          try {
            const url = await productApi.uploadImage(file);
            if (url) imageUrls.push(url);
          } catch (err) {
            console.error("Failed to upload image:", err);
          }
        }
      }

      processedVariants.push({
        sku: variant.sku.trim().toUpperCase(),
        size: variant.size?.trim() || null,
        color: variant.color?.trim() || null,
        price: parseFloat(variant.price) || parseFloat(productForm.basePrice) || 0,
        discountPrice: parseFloat(variant.discountPrice) || null,
        stock: parseInt(variant.stock) || 0,
        imageUrl: imageUrls.length > 0 ? imageUrls[0] : null,
        imageUrls: imageUrls,
      });
    }

    // 2. Build backend payload
    const payload = {
      name: productForm.name.trim(),
      description: productForm.description?.trim() || "",
      price: parseFloat(productForm.basePrice) || 0,
      discountPrice: parseFloat(productForm.discountPrice) || null,
      categoryId: productForm.categoryId || null,
      gender: productForm.gender || "Unisex",
      brand: productForm.brand?.trim() || null,
      isTrending: productForm.isTrending || false,
      isFeatured: productForm.isFeatured || false,
      isBestSeller: productForm.isBestSeller || false,
      variants: processedVariants,
    };

    // 3. Post product creation to API
    return await productApi.createProduct(payload);
  },
};
export default productService;
