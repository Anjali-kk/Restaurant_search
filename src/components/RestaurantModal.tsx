import React from 'react';
import { X, Star, MapPin, Phone, Clock, Globe, Utensils } from 'lucide-react';
import { Restaurant } from '../types/Restaurant';

interface RestaurantModalProps {
  restaurant: Restaurant | null;
  isOpen: boolean;
  onClose: () => void;
}

export const RestaurantModal: React.FC<RestaurantModalProps> = ({
  restaurant,
  isOpen,
  onClose
}) => {
  if (!isOpen || !restaurant) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="relative">
          <img
            src={restaurant.image}
            alt={restaurant.name}
            className="w-full h-64 object-cover rounded-t-xl"
          />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-white/80 hover:bg-white p-2 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {restaurant.name}
              </h2>
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <span className="ml-1 font-medium">{restaurant.rating}</span>
                </div>
                <span className="text-lg font-semibold text-orange-600">
                  {restaurant.priceRange}
                </span>
                <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm font-medium">
                  {restaurant.cuisine}
                </span>
              </div>
            </div>
          </div>
          
          <p className="text-gray-600 mb-6">{restaurant.description}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900 flex items-center">
                <MapPin className="w-4 h-4 mr-2" />
                Location & Contact
              </h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p>{restaurant.address}</p>
                <div className="flex items-center">
                  <Phone className="w-4 h-4 mr-2" />
                  <span>{restaurant.phone}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  <span>{restaurant.hours}</span>
                </div>
                {restaurant.website && (
                  <div className="flex items-center">
                    <Globe className="w-4 h-4 mr-2" />
                    <a
                      href={`https://${restaurant.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-orange-600 hover:underline"
                    >
                      {restaurant.website}
                    </a>
                  </div>
                )}
              </div>
            </div>
            
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900 flex items-center">
                <Utensils className="w-4 h-4 mr-2" />
                Popular Dishes
              </h3>
              <div className="space-y-2">
                {restaurant.popular_dishes.map((dish, index) => (
                  <span
                    key={index}
                    className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm mr-2 mb-2"
                  >
                    {dish}
                  </span>
                ))}
              </div>
            </div>
          </div>
          
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">Features & Amenities</h3>
            <div className="flex flex-wrap gap-2">
              {restaurant.features.map((feature, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                >
                  {feature}
                </span>
              ))}
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-2">Atmosphere</h3>
            <p className="text-gray-600">{restaurant.atmosphere}</p>
          </div>
        </div>
      </div>
    </div>
  );
};