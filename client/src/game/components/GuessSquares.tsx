import { MAX_TRIES, useGameState } from "../../context/GameState";
import { COLORS } from "../colors";

export const getColor = (percentage: number) => {
  if (percentage > 66) return COLORS.hit;
  if (percentage >= 33) return COLORS.close;
  return COLORS.missed;
};

export const GuessSquares = () => {
  const { history } = useGameState();

  return (
    <div className="flex justify-center items-center gap-1 shrink-0 mt-1.5 mb-4">
      {Array.from({ length: MAX_TRIES }, (_, index) => {
        const guess = history[index];

        return (
          <div
            key={index}
            className={`size-6 rounded-sm ${
              guess
                ? `bg-${getColor(guess.percentage)}`
                : "border border-base-400 bg-base-100"
            }`}
          />
        );
      })}
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="3.5"
        className="size-4 ml-1"
      >
        <path d="M6 18 18 6M8 6h10v10" />
      </svg>
    </div>
  );
};
