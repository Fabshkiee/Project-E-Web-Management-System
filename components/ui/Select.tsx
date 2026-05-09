import React, { useState, useRef, useEffect } from "react";
import { ChevronDownIcon } from "./Icons";

export interface SelectOption {
  label: string;
  value: string | number;
}

interface SelectProps {
  label?: string;
  options: SelectOption[];
  value: string | number;
  onChange: (value: any) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  filterLabel?: string; // For the search-filter style "Label: Value"
  id?: string;
}

export const Select = ({
  label,
  options,
  value,
  onChange,
  placeholder = "Select option",
  className = "",
  disabled = false,
  filterLabel,
  id,
}: SelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find((opt) => opt.value === value);

  const inputBase =
    "w-full px-4 py-3 rounded-xl border border-stroke dark:border-white/10 bg-gray-100/50 dark:bg-transparent text-foreground text-sm font-lexend transition-all flex items-center justify-between cursor-pointer disabled:opacity-50 disabled:pointer-events-none";

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      {label && (
        <label
          htmlFor={id}
          className="text-[11px] font-medium font-lexend uppercase tracking-wider text-gray-500 dark:text-[#9CA3AF] mb-1.5 block"
        >
          {label}
        </label>
      )}

      <button
        id={id}
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className={`${inputBase} ${
          isOpen
            ? "border-primary ring-2 ring-primary/30"
            : "hover:border-gray-300 dark:hover:border-white/20"
        }`}
      >
        <div className="flex-1 text-left truncate">
          {filterLabel && (
            <span className="text-gray-500 dark:text-gray-400 mr-2">
              {filterLabel}:
            </span>
          )}
          <span
            className={selectedOption ? "text-foreground" : "text-[#9CA3AF]"}
          >
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        </div>
        <ChevronDownIcon
          className={`w-4 h-4 text-[#9CA3AF] transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-[calc(100%+4px)] left-0 w-full min-w-[160px] bg-white dark:bg-[#1f1f1f] border border-stroke dark:border-white/10 rounded-xl shadow-xl z-[60] py-2 animate-in fade-in slide-in-from-top-1 duration-200 max-h-60 overflow-y-auto">
          {options.map((opt) => (
            <div
              key={opt.value}
              className={`px-4 py-2.5 text-sm font-lexend cursor-pointer transition-colors ${
                value === opt.value
                  ? "bg-primary/10 text-primary font-semibold"
                  : "text-foreground hover:bg-gray-100 dark:hover:bg-white/5"
              }`}
              onClick={() => {
                onChange(opt.value);
                setIsOpen(false);
              }}
            >
              {opt.label}
            </div>
          ))}
          {options.length === 0 && (
            <div className="px-4 py-2 text-sm text-gray-500 font-lexend">
              No options available
            </div>
          )}
        </div>
      )}
    </div>
  );
};
