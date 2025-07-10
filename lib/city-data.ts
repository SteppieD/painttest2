export interface CityData {
  city: string;
  state: string;
  stateCode: string;
  slug: string;
  population: number;
  contractors: number;
  latitude: number;
  longitude: number;
}

export const topCities: CityData[] = [
  {
    city: "Houston",
    state: "Texas",
    stateCode: "TX",
    slug: "houston",
    population: 2325502,
    contractors: 487,
    latitude: 29.7604,
    longitude: -95.3698
  },
  {
    city: "Los Angeles",
    state: "California", 
    stateCode: "CA",
    slug: "los-angeles",
    population: 3898747,
    contractors: 612,
    latitude: 34.0522,
    longitude: -118.2437
  },
  {
    city: "Chicago",
    state: "Illinois",
    stateCode: "IL", 
    slug: "chicago",
    population: 2746388,
    contractors: 423,
    latitude: 41.8781,
    longitude: -87.6298
  },
  {
    city: "Phoenix",
    state: "Arizona",
    stateCode: "AZ",
    slug: "phoenix",
    population: 1608139,
    contractors: 385,
    latitude: 33.4484,
    longitude: -112.0740
  },
  {
    city: "Philadelphia",
    state: "Pennsylvania",
    stateCode: "PA",
    slug: "philadelphia",
    population: 1603797,
    contractors: 312,
    latitude: 39.9526,
    longitude: -75.1652
  },
  {
    city: "San Antonio",
    state: "Texas",
    stateCode: "TX",
    slug: "san-antonio",
    population: 1434625,
    contractors: 298,
    latitude: 29.4241,
    longitude: -98.4936
  },
  {
    city: "San Diego",
    state: "California",
    stateCode: "CA",
    slug: "san-diego",
    population: 1386932,
    contractors: 356,
    latitude: 32.7157,
    longitude: -117.1611
  },
  {
    city: "Dallas",
    state: "Texas",
    stateCode: "TX",
    slug: "dallas",
    population: 1304379,
    contractors: 412,
    latitude: 32.7767,
    longitude: -96.7970
  },
  {
    city: "San Jose",
    state: "California",
    stateCode: "CA",
    slug: "san-jose",
    population: 1013240,
    contractors: 267,
    latitude: 37.3382,
    longitude: -121.8863
  },
  {
    city: "Austin",
    state: "Texas",
    stateCode: "TX",
    slug: "austin",
    population: 961855,
    contractors: 324,
    latitude: 30.2672,
    longitude: -97.7431
  }
];

// Next 40 cities for expansion
export const additionalCities: CityData[] = [
  { city: "Jacksonville", state: "Florida", stateCode: "FL", slug: "jacksonville", population: 911507, contractors: 245, latitude: 30.3322, longitude: -81.6557 },
  { city: "Fort Worth", state: "Texas", stateCode: "TX", slug: "fort-worth", population: 909585, contractors: 189, latitude: 32.7555, longitude: -97.3308 },
  { city: "Columbus", state: "Ohio", stateCode: "OH", slug: "columbus", population: 898553, contractors: 178, latitude: 39.9612, longitude: -82.9988 },
  { city: "Charlotte", state: "North Carolina", stateCode: "NC", slug: "charlotte", population: 885708, contractors: 234, latitude: 35.2271, longitude: -80.8431 },
  { city: "San Francisco", state: "California", stateCode: "CA", slug: "san-francisco", population: 881549, contractors: 298, latitude: 37.7749, longitude: -122.4194 },
  { city: "Indianapolis", state: "Indiana", stateCode: "IN", slug: "indianapolis", population: 876384, contractors: 156, latitude: 39.7684, longitude: -86.1581 },
  { city: "Seattle", state: "Washington", stateCode: "WA", slug: "seattle", population: 753675, contractors: 312, latitude: 47.6062, longitude: -122.3321 },
  { city: "Denver", state: "Colorado", stateCode: "CO", slug: "denver", population: 727211, contractors: 289, latitude: 39.7392, longitude: -104.9903 },
  { city: "Nashville", state: "Tennessee", stateCode: "TN", slug: "nashville", population: 670820, contractors: 198, latitude: 36.1627, longitude: -86.7816 },
  { city: "Oklahoma City", state: "Oklahoma", stateCode: "OK", slug: "oklahoma-city", population: 655057, contractors: 134, latitude: 35.4676, longitude: -97.5164 }
];

export function getCityBySlug(stateSlug: string, citySlug: string): CityData | undefined {
  const allCities = [...topCities, ...additionalCities];
  return allCities.find(city => 
    city.state.toLowerCase().replace(/\s+/g, '-') === stateSlug && 
    city.slug === citySlug
  );
}

export function getAllCityPaths() {
  const allCities = [...topCities, ...additionalCities];
  return allCities.map(city => ({
    state: city.state.toLowerCase().replace(/\s+/g, '-'),
    city: city.slug
  }));
}