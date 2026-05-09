import { SearchIcon } from "@/components/ui/Icons";
import { Select } from "@/components/ui/Select";

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
          <Select
            key={idx}
            filterLabel={filter.label}
            value={filter.value}
            onChange={filter.onChange}
            options={
              filter.options.some((opt) => opt.value === "all")
                ? filter.options.map((opt) => ({
                    label: opt.label,
                    value: opt.value,
                  }))
                : [
                    { label: "All", value: "all" },
                    ...filter.options.map((opt) => ({
                      label: opt.label,
                      value: opt.value,
                    })),
                  ]
            }
            className="min-w-[140px]"
          />
        ))}
      </div>
    </section>
  );
};

