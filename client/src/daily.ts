import { COUNTRIES } from "@shared/countries";
import { getDailySeed } from "@shared/daily";

const scramble = (n: number): number => {
  n = n * 7919;
  n = n % 1_000_003;
  n = n * n;
  return n % 1_000_003;
};

export const getDailyCountry = (seed = getDailySeed()) => {
  const index = scramble(seed) % COUNTRIES.length;
  const dailyCountry = COUNTRIES[index];

  return dailyCountry;
};
