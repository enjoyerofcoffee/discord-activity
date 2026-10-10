export interface Country {
  code: string; // e.g. "FR"
  name: string;
  lat: number; // reference point (main landmass).
  lon: number; // use to calcualte distance between countries
}
