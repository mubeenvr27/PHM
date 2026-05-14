import { z } from "zod";

/** E.164 phone: + followed by 1-15 digits */
const e164Phone = z
  .string()
  .min(1, "Phone number is required")
  .regex(
    /^\+[1-9]\d{1,14}$/,
    "Phone must be in E.164 format (e.g. +12025551234)"
  );

export const shippingSchema = z.object({
  firstName: z.string().min(1, "First name is required").max(50),
  lastName: z.string().min(1, "Last name is required").max(50),
  email: z.string().min(1, "Email is required").email("Enter a valid email"),
  phone: e164Phone,
  addressLine1: z.string().min(1, "Street address is required").max(200),
  addressLine2: z.string().max(200).optional(),
  city: z.string().min(1, "City is required").max(100),
  state: z.string().min(2, "State is required").max(2, "Use 2-letter code"),
  zip: z
    .string()
    .min(5, "ZIP code is required")
    .regex(/^\d{5}(-\d{4})?$/, "Enter a valid US ZIP (e.g. 75165)"),
  country: z.string(),
  shippingMethod: z.enum(["standard"]),
});

export type ShippingFormValues = z.infer<typeof shippingSchema>;
