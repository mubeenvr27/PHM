"use client";

/**
 * ============================================================
 * /admin/products — Product Management Page
 * ============================================================
 * State: All product data is held in local React state (mock).
 * Images: URL.createObjectURL() generates temporary blob URLs
 *         for in-browser preview; the blob URL is stored in state.
 *
 * ┌─────────────────────────────────────────────────────────┐
 * │  TODO — S3 PRESIGNED UPLOAD INTEGRATION POINT           │
 * │                                                         │
 * │  When the backend is provisioned, replace the           │
 * │  URL.createObjectURL() call in `handleImageChange` with │
 * │  the following flow:                                     │
 * │                                                         │
 * │  1. POST /api/admin/products/upload-url                  │
 * │     Body: { filename: file.name, contentType: file.type }│
 * │     Response: { uploadUrl: string, publicUrl: string }   │
 * │                                                         │
 * │  2. PUT uploadUrl (the S3 presigned URL)                 │
 * │     with the raw File as the body and the correct        │
 * │     Content-Type header — no multipart/form-data.        │
 * │                                                         │
 * │  3. Store publicUrl (the permanent CDN/S3 URL) in your   │
 * │     form state instead of the blob URL:                  │
 * │     form.setValue("image_url", publicUrl)                │
 * │                                                         │
 * │  Reference: src/app/api/admin/products/upload-url/       │
 * │  route.ts (to be created)                               │
 * └─────────────────────────────────────────────────────────┘
 */

import { useState, useRef, useCallback, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  PackageSearch,
  PlusCircle,
  Pencil,
  Archive,
  UploadCloud,
  ShoppingBag,
  BarChart3,
  ListTodo,
  ImageOff,
  Loader2,
  Users,
} from "lucide-react";
import AdminNav from "@/components/admin/AdminNav";
import { hasPermission } from "@/lib/auth";

// ── Shadcn / Base-UI Components ───────────────────────────────
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Table,
  TableHeader,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────
type StockStatus = "in_stock" | "out_of_stock" | "archived";
type ProductType = "individual" | "bundle";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock_status: StockStatus;
  product_type: ProductType;
  image_url: string;
}

// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────
const priceFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
});

/** Strips HTML tags to prevent XSS payloads being stored as product names. */
function stripHtml(value: string): string {
  return value.replace(/<[^>]*>/g, "").trim();
}

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png"] as const;

// ─────────────────────────────────────────────────────────────
// Zod Schema
// ─────────────────────────────────────────────────────────────
//
// Note: XSS sanitisation (stripHtml) is intentionally NOT applied as a
// Zod .transform() here. @hookform/resolvers v5 with Zod v4 does not
// support schemas whose input type differs from the output type when
// used as a resolver — the TFieldValues generic constraint breaks.
// Instead, stripHtml is called explicitly inside handleSave() at the
// point of persistence, keeping form state as raw strings throughout.

const productSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters.")
    .max(100, "Name cannot exceed 100 characters."),
  description: z
    .string()
    .max(500, "Description cannot exceed 500 characters.")
    .optional(),
  price: z.coerce
    .number()
    .positive("Price must be a positive number greater than zero."),
  stock_status: z.enum(["in_stock", "out_of_stock", "archived"]),
  product_type: z.enum(["individual", "bundle"]),
});

type ProductFormValues = z.infer<typeof productSchema>;

// ─────────────────────────────────────────────────────────────
// Seed Data — 3 realistic medical monitoring devices
// ─────────────────────────────────────────────────────────────
const SEED_PRODUCTS: Product[] = [
  {
    id: "prod_001",
    name: "CardioGuard Pro 3000",
    description:
      "Clinical-grade continuous ECG monitor with 12-lead capability. Features AI-assisted arrhythmia detection, cloud sync, and 72-hour battery life. FDA 510(k) cleared.",
    price: 4299.0,
    stock_status: "in_stock",
    product_type: "individual",
    image_url: "",
  },
  {
    id: "prod_002",
    name: "PulseOx Elite Wristband",
    description:
      "Medical-grade SpO2 and heart rate wristband sensor. Continuous monitoring with ±1% SpO2 accuracy, 7-day wear life, and HIPAA-compliant data transmission.",
    price: 799.5,
    stock_status: "in_stock",
    product_type: "individual",
    image_url: "",
  },
  {
    id: "prod_003",
    name: "NeuroPatch EEG Headset",
    description:
      "Portable 8-channel dry-electrode EEG headset for remote neurological assessment. Wireless BLE 5.0 with real-time signal quality indicators.",
    price: 11850.0,
    stock_status: "out_of_stock",
    product_type: "individual",
    image_url: "",
  },
];

// ─────────────────────────────────────────────────────────────
// Status Badge helper
// ─────────────────────────────────────────────────────────────
const STATUS_META: Record<
  StockStatus,
  { label: string; variant: "default" | "secondary" | "destructive" | "outline" }
> = {
  in_stock: { label: "In Stock", variant: "default" },
  out_of_stock: { label: "Out of Stock", variant: "destructive" },
  archived: { label: "Archived", variant: "outline" },
};

function StatusBadge({ status }: { status: StockStatus }) {
  const meta = STATUS_META[status];
  return <Badge variant={meta.variant}>{meta.label}</Badge>;
}

// ─────────────────────────────────────────────────────────────
// Type Badge helper
// ─────────────────────────────────────────────────────────────
const TYPE_META: Record<
  ProductType,
  { label: string; className: string }
> = {
  individual: { label: "Individual", className: "bg-sky-50 text-sky-700 border-sky-200 hover:bg-sky-50" },
  bundle: { label: "Bundle Package", className: "bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-50" },
};

function ProductTypeBadge({ type }: { type: ProductType }) {
  const meta = TYPE_META[type] || { label: type, className: "" };
  return (
    <Badge variant="outline" className={meta.className}>
      {meta.label}
    </Badge>
  );
}

// ─────────────────────────────────────────────────────────────
// Product Dialog (Add / Edit)
// ─────────────────────────────────────────────────────────────
interface ProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editTarget: Product | null;
  onSave: (values: ProductFormValues, imageUrl: string) => void;
}

function ProductDialog({
  open,
  onOpenChange,
  editTarget,
  onSave,
}: ProductDialogProps) {
  const isEditing = editTarget !== null;

  // Local image preview state — separate from RHF so we can keep
  // the blob URL alongside the form data without polluting the schema.
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string>(
    editTarget?.image_url ?? ""
  );
  const [imageError, setImageError] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<ProductFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(productSchema) as any,
    defaultValues: {
      name: editTarget?.name ?? "",
      description: editTarget?.description ?? "",
      price: editTarget?.price ?? (undefined as unknown as number),
      stock_status: editTarget?.stock_status ?? "in_stock",
      product_type: editTarget?.product_type ?? "individual",
    },
  });

  // Hydrate the form fields using the exact form.reset invocation requested
  useEffect(() => {
    if (open) {
      if (editTarget) {
        form.reset({
          name: editTarget.name,
          price: editTarget.price,
          description: editTarget.description,
          stock_status: editTarget.stock_status,
          product_type: editTarget.product_type,
          image_url: editTarget.image_url,
        } as any);
        setImagePreviewUrl(editTarget.image_url);
      } else {
        form.reset({
          name: "",
          price: undefined as unknown as number,
          description: "",
          stock_status: "in_stock",
          product_type: "individual",
          image_url: "",
        } as any);
        setImagePreviewUrl("");
      }
      setImageError("");
    }
  }, [open, editTarget, form]);

  // Called when the Dialog's open state changes
  const handleOpenChange = (nextOpen: boolean) => {
    onOpenChange(nextOpen);
  };

  // ── Image file validation & blob URL generation ─────────────
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setImageError("");

    if (!file) return;

    // Validate MIME type
    if (!(ACCEPTED_IMAGE_TYPES as readonly string[]).includes(file.type)) {
      setImageError("Only JPEG and PNG images are accepted.");
      e.target.value = "";
      return;
    }

    // Validate file size (mock — 5 MB cap)
    if (file.size > MAX_FILE_SIZE_BYTES) {
      setImageError(
        `File is too large (${(file.size / 1024 / 1024).toFixed(1)} MB). Maximum is 5 MB.`
      );
      e.target.value = "";
      return;
    }

    // ┌───────────────────────────────────────────────────────┐
    // │  MOCK IMPLEMENTATION — LOCAL BLOB URL                 │
    // │                                                       │
    // │  The line below creates a temporary object URL that   │
    // │  only lives in this browser session. It is NOT        │
    // │  uploaded anywhere.                                   │
    // │                                                       │
    // │  ── REPLACE THIS BLOCK WITH S3 UPLOAD LOGIC ──        │
    // │                                                       │
    // │  const { uploadUrl, publicUrl } =                     │
    // │    await fetch("/api/admin/products/upload-url", {    │
    // │      method: "POST",                                   │
    // │      headers: { "Content-Type": "application/json" }, │
    // │      body: JSON.stringify({                           │
    // │        filename: file.name,                           │
    // │        contentType: file.type,                        │
    // │      }),                                              │
    // │    }).then((r) => r.json());                          │
    // │                                                       │
    // │  await fetch(uploadUrl, {                             │
    // │    method: "PUT",                                     │
    // │    headers: { "Content-Type": file.type },            │
    // │    body: file,                                        │
    // │  });                                                  │
    // │                                                       │
    // │  // publicUrl is the permanent S3/CDN URL:            │
    // │  setImagePreviewUrl(publicUrl);                       │
    // └───────────────────────────────────────────────────────┘
    const blobUrl = URL.createObjectURL(file);
    setImagePreviewUrl(blobUrl);
  };

  // ── Submit ──────────────────────────────────────────────────
  const handleSubmit = form.handleSubmit((values) => {
    onSave(values, imagePreviewUrl);
    handleOpenChange(false);
  });

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-lg w-full">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Product" : "Add New Product"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the product details below. Changes are saved locally."
              : "Fill in the details to add a new product to the catalogue."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            id="product-form"
            onSubmit={handleSubmit}
            className="space-y-4 py-2"
          >
            {/* ── Name ── */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Name</FormLabel>
                  <FormControl>
                    <Input
                      id="product-name-input"
                      placeholder="e.g. CardioGuard Pro 3000"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* ── Price ── */}
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price (USD)</FormLabel>
                  <FormControl>
                    <Input
                      id="product-price-input"
                      type="number"
                      step="0.01"
                      min="0.01"
                      placeholder="0.00"
                      {...field}
                      onChange={(e) => field.onChange(e.target.value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* ── Stock Status ── */}
            <FormField
              control={form.control}
              name="stock_status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Stock Status</FormLabel>
                  <FormControl>
                    <div>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger
                          id="product-status-trigger"
                          className="w-full h-12"
                        >
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="in_stock">In Stock</SelectItem>
                          <SelectItem value="out_of_stock">
                            Out of Stock
                          </SelectItem>
                          <SelectItem value="archived">Archived</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* ── Product Type ── */}
            <FormField
              control={form.control}
              name="product_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Type</FormLabel>
                  <FormControl>
                    <div>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger
                          id="product-type-trigger"
                          className="w-full h-12"
                        >
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="individual">Individual Device</SelectItem>
                          <SelectItem value="bundle">Bundle Package</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* ── Description ── */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Description{" "}
                    <span className="text-xs text-[var(--color-text-muted)]">
                      (optional)
                    </span>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      id="product-description-input"
                      placeholder="Brief product description (max 500 characters)…"
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* ── Image Upload ── */}
            <div className="space-y-2">
              <label
                htmlFor="product-image-input"
                className="text-sm font-medium leading-none"
              >
                Product Image
                <span className="ml-1 text-xs text-[var(--color-text-muted)]">
                  (JPEG / PNG, max 5 MB)
                </span>
              </label>

              {/* Drop zone / file button */}
              <label
                htmlFor="product-image-input"
                className="flex flex-col items-center justify-center gap-2 w-full min-h-[120px] rounded-lg border-2 border-dashed border-[var(--color-border)] bg-[var(--color-surface)] cursor-pointer hover:border-[var(--color-accent)] hover:bg-teal-50/30 transition-colors group"
              >
                {imagePreviewUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={imagePreviewUrl}
                    alt="Product preview"
                    className="max-h-[140px] rounded-md object-contain"
                  />
                ) : (
                  <>
                    <UploadCloud
                      size={28}
                      className="text-[var(--color-text-muted)] group-hover:text-[var(--color-accent)] transition-colors"
                    />
                    <span className="text-sm text-[var(--color-text-muted)]">
                      Click to upload image
                    </span>
                  </>
                )}
              </label>

              <input
                ref={fileInputRef}
                id="product-image-input"
                type="file"
                accept="image/jpeg,image/png"
                className="sr-only"
                onChange={handleImageChange}
              />

              {imageError && (
                <p className="text-sm font-medium text-red-500">{imageError}</p>
              )}

              {imagePreviewUrl && (
                <button
                  type="button"
                  onClick={() => {
                    setImagePreviewUrl("");
                    if (fileInputRef.current) fileInputRef.current.value = "";
                  }}
                  className="text-xs text-[var(--color-text-muted)] hover:text-red-500 underline transition-colors min-h-0 min-w-0 h-auto"
                >
                  Remove image
                </button>
              )}
            </div>
          </form>
        </Form>

        <DialogFooter>
          <Button
            id="product-form-submit-btn"
            type="submit"
            form="product-form"
            disabled={form.formState.isSubmitting}
            className="bg-[var(--color-accent)] hover:bg-[#0a5f63] text-white"
          >
            {form.formState.isSubmitting && (
              <Loader2 size={14} className="animate-spin mr-1.5" />
            )}
            {isEditing ? "Save Changes" : "Add Product"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─────────────────────────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────────────────────────
export default function AdminProductsPage() {
  const pathname = usePathname();
  const [role, setRole] = useState<string>("user");

  useEffect(() => {
    const getCookieValue = (name: string): string | undefined => {
      if (typeof document === "undefined") return undefined;
      return document.cookie
        .split("; ")
        .find((row) => row.startsWith(`${name}=`))
        ?.split("=")[1];
    };
    const cookieRole = getCookieValue("mock_admin_token");
    if (cookieRole) setRole(cookieRole);
  }, []);

  // ── Mock product state ──────────────────────────────────────
  const [products, setProducts] = useState<Product[]>(SEED_PRODUCTS);

  // ── Dialog state ────────────────────────────────────────────
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Product | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  // ── Archive guard — tracks in-flight archives to prevent
  //    double-click state corruption ────────────────────────
  const archivingIds = useRef<Set<string>>(new Set());

  // ── Handlers ───────────────────────────────────────────────
  const openAddDialog = () => {
    setEditTarget(null);
    setEditingId(null);
    setDialogOpen(true);
  };

  const openEditDialog = (product: Product) => {
    setEditTarget(product);
    setEditingId(product.id);
    setDialogOpen(true);
  };

  const handleArchive = (productId: string) => {
    // Guard against double-click firing multiple state updates
    if (archivingIds.current.has(productId)) return;
    archivingIds.current.add(productId);

    setProducts((prev) =>
      prev.map((p) =>
        p.id === productId ? { ...p, stock_status: "archived" } : p
      )
    );

    // Release the lock after the state flush (next tick)
    setTimeout(() => {
      archivingIds.current.delete(productId);
    }, 0);
  };

  const handleSave = (values: ProductFormValues, imageUrl: string) => {
    // XSS sanitisation applied at persistence time (stripHtml is not used
    // as a Zod .transform() to avoid @hookform/resolvers v5 + Zod v4 type
    // conflicts — see schema comment above for full rationale).
    const sanitisedName = stripHtml(values.name);
    const sanitisedDesc = values.description ? stripHtml(values.description) : "";

    if (editingId) {
      // ── Update existing product ──
      setProducts((prev) =>
        prev.map((p) =>
          p.id === editingId
            ? {
                ...p,
                name: sanitisedName,
                description: sanitisedDesc,
                price: values.price,
                stock_status: values.stock_status,
                product_type: values.product_type,
                image_url: imageUrl,
              }
            : p
        )
      );
    } else {
      // ── Add new product ──
      const newProduct: Product = {
        id: `prod_${Date.now()}`,
        name: sanitisedName,
        description: sanitisedDesc,
        price: values.price,
        stock_status: values.stock_status,
        product_type: values.product_type,
        image_url: imageUrl,
      };
      setProducts((prev) => [newProduct, ...prev]);
    }
  };

  // ─────────────────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6 lg:p-10">
      <div className="mx-auto max-w-7xl space-y-8">

        {/* ── Page Header & Navigation ── */}
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-[#1B3A5C]">
              Product Catalogue
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Manage medical monitoring devices and their availability.
            </p>
          </div>

          {/* Admin nav tabs — role-aware via AdminNav */}
          <AdminNav />
        </div>

        {/* ── Table Card ── */}
        <div className="rounded-3xl border border-slate-100 bg-white shadow-md overflow-hidden">

          {/* Card toolbar */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
            <div>
              <p className="text-sm font-semibold text-[#1B3A5C]">
                {products.length} product{products.length !== 1 ? "s" : ""}
              </p>
            </div>
            {hasPermission(role, "manage:products") && (
              <Button
                id="open-add-product-dialog-btn"
                onClick={openAddDialog}
                className="flex items-center gap-2 bg-[#1B3A5C] hover:bg-[#162f4a] text-white"
              >
                <PlusCircle size={16} />
                Add Product
              </Button>
            )}
          </div>

          {/* Data Table */}
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/50 hover:bg-slate-50/50">
                <TableHead className="w-[80px] pl-6 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Image
                </TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Name
                </TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Price
                </TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Type
                </TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Status
                </TableHead>
                {hasPermission(role, "manage:products") && (
                  <TableHead className="text-right pr-6 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Actions
                  </TableHead>
                )}
              </TableRow>
            </TableHeader>

            <TableBody>
              {products.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={hasPermission(role, "manage:products") ? 6 : 5}
                    className="py-16 text-center text-slate-400"
                  >
                    <div className="flex flex-col items-center gap-3">
                      <PackageSearch size={40} className="opacity-30" />
                      <span className="text-sm">No products yet.</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                products.map((product) => (
                  <TableRow
                    key={product.id}
                    className="border-b border-slate-100 transition-colors hover:bg-slate-50/60"
                  >
                    {/* Thumbnail */}
                    <TableCell className="pl-6">
                      <div className="w-12 h-12 rounded-lg border border-slate-100 bg-slate-50 overflow-hidden flex items-center justify-center">
                        {product.image_url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={product.image_url}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <ImageOff
                            size={18}
                            className="text-slate-300"
                          />
                        )}
                      </div>
                    </TableCell>

                    {/* Name + description excerpt */}
                    <TableCell>
                      <p className="font-semibold text-[#1B3A5C] text-sm">
                        {product.name}
                      </p>
                      {product.description && (
                        <p className="text-xs text-slate-400 mt-0.5 max-w-[320px] truncate">
                          {product.description}
                        </p>
                      )}
                    </TableCell>

                    {/* Price */}
                    <TableCell className="font-mono text-sm font-medium text-[#1B3A5C]">
                      {priceFormatter.format(product.price)}
                    </TableCell>

                    {/* Type */}
                    <TableCell>
                      <ProductTypeBadge type={product.product_type} />
                    </TableCell>

                    {/* Status */}
                    <TableCell>
                      <StatusBadge status={product.stock_status} />
                    </TableCell>

                    {/* Actions */}
                    {hasPermission(role, "manage:products") && (
                      <TableCell className="pr-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {/* Edit */}
                          <Button
                            id={`edit-product-btn-${product.id}`}
                            variant="outline"
                            size="sm"
                            onClick={() => openEditDialog(product)}
                            className="flex items-center gap-1.5 text-[#1B3A5C] border-slate-200 hover:border-[#1B3A5C] hover:bg-[#1B3A5C] hover:text-white transition-all"
                          >
                            <Pencil size={13} />
                            Edit
                          </Button>

                          {/* Archive — updates status only, never deletes */}
                          <Button
                            id={`archive-product-btn-${product.id}`}
                            variant="outline"
                            size="sm"
                            disabled={product.stock_status === "archived"}
                            onClick={() => handleArchive(product.id)}
                            className="flex items-center gap-1.5 text-amber-700 border-amber-200 hover:border-amber-600 hover:bg-amber-600 hover:text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                          >
                            <Archive size={13} />
                            {product.stock_status === "archived"
                              ? "Archived"
                              : "Archive"}
                          </Button>
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {/* Footer note */}
          <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/30">
            <p className="text-xs text-slate-400">
              All data is stored in local React state. Backend persistence
              is pending API provisioning.
            </p>
          </div>
        </div>
      </div>

      {/* ── Product Dialog ── */}
      <ProductDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        editTarget={editTarget}
        onSave={handleSave}
      />
    </div>
  );
}
