"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useMemo,
  type ReactNode,
} from "react";
import {
  getProductById,
  getVariantPrice,
  type CartItem,
  type CartState,
} from "@/lib/shop-products";

// TYPES
interface CartContextValue {
  items: CartItem[];
  itemCount: number;
  totalPrice: number; // in Cent
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addItem: (productId: string, variantId: string, quantity?: number) => void;
  removeItem: (productId: string, variantId: string) => void;
  updateQuantity: (
    productId: string,
    variantId: string,
    quantity: number,
  ) => void;
  clearCart: () => void;
}

// CONSTANTS
const CART_STORAGE_KEY = "beafox_shop_cart";
const CartContext = createContext<CartContextValue | null>(null);

// HELPER
function loadCartFromStorage(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    const state: CartState = JSON.parse(raw);
    // Cart verfällt nach 7 Tagen
    if (Date.now() - state.updatedAt > 7 * 24 * 60 * 60 * 1000) return [];
    return state.items;
  } catch {
    return [];
  }
}

function saveCartToStorage(items: CartItem[]): void {
  if (typeof window === "undefined") return;
  try {
    const state: CartState = { items, updatedAt: Date.now() };
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state));
  } catch {
    // localStorage unavailable
  }
}

// COMPONENT
export default function ShopCartProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  // Hydrate from localStorage
  useEffect(() => {
    setItems(loadCartFromStorage());
    setIsHydrated(true);
  }, []);

  // Persist to localStorage
  useEffect(() => {
    if (isHydrated) {
      saveCartToStorage(items);
    }
  }, [items, isHydrated]);

  // FUNCTIONS
  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);
  const toggleCart = useCallback(() => setIsOpen((prev) => !prev), []);

  const addItem = useCallback(
    (productId: string, variantId: string, quantity = 1) => {
      setItems((prev) => {
        const existing = prev.find(
          (item) =>
            item.productId === productId && item.variantId === variantId,
        );
        if (existing) {
          return prev.map((item) =>
            item.productId === productId && item.variantId === variantId
              ? { ...item, quantity: item.quantity + quantity }
              : item,
          );
        }
        return [...prev, { productId, variantId, quantity }];
      });
      setIsOpen(true);
    },
    [],
  );

  const removeItem = useCallback(
    (productId: string, variantId: string) => {
      setItems((prev) =>
        prev.filter(
          (item) =>
            !(item.productId === productId && item.variantId === variantId),
        ),
      );
    },
    [],
  );

  const updateQuantity = useCallback(
    (productId: string, variantId: string, quantity: number) => {
      if (quantity <= 0) {
        removeItem(productId, variantId);
        return;
      }
      setItems((prev) =>
        prev.map((item) =>
          item.productId === productId && item.variantId === variantId
            ? { ...item, quantity }
            : item,
        ),
      );
    },
    [removeItem],
  );

  const clearCart = useCallback(() => {
    setItems([]);
    setIsOpen(false);
  }, []);

  // COMPUTED
  const itemCount = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items],
  );

  const totalPrice = useMemo(
    () =>
      items.reduce((sum, item) => {
        const product = getProductById(item.productId);
        if (!product) return sum;
        const price = getVariantPrice(product, item.variantId);
        return sum + price * item.quantity;
      }, 0),
    [items],
  );

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      itemCount,
      totalPrice,
      isOpen,
      openCart,
      closeCart,
      toggleCart,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
    }),
    [
      items,
      itemCount,
      totalPrice,
      isOpen,
      openCart,
      closeCart,
      toggleCart,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

// HOOK
export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a ShopCartProvider");
  }
  return context;
}
