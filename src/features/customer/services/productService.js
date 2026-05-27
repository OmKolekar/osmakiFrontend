import { productApi } from "../api/productApi";

export const productService = {
  getProducts: async () => {
    const data = await productApi.getProducts();
    if (!Array.isArray(data)) return [];
    return data.map(p => ({
      ...p,
      price: parseFloat(p.price),
      discountPrice: p.discountPrice ? parseFloat(p.discountPrice) : null,
      variants: p.variants?.map(v => ({
        ...v,
        price: parseFloat(v.price),
        discountPrice: v.discountPrice ? parseFloat(v.discountPrice) : null,
      })) || [],
      image: p.image || (p.variants && p.variants[0] && p.variants[0].images && p.variants[0].images[0] && p.variants[0].images[0].imageUrl) || "https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd",
    }));
  },

  getProductById: async (id) => {
    const data = await productApi.getProductById(id);
    if (!data || !data.id) return null;
    const images = data.variants?.flatMap(v => v.images?.map(img => img.imageUrl) || []) || [];
    const defaultImage = data.image || images[0] || "https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd";
    if (images.length === 0) {
      images.push(defaultImage);
    }
    return {
      ...data,
      price: parseFloat(data.price),
      discountPrice: data.discountPrice ? parseFloat(data.discountPrice) : null,
      variants: data.variants?.map(v => ({
        ...v,
        price: parseFloat(v.price),
        discountPrice: v.discountPrice ? parseFloat(v.discountPrice) : null,
      })) || [],
      image: defaultImage,
      images,
    };
  },
};
