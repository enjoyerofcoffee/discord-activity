export interface Country {
  code: string; // ISO 3166-1 alpha-2, e.g. "FR"
  name: string;
  lat: number; // reference point (main landmass).
  lon: number; // use to calcualte distance between countries
}
