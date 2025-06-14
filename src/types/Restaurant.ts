export interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  rating: number;
  priceRange: '$' | '$$' | '$$$' | '$$$$';
  image: string;
  description: string;
  address: string;
  phone: string;
  hours: string;
  features: string[];
  popular_dishes: string[];
  atmosphere: string;
  website?: string;
}

export interface FilterOptions {
  cuisine: string;
  priceRange: string;
  minRating: number;
}