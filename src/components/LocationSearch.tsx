import React, { useState } from 'react';
import { MapPin, Search, Loader2 } from 'lucide-react';

interface LocationSearchProps {
  onLocationSearch: (location: string, filters?: any) => void;
  isLoading: boolean;
}

export const LocationSearch: React.FC<LocationSearchProps> = ({
  onLocationSearch,
  isLoading
}) => {
  const [location, setLocation] = useState('');
  const [cuisine, setCuisine] = useState('');
  const [priceRange, setPriceRange] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (location.trim()) {
      onLocationSearch(location, { cuisine, priceRange });
    }
  };

  const cuisineOptions = [
    'italian', 'chinese', 'japanese', 'mexican', 'indian', 'french', 
    'thai', 'mediterranean', 'american', 'korean', 'vietnamese', 'greek'
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
      <div className="flex items-center mb-4">
        <MapPin className="w-5 h-5 text-orange-600 mr-2" />
        <h2 className="text-lg font-semibold text-gray-900">Search Restaurants by Location</h2>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Enter city or zip code..."
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              required
            />
          </div>
          
          <select
            value={cuisine}
            onChange={(e) => setCuisine(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          >
            <option value="">All Cuisines</option>
            {cuisineOptions.map((option) => (
              <option key={option} value={option}>
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </option>
            ))}
          </select>
          
          <select
            value={priceRange}
            onChange={(e) => setPriceRange(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          >
            <option value="">All Prices</option>
            <option value="1">$ - Budget Friendly</option>
            <option value="2">$$ - Moderate</option>
            <option value="3">$$$ - Upscale</option>
            <option value="4">$$$$ - Fine Dining</option>
          </select>
        </div>
        
        <button
          type="submit"
          disabled={isLoading || !location.trim()}
          className="w-full md:w-auto px-8 py-3 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 text-white font-medium rounded-lg transition-colors flex items-center justify-center"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Searching...
            </>
          ) : (
            <>
              <Search className="w-4 h-4 mr-2" />
              Search Restaurants
            </>
          )}
        </button>
      </form>
    </div>
  );
};