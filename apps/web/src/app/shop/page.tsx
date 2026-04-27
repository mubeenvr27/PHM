"use client"

import { ShoppingCart, Package } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

const products = [
  {
    id: "hypertension",
    name: "Hypertension Bundle",
    price: 50,
    items: ["Bluetooth Blood Pressure Cuff", "Bluetooth Weight Scale"],
    description: "Essential home monitoring tools for daily blood pressure tracking."
  },
  {
    id: "diabetes",
    name: "Diabetes Care Bundle",
    price: 65,
    items: ["Cellular Glucose Meter Kit", "Bluetooth Weight Scale"],
    description: "Complete glucose monitoring kit with real-time sync capabilities."
  },
  {
    id: "respiratory",
    name: "Respiratory Care Bundle",
    price: 105,
    items: ["Digital Peak Flow Meter", "Bluetooth Pulse Oximeter"],
    description: "Advanced respiratory tracking for COPD and asthma patients."
  },
  {
    id: "adv-heart",
    name: "Advanced Heart Failure Bundle",
    price: 100,
    items: ["4G Blood Pressure Cuff", "4G Weight Scale"],
    description: "Cellular-enabled devices that don't require Wi-Fi or smartphone pairing."
  }
]

export default function ShopPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* ── Header Banner ── */}
      <section className="bg-[#1B3A5C] py-16 lg:py-24 w-full">
        <div className="max-w-7xl mx-auto px-6 md:px-8 w-full text-center">
          <h1 className="text-4xl font-bold tracking-tight text-white md:text-5xl">
            Device Bundles
          </h1>
          <p className="mt-4 text-lg text-white/80 max-w-2xl mx-auto">
            Clinical-grade remote monitoring devices pre-configured for your care program.
          </p>
        </div>
      </section>

      {/* ── Product Grid ── */}
      <section className="py-16 lg:py-24 w-full">
        <div className="max-w-7xl mx-auto px-6 md:px-8 w-full">
          
          <div className="flex items-center gap-2 mb-8 bg-teal-50 text-[#0D7377] w-fit px-4 py-2 rounded-lg text-sm font-semibold">
            <Package size={18} />
            <span>Standard Flat-Rate Shipping: $8.69 for all items</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <Card key={product.id} className="flex flex-col h-full border-[#E2EBF4] hover:shadow-lg transition-all duration-300 hover:border-[#0D7377]/50 hover:-translate-y-1 bg-white">
                <CardHeader className="pb-4">
                  <div className="aspect-square bg-[#F8FAFC] rounded-lg mb-4 flex items-center justify-center border border-[#E2EBF4]/50 p-6">
                    <img src="/logo-horizontal.svg" alt={product.name} className="opacity-20 max-w-full h-auto object-contain" />
                  </div>
                  <CardTitle className="text-xl text-[#1B3A5C] leading-tight">{product.name}</CardTitle>
                  <p className="text-2xl font-bold text-[#0D7377] mt-2">${product.price.toFixed(2)}</p>
                </CardHeader>
                <CardContent className="flex-1">
                  <p className="text-sm text-slate-500 mb-4">{product.description}</p>
                  <div className="space-y-2">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">What's Included:</p>
                    <ul className="text-sm text-[#1A1A2E] space-y-1 font-medium">
                      {product.items.map((item, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-[#0D7377] mt-0.5">•</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
                <CardFooter>
                  <button className="w-full bg-[#1B3A5C] hover:bg-[#152e4a] text-white h-12 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors">
                    <ShoppingCart size={18} />
                    Add to Cart
                  </button>
                </CardFooter>
              </Card>
            ))}
          </div>

        </div>
      </section>
    </div>
  )
}
