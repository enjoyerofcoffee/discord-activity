import { CountryOutline } from "./components/CountryOutline";
import Header from "../../public/Header.png";
import { CountryName } from "./components/CountryName";
import { CountryList } from "./components/CountryList";
import { useGameState } from "../context/GameState";
import { Guesses } from "./components/Guesses";
import { GuessSquares } from "./components/GuessSquares";
import { getDailyCountry } from "../daily";
import Confetti from "./components/Confetti";

export const GameScreen = () => {
  const { status, history } = useGameState();

  const dailyCountry = getDailyCountry();

  return (
    <div className="flex flex-col h-full">
      <img src={Header} />
      {status === "finished_won" && <Confetti />}

      <GuessSquares />
      <CountryOutline country={dailyCountry} />
      <CountryName country={dailyCountry} />

      <div className="flex gap-2 shrink-0 mb-4">
        <CountryList />
      </div>

      <Guesses countries={history} />
    </div>
  );
};
