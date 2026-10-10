import { getDailySeed } from "@shared/daily";
import { useEffect, useState } from "react";
import { useDiscordUser } from "../../context/Discord";
import { MAX_TRIES } from "../../context/GameState";
import { getParticipants, type Participant } from "../../discord";
import { loadPlayers } from "../../save";
import { getColor } from "./GuessSquares";

const REFRESH_MS = 5000;

type Player = Participant & { percentages: number[] };

export const Players = () => {
  const user = useDiscordUser();
  const [players, setPlayers] = useState<Player[]>([]);

  useEffect(() => {
    if (!user) {
      return;
    }

    const refresh = async () => {
      const participants = await getParticipants();
      const others = participants.filter(
        (participant) => participant.id !== user.id,
      );
      const progress = await loadPlayers(
        getDailySeed(),
        others.map((participant) => participant.id),
      );

      setPlayers(
        others.map((participant) => ({
          ...participant,
          percentages:
            progress.find((player) => player.userId === participant.id)
              ?.percentages ?? [],
        })),
      );
    };

    refresh();
    const interval = setInterval(refresh, REFRESH_MS);

    return () => clearInterval(interval);
  }, [user]);

  if (players.length === 0) {
    return null;
  }

  return (
    <div className="flex gap-2 shrink-0 mx-auto max-w-full overflow-x-auto mt-2 md:fixed md:left-3 md:top-3 md:bottom-3 md:mt-0 md:flex-col md:overflow-y-auto">
      {players.map((player) => {
        const name = player.nickname ?? player.global_name ?? player.username;

        return (
          <div
            key={player.id}
            title={name}
            className="flex shrink-0 items-center gap-2 rounded-lg border border-base-300 bg-base-100 p-2"
          >
            {player.avatar ? (
              <img
                className="size-10 rounded-full"
                src={`https://cdn.discordapp.com/avatars/${player.id}/${player.avatar}.png?size=64`}
              />
            ) : (
              <div className="flex size-10 items-center justify-center rounded-full bg-neutral text-neutral-content">
                {name[0]}
              </div>
            )}
            <div className="flex gap-0.5">
              {Array.from({ length: MAX_TRIES }, (_, index) => {
                const percentage = player.percentages[index];

                return (
                  <div
                    key={index}
                    className={`size-3 rounded-xs ${
                      percentage === undefined
                        ? "border border-base-400 bg-base-100"
                        : `bg-${getColor(percentage)}`
                    }`}
                  />
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};
