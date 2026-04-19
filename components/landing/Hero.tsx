"use client";

import Image from "next/image";
import React from "react";

export default function Hero() {
  const [currentImageIndex, setCurrentImageIndex] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative min-h-[90vh] lg:min-h-screen bg-land-bg overflow-hidden flex items-center">
      {/* Background Image */}
      <div className="absolute inset-0 bg-land-bg">
        <Image
          src="/assets/hero_bg.webp"
          alt="Project-E Fitness Gym"
          fill
          className="object-cover opacity-20 lg:opacity-30 mix-blend-luminosity"
          priority
          quality={75}
          sizes="100vw"
        />
      </div>

      {/* Content Container */}
      <div className="relative z-20 w-full max-w-[1400px] mx-auto px-6 sm:px-10 md:px-16 flex flex-col lg:flex-row items-center justify-between text-center lg:text-left gap-12 lg:gap-16 pt-24 lg:pt-0">
        {/* Left Text Column */}
        <div className="max-w-2xl lg:max-w-3xl flex-1 mb-8 lg:mb-0">
          {/* Headline */}
          <h1 className="text-[44px] leading-[1.05] sm:text-[64px] lg:text-[72px] xl:text-[80px] font-bold text-white tracking-tight">
            Train With <span className="text-land-crimson">Purpose.</span>
            <br className="hidden sm:block" /> Train With{" "}
            <span className="text-land-crimson">Passion.</span>
          </h1>

          {/* Description */}
          <p className="mt-6 md:mt-8 text-[#A1A1AA] text-base sm:text-lg md:text-xl lg:max-w-[600px] mx-auto lg:mx-0 leading-relaxed font-inter">
            Step into Project-E Fitness Gym, where your ambitions become
            reality. We provide the elite equipment and expert environment
            needed to push your limits. Don’t wait to become your best self —
            start your journey to greatness today.
          </p>

          {/* Buttons */}
          <div className="mt-10 lg:mt-12 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-5 w-full sm:w-auto">
            {/* View Memberships */}
            <button
              className="w-full sm:w-[220px] h-[56px] flex items-center justify-center 
                         bg-land-crimson hover:bg-[#ff1a40] active:scale-95
                         transition-all duration-300 text-white text-base md:text-lg font-bold
                         rounded-xl shadow-lg shadow-land-crimson/20"
            >
              View Memberships
            </button>

            {/* Member Portal */}
            <button
              className="group w-full sm:w-[220px] h-[56px] flex items-center justify-center gap-3
                         border border-white/10 bg-white/5 hover:bg-white/10 backdrop-blur-sm
                         transition-all duration-300 text-white text-base md:text-lg font-bold rounded-xl 
                         active:scale-95"
            >
              <div className="flex items-center gap-3">
                <Image
                  src="/assets/member_portal_icon.svg"
                  alt="Member Portal Icon"
                  aria-hidden="true"
                  width={22}
                  height={22}
                  className="transition-transform group-hover:rotate-12"
                />
                <span className="leading-none">Member Portal</span>
              </div>
            </button>
          </div>
        </div>

        {/* Right Rotating Images Design */}
        <div className="relative w-full max-w-[340px] sm:max-w-[400px] lg:max-w-[480px] aspect-[4/5] lg:aspect-[3/4] shrink-0 hidden md:block">
          {/* Subtle Glow Behind Card */}
          <div className="absolute inset-0 bg-land-crimson/20 blur-[100px] rounded-full pointer-events-none" />

          {/* Main Card */}
          <div className="relative w-full h-full rounded-[32px] overflow-hidden shadow-2xl shadow-black border border-white/10 animate-card-float bg-land-dark">
            {/* Image Layers */}
            {HERO_IMAGES.map((img, i) => (
              <div
                key={img.src}
                className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                  i === currentImageIndex ? "opacity-100 z-10" : "opacity-0 z-0"
                }`}
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  className="object-cover"
                  priority={i === 0}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 480px"
                />

                {/* Gradient overlay for text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none" />

                {/* Integrated Glass Badge */}
                <div className="absolute bottom-8 left-8">
                  <div className="bg-white/10 backdrop-blur-md border border-white/10 px-5 py-2.5 rounded-xl shadow-lg">
                    <p className="text-white font-bold text-xs tracking-[0.2em] uppercase">
                      {img.badge}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            {/* Pagination Indicators */}
            <div className="absolute bottom-10 right-8 flex gap-2 z-20">
              {HERO_IMAGES.map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 rounded-full transition-all duration-500 ease-in-out ${
                    i === currentImageIndex
                      ? "bg-land-crimson w-6"
                      : "bg-white/30 w-2"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Full-size gradient overlays */}

      {/* 1. Left to Right (Based on Figma: 0% at 100% opacity, 50% at 0% opacity, 100% at 0% opacity) */}
      <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-land-bg from-0% via-land-bg/0 via-50% to-transparent to-100% pointer-events-none z-10 hidden lg:block" />

      {/* 2. Bottom to Top (Based on Figma: 0% at 100% opacity, 50% at 80% opacity, 100% at 0% opacity) */}
      <div className="absolute inset-0 w-full h-full bg-gradient-to-t from-land-bg from-0% via-land-bg/80 via-50% to-transparent to-100% pointer-events-none z-10" />
    </div>
  );
}

const HERO_IMAGES = [
  { src: "/assets/coach.webp", alt: "Elite Coaching", badge: "Elite Training" },
  {
    src: "/assets/community.webp",
    alt: "Strong Community",
    badge: "Strong Community",
  },
  {
    src: "/assets/gym.webp",
    alt: "Global Gym Facilities",
    badge: "Premium Equipment",
  },
];
