import { SearchIcon, ChevronDownIcon } from "@/components/ui/Icons";
import { useState, useRef, useEffect } from "react";

interface FilterOption {
  label: string;
  value: string;
}

interface FilterConfig {
  label: string;
  options: FilterOption[];
  value: string;
  onChange: (value: string) => void;
}

interface SearchFilterProps {
  onSearch: (query: string) => void;
  filters: FilterConfig[];
  placeholder?: string;
  className?: string;
}

export const SearchFilter = ({
  onSearch,
  filters,
  placeholder = "Search by name or ID...",
  className = "",
}: SearchFilterProps) => {
  return (
    <section
      className={`flex flex-col md:flex-row gap-4 items-center w-full ${className}`}
    >
      {/* Search Input */}
      <div className="relative flex-1 w-full group">
        <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors duration-200">
          <SearchIcon className="w-5 h-5" />
        </span>
        <input
          type="text"
          placeholder={placeholder}
          onChange={(e) => onSearch(e.target.value)}
          className="w-full pl-14 pr-6 py-3.5 bg-white dark:bg-[#1a1a1a] border border-stroke dark:border-white/5 rounded-xl text-sm font-lexend focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/30 transition-all shadow-sm placeholder:text-gray-400 text-foreground"
        />
      </div>

      {/* Filters Container */}
      <div className="flex gap-3 w-full md:w-auto">
        {filters.map((filter, idx) => (
          <CustomDropdown key={idx} filter={filter} />
        ))}
      </div>
    </section>
  );
};

const CustomDropdown = ({ filter }: { filter: FilterConfig }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption =
    filter.options.find((opt) => opt.value === filter.value) || {
      label: "All",
      value: "all",
    };

  const hasAllOption = filter.options.some((opt) => opt.value === "all");

  return (
    <div className="relative min-w-[140px]" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between px-5 py-3.5 bg-white dark:bg-[#1a1a1a] border rounded-xl text-sm font-lexend font-medium transition-all shadow-sm ${
          isOpen
            ? "border-primary ring-4 ring-primary/5"
            : "border-stroke dark:border-white/5 hover:border-gray-300 dark:hover:border-white/10"
        }`}
      >
        <span className="text-gray-500 dark:text-gray-400 mr-2">
          {filter.label}:
        </span>
        <span className="text-foreground flex-1 text-left truncate">
          {selectedOption.label}
        </span>
        <ChevronDownIcon
          className={`w-4 h-4 text-gray-400 ml-2 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="absolute z-50 top-full mt-2 w-full min-w-[180px] bg-white dark:bg-[#1f1f1f] border border-stroke dark:border-white/10 rounded-xl shadow-xl overflow-hidden py-1 animate-in fade-in slide-in-from-top-1">
          {!hasAllOption && (
            <button
              onClick={() => {
                filter.onChange("all");
                setIsOpen(false);
              }}
              className={`w-full text-left px-5 py-2.5 text-sm font-lexend transition-colors ${
                filter.value === "all"
                  ? "bg-primary/10 text-primary font-semibold"
                  : "text-foreground hover:bg-gray-50 dark:hover:bg-white/5"
              }`}
            >
              All
            </button>
          )}
          {filter.options.map((opt) => (
            <button
              key={opt.value}
              onClick={() => {
                filter.onChange(opt.value);
                setIsOpen(false);
              }}
              className={`w-full text-left px-5 py-2.5 text-sm font-lexend transition-colors ${
                filter.value === opt.value
                  ? "bg-primary/10 text-primary font-semibold"
                  : "text-foreground hover:bg-gray-50 dark:hover:bg-white/5"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
