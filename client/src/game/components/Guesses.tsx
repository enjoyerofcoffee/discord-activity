import { COUNTRIES } from "@shared/countries";
import { COLORS } from "../colors";
import { getColor } from "./GuessSquares";
import { type History } from "../../context/GameState";

type GuessesProps = {
  countries: History[];
};
export const Guesses = ({ countries }: GuessesProps) => {
  return (
    <div className="flex flex-col gap-1 min-h-0 overflow-auto pb-2">
      {countries.map(({ countryCode, percentage }) => {
        const color = getColor(percentage);
        const name = COUNTRIES.find(
          (country) => country.code === countryCode,
        )?.name;

        return (
          <div
            key={countryCode}
            className={`flex items-center shrink-0 h-10 px-3 rounded-sm font-bold bg-${color} ${
              color === COLORS.hit ? "text-white" : "text-black"
            }`}
          >
            <span className="truncate">{name}</span>
          </div>
        );
      })}
    </div>
  );
};
