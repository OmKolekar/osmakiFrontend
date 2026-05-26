import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext";
import { cartService } from "../services/cartService";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);

  // Sync / Load cart depending on user status
  useEffect(() => {
    const syncCart = async () => {
      if (user) {
        setLoading(true);
        try {
          // If there are items in local storage cart, merge them to DB first
          const savedCart = localStorage.getItem("osmaki_cart");
          if (savedCart) {
            const localItems = JSON.parse(savedCart);
            if (localItems.length > 0) {
              for (const item of localItems) {
                await cartService.addToCart(user.id, item.id, item.quantity);
              }
              // Clear local storage after merging
              localStorage.removeItem("osmaki_cart");
            }
          }

          // Fetch final merged cart from backend
          const items = await cartService.getCart(user.id);
          setCartItems(items);
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

  // Save guest cart to localStorage
  useEffect(() => {
    if (!user) {
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
        await cartService.clearCart(user.id);
        setCartItems([]);
      } catch (err) {
        console.error("Failed to clear backend cart:", err);
      }
    } else {
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
