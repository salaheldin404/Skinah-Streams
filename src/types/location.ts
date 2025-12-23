export interface Address {
  city: string;
  country: string;
  country_code: string;
  name: string;
  postCode: string;
  state: string;
}

export interface Location {
  address: Address;
  class: string;
  display_address: string;
  display_name: string;
  display_place: string;
  lat: string;
  lon: string;
}