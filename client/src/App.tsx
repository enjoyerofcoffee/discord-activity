import { DiscordProvider } from "./context/Discord";
import { GameStateProvider } from "./context/GameState";
import { GameScreen } from "./game/GameScreen";

export default function App() {
  return (
    <DiscordProvider>
      <GameStateProvider>
        <div className="mx-auto flex h-dvh max-w-3xl flex-col px-3">
          <GameScreen />
        </div>
      </GameStateProvider>
    </DiscordProvider>
  );
}
