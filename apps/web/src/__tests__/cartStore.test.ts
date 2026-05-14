import { describe, it, expect, beforeEach } from "vitest";
import { useCartStore, selectTotalItems, selectSubtotalCents } from "@/store/cartStore";

/* ─── Test fixtures ───────────────────────────────────────────────── */

const DEVICE_A = {
  id: "bt-bp-cuff",
  name: "Bluetooth Blood Pressure Cuff",
  price_cents: 2500,
  image: "/Devices_image/Blood_pressure_cuff.png",
};

const DEVICE_B = {
  id: "glucose-meter",
  name: "Cellular Glucose Meter Kit",
  price_cents: 3500,
  image: "/Devices_image/Glucose_meter.png",
};

const BUNDLE = {
  id: "respiratory",
  name: "Respiratory Care Bundle",
  price_cents: 10500,
  image: "/Devices_image/peak_meter.png",
};

/* ─── Helpers ─────────────────────────────────────────────────────── */

/** Direct access to the store state (outside React) */
const getState = () => useCartStore.getState();
const addItem = (item: typeof DEVICE_A) => getState().addItem(item);
const removeItem = (id: string) => getState().removeItem(id);
const updateQuantity = (id: string, qty: number) => getState().updateQuantity(id, qty);
const clearCart = () => getState().clearCart();
const items = () => getState().items;
const totalItems = () => selectTotalItems(getState());
const subtotalCents = () => selectSubtotalCents(getState());

/* ─── Tests ───────────────────────────────────────────────────────── */

describe("cartStore", () => {
  beforeEach(() => {
    // Reset store between tests
    clearCart();
  });

  /* ── addItem ─────────────────────────────────────────────────── */

  describe("addItem", () => {
    it("should add a new item with quantity 1", () => {
      addItem(DEVICE_A);
      expect(items()).toHaveLength(1);
      expect(items()[0]).toMatchObject({
        ...DEVICE_A,
        quantity: 1,
      });
    });

    it("should increment quantity when adding an existing item", () => {
      addItem(DEVICE_A);
      addItem(DEVICE_A);
      expect(items()).toHaveLength(1);
      expect(items()[0].quantity).toBe(2);
    });

    it("should keep separate line-items for different products", () => {
      addItem(DEVICE_A);
      addItem(DEVICE_B);
      expect(items()).toHaveLength(2);
      expect(items()[0].id).toBe(DEVICE_A.id);
      expect(items()[1].id).toBe(DEVICE_B.id);
    });
  });

  /* ── removeItem ──────────────────────────────────────────────── */

  describe("removeItem", () => {
    it("should remove the item by id", () => {
      addItem(DEVICE_A);
      addItem(DEVICE_B);
      removeItem(DEVICE_A.id);
      expect(items()).toHaveLength(1);
      expect(items()[0].id).toBe(DEVICE_B.id);
    });

    it("should do nothing if the id does not exist", () => {
      addItem(DEVICE_A);
      removeItem("nonexistent");
      expect(items()).toHaveLength(1);
    });

    it("should result in an empty cart when the last item is removed", () => {
      addItem(DEVICE_A);
      removeItem(DEVICE_A.id);
      expect(items()).toHaveLength(0);
    });
  });

  /* ── updateQuantity ──────────────────────────────────────────── */

  describe("updateQuantity", () => {
    it("should set the quantity to the specified value", () => {
      addItem(DEVICE_A);
      updateQuantity(DEVICE_A.id, 5);
      expect(items()[0].quantity).toBe(5);
    });

    it("should remove the item if quantity is set to 0", () => {
      addItem(DEVICE_A);
      updateQuantity(DEVICE_A.id, 0);
      expect(items()).toHaveLength(0);
    });

    it("should remove the item if quantity is set to a negative number", () => {
      addItem(DEVICE_A);
      updateQuantity(DEVICE_A.id, -1);
      expect(items()).toHaveLength(0);
    });

    it("should not affect other items", () => {
      addItem(DEVICE_A);
      addItem(DEVICE_B);
      updateQuantity(DEVICE_A.id, 3);
      expect(items()[0].quantity).toBe(3);
      expect(items()[1].quantity).toBe(1);
    });
  });

  /* ── clearCart ────────────────────────────────────────────────── */

  describe("clearCart", () => {
    it("should remove all items", () => {
      addItem(DEVICE_A);
      addItem(DEVICE_B);
      addItem(BUNDLE);
      clearCart();
      expect(items()).toHaveLength(0);
    });
  });

  /* ── Selectors (cart math) ───────────────────────────────────── */

  describe("selectTotalItems", () => {
    it("should return 0 for an empty cart", () => {
      expect(totalItems()).toBe(0);
    });

    it("should sum quantities across all line-items", () => {
      addItem(DEVICE_A);
      addItem(DEVICE_A); // qty 2
      addItem(DEVICE_B); // qty 1
      expect(totalItems()).toBe(3);
    });
  });

  describe("selectSubtotalCents", () => {
    it("should return 0 for an empty cart", () => {
      expect(subtotalCents()).toBe(0);
    });

    it("should calculate subtotal in cents correctly", () => {
      addItem(DEVICE_A); // 2500
      addItem(DEVICE_B); // 3500
      expect(subtotalCents()).toBe(2500 + 3500);
    });

    it("should account for quantity when computing subtotal", () => {
      addItem(DEVICE_A);
      updateQuantity(DEVICE_A.id, 3);
      expect(subtotalCents()).toBe(2500 * 3);
    });

    it("should use integer math (no floating-point errors)", () => {
      // Add items whose dollar values would cause FP issues if using dollars
      // $25.00 + $35.00 + $105.00 = $165.00 → 16500 cents
      addItem(DEVICE_A);
      addItem(DEVICE_B);
      addItem(BUNDLE);
      const result = subtotalCents();
      expect(result).toBe(16500);
      expect(Number.isInteger(result)).toBe(true);
    });
  });
});
