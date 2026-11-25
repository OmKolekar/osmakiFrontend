import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext";
import { cartService } from "../services/cartService";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState(() => {
    // SWR Cache: Read user or guest cart instantly from localStorage for 0ms initial render
    try {
      const activeUser = localStorage.getItem("osmaki_user");
      const userId = activeUser ? JSON.parse(activeUser)?.id : null;
      const key = userId ? `osmaki_user_cart_${userId}` : "osmaki_cart";
      const savedCart = localStorage.getItem(key) || localStorage.getItem("osmaki_cart");
      if (savedCart) {
        const parsed = JSON.parse(savedCart);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (err) {
      console.warn("Failed to parse cached cart on init:", err);
    }
    return [];
  });
  const [loading, setLoading] = useState(false);

  // Sync / Load cart depending on user status in background (SWR pattern)
  useEffect(() => {
    const syncCart = async () => {
      if (user) {
        // Only trigger loading spinner if we don't already have cached items
        if (cartItems.length === 0) {
          setLoading(true);
        }
        try {
          // If there are guest items in local storage, merge them to DB first
          const savedGuestCart = localStorage.getItem("osmaki_cart");
          if (savedGuestCart) {
            const localItems = JSON.parse(savedGuestCart);
            if (Array.isArray(localItems) && localItems.length > 0) {
              for (const item of localItems) {
                await cartService.addToCart(user.id, item.id, item.quantity);
              }
              localStorage.removeItem("osmaki_cart");
            }
          }

          // Fetch fresh merged cart from backend silently
          const items = await cartService.getCart(user.id);
          setCartItems(items);
          localStorage.setItem(`osmaki_user_cart_${user.id}`, JSON.stringify(items));
        } catch (err) {
          console.error("Failed to sync cart with backend:", err);
        } finally {
          setLoading(false);
        }
      } else {
        // Load from local storage for guests
        const savedCart = localStorage.getItem("osmaki_cart");
        if (savedCart) {
          try {
            setCartItems(JSON.parse(savedCart));
          } catch (err) {
            console.error("Failed to parse saved cart:", err);
            localStorage.removeItem("osmaki_cart");
          }
        } else {
          setCartItems([]);
        }
      }
    };

    syncCart();
  }, [user]);

  // Persist cart to localStorage (user-specific or guest)
  useEffect(() => {
    if (user) {
      localStorage.setItem(`osmaki_user_cart_${user.id}`, JSON.stringify(cartItems));
    } else {
      localStorage.setItem("osmaki_cart", JSON.stringify(cartItems));
    }
  }, [cartItems, user]);

  const addToCart = async (product, quantity = 1) => {
    if (user) {
      try {
        await cartService.addToCart(user.id, product.id, quantity);
        const items = await cartService.getCart(user.id);
        setCartItems(items);
      } catch (err) {
        console.error("Failed to add to backend cart:", err);
      }
    } else {
      setCartItems((prevItems) => {
        const existingItem = prevItems.find((item) => item.id === product.id);
        if (existingItem) {
          return prevItems.map((item) =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
        }
        return [...prevItems, { ...product, quantity }];
      });
    }
  };

  const updateQuantity = async (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    if (user) {
      try {
        await cartService.updateQuantity(user.id, productId, quantity);
        const items = await cartService.getCart(user.id);
        setCartItems(items);
      } catch (err) {
        console.error("Failed to update quantity in backend:", err);
      }
    } else {
      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item.id === productId ? { ...item, quantity } : item
        )
      );
    }
  };

  const removeFromCart = async (productId) => {
    if (user) {
      try {
        await cartService.removeFromCart(user.id, productId);
        const items = await cartService.getCart(user.id);
        setCartItems(items);
      } catch (err) {
        console.error("Failed to remove item from backend:", err);
      }
    } else {
      setCartItems((prevItems) => prevItems.filter((item) => item.id !== productId));
    }
  };

  const clearCart = async () => {
    if (user) {
      try {
        localStorage.removeItem(`osmaki_user_cart_${user.id}`);
        await cartService.clearCart(user.id);
        setCartItems([]);
      } catch (err) {
        console.error("Failed to clear backend cart:", err);
      }
    } else {
      localStorage.removeItem("osmaki_cart");
      setCartItems([]);
    }
  };

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const cartTotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        cartCount,
        cartTotal,
        loading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
