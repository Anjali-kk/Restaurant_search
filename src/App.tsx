import React, { useState, useMemo } from 'react';
import { Utensils, Heart, AlertCircle } from 'lucide-react';
import { RestaurantCard } from './components/RestaurantCard';
import { FilterBar } from './components/FilterBar';
import { LocationSearch } from './components/LocationSearch';
import { RestaurantModal } from './components/RestaurantModal';
import { QuestionBot } from './components/QuestionBot';
import { restaurants as defaultRestaurants } from './data/restaurants';
import { apiService, ApiRestaurant } from './services/api';
import { Restaurant, FilterOptions } from './types/Restaurant';

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<FilterOptions>({
    cuisine: '',
    priceRange: '',
    minRating: 0
  });
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [restaurants, setRestaurants] = useState<Restaurant[]>(defaultRestaurants);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [isUsingLiveData, setIsUsingLiveData] = useState(false);

  const cuisines = useMemo(() => {
    return Array.from(new Set(restaurants.map(r => r.cuisine))).sort();
  }, [restaurants]);

  const filteredRestaurants = useMemo(() => {
    let result = restaurants.filter(restaurant => {
      const matchesSearch = restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          restaurant.cuisine.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          restaurant.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCuisine = !filters.cuisine || restaurant.cuisine === filters.cuisine;
      const matchesPrice = !filters.priceRange || restaurant.priceRange === filters.priceRange;
      const matchesRating = restaurant.rating >= filters.minRating;
      const matchesFavorites = !showFavoritesOnly || favorites.has(restaurant.id);
      
      return matchesSearch && matchesCuisine && matchesPrice && matchesRating && matchesFavorites;
    });

    return result.sort((a, b) => b.rating - a.rating);
  }, [searchTerm, filters, favorites, showFavoritesOnly, restaurants]);

  const handleLocationSearch = async (location: string, searchFilters?: any) => {
    setIsSearching(true);
    setSearchError(null);

    try {
      const response = await apiService.searchRestaurants({
        location,
        cuisine: searchFilters?.cuisine,
        priceRange: searchFilters?.priceRange,
        radius: 8000 // 5 miles in meters
      });

      // Convert API restaurants to our format
      const convertedRestaurants: Restaurant[] = response.restaurants.map((apiRestaurant: ApiRestaurant) => ({
        ...apiRestaurant,
        priceRange: apiRestaurant.priceRange as '$' | '$$' | '$$$' | '$$$$'
      }));

      setRestaurants(convertedRestaurants);
      setIsUsingLiveData(true);
      
      // Reset filters when new search is performed
      setFilters({
        cuisine: '',
        priceRange: '',
        minRating: 0
      });
      setSearchTerm('');
      
    } catch (error) {
      console.error('Location search error:', error);
      setSearchError(error instanceof Error ? error.message : 'Failed to search restaurants');
    } finally {
      setIsSearching(false);
    }
  };

  const handleRestaurantSelect = (restaurant: Restaurant) => {
    setSelectedRestaurant(restaurant);
    setIsModalOpen(true);
  };

  const handleToggleFavorite = (id: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(id)) {
        newFavorites.delete(id);
      } else {
        newFavorites.add(id);
      }
      return newFavorites;
    });
  };

  const resetToDefault = () => {
    setRestaurants(defaultRestaurants);
    setIsUsingLiveData(false);
    setSearchError(null);
    setFilters({
      cuisine: '',
      priceRange: '',
      minRating: 0
    });
    setSearchTerm('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Utensils className="w-8 h-8 text-orange-600 mr-3" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">FoodieFinds</h1>
                <p className="text-gray-600">
                  {isUsingLiveData ? 'Live restaurant search powered by Yelp' : 'Discover amazing restaurants near you'}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {isUsingLiveData && (
                <button
                  onClick={resetToDefault}
                  className="px-4 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  Show Demo Data
                </button>
              )}
              <button
                onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                  showFavoritesOnly
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Heart size={20} className="mr-2" fill={showFavoritesOnly ? 'currentColor' : 'none'} />
                {showFavoritesOnly ? 'Show All' : 'Favorites'} ({favorites.size})
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Location Search */}
        <LocationSearch 
          onLocationSearch={handleLocationSearch}
          isLoading={isSearching}
        />

        {/* Search Error */}
        {searchError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
              <div>
                <h3 className="text-red-800 font-medium">Search Error</h3>
                <p className="text-red-700 text-sm mt-1">{searchError}</p>
                <p className="text-red-600 text-xs mt-2">
                  Make sure your Yelp API key is configured in Supabase environment variables.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Filter Bar */}
        <FilterBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          filters={filters}
          onFilterChange={setFilters}
          cuisines={cuisines}
        />

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            {showFavoritesOnly
              ? `Showing ${filteredRestaurants.length} favorite restaurant${filteredRestaurants.length !== 1 ? 's' : ''}`
              : `Found ${filteredRestaurants.length} restaurant${filteredRestaurants.length !== 1 ? 's' : ''}`
            }
            {isUsingLiveData && ' from live search'}
          </p>
        </div>

        {/* Restaurant Grid */}
        {filteredRestaurants.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredRestaurants.map((restaurant) => (
              <RestaurantCard
                key={restaurant.id}
                restaurant={restaurant}
                onSelect={handleRestaurantSelect}
                isFavorite={favorites.has(restaurant.id)}
                onToggleFavorite={handleToggleFavorite}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Utensils className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              {showFavoritesOnly ? 'No favorites found' : 'No restaurants found'}
            </h3>
            <p className="text-gray-500">
              {showFavoritesOnly
                ? 'Start adding restaurants to your favorites!'
                : isUsingLiveData
                ? 'Try searching a different location or adjusting your filters'
                : 'Try adjusting your search criteria or filters'
              }
            </p>
          </div>
        )}
      </main>

      {/* Restaurant Modal */}
      <RestaurantModal
        restaurant={selectedRestaurant}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      {/* Question Bot */}
      <QuestionBot restaurants={restaurants} />
    </div>
  );
}

export default App;