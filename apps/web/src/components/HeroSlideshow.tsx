"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

const IMAGES = Array.from({ length: 11 }, (_, i) => `/Home_page_pics_animation/${i + 1}.webp`);

export default function HeroSlideshow() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // Always animate the slideshow, ignoring prefers-reduced-motion for this specific hero component.
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % IMAGES.length);
    }, 3000);

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
          style={{
            transition: 'opacity 1.5s ease-in-out, transform 10s ease-out',
            transform: index === currentIndex ? 'scale(1.1)' : 'scale(1)',
            opacity: index === currentIndex ? 1 : 0,
          }}
          className="object-cover"
        />
      ))}
    </div>
  );
}
