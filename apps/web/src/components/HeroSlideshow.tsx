"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

const IMAGES = Array.from({ length: 11 }, (_, i) => `/Home_page_pics/${i + 1}.webp`);

export default function HeroSlideshow() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mediaQuery.matches) {
      return;
    }

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % IMAGES.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden" aria-hidden="true">
      {IMAGES.map((src, index) => (
        <Image
          key={src}
          src={src}
          alt={`Priority Home Monitor Background ${index + 1}`}
          fill
          priority={index < 3}
          className={`object-cover transition-opacity duration-[1500ms] ease-in-out ${
            index === currentIndex ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}
    </div>
  );
}
