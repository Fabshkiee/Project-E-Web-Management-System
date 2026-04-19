"use client";

import React, { useEffect, useRef, useState } from "react";

interface ScrollRevealProps {
  children: React.ReactNode;
  threshold?: number;
  className?: string;
  direction?: "up" | "down" | "left" | "right" | "none";
  delay?: number;
  duration?: number;
}

export default function ScrollReveal({
  children,
  threshold = 0.15,
  className = "",
  direction = "up",
  delay = 0,
  duration = 1000,
}: ScrollRevealProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      {
        threshold,
        // Add a bit of rootMargin to start the animation slightly before it enters
        rootMargin: "0px 0px -50px 0px",
      },
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [threshold]);

  const getInitialStyles = () => {
    if (isVisible) return "opacity-100 translate-x-0 translate-y-0 scale-100";

    const base = "opacity-0 transition-all";
    switch (direction) {
      case "up":
        return `${base} translate-y-8 scale-[0.98]`;
      case "down":
        return `${base} -translate-y-8 scale-[0.98]`;
      case "left":
        return `${base} translate-x-8`;
      case "right":
        return `${base} -translate-x-8`;
      case "none":
        return `${base} scale-95`;
      default:
        return `${base} translate-y-8`;
    }
  };

  return (
    <div
      ref={ref}
      className={`will-change-[transform,opacity] ${getInitialStyles()} ${className}`}
      style={{
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`,
        transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)", // Custom easeOutExpo for luxury feel
      }}
    >
      {children}
    </div>
  );
}
