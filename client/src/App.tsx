import { DiscordProvider } from "./context/Discord";
import { GameStateProvider } from "./context/GameState";
import { GameScreen } from "./game/GameScreen";

export default function App() {
  return (
    <DiscordProvider>
      <GameStateProvider>
        <div className="mx-auto flex h-dvh max-w-md flex-col">
          <GameScreen />
        </div>
      </GameStateProvider>
    </DiscordProvider>
  );
}
