import { SearchIcon, ChevronDown } from "@/components/ui/Icons";

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
    <section className={`flex flex-col md:flex-row gap-4 items-center w-full ${className}`}>
      {/* Search Input */}
      <div className="relative flex-1 w-full group">
        <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors duration-200">
          <SearchIcon className="w-5 h-5" />
        </span>
        <input
          type="text"
          placeholder={placeholder}
          onChange={(e) => onSearch(e.target.value)}
          className="w-full pl-14 pr-6 py-3.5 bg-white dark:bg-[#1a1a1a] border border-stroke dark:border-white/5 rounded-xl text-sm font-lexend focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/30 transition-all shadow-sm placeholder:text-gray-400"
        />
      </div>

      {/* Filters Container */}
      <div className="flex gap-3 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
        {filters.map((filter, idx) => (
          <div key={idx} className="relative min-w-[160px] shrink-0">
            <select
              value={filter.value}
              onChange={(e) => filter.onChange(e.target.value)}
              className="appearance-none w-full pl-5 pr-12 py-3.5 bg-white dark:bg-[#1a1a1a] border border-stroke dark:border-white/5 rounded-xl text-sm font-lexend font-medium text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/30 transition-all shadow-sm cursor-pointer hover:border-gray-300 dark:hover:border-white/10"
            >
              <option value="all">
                {filter.label}: All
              </option>
              {filter.options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {filter.label}: {opt.label}
                </option>
              ))}
            </select>
            <span className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none group-hover:text-gray-600 transition-colors">
              <ChevronDown className="w-4 h-4" />
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};
