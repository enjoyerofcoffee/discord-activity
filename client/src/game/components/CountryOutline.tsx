import type { Country } from "@shared/types";

interface CountryOutlineProps {
  country: Country;
}
export const CountryOutline = ({ country }: CountryOutlineProps) => {
  return (
    <div>
      <img
        className="h-64 pb-2 mx-auto"
        src={`${import.meta.env.BASE_URL}outlines/${country.code.toLowerCase()}.svg`}
        alt="Country outline"
      />
    </div>
  );
};
