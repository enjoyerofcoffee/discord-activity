import { COUNTRIES } from "@shared/countries";
import { COLORS } from "../colors";
import { Arrow } from "./Arrow";
import { getColor } from "./GuessSquares";
import { type History } from "../../context/GameState";

type GuessesProps = {
  countries: History[];
};
export const Guesses = ({ countries }: GuessesProps) => {
  return (
    <div className="flex flex-col gap-1 min-h-0 overflow-auto pb-2">
      {countries.map(({ countryCode, percentage, arrow }) => {
        const color = getColor(percentage);
        const name = COUNTRIES.find(
          (country) => country.code === countryCode,
        )?.name;

        return (
          <div
            key={countryCode}
            className={`flex items-center justify-between shrink-0 h-10 px-3 rounded-sm font-bold bg-${color} ${
              color === COLORS.hit ? "text-white" : "text-black"
            }`}
          >
            <span className="truncate">{name}</span>
            <span className="flex items-center gap-2 shrink-0 tabular-nums">
              <Arrow arrow={arrow} />
              {Math.round(percentage)}%
            </span>
          </div>
        );
      })}
    </div>
  );
};
