'use client';

import Image from 'next/image';
import React from 'react';

export default function Hero() {
  return (
    <div className="relative min-h-screen bg-land-bg overflow-hidden flex items-center">
      {/* Background Image */}
      <div className="absolute inset-0 bg-land-bg">
        <Image
          src="/assets/hero_bg.webp"
          alt="Project-E Fitness Gym"
          fill
          className="object-cover opacity-50 brightness-[0.85] contrast-100 saturate-100"
          priority
          quality={95}
          sizes="100vw"
        />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-screen-2xl mx-auto px-6 lg:px-16 w-full">
        <div className="max-w-2xl">
          {/* Headline */}
          <h1 className="landing-h1 text-white tracking-tight">
            Train With <span className="text-land-crimson">Purpose.</span>
            <br />
            Train With <span className="text-land-crimson">Passion.</span>
          </h1>

          {/* Description */}
          <p className="mt-8 landing-p-lg text-gray-300 max-w-lg">
            Step into Project-E Fitness Gym, where your ambitions become reality. 
            We provide the elite fitness equipment and expert environment needed to 
            push your limits. Don't wait to become your best self—start your 
            journey to greatness today.
          </p>

          {/* Buttons */}
          <div className="mt-12 flex flex-wrap gap-4">
            {/* View Memberships */}
            <button
              className="px-10 py-6 bg-land-crimson hover:bg-land-red active:bg-land-border 
                         transition-all duration-200 text-white landing-h4 
                         rounded-3xl shadow-2xl shadow-land-crimson/60 hover:shadow-land-crimson/80 
                         active:scale-[0.97]"
            >
              View Memberships
            </button>

            {/* Member Portal */}
            <button
              className="group px-8 py-6 border border-white/30 hover:border-land-crimson 
                         bg-white/10 hover:bg-land-card-hover backdrop-blur-lg transition-all 
                         duration-200 text-white landing-h4 rounded-3xl 
                         flex items-center gap-3 active:scale-[0.97]"
            >
              {/* Image for Icon */}
              <Image
                src="/assets/member_portal_icon.svg"   
                alt="Member Portal Icon"
                width={28}
                height={28}
                className="transition-transform group-active:scale-110"
              />
              Member Portal
            </button>
          </div>
        </div>
      </div>

      {/* Full-size gradient overlay */}
      <div className="absolute inset-0 w-full h-full bg-gradient-to-t from-land-bg via-land-bg/95 to-transparent pointer-events-none" />
    </div>
  );
}