import type { Country } from "@shared/types";

interface CountryOutlineProps {
  country: Country;
}
export const CountryOutline = ({ country }: CountryOutlineProps) => {
  return (
    // Shrinks on short screens to leave room for the guesses
    <div className="flex-1 min-h-28 max-h-64 pb-2">
      <img
        className="size-full object-contain"
        src={`${import.meta.env.BASE_URL}outlines/${country.code.toLowerCase()}.svg`}
        alt="Country outline"
      />
    </div>
  );
};
