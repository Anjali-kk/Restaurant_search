const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export interface SearchRestaurantsParams {
  location: string;
  cuisine?: string;
  priceRange?: string;
  radius?: number;
}

export interface ChatMessage {
  message: string;
  context?: string;
  restaurants?: any[];
}

export interface ApiRestaurant {
  id: string;
  name: string;
  cuisine: string;
  rating: number;
  priceRange: string;
  image: string;
  description: string;
  address: string;
  phone: string;
  hours: string;
  features: string[];
  popular_dishes: string[];
  atmosphere: string;
  website?: string;
  coordinates?: { latitude: number; longitude: number };
  distance?: number;
}

export interface SearchResponse {
  restaurants: ApiRestaurant[];
  total: number;
  location?: { latitude: number; longitude: number };
}

export interface ChatResponse {
  message: string;
  timestamp: string;
}

class ApiService {
  private async makeRequest(endpoint: string, data: any) {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/${endpoint}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `API request failed: ${response.status}`);
    }

    return response.json();
  }

  async searchRestaurants(params: SearchRestaurantsParams): Promise<SearchResponse> {
    return this.makeRequest('search-restaurants', params);
  }

  async chatWithGPT(params: ChatMessage): Promise<ChatResponse> {
    return this.makeRequest('chat-gpt', params);
  }
}

export const apiService = new ApiService();