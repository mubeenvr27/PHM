import { create } from "zustand";
import { persist } from "zustand/middleware";

/* ─── Types ───────────────────────────────────────────────────────── */

export interface CartItem {
  /** Unique product identifier (matches shop product id) */
  id: string;
  name: string;
  /** Price in cents to avoid floating-point arithmetic errors */
  price_cents: number;
  quantity: number;
  image: string;
}

export interface CartState {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
}

/* ─── Selectors (derived) ─────────────────────────────────────────── */

/** Total number of individual items across all line-items */
export const selectTotalItems = (state: CartState): number =>
  state.items.reduce((sum, item) => sum + item.quantity, 0);

/** Subtotal in cents */
export const selectSubtotalCents = (state: CartState): number =>
  state.items.reduce((sum, item) => sum + item.price_cents * item.quantity, 0);

/* ─── Store ───────────────────────────────────────────────────────── */

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],

      addItem: (newItem) =>
        set((state) => {
          const existing = state.items.find((i) => i.id === newItem.id);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.id === newItem.id
                  ? { ...i, quantity: i.quantity + 1 }
                  : i
              ),
            };
          }
          return { items: [...state.items, { ...newItem, quantity: 1 }] };
        }),

      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((i) => i.id !== id),
        })),

      updateQuantity: (id, quantity) =>
        set((state) => {
          if (quantity < 1) {
            return { items: state.items.filter((i) => i.id !== id) };
          }
          return {
            items: state.items.map((i) =>
              i.id === id ? { ...i, quantity } : i
            ),
          };
        }),

      clearCart: () => set({ items: [] }),
    }),
    {
      name: "phm-cart",
    }
  )
);
