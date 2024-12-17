type SearchResult = {
  id: string;
  name: string;
  image: string;
};

type User = {
  id: string;
  email: string;
};

type LocationCoordinates = {
  longitude: number;
  latitude: number;
};

type Profile = {
  id: string;
  first_name: string;
  last_name: string;
  avatar_url?: string;
  bio?: string;
  location?: any;
  city?: string;
  state?: string;
  country?: string;
  birthday?: string;
  created_at: string;
  updated_at: string;
};

type Journey = {
  id: string;
  title: string;
  description?: string;
  user_id: string;
  start_date: string;
  end_date: string;
  created_at: string;
  updated_at: string;
};

type WithProfile<T> = T & {
  profile: Pick<Profile, 'first_name' | 'last_name' | 'avatar_url'>;
};

type JourneyWithProfile = WithProfile<Journey> & {
  locations: LocationInfo[];
};

type DraftJourney = {
  id: string;
  title: string;
  description?: string;
  isActive: boolean;
  locations: DraftLocation[];
  startDate: string;
};

type DraftLocation = {
  id: string;
  title: string;
  description?: string; // or description
  position?: number; // doesnt need if we sort by date
  coordinates: LocationCoordinates;
  address?: string;
  date: string;
  rating: number;
  images: string[];
  placeID?: string; // from mapbox or eventbrite or api
  hideLocation: boolean;
  hideTime: boolean;
  created_at: string;
  updated_at: string;
};

type LocationInfo = {
  id: string;
  journey_id: string;
  title: string;
  description?: string;
  address?: string;
  coordinates: LocationCoordinates;
  place_id?: string;
  rating?: number;
  images?: string[];
  position: number;
  date: string;
  created_at: string;
  updated_at: string;
  tags?: string[];
  cost?: number;
  duration?: number;
};

type SavedLocation = {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  address?: string;
  coordinates: LocationCoordinates;
  place_id?: string;
  created_at: string;
};

type SingleEditableField = 'first_name' | 'last_name' | 'bio' | 'birthday' | 'avatar_url';
type ComplexEditableField = 'location';
type EditableField = SingleEditableField | ComplexEditableField;

type LocationUpdate = {
  city: string;
  state: string;
  country: string;
};

type EditableProfile = Pick<Profile, SingleEditableField>;

type ImageItem = {
  uri: string;
  loading?: boolean;
  error?: boolean;
};

type LocationResult = {
  type: string;
  geometry: {
    coordinates: number[];
    type: string;
  };
  properties: {
    name: string;
    name_preferred?: string;
    mapbox_id: string;
    feature_type: string;
    address?: string;
    full_address?: string;
    place_formatted?: string;
    maki?: string;
    context: {
      country?: {
        id?: string;
        name: string;
        country_code: string;
        country_code_alpha_3: string;
      };
      region?: {
        id?: string;
        name: string;
        region_code: string;
        region_code_full: string;
      };
      postcode?: {
        id?: string;
        name: string;
      };
      district?: {
        id?: string;
        name: string;
      };
      place: {
        id?: string;
        name: string;
      };
      locality?: {
        id?: string;
        name: string;
      };
      address: {
        id?: string;
        name: string;
        address_number: string;
        street_name: string;
      };
      street: {
        name: string;
      };
      neighborhood?: {
        id: string;
        name: string;
      };
    };
    coordinates: {
      latitude: number;
      longitude: number;
      accuracy?: number;
      routable_points?: Array<{
        name: string;
        latitude: number;
        longitude: number;
      }>;
    };
    language?: string;
    bbox?: [number, number, number, number]; // [minLon, minLat, maxLon, maxLat]
    poi_category: string[];
    poi_category_ids: string[];
    brand?: string[];
    brand_id?: string[];
    external_ids?: Record<string, string>;
    metadata?: Record<string, any>;
  };
};
