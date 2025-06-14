import React from 'react';
import { Star, MapPin, Phone, Clock, Heart } from 'lucide-react';
import { Restaurant } from '../types/Restaurant';

interface RestaurantCardProps {
  restaurant: Restaurant;
  onSelect: (restaurant: Restaurant) => void;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
}

export const RestaurantCard: React.FC<RestaurantCardProps> = ({
  restaurant,
  onSelect,
  isFavorite,
  onToggleFavorite
}) => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer">
      <div className="relative">
        <img
          src={restaurant.image}
          alt={restaurant.name}
          className="w-full h-48 object-cover"
        />
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(restaurant.id);
          }}
          className={`absolute top-3 right-3 p-2 rounded-full transition-colors ${
            isFavorite
              ? 'bg-red-500 text-white'
              : 'bg-white/80 text-gray-600 hover:bg-red-500 hover:text-white'
          }`}
        >
          <Heart size={20} fill={isFavorite ? 'currentColor' : 'none'} />
        </button>
        <div className="absolute top-3 left-3 bg-white/90 px-2 py-1 rounded-full text-sm font-medium text-gray-800">
          {restaurant.cuisine}
        </div>
      </div>
      
      <div className="p-6" onClick={() => onSelect(restaurant)}>
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold text-gray-900">{restaurant.name}</h3>
          <span className="text-lg font-semibold text-orange-600">
            {restaurant.priceRange}
          </span>
        </div>
        
        <div className="flex items-center mb-3">
          <div className="flex items-center">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="ml-1 text-sm font-medium text-gray-700">
              {restaurant.rating}
            </span>
          </div>
        </div>
        
        <p className="text-gray-600 mb-4 line-clamp-2">{restaurant.description}</p>
        
        <div className="space-y-2 text-sm text-gray-500">
          <div className="flex items-center">
            <MapPin className="w-4 h-4 mr-2" />
            <span>{restaurant.address}</span>
          </div>
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-2" />
            <span>{restaurant.hours}</span>
          </div>
        </div>
        
        <div className="mt-4 flex flex-wrap gap-2">
          {restaurant.features.slice(0, 3).map((feature, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
            >
              {feature}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};