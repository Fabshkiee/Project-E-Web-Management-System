"use client";

import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  icon?: React.ReactNode;
  variant?: "primary" | "secondary";
  className?: string;
}

export const Button = ({
  children,
  icon,
  variant = "primary",
  className = "",
  ...props
}: ButtonProps) => {
  const baseStyles =
    "flex items-center justify-center gap-2 px-5 py-2.5 rounded-md font-lexend font-bold text-sm transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none";

  const variants = {
    primary:
      "bg-primary text-white shadow-lg shadow-primary/20 hover:bg-primary/90 hover:shadow-primary/30 hover:cursor-pointer",
    secondary:
      "bg-white dark:bg-white/5 border border-stroke dark:border-white/10 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 shadow-sm hover:cursor-pointer",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${className} group`}
      {...props}
    >
      {icon && (
        <span className="shrink-0 transition-transform duration-300 group-hover:scale-110">
          {icon}
        </span>
      )}
      {children}
    </button>
  );
};

// Shorthand exports for convenience
export const PrimaryButton = (props: ButtonProps) => (
  <Button variant="primary" {...props} />
);

export const SecondaryButton = (props: ButtonProps) => (
  <Button variant="secondary" {...props} />
);
