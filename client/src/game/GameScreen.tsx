import { CountryOutline } from "./components/CountryOutline";
import Header from "../../public/Header.png";
import { CountryName } from "./components/CountryName";
import { CountryList } from "./components/CountryList";
import { useGameState } from "../context/GameState";
import { Guesses } from "./components/Guesses";
import { GuessSquares } from "./components/GuessSquares";
import { getDailyCountry } from "../daily";
import Confetti from "./components/Confetti";
import { Players } from "./components/Players";

export const GameScreen = () => {
  const { status, history } = useGameState();

  const dailyCountry = getDailyCountry();

  return (
    <div className="flex flex-col h-full">
      {status === "finished_won" && <Confetti />}

      <Players />

      <div className="flex flex-col flex-1 min-w-0 min-h-0 overflow-y-auto">
        <img className="h-12 mx-auto shrink-0 object-contain" src={Header} />
        <GuessSquares />
        <CountryOutline country={dailyCountry} />
        <CountryName country={dailyCountry} />

        <div className="flex flex-col w-full max-w-md mx-auto shrink-0">
          <div className="flex gap-2 shrink-0 mb-4">
            <CountryList />
          </div>

          <Guesses countries={history} />
        </div>
      </div>
    </div>
  );
};
