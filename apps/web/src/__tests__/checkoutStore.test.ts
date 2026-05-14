import { describe, it, expect, beforeEach } from "vitest";
import { useCheckoutStore } from "@/store/checkoutStore";
import { shippingSchema } from "@/lib/checkoutSchema";

/* ─── checkoutStore tests ─────────────────────────────────────────── */

const getState = () => useCheckoutStore.getState();

describe("checkoutStore", () => {
  beforeEach(() => {
    getState().resetCheckout();
  });

  it("should initialize at step 1 with empty data", () => {
    expect(getState().step).toBe(1);
    expect(getState().data.firstName).toBe("");
    expect(getState().data.country).toBe("US");
    expect(getState().data.shippingMethod).toBe("standard");
  });

  it("setStep should change the current step", () => {
    getState().setStep(2);
    expect(getState().step).toBe(2);
  });

  it("setData should merge partial data without clobbering", () => {
    getState().setData({ firstName: "Jane", lastName: "Smith" });
    getState().setData({ email: "jane@test.com" });
    expect(getState().data.firstName).toBe("Jane");
    expect(getState().data.lastName).toBe("Smith");
    expect(getState().data.email).toBe("jane@test.com");
  });

  it("resetCheckout should return to step 1 and clear data", () => {
    getState().setStep(3);
    getState().setData({ firstName: "Bob", phone: "+12025551234" });
    getState().resetCheckout();
    expect(getState().step).toBe(1);
    expect(getState().data.firstName).toBe("");
    expect(getState().data.phone).toBe("");
  });
});

/* ─── Zod schema tests ────────────────────────────────────────────── */

const VALID_DATA = {
  firstName: "Jane",
  lastName: "Doe",
  email: "jane@example.com",
  phone: "+12025551234",
  addressLine1: "123 Main St",
  addressLine2: "",
  city: "Waxahachie",
  state: "TX",
  zip: "75165",
  country: "US",
  shippingMethod: "standard" as const,
};

describe("shippingSchema validation", () => {
  it("should accept valid data", () => {
    const result = shippingSchema.safeParse(VALID_DATA);
    expect(result.success).toBe(true);
  });

  it("should reject missing first name", () => {
    const result = shippingSchema.safeParse({ ...VALID_DATA, firstName: "" });
    expect(result.success).toBe(false);
  });

  it("should reject invalid email", () => {
    const result = shippingSchema.safeParse({ ...VALID_DATA, email: "notanemail" });
    expect(result.success).toBe(false);
  });

  describe("E.164 phone validation", () => {
    it("should accept +12025551234", () => {
      const result = shippingSchema.safeParse(VALID_DATA);
      expect(result.success).toBe(true);
    });

    it("should reject phone without + prefix", () => {
      const result = shippingSchema.safeParse({ ...VALID_DATA, phone: "2025551234" });
      expect(result.success).toBe(false);
    });

    it("should reject phone with letters", () => {
      const result = shippingSchema.safeParse({ ...VALID_DATA, phone: "+1abc5551234" });
      expect(result.success).toBe(false);
    });

    it("should reject phone starting with +0", () => {
      const result = shippingSchema.safeParse({ ...VALID_DATA, phone: "+0123456789" });
      expect(result.success).toBe(false);
    });
  });

  describe("ZIP code validation", () => {
    it("should accept 5-digit ZIP", () => {
      const result = shippingSchema.safeParse({ ...VALID_DATA, zip: "75165" });
      expect(result.success).toBe(true);
    });

    it("should accept ZIP+4 format", () => {
      const result = shippingSchema.safeParse({ ...VALID_DATA, zip: "75165-1234" });
      expect(result.success).toBe(true);
    });

    it("should reject 4-digit ZIP", () => {
      const result = shippingSchema.safeParse({ ...VALID_DATA, zip: "7516" });
      expect(result.success).toBe(false);
    });
  });

  it("should reject invalid shipping method", () => {
    const result = shippingSchema.safeParse({ ...VALID_DATA, shippingMethod: "drone" });
    expect(result.success).toBe(false);
  });
});
