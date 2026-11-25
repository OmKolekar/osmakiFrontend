import { cartApi } from "../api/cartApi";

export const cartService = {
  getCart: async (userId) => {
    const dbItems = await cartApi.getCart(userId);
    if (!Array.isArray(dbItems)) return [];
    
    return dbItems.map((item) => {
      const variant = item.variant;
      const product = variant?.product;
      const variantImage = variant?.images?.[0]?.imageUrl || product?.image || "";
      
      const getActivePrice = (v, p) => {
        const vPrice = parseFloat(v?.price || p?.price || 0);
        const rawDisc = v?.discountPrice || p?.discountPrice;
        const vDisc = rawDisc ? parseFloat(rawDisc) : null;
        if (vDisc !== null && vDisc > 0 && vDisc < vPrice) return vDisc;
        return vPrice;
      };

      const getOriginalPrice = (v, p) => {
        return parseFloat(v?.price || p?.price || 0);
      };

      return {
        id: variant?.id || item.id,
        productId: product?.id,
        name: product?.name || "Product",
        price: getActivePrice(variant, product),
        originalPrice: getOriginalPrice(variant, product),
        quantity: item.quantity,
        image: variantImage,
        brand: product?.brand || "OSMAKI",
        selectedColor: variant?.color || "",
        selectedSize: variant?.size || "",
        sku: variant?.sku || null,
      };
    });
  },

  addToCart: async (userId, variantId, quantity) => {
    return await cartApi.addToCart(userId, variantId, quantity);
  },

  updateQuantity: async (userId, variantId, quantity) => {
    return await cartApi.updateQuantity(userId, variantId, quantity);
  },

  removeFromCart: async (userId, variantId) => {
    return await cartApi.removeFromCart(userId, variantId);
  },

  clearCart: async (userId) => {
    return await cartApi.clearCart(userId);
  }
};
