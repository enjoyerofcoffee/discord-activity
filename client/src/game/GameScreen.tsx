import { CountryOutline } from "./components/CountryOutline";
import Header from "../../public/Header.png";
import { CountryList } from "./components/CountryList";
import { useGameState } from "../context/GameState";
import { Guesses } from "./components/Guesses";
import { GuessSquares } from "./components/GuessSquares";

export const GameScreen = () => {
  const { guesses, status, history } = useGameState();

  return (
    <div className="flex flex-col h-full">
      <img src={Header} />
      <GuessSquares />
      <CountryOutline
        country={{ code: "FR", name: "France", lat: 46.6, lon: 2.4 }}
      />
      <div className="flex gap-2 shrink-0 mb-4">
        <CountryList />
      </div>
      <Guesses countries={history} />
    </div>
  );
};
