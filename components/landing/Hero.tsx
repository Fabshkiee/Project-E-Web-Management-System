"use client";

import Image from "next/image";
import React from "react";

export default function Hero() {
  return (
    <div className="relative min-h-screen bg-land-bg overflow-hidden flex items-center">
      {/* Background Image */}
      <div className="absolute inset-0 bg-land-bg">
        <Image
          src="/assets/hero_bg.webp"
          alt="Project-E Fitness Gym"
          fill
          className="object-cover opacity-30"
          priority
          quality={95}
          sizes="100vw"
        />
      </div>

      {/* Content */}
      <div className="relative z-20 container mx-auto lg:mx-0 px-6 sm:px-12 flex flex-col items-center lg:items-start text-center lg:text-left">
        <div className="max-w-4xl mb-12 sm:mb-20 md:mb-32">
          {/* Headline */}
          <h1 className="text-[44px] leading-[1.05] sm:text-[64px] md:text-[80px] font-bold text-white tracking-tight">
            Train With <span className="text-land-crimson">Purpose.</span>
            <br /> Train With{" "}
            <span className="text-land-crimson">Passion.</span>
          </h1>

          {/* Description */}
          <p className="mt-8 text-[#A1A1AA] text-base sm:text-lg md:text-xl max-w-2xl mx-auto lg:mx-0 leading-relaxed font-inter">
            Step into Project-E Fitness Gym, where your ambitions become
            reality. We provide the elite equipment and expert environment
            needed to push your limits. Don’t wait to become your best self —
            start your journey to greatness today.
          </p>

          {/* Buttons */}
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-5 w-full sm:w-auto">
            {/* View Memberships */}
            <button
              className="w-full sm:w-[220px] h-[56px] flex items-center justify-center 
                         bg-land-crimson hover:bg-[#ff1a40] active:scale-95
                         transition-all duration-300 text-white text-base md:text-lg font-bold
                         rounded-xl shadow-xl shadow-land-crimson/20 hover:shadow-land-crimson/40"
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
              <Image
                src="/assets/member_portal_icon.svg"
                alt="Member Portal Icon"
                aria-hidden="true"
                width={22}
                height={22}
                className="transition-transform group-hover:rotate-12"
              />
              Member Portal
            </button>
          </div>
        </div>
      </div>

      {/* Full-size gradient overlays */}

      {/* 1. Left to Right (Based on Figma: 0% at 100% opacity, 50% at 0% opacity, 100% at 0% opacity) */}
      <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-land-bg from-0% via-land-bg/0 via-50% to-transparent to-100% pointer-events-none z-10" />

      {/* 2. Bottom to Top (Based on Figma: 0% at 100% opacity, 50% at 80% opacity, 100% at 0% opacity) */}
      <div className="absolute inset-0 w-full h-full bg-gradient-to-t from-land-bg from-0% via-land-bg/80 via-50% to-transparent to-100% pointer-events-none z-10" />
    </div>
  );
}
