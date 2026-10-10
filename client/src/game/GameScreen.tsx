import { CountryOutline } from "./components/CountryOutline";
import Header from "../../public/Header.png";
import { CountryList } from "./components/CountryList";
import { useGameState } from "../context/GameState";

export const GameScreen = () => {
  const { guesses, status } = useGameState();

  return (
    <div className="flex flex-col h-full">
      <img src={Header} />
      <CountryOutline
        country={{ code: "FR", name: "France", lat: 46.6, lon: 2.4 }}
      />
      {guesses} - {status}
      <div className="flex gap-2 min-h-0 mb-4">
        <CountryList />
      </div>
    </div>
  );
};
