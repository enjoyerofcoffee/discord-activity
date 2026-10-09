import { CountryOutline } from "./components/CountryOutline";

export const GameScreen = () => {
  return (
    <div className="space-y-4">
      <h1 className="text-4xl text-center">Worldle</h1>
      <CountryOutline
        country={{ code: "FR", name: "France", lat: 46.6, lon: 2.4 }}
      />
    </div>
  );
};
