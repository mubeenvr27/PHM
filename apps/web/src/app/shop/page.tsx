"use client"

import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { ShoppingCart, Package, CheckCircle2 } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const products = [
  {
    id: "hypertension",
    name: "Hypertension Bundle",
    price: 50,
    items: ["Bluetooth Blood Pressure Cuff", "Bluetooth Weight Scale"],
    description: "Precision daily monitoring for cardiovascular health.",
    images: ["/Devices_image/Blood_pressure_cuff.png"],
    badge: "Built-in Bluetooth",
    badgeStyle: "bg-teal-50 text-[#0D7377] border-[#0D7377]/20"
  },
  {
    id: "diabetes",
    name: "Diabetes Care Bundle",
    price: 65,
    items: ["Cellular Glucose Meter Kit", "Bluetooth Weight Scale"],
    description: "Real-time glucose tracking with automated cloud syncing.",
    images: ["/Devices_image/Glucose_meter.png"],
    badge: "Independent 4G",
    badgeStyle: "bg-blue-50 text-[#1B3A5C] border-[#1B3A5C]/20"
  },
  {
    id: "respiratory",
    name: "Respiratory Care Bundle",
    price: 105,
    items: ["Digital Peak Flow Meter", "Bluetooth Pulse Oximeter"],
    description: "Advanced lung function and oxygen saturation tracking.",
    images: ["/Devices_image/peak_meter.png", "/Devices_image/pulse_oximeter.png"],
    badge: "Built-in Bluetooth",
    badgeStyle: "bg-teal-50 text-[#0D7377] border-[#0D7377]/20"
  },
  {
    id: "adv-heart",
    name: "Advanced Heart Failure Bundle",
    price: 100,
    items: ["4G Blood Pressure Cuff", "4G Weight Scale"],
    description: "Hospital-grade 4G monitoring that works without Wi-Fi or smartphone pairing.",
    images: ["/Devices_image/Blood_pressure_cuff.png"],
    badge: "Independent 4G",
    badgeStyle: "bg-blue-50 text-[#1B3A5C] border-[#1B3A5C]/20"
  }
]

export default function ShopPage() {
  const router = useRouter()
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const handleAddToCart = (productName: string) => {
    setToastMessage(`Added ${productName} to cart. Redirecting to enrollment...`)
    setTimeout(() => {
      setToastMessage(null)
      router.push("/contact")
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-white relative">
      {/* ── Toast Notification ── */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-[#1B3A5C] text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-top-4 fade-in duration-300">
          <div className="bg-[#0D7377] p-2 rounded-full">
            <ShoppingCart size={16} className="text-white" />
          </div>
          <span className="font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* ── Full-Bleed Section Architecture ── */}
      <section className="w-full bg-[#F8FAFC] py-24 border-b border-slate-200/50">
        <div className="max-w-7xl mx-auto px-6 md:px-8 w-full flex flex-col items-center text-center">
          
          {/* Global Shipping Rule Banner */}
          <div className="inline-flex items-center gap-2 mb-10 bg-white border border-slate-200/60 shadow-sm text-[#1B3A5C] px-6 py-3 rounded-full text-sm font-bold tracking-wide transition-transform hover:scale-105">
            <Package size={18} className="text-[#0D7377]" />
            <span>Standard Flat-Rate Shipping: $8.69 for all items</span>
          </div>

          <h1 className="text-[40px] md:text-[48px] leading-[1.6] font-bold text-[#1B3A5C] max-w-4xl">
            Premium Clinical Devices
          </h1>
          <p className="mt-6 text-xl text-slate-500 max-w-2xl mx-auto font-medium leading-relaxed">
            Hospital-grade remote monitoring bundles pre-configured to seamlessly integrate with your care program.
          </p>
        </div>
      </section>

      {/* ── Product Grid Section ── */}
      <section className="py-24 w-full bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-8 w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product, index) => (
              <Card 
                key={product.id} 
                className="group flex flex-col h-full bg-[#F8FAFC] border border-slate-200/60 rounded-3xl shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 overflow-hidden relative"
              >
                <CardHeader className="p-6 pb-4">
                  <div className="mb-6">
                    <Badge variant="outline" className={`px-4 py-1.5 text-xs font-bold uppercase tracking-wider rounded-full border ${product.badgeStyle}`}>
                      {product.badge}
                    </Badge>
                  </div>
                  
                  {/* Elevated Imagery Container */}
                  <div className="aspect-[4/3] w-full rounded-2xl mb-6 relative">
                    {product.images.length > 1 ? (
                      /* Staggered "Product Duo" Layout */
                      <div className="relative w-full h-full flex items-center justify-center">
                        <div className="absolute left-2 top-2 w-3/4 h-3/4 z-0 opacity-90 transition-transform duration-500 group-hover:scale-105 group-hover:-rotate-3">
                          <Image 
                            src={product.images[1]} 
                            alt="Secondary Device" 
                            fill
                            className="object-contain drop-shadow-md"
                            sizes="(max-width: 768px) 100vw, 25vw"
                          />
                        </div>
                        <div className="absolute right-0 bottom-0 w-3/4 h-3/4 z-10 transition-transform duration-500 group-hover:scale-110 group-hover:-translate-y-2">
                          <Image 
                            src={product.images[0]} 
                            alt="Primary Device" 
                            fill
                            className="object-contain drop-shadow-2xl"
                            priority={index < 2}
                            sizes="(max-width: 768px) 100vw, 25vw"
                          />
                        </div>
                      </div>
                    ) : (
                      /* Single Device Layout */
                      <div className="relative w-full h-full p-4 transition-transform duration-500 group-hover:scale-110 group-hover:-translate-y-2">
                        <Image 
                          src={product.images[0]} 
                          alt={product.name} 
                          fill
                          className="object-contain drop-shadow-xl"
                          priority={index < 2}
                          sizes="(max-width: 768px) 100vw, 25vw"
                        />
                      </div>
                    )}
                  </div>
                  
                  <CardTitle className="text-2xl font-bold text-[#1B3A5C] leading-tight">
                    {product.name}
                  </CardTitle>
                  <p className="text-3xl font-extrabold text-[#0D7377] mt-3 tracking-tight">${product.price.toFixed(2)}</p>
                </CardHeader>
                
                <CardContent className="flex-1 p-6 pt-0">
                  <p className="text-base text-slate-500 font-medium leading-relaxed mb-6">
                    {product.description}
                  </p>
                  
                  {/* Feature Lists with Horizontal Icons */}
                  <div className="flex flex-col gap-3">
                    {product.items.map((item, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5 text-[#0D7377] shrink-0" />
                        <span className="text-sm font-bold text-[#1B3A5C]">{item}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
                
                <CardFooter className="p-6 pt-0">
                  <button 
                    onClick={() => handleAddToCart(product.name)}
                    className="w-full bg-[#0D7377] hover:bg-[#0a5f63] text-white h-14 rounded-2xl font-bold flex items-center justify-center gap-3 transition-colors duration-300 shadow-md hover:shadow-lg focus:ring-4 focus:ring-[#0D7377]/20 outline-none"
                  >
                    <ShoppingCart size={20} />
                    <span className="text-lg">Add to Cart</span>
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
