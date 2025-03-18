export interface NominatimData {
  address: NominatimAddress;
  lat: string,
  lon: string,
}

export interface NominatimAddress {
  country?: string;
  county?: string;
  city?: string;
  town?: string;
  village?: string;
  hamlet?: string;
  locality?: string;
  postcode?: string;
  road?: string;
  pedestrian?: string;
  footway?: string;
  path?: string;
  square?: string;
  street?: string;
  house_number?: string;
}

export type Address = {
  country: string;
  county: string;
  city: string;
  postalCode: string;
  street: string;
  house_number: string;
  lat: number,
  lon: number,
}

export type Coordinates = {
  lat: number;
  lon: number;
};
