import { COUNTRIES } from "@shared/countries";
import { COLORS } from "../colors";

type GuessesProps = {
  countries: string[];
};
export const Guesses = ({ countries }: GuessesProps) => {
  const countryNames = COUNTRIES.filter((country) =>
    countries.includes(country.code),
  ).map((country) => country.name);

  return (
    <div className="flex flex-col gap-2 min-h-0 overflow-auto pb-2">
      {countryNames.map((name) => {
        return (
          <div key={name} className={`card bg-${COLORS.close} shadow-sm`}>
            <div className="card-body">
              <h1 className="card-title">{name}</h1>
            </div>
          </div>
        );
      })}
    </div>
  );
};
