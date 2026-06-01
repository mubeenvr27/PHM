"use client"

import Image from "next/image"
import { useState } from "react"
import { ShoppingCart, Package, CheckCircle2, Layers, Cpu } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useCartStore } from "@/store/cartStore"
import { toast } from "sonner"

// ── Data ─────────────────────────────────────────────────────────────────────

const bundles = [
  {
    id: "hypertension",
    name: "Hypertension Bundle",
    price: 50,
    items: ["Bluetooth Blood Pressure Cuff"],
    description: "Precision daily monitoring for cardiovascular health.",
    images: ["/Devices_image/Blood_pressure_cuff.png"],
    badge: "Built-in Bluetooth",
    badgeStyle: "bg-teal-50 text-[#0D7377] border-[#0D7377]/20",
    stock_status: "in_stock",
  },
  {
    id: "diabetes",
    name: "Diabetes Care Bundle",
    price: 65,
    items: ["Cellular Glucose Meter Kit"],
    description: "Real-time glucose tracking with automated cloud syncing.",
    images: ["/Devices_image/Glucose_meter.png"],
    badge: "Independent 4G",
    badgeStyle: "bg-blue-50 text-[#1B3A5C] border-[#1B3A5C]/20",
    stock_status: "in_stock",
  },
  {
    id: "respiratory",
    name: "Respiratory Care Bundle",
    price: 105,
    items: ["Digital Peak Flow Meter", "Bluetooth Pulse Oximeter"],
    description: "Advanced lung function and oxygen saturation tracking.",
    images: [
      "/Devices_image/peak_meter.png",
      "/Devices_image/pulse_oximeter.png",
    ],
    badge: "Built-in Bluetooth",
    badgeStyle: "bg-teal-50 text-[#0D7377] border-[#0D7377]/20",
    stock_status: "in_stock",
  },
  {
    id: "adv-heart",
    name: "Advanced Heart Failure Bundle",
    price: 100,
    items: ["4G Blood Pressure Cuff", "4G Weight Scale"],
    description:
      "Hospital-grade 4G monitoring that works without Wi-Fi or smartphone pairing.",
    images: ["/Devices_image/Blood_pressure_cuff.png"],
    badge: "Independent 4G",
    badgeStyle: "bg-blue-50 text-[#1B3A5C] border-[#1B3A5C]/20",
    stock_status: "in_stock",
  },
]

const individualDevices = [
  {
    id: "bt-bp-cuff",
    name: "Bluetooth Blood Pressure Cuff",
    price: 25,
    items: ["Bluetooth Blood Pressure Cuff"],
    description:
      "Pairs effortlessly with any smartphone via Bluetooth for instant readings.",
    images: ["/Devices_image/Blood_pressure_cuff.png"],
    badge: "Built-in Bluetooth",
    badgeStyle: "bg-teal-50 text-[#0D7377] border-[#0D7377]/20",
    stock_status: "in_stock",
  },
  {
    id: "glucose-meter",
    name: "Cellular Glucose Meter Kit",
    price: 35,
    items: ["Cellular Glucose Meter Kit"],
    description:
      "Automated cloud syncing over 4G for real-time glucose management.",
    images: ["/Devices_image/Glucose_meter.png"],
    badge: "Independent 4G",
    badgeStyle: "bg-blue-50 text-[#1B3A5C] border-[#1B3A5C]/20",
    stock_status: "in_stock",
  },
  {
    id: "peak-flow",
    name: "Digital Peak Flow Meter",
    price: 80,
    items: ["Digital Peak Flow Meter"],
    description:
      "Track lung function and COPD progression with precision Bluetooth reporting.",
    images: ["/Devices_image/peak_meter.png"],
    badge: "Built-in Bluetooth",
    badgeStyle: "bg-teal-50 text-[#0D7377] border-[#0D7377]/20",
    stock_status: "in_stock",
  },
  {
    id: "pulse-ox",
    name: "Bluetooth Pulse Oximeter",
    price: 25,
    items: ["Bluetooth Pulse Oximeter"],
    description:
      "Hospital-grade SpO₂ and heart rate monitoring streamed directly to your care team.",
    images: ["/Devices_image/pulse_oximeter.png"],
    badge: "Built-in Bluetooth",
    badgeStyle: "bg-teal-50 text-[#0D7377] border-[#0D7377]/20",
    stock_status: "in_stock",
  },
  {
    id: "4g-bp-cuff",
    name: "4G Blood Pressure Cuff",
    price: 40,
    items: ["4G Blood Pressure Cuff"],
    description:
      "Fully independent cellular connectivity, no phone or Wi-Fi required.",
    images: ["/Devices_image/Blood_pressure_cuff.png"],
    badge: "Independent 4G",
    badgeStyle: "bg-blue-50 text-[#1B3A5C] border-[#1B3A5C]/20",
    stock_status: "in_stock",
  },
]

// ── Types ─────────────────────────────────────────────────────────────────────

type Tab = "bundles" | "devices"

interface Product {
  id: string
  name: string
  price: number
  items: string[]
  description: string
  images: string[]
  badge: string
  badgeStyle: string
  stock_status: string;
}

// ── Product Card ──────────────────────────────────────────────────────────────

function ProductCard({
  product,
  onAddToCart,
}: {
  product: Product
  onAddToCart: (product: Product) => void
}) {
  return (
    <Card className="group flex flex-col h-full bg-white border border-slate-200/60 rounded-3xl shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 overflow-hidden">
      <CardHeader className="p-8 pb-6">
        {/* Connectivity Badge */}
        <div className="mb-6">
          <Badge
            variant="outline"
            className={`px-4 py-1.5 text-xs font-bold uppercase tracking-wider rounded-full border ${product.badgeStyle}`}
          >
            {product.badge}
          </Badge>
        </div>

        {/* ── Image Showcase ── */}
        <div className="h-[400px] w-full bg-slate-50 rounded-2xl overflow-hidden relative">
          {product.images.length > 1 ? (
            /* Side-by-Side Product Duo */
            <div className="flex flex-row items-center justify-center gap-4 w-full h-full p-6">
              <div className="relative w-1/2 h-[85%] transition-transform duration-500 ease-out group-hover:scale-105">
                <Image
                  src={product.images[0]}
                  alt="Primary Device"
                  fill
                  priority
                  className="object-contain drop-shadow-xl mix-blend-multiply"
                  sizes="(max-width: 1024px) 45vw, 25vw"
                />
              </div>
              <div className="relative w-1/2 h-[85%] transition-transform duration-500 ease-out group-hover:scale-105">
                <Image
                  src={product.images[1]}
                  alt="Secondary Device"
                  fill
                  priority
                  className="object-contain drop-shadow-xl mix-blend-multiply"
                  sizes="(max-width: 1024px) 45vw, 25vw"
                />
              </div>
            </div>
          ) : (
            /* Single Hero Device */
            <div className="relative w-full h-full p-8 transition-transform duration-500 ease-out group-hover:scale-105">
              <Image
                src={product.images[0]}
                alt={product.name}
                fill
                priority
                className="object-contain drop-shadow-xl mix-blend-multiply"
                sizes="(max-width: 768px) 90vw, (max-width: 1024px) 45vw, 30vw"
              />
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="flex-1 px-8 pb-2">
        {/* Title + Price Stack */}
        <div className="flex flex-col gap-1.5 mb-5">
          <CardTitle className="text-2xl font-bold text-[#1B3A5C] leading-snug">
            {product.name}
          </CardTitle>
          <p className="text-3xl font-extrabold text-[#0D7377]">
            ${product.price.toFixed(2)}
          </p>
        </div>

        <p className="text-base text-slate-500 font-medium leading-relaxed mb-5">
          {product.description}
        </p>

        {/* Included Items */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-3">
          {product.items.map((item, i) => (
            <div key={i} className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-[#0D7377] shrink-0" />
              <span className="text-sm font-bold text-[#1B3A5C]">{item}</span>
            </div>
          ))}
        </div>
      </CardContent>

      <CardFooter className="p-8 pt-6">
        <button
          onClick={() => onAddToCart(product)}
          className="w-full bg-[#0D7377] hover:bg-[#0a5f63] text-white h-14 rounded-2xl font-bold flex items-center justify-center gap-3 transition-colors duration-300 shadow-md hover:shadow-lg focus:ring-4 focus:ring-[#0D7377]/20 outline-none"
        >
          <ShoppingCart size={20} />
          <span className="text-lg">Add to Cart</span>
        </button>
      </CardFooter>
    </Card>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function ShopPage() {
  const addItem = useCartStore((s) => s.addItem)
  const [activeTab, setActiveTab] = useState<Tab>("devices")

  const handleAddToCart = (product: Product) => {
    addItem({
      id: product.id,
      name: product.name,
      price_cents: product.price * 100,
      image: product.images[0],
    })
    toast.success(`Added "${product.name}" to cart`, {
      description: "View your cart to proceed with enrollment.",
      action: {
        label: "View Cart",
        onClick: () => (window.location.href = "/cart"),
      },
    })
  }

  const isBundle = activeTab === "bundles"
  const displayedProducts = (isBundle ? bundles : individualDevices).filter(
    (product) => product.stock_status !== "archived"
  )
  const gridClass = isBundle
    ? "grid grid-cols-1 lg:grid-cols-2 gap-12"
    : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"

  return (
    <div className="min-h-screen bg-white relative">

      {/* ── Hero Header ── */}
      <section className="w-full bg-[#1B3A5C] py-24 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 md:px-8 w-full flex flex-col items-center text-center">
          {/* Shipping Banner */}
          <div className="inline-flex items-center gap-2 mb-10 bg-white border border-slate-200/60 shadow-sm text-[#1B3A5C] px-6 py-3 rounded-full text-sm font-bold tracking-wide transition-transform hover:scale-105">
            <Package size={18} className="text-[#0D7377]" />
            <span>Standard Flat-Rate Shipping: $8.69 for all items</span>
          </div>

          <h1 className="text-[40px] md:text-[48px] leading-[1.15] font-bold text-white max-w-4xl">
            Premium Clinical Devices
          </h1>
          <p className="mt-6 text-xl text-white/80 max-w-2xl mx-auto font-medium leading-relaxed">
            Hospital-grade remote monitoring devices and bundles, pre-configured
            to seamlessly integrate with your care program.
          </p>
        </div>
      </section>

      {/* ── Tab Toggle ── */}
      <section className="w-full bg-slate-50 border-b border-slate-200 py-8">
        <div className="max-w-7xl mx-auto px-6 md:px-8 flex justify-center">
          <div
            role="tablist"
            aria-label="Product category"
            className="relative inline-flex items-center bg-slate-200/70 rounded-2xl p-1.5 gap-1 shadow-inner"
          >
            {/* Sliding pill — positioned absolutely behind buttons */}
            <span
              aria-hidden="true"
              className={`absolute top-1.5 bottom-1.5 rounded-xl bg-white shadow-md transition-all duration-300 ease-in-out ${!isBundle
                ? "left-1.5 right-[calc(50%+3px)]"
                : "left-[calc(50%+3px)] right-1.5"
                }`}
            />

            <button
              role="tab"
              id="tab-devices"
              aria-selected={!isBundle}
              aria-controls="panel-devices"
              onClick={() => setActiveTab("devices")}
              className={`relative z-10 h-14 px-8 rounded-xl text-lg font-bold flex items-center gap-2.5 transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0D7377] ${!isBundle ? "text-[#1B3A5C]" : "text-slate-500 hover:text-slate-700"
                }`}
            >
              <Cpu size={20} />
              Individual Devices
            </button>

            <button
              role="tab"
              id="tab-bundles"
              aria-selected={isBundle}
              aria-controls="panel-bundles"
              onClick={() => setActiveTab("bundles")}
              className={`relative z-10 h-14 px-8 rounded-xl text-lg font-bold flex items-center gap-2.5 transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0D7377] ${isBundle ? "text-[#1B3A5C]" : "text-slate-500 hover:text-slate-700"
                }`}
            >
              <Layers size={20} />
              Care Bundles
            </button>
          </div>
        </div>
      </section>

      {/* ── Product Grid ── */}
      <section
        id={isBundle ? "panel-bundles" : "panel-devices"}
        role="tabpanel"
        aria-labelledby={isBundle ? "tab-bundles" : "tab-devices"}
        className="py-24 w-full bg-white"
      >
        <div className="max-w-7xl mx-auto px-6 md:px-8 w-full">
          <div className={gridClass}>
            {displayedProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
