import { CountryOutline } from "./components/CountryOutline";
import Header from "../../public/Header.png";
import WorldleIcon from "../../public/WorldleIcon.svg";

export const GameScreen = () => {
  return (
    <div>
      <img src={Header} />
      <CountryOutline
        country={{ code: "FR", name: "France", lat: 46.6, lon: 2.4 }}
      />
      <div className="flex justify-between">
        <input
          type="text"
          placeholder="France... United Kingdom..."
          className="input"
        />
        <button className="btn">
          <img className="w-8" src={WorldleIcon}></img>
          Guess
        </button>
      </div>
    </div>
  );
};
