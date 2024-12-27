type SearchResult = {
  id: string;
  name: string;
  image: string;
};

type Connection = {
  id: string;
  first_name: string;
  last_name: string;
  avatar_url: string;
  followed_at: string;
  is_following: boolean;
};

type FollowResponse = {
  followers?: Connection[];
  following?: Connection[];
  total_count: number;
  has_more: boolean;
};

// Cache types
type FollowCounts = {
  followers: number;
  following: number;
};

type UserStats = {
  totalJourneys: number;
  recentJourneys: number;
};

type ProfileWithStats = Profile & UserStats & FollowCounts;

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

type JourneyResponse = {
  has_more: boolean;
  journeys: JourneyWithProfile[];
  total_count: number;
};

type Journey = {
  id: string;
  title: string;
  description?: string;
  user_id: string;
  start_date: string;
  locations: LocationInfo[];
  created_at: string;
  updated_at: string;
};

type User = {
  id: string;
  email: string;
};

type LocationCoordinates = {
  longitude: number;
  latitude: number;
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
  date: string;
  created_at: string;
  updated_at: string;
  tags?: string[];
};

type WithProfile<T> = T & {
  profile: Pick<Profile, 'id' | 'first_name' | 'last_name' | 'avatar_url'>;
};

type JourneyWithProfile = WithProfile<Journey>;

type DraftJourney = {
  id: string;
  title: string;
  description?: string;
  isPublic: boolean;
  isActive: boolean;
  locations: DraftLocation[];
  startDate: string;
  created_at: string;
  updated_at: string;
};

type DraftLocation = {
  id: string;
  title: string;
  description?: string;
  coordinates: LocationCoordinates;
  address?: string;
  date: string;
  rating: number;
  images: { uri: string; base64: string | null | undefined }[];
  placeID?: string; // from mapbox - not using this yet
  hideLocation: boolean;
  hideTime: boolean;
  created_at: string;
  updated_at: string;
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

type SingleEditableField = 'first_name' | 'last_name' | 'bio' | 'birthday' | 'avatar_url' | 'theme';
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
  base64: string | null | undefined;
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
