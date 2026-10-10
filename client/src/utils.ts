import type { Country } from "@shared/types";

export const getPercentage = (guess: Country, answer: Country): number => {
  if (guess.code === answer.code) return 100;

  // Distance in km between the two countries (haversine formula)
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(answer.lat - guess.lat);
  const dLon = toRad(answer.lon - guess.lon);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(guess.lat)) *
      Math.cos(toRad(answer.lat)) *
      Math.sin(dLon / 2) ** 2;
  const distanceKm = 2 * 6371 * Math.asin(Math.sqrt(h));

  // 0 km away = 100%, 20,000 km away (other side of the world) = 0%
  return Math.floor((1 - distanceKm / 20000) * 100);
};
