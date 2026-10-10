import { CountryOutline } from "./components/CountryOutline";
import Header from "../../public/Header.png";
import { CountryList } from "./components/CountryList";
import WorldleIcon from "../../public/WorldleIcon.svg";

export const GameScreen = () => {
  return (
    <div className="flex flex-col h-full">
      <img src={Header} />
      <CountryOutline
        country={{ code: "FR", name: "France", lat: 46.6, lon: 2.4 }}
      />
      <div className="flex gap-2 min-h-0 mb-4">
        <CountryList />
        <button className="btn">
          <img className="w-8" src={WorldleIcon}></img>
          Guess
        </button>
      </div>
    </div>
  );
};
