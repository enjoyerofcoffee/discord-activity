import { CountryOutline } from "./components/CountryOutline";
import Header from "../../public/Header.png";
import { CountryList } from "./components/CountryList";

export const GameScreen = () => {
  return (
    <div className="flex flex-col h-full">
      <img src={Header} />
      <CountryOutline
        country={{ code: "FR", name: "France", lat: 46.6, lon: 2.4 }}
      />
      <div className="flex gap-2 min-h-0 mb-4">
        <CountryList />
        <button className="btn bg-emerald-600 text-white">Guess</button>
      </div>
    </div>
  );
};
