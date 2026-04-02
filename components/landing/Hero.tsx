'use client';

import Image from 'next/image';
import React from 'react';

export default function Hero() {
  return (
    <div className="relative min-h-screen bg-black overflow-hidden flex items-center">
      {/* Background Image*/}
      <div className="absolute inset-0 bg-black">
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
          <h1 className="text-5xl sm:text-6xl lg:text-[72px] font-bold leading-[1.1] tracking-tight text-white">
            Train With <span className="text-[#E61938]">Purpose.</span>
            <br />
            Train With <span className="text-[#E61938]">Passion.</span>
          </h1>

          {/* Description*/}
          <p className="mt-8 text-lg lg:text-xl text-gray-300 leading-relaxed max-w-lg">
            Step into Project-E Fitness Gym, where your ambitions become reality. 
            We provide the elite fitness equipment and expert environment needed to 
            push your limits. Don't wait to become your best self—start your 
            journey to greatness today.
          </p>

          {/* Buttons*/}
          <div className="mt-12 flex flex-wrap gap-4">
            {/* View Memberships */}
            <button
              className="px-10 py-6 bg-[#e11d48] hover:bg-[#c81e3d] active:bg-[#b91c3a] 
                         transition-all duration-200 text-white font-semibold text-xl 
                         rounded-3xl shadow-2xl shadow-red-900/60 hover:shadow-red-900/80 
                         active:scale-[0.97]"
            >
              View Memberships
            </button>

            {/* Member Portal  */}
            <button
              className="group px-8 py-6 border border-white/30 hover:border-white/60 
                         bg-white/10 hover:bg-white/20 backdrop-blur-lg transition-all 
                         duration-200 text-white font-semibold text-xl rounded-3xl 
                         flex items-center gap-3 active:scale-[0.97]"
            >
              {/* Image for Icon*/}
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

      {/* Bottom gradient overlay */}
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-black via-black/95 to-transparent pointer-events-none" />
    </div>
  );
}