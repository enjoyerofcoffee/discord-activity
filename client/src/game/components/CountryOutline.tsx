import type { Country } from "@shared/types";

interface CountryOutlineProps {
  country: Country;
}
export const CountryOutline = ({ country }: CountryOutlineProps) => {
  return (
    <div className="flex-1 w-full max-w-md mx-auto min-h-32 max-h-64 pb-2">
      <img
        className="size-full object-contain"
        src={`${import.meta.env.BASE_URL}outlines/${country.code.toLowerCase()}.svg`}
        alt="Country outline"
      />
    </div>
  );
};
