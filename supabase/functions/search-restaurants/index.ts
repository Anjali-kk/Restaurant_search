import { corsHeaders } from '../_shared/cors.ts';

interface SearchRequest {
  location: string;
  cuisine?: string;
  priceRange?: string;
  radius?: number;
}

interface YelpBusiness {
  id: string;
  name: string;
  image_url: string;
  url: string;
  review_count: number;
  categories: Array<{ alias: string; title: string }>;
  rating: number;
  coordinates: { latitude: number; longitude: number };
  transactions: string[];
  price?: string;
  location: {
    address1: string;
    city: string;
    zip_code: string;
    country: string;
    state: string;
    display_address: string[];
  };
  phone: string;
  display_phone: string;
  distance: number;
}

interface YelpResponse {
  businesses: YelpBusiness[];
  total: number;
  region: {
    center: { longitude: number; latitude: number };
  };
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { location, cuisine, priceRange, radius = 5000 }: SearchRequest = await req.json();

    if (!location) {
      return new Response(
        JSON.stringify({ error: 'Location is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Get Yelp API key from environment
    const yelpApiKey = Deno.env.get('YELP_API_KEY');
    if (!yelpApiKey) {
      return new Response(
        JSON.stringify({ error: 'Yelp API key not configured' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Build Yelp API URL
    const params = new URLSearchParams({
      location: location,
      categories: cuisine ? `restaurants,${cuisine}` : 'restaurants',
      radius: radius.toString(),
      limit: '20',
      sort_by: 'rating'
    });

    if (priceRange) {
      params.append('price', priceRange);
    }

    const yelpUrl = `https://api.yelp.com/v3/businesses/search?${params.toString()}`;

    // Make request to Yelp API
    const yelpResponse = await fetch(yelpUrl, {
      headers: {
        'Authorization': `Bearer ${yelpApiKey}`,
        'Content-Type': 'application/json'
      }
    });

    if (!yelpResponse.ok) {
      throw new Error(`Yelp API error: ${yelpResponse.status}`);
    }

    const yelpData: YelpResponse = await yelpResponse.json();

    // Transform Yelp data to our format
    const restaurants = yelpData.businesses.map(business => ({
      id: business.id,
      name: business.name,
      cuisine: business.categories[0]?.title || 'Restaurant',
      rating: business.rating,
      priceRange: business.price || '$$',
      image: business.image_url || 'https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: `${business.categories.map(cat => cat.title).join(', ')} restaurant with ${business.review_count} reviews`,
      address: business.location.display_address.join(', '),
      phone: business.display_phone || business.phone,
      hours: 'Hours vary - call for details',
      features: [
        ...business.transactions,
        business.price ? `Price: ${business.price}` : '',
        `${business.review_count} reviews`
      ].filter(Boolean),
      popular_dishes: ['Popular dishes vary'],
      atmosphere: 'See reviews for atmosphere details',
      website: business.url,
      coordinates: business.coordinates,
      distance: Math.round(business.distance)
    }));

    return new Response(
      JSON.stringify({
        restaurants,
        total: yelpData.total,
        location: yelpData.region?.center
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Search restaurants error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to search restaurants',
        details: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});