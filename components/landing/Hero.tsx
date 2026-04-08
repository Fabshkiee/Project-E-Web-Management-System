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
          className="object-cover opacity-30"
          priority
          quality={95}
          sizes="100vw"
        />
      </div>

      {/* Content */}
      <div className="relative z-20 container ml-0 px-[32px] w-full text-left">
        <div className="max-w-3xl mb-24 md:mb-32">
          
          {/* Headline */}
          <h1 className="text-[72px] font-bold text-white tracking-tight leading-tight">
            Train With <span className="text-land-crimson">Purpose.</span>
            <br />
            Train With <span className="text-land-crimson">Passion.</span>
          </h1>

          {/* Description */}
          <p className="mt-8 text-[#A1A1AA] text-[18px] inline-block">
            Step into Project-E Fitness Gym, where your ambitions become reality.<br className="hidden sm:block" />
            We provide the elite equipment and expert environment needed to<br className="hidden sm:block" />
            push your limits. Don’t wait to become your best self—start your<br className="hidden sm:block" />
            journey to greatness today.
          </p>

          {/* Buttons */}
          <div className="mt-10 flex flex-wrap gap-4">
            
            {/* View Memberships */}
            <button
              className="w-[207px] h-[48px] flex items-center justify-center 
                         bg-land-crimson hover:bg-land-red active:bg-land-border 
                         transition-all duration-200 text-white text-[16px] font-bold
                         rounded-lg active:scale-[0.97] whitespace-nowrap
                         hover:scale-105 hover:shadow-lg hover:shadow-land-crimson/50
                         focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-land-crimson focus-visible:ring-offset-2 focus-visible:ring-offset-land-bg"
            >
              View Memberships
            </button>

            {/* Member Portal */}
            <button
              className="group w-[207px] h-[48px] flex items-center justify-center gap-3
                         border border-[#1D1516] hover:border-land-crimson 
                         bg-[#1D1516] hover:bg-land-card-hover transition-colors 
                         duration-200 text-white text-[16px] font-bold rounded-lg 
                         active:scale-[0.97] whitespace-nowrap
                         focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-land-crimson focus-visible:ring-offset-2 focus-visible:ring-offset-land-bg"
            >
              <Image
                src="/assets/member_portal_icon.svg"   
                alt="Member Portal Icon" 
                aria-hidden="true"
                width={20}
                height={20}
                className="transition-transform group-hover:scale-110 group-active:scale-110 flex-shrink-0"
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