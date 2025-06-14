import React from 'react';
import { Search, Filter, Star } from 'lucide-react';
import { FilterOptions } from '../types/Restaurant';

interface FilterBarProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  filters: FilterOptions;
  onFilterChange: (filters: FilterOptions) => void;
  cuisines: string[];
}

export const FilterBar: React.FC<FilterBarProps> = ({
  searchTerm,
  onSearchChange,
  filters,
  onFilterChange,
  cuisines
}) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
      <div className="flex items-center mb-4">
        <Filter className="w-5 h-5 text-orange-600 mr-2" />
        <h2 className="text-lg font-semibold text-gray-900">Find Your Perfect Restaurant</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search restaurants..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          />
        </div>
        
        <select
          value={filters.cuisine}
          onChange={(e) => onFilterChange({ ...filters, cuisine: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
        >
          <option value="">All Cuisines</option>
          {cuisines.map((cuisine) => (
            <option key={cuisine} value={cuisine}>
              {cuisine}
            </option>
          ))}
        </select>
        
        <select
          value={filters.priceRange}
          onChange={(e) => onFilterChange({ ...filters, priceRange: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
        >
          <option value="">All Prices</option>
          <option value="$">$ - Budget Friendly</option>
          <option value="$$">$$ - Moderate</option>
          <option value="$$$">$$$ - Upscale</option>
          <option value="$$$$">$$$$ - Fine Dining</option>
        </select>
        
        <div className="flex items-center space-x-2">
          <Star className="w-4 h-4 text-yellow-400" />
          <input
            type="range"
            min="0"
            max="5"
            step="0.5"
            value={filters.minRating}
            onChange={(e) => onFilterChange({ ...filters, minRating: parseFloat(e.target.value) })}
            className="flex-1"
          />
          <span className="text-sm text-gray-600 min-w-[3rem]">
            {filters.minRating}+
          </span>
        </div>
      </div>
    </div>
  );
};