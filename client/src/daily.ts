import { COUNTRIES } from "@shared/countries";

// The same input always gives the same output.
const scramble = (n: number): number => {
  n = n * 7919;
  n = n % 1_000_003;
  n = n * n;
  return n % 1_000_003;
};

export const getDailyCountry = () => {
  const now = new Date();
  const seed =
    now.getUTCFullYear() * 10000 +
    (now.getUTCMonth() + 1) * 100 +
    now.getUTCDate();

  const index = scramble(seed) % COUNTRIES.length;
  const dailyCountry = COUNTRIES[index];

  return dailyCountry;
};
