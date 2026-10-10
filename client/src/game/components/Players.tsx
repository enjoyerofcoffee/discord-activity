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
    <div className="flex justify-center gap-3 shrink-0 overflow-x-auto mb-2">
      {players.map((player) => {
        const name = player.nickname ?? player.global_name ?? player.username;

        return (
          <div key={player.id} className="flex flex-col items-center gap-1 w-14">
            {player.avatar ? (
              <img
                className="size-8 rounded-full"
                src={`https://cdn.discordapp.com/avatars/${player.id}/${player.avatar}.png?size=64`}
              />
            ) : (
              <div className="flex size-8 items-center justify-center rounded-full bg-neutral text-neutral-content">
                {name[0]}
              </div>
            )}
            <span className="w-full truncate text-center text-xs">{name}</span>
            <div className="flex gap-0.5">
              {Array.from({ length: MAX_TRIES }, (_, index) => {
                const percentage = player.percentages[index];

                return (
                  <div
                    key={index}
                    className={`size-2 rounded-xs ${
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
