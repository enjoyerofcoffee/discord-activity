import { COUNTRIES } from "@shared/countries";
import { COLORS } from "../colors";
import { Arrow } from "./Arrow";
import { getColor } from "./GuessSquares";
import { MAX_TRIES, type History } from "../../context/GameState";

type GuessesProps = {
  countries: History[];
};
export const Guesses = ({ countries }: GuessesProps) => {
  return (
    <div className="grid grid-cols-3 gap-1 shrink-0 pb-2">
      {Array.from({ length: MAX_TRIES }, (_, index) => {
        const guess = countries[index];

        if (!guess) {
          return (
            <div
              key={index}
              className="h-12 rounded-sm border border-base-300"
            />
          );
        }

        const color = getColor(guess.percentage);
        const name = COUNTRIES.find(
          (country) => country.code === guess.countryCode,
        )?.name;

        return (
          <div
            key={index}
            className={`flex flex-col justify-center h-12 px-2 rounded-sm font-bold bg-${color} ${
              color === COLORS.hit ? "text-white" : "text-black"
            }`}
          >
            <span className="truncate text-sm">{name}</span>
            <span className="flex items-center gap-1 text-xs tabular-nums">
              <Arrow arrow={guess.arrow} />
              {Math.round(guess.percentage)}%
            </span>
          </div>
        );
      })}
    </div>
  );
};
