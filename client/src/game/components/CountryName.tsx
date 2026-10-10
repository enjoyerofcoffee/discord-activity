import type { Country } from "@shared/types";
import { MAX_TRIES, useGameState } from "../../context/GameState";
import { COLORS } from "../colors";

const FACE =
  "absolute inset-0 flex items-center justify-center rounded-sm backface-hidden";

interface CountryNameProps {
  country: Country;
}
export const CountryName = ({ country }: CountryNameProps) => {
  const { status, guesses } = useGameState();

  const won = status === "finished_won";
  const revealed = won || status === "finished_loss" || guesses >= MAX_TRIES;

  return (
    <div
      className="w-64 h-12 mx-auto shrink-0 mb-4 perspective-midrange"
      aria-label={revealed ? country.name : "Hidden country name"}
    >
      <div
        className={`relative size-full transform-3d transition-transform duration-700 ${
          revealed ? "rotate-x-180" : ""
        }`}
      >
        <div
          className={`${FACE} border border-black bg-white text-lg font-bold`}
        >
          ?
        </div>
        <div
          className={`${FACE} rotate-x-180 px-2 ${won ? `bg-${COLORS.hit} text-white` : "border border-black bg-white text-black"} text-center text-sm leading-tight font-bold uppercase`}
        >
          {revealed && country.name}
        </div>
      </div>
    </div>
  );
};
