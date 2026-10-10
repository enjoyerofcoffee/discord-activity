import { GameStateProvider } from "./context/GameState";
import { GameScreen } from "./game/GameScreen";

export default function App() {
  return (
    <GameStateProvider>
      <div className="mx-auto flex h-dvh max-w-md flex-col">
        <GameScreen />
      </div>
    </GameStateProvider>
  );
}
