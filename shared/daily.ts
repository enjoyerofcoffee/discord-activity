// One number per UTC day, e.g. 20261010. Everyone gets the same game for that day.
export const getDailySeed = (date = new Date()): number =>
  date.getUTCFullYear() * 10000 +
  (date.getUTCMonth() + 1) * 100 +
  date.getUTCDate();
